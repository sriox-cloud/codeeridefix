import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_NAME = 'codeer-ide-files';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Try to get repository contents
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents`,
            {
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (response.status === 404) {
            // Repository doesn't exist, return empty files array
            return NextResponse.json({ files: [] });
        }

        if (!response.ok) {
            throw new Error('Failed to fetch repository contents');
        }

        const contents = await response.json();
        const files = [];

        // Process each file
        for (const item of contents) {
            if (item.type === 'file' && item.name.endsWith('.js') || item.name.endsWith('.py') || item.name.endsWith('.java')) {
                try {
                    // Fetch file content
                    const fileResponse = await fetch(item.download_url);
                    const content = await fileResponse.text();

                    files.push({
                        name: item.name,
                        content,
                        language: getLanguageFromFilename(item.name),
                        path: item.path,
                    });
                } catch (error) {
                    console.error(`Error fetching file ${item.name}:`, error);
                }
            }
        }

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Error fetching GitHub files:', error);
        return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, content, language } = await request.json();

        // First, ensure the repository exists
        await ensureRepositoryExists(session);

        // Create or update file
        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents/${name}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: `Create ${name}`,
                    content: Buffer.from(content).toString('base64'),
                    branch: 'main',
                }),
            }
        );

        if (!response.ok) {
            throw new Error('Failed to create file');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error creating file:', error);
        return NextResponse.json({ error: 'Failed to create file' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { path } = await request.json();

        // Get file SHA first
        const fileResponse = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents/${path}`,
            {
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (!fileResponse.ok) {
            throw new Error('File not found');
        }

        const fileData = await fileResponse.json();

        // Delete file
        const deleteResponse = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents/${path}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: `Delete ${path}`,
                    sha: fileData.sha,
                    branch: 'main',
                }),
            }
        );

        if (!deleteResponse.ok) {
            throw new Error('Failed to delete file');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}

async function ensureRepositoryExists(session: any) {
    try {
        // Check if repository exists
        const repoResponse = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}`,
            {
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            }
        );

        if (repoResponse.ok) {
            return; // Repository exists
        }

        // Create repository
        await fetch(`${GITHUB_API_BASE}/user/repos`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${session.accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            body: JSON.stringify({
                name: REPO_NAME,
                description: 'Code files from Codeer IDE',
                private: false,
                auto_init: true,
            }),
        });
    } catch (error) {
        console.error('Error ensuring repository exists:', error);
    }
}

function getLanguageFromFilename(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const extensionMap: { [key: string]: string } = {
        js: 'javascript',
        py: 'python',
        java: 'java',
        cpp: 'cpp',
        c: 'c',
        cs: 'csharp',
        go: 'go',
        rs: 'rust',
        php: 'php',
        rb: 'ruby',
    };
    return extensionMap[extension || ''] || 'javascript';
}
