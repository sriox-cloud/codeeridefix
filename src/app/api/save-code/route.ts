import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_NAME = 'codeer-ide-files';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { code, language, filename } = await request.json();

        // Ensure the repository exists
        await ensureRepositoryExists(session);

        // Check if file already exists
        let fileSha = null;
        try {
            const existingFileResponse = await fetch(
                `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents/${filename}`,
                {
                    headers: {
                        'Authorization': `token ${session.accessToken}`,
                        'Accept': 'application/vnd.github.v3+json',
                    },
                }
            );

            if (existingFileResponse.ok) {
                const existingFile = await existingFileResponse.json();
                fileSha = existingFile.sha;
            }
        } catch (error) {
            // File doesn't exist, which is fine
        }

        // Create or update file
        const requestBody: any = {
            message: fileSha ? `Update ${filename}` : `Create ${filename}`,
            content: Buffer.from(code).toString('base64'),
            branch: 'main',
        };

        if (fileSha) {
            requestBody.sha = fileSha;
        }

        const response = await fetch(
            `${GITHUB_API_BASE}/repos/${session.user?.name}/${REPO_NAME}/contents/${filename}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${session.accessToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to save file: ${errorData.message}`);
        }

        const result = await response.json();

        return NextResponse.json({
            success: true,
            url: result.content.html_url,
            message: fileSha ? 'File updated successfully' : 'File created successfully'
        });
    } catch (error) {
        console.error('Error saving code:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save code' },
            { status: 500 }
        );
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
        const createResponse = await fetch(`${GITHUB_API_BASE}/user/repos`, {
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

        if (!createResponse.ok) {
            throw new Error('Failed to create repository');
        }

        // Wait a moment for repository to be fully created
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
        console.error('Error ensuring repository exists:', error);
        throw error;
    }
}
