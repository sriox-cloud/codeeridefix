import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated - please sign in' }, { status: 401 });
        }

        // Extract access token from session
        const accessToken = (session as any).accessToken;

        if (!accessToken) {
            return NextResponse.json({ error: 'No GitHub access token found - please sign in again' }, { status: 401 });
        }

        const { filename, content, repository } = await req.json();

        if (!filename || content === undefined) {
            return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
        }

        const repoName = repository === 'new_repo' ? `${filename.split('.')[0]}_project` : repository;

        // Get authenticated user info
        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        if (!userResponse.ok) {
            return NextResponse.json({ error: 'Failed to get GitHub user info' }, { status: 401 });
        }

        const userData = await userResponse.json();
        const username = userData.login;        // Check if repository exists
        const repoCheckResponse = await fetch(
            `https://api.github.com/repos/${username}/${repoName}`,
            {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        // Create repository if it doesn't exist
        if (repoCheckResponse.status === 404) {
            const createRepoResponse = await fetch('https://api.github.com/user/repos', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: repoName,
                    description: `Code repository for ${filename}`,
                    private: false,
                    auto_init: true,
                }),
            });

            if (!createRepoResponse.ok) {
                const error = await createRepoResponse.json();
                return NextResponse.json({ error: 'Failed to create repository', details: error }, { status: 500 });
            }
        }

        // Check if file exists to get SHA
        let sha: string | undefined;
        const fileCheckResponse = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
            {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (fileCheckResponse.ok) {
            const fileData = await fileCheckResponse.json();
            sha = fileData.sha;
        }

        // Create or update file
        const updateFileResponse = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: `Update ${filename}`,
                    content: Buffer.from(content).toString('base64'),
                    sha: sha,
                }),
            }
        );

        if (!updateFileResponse.ok) {
            const error = await updateFileResponse.json();
            return NextResponse.json({ error: 'Failed to save file', details: error }, { status: 500 });
        }

        const result = await updateFileResponse.json();
        return NextResponse.json({
            success: true,
            url: result.content.html_url,
            repository: repoName
        });

    } catch (error) {
        console.error('GitHub save error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
