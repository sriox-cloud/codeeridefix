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

        // Filter for code files only (excluding README files from filtering since user wants all files)
        const codeFileExtensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.cs', '.go', '.rs', '.php', '.rb', '.html', '.css', '.json', '.txt', '.md', '.yml', '.yaml', '.xml', '.sh', '.sql', '.vue', '.svelte'];

        console.log('Repository contents:', contents.length, 'items');
        console.log('Contents:', contents.map((item: any) => ({ name: item.name, type: item.type })));

        // Function to recursively fetch files from directories with better error handling
        async function fetchAllFiles(items: any[], currentPath = ''): Promise<any[]> {
            const allFiles = [];

            for (const item of items) {
                const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;
                console.log(`Processing: ${fullPath} (type: ${item.type})`);

                if (item.type === 'file') {
                    // Include more file types and be more permissive
                    const isCodeFile = codeFileExtensions.some(ext => item.name.toLowerCase().endsWith(ext)) ||
                        item.name.toLowerCase().includes('readme') ||
                        item.name.toLowerCase().includes('license') ||
                        !item.name.includes('.') || // Files without extension
                        item.size < 1000000; // Files under 1MB

                    if (isCodeFile) {
                        console.log(`Adding file: ${fullPath}`);
                        allFiles.push({ ...item, fullPath });
                    } else {
                        console.log(`Skipping file: ${fullPath} (not a code file)`);
                    }
                } else if (item.type === 'dir' && !item.name.startsWith('.') && item.name !== 'node_modules') {
                    // Skip hidden directories and node_modules
                    console.log(`Exploring directory: ${fullPath}`);
                    try {
                        const dirResponse = await fetch(item.url, {
                            headers: {
                                'Authorization': `token ${accessToken}`,
                                'Accept': 'application/vnd.github.v3+json',
                            },
                        });

                        if (dirResponse.ok) {
                            const dirContents = await dirResponse.json();
                            console.log(`Directory ${fullPath} has ${dirContents.length} items`);
                            const dirFiles = await fetchAllFiles(dirContents, fullPath);
                            allFiles.push(...dirFiles);
                        } else {
                            console.error(`Failed to fetch directory ${fullPath}:`, dirResponse.status);
                        }
                    } catch (error) {
                        console.error(`Error fetching directory ${fullPath}:`, error);
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
                    console.log(`Fetching content for: ${file.fullPath || file.name}`);
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
                            name: file.fullPath || file.name, // Use full path as name
                            content: content,
                            size: file.size
                        };
                    } else {
                        console.error(`Failed to fetch file ${file.name}:`, fileResponse.status);
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
        console.log('File names:', validFiles.map((f: any) => f.name));

        return NextResponse.json({
            success: true,
            repository: repository,
            files: validFiles,
            totalFiles: validFiles.length,
            debug: {
                totalContents: contents.length,
                foundCodeFiles: codeFiles.length,
                successfullyLoaded: validFiles.length,
                fileNames: validFiles.map((f: any) => f.name)
            }
        });

    } catch (error) {
        console.error('GitHub load error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
