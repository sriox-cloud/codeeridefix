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

        const { repository } = await req.json();

        if (!repository) {
            return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
        }

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
        const username = userData.login;

        // Get repository contents
        const contentsResponse = await fetch(
            `https://api.github.com/repos/${username}/${repository}/contents`,
            {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!contentsResponse.ok) {
            if (contentsResponse.status === 404) {
                return NextResponse.json({ error: 'Repository not found' }, { status: 404 });
            }
            const error = await contentsResponse.json();
            return NextResponse.json({ error: 'Failed to fetch repository contents', details: error }, { status: 500 });
        }

        const contents = await contentsResponse.json();

        // Filter for code files only
        const codeFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.php', '.rb', '.html', '.css', '.json', '.txt', '.md', '.yml', '.yaml', '.xml'];

        console.log('Repository contents:', contents.length, 'items');

        // Function to recursively fetch files from directories
        async function fetchAllFiles(items: any[]): Promise<any[]> {
            const allFiles = [];

            for (const item of items) {
                if (item.type === 'file' && codeFileExtensions.some(ext => item.name.toLowerCase().endsWith(ext))) {
                    // It's a code file, add it to our list
                    allFiles.push(item);
                } else if (item.type === 'dir') {
                    // It's a directory, fetch its contents recursively
                    try {
                        const dirResponse = await fetch(item.url, {
                            headers: {
                                'Authorization': `token ${accessToken}`,
                                'Accept': 'application/vnd.github.v3+json',
                            },
                        });

                        if (dirResponse.ok) {
                            const dirContents = await dirResponse.json();
                            const dirFiles = await fetchAllFiles(dirContents);
                            allFiles.push(...dirFiles);
                        }
                    } catch (error) {
                        console.error(`Error fetching directory ${item.name}:`, error);
                    }
                }
            }

            return allFiles;
        }

        const codeFiles = await fetchAllFiles(contents);
        console.log('Found code files:', codeFiles.length);

        // Fetch content for each file
        const filesWithContent = await Promise.all(
            codeFiles.map(async (file: any) => {
                try {
                    const fileResponse = await fetch(file.url, {
                        headers: {
                            'Authorization': `token ${accessToken}`,
                            'Accept': 'application/vnd.github.v3+json',
                        },
                    });

                    if (fileResponse.ok) {
                        const fileData = await fileResponse.json();
                        // Decode base64 content
                        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
                        return {
                            name: file.name,
                            content: content,
                            size: file.size
                        };
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching file ${file.name}:`, error);
                    return null;
                }
            })
        );

        // Filter out null entries (failed fetches)
        const validFiles = filesWithContent.filter(file => file !== null);

        console.log('Successfully loaded files:', validFiles.length);
        console.log('File names:', validFiles.map(f => f.name));

        return NextResponse.json({
            success: true,
            repository: repository,
            files: validFiles,
            totalFiles: validFiles.length,
            debug: {
                totalContents: contents.length,
                foundCodeFiles: codeFiles.length,
                successfullyLoaded: validFiles.length
            }
        });

    } catch (error) {
        console.error('GitHub load error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
