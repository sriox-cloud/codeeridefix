import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { source_code, language_id, stdin } = await request.json();

        // Your custom Judge0 API endpoint
        const judge0Url = 'https://api.codeer.org/submissions';

        // Create submission
        const submissionResponse = await fetch(`${judge0Url}?base64_encoded=false&wait=true`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source_code,
                language_id,
                stdin: stdin || '',
            }),
        });

        const submissionData = await submissionResponse.json();

        if (submissionData.stdout) {
            return NextResponse.json({
                output: submissionData.stdout,
                stats: {
                    time: submissionData.time,
                    memory: submissionData.memory,
                    compile_output: submissionData.compile_output,
                    message: submissionData.message,
                    status: submissionData.status,
                }
            });
        } else if (submissionData.stderr) {
            return NextResponse.json({
                error: submissionData.stderr,
                stats: {
                    time: submissionData.time,
                    memory: submissionData.memory,
                    compile_output: submissionData.compile_output,
                    message: submissionData.message,
                    status: submissionData.status,
                }
            });
        } else if (submissionData.compile_output) {
            return NextResponse.json({
                error: submissionData.compile_output,
                stats: {
                    compile_output: submissionData.compile_output,
                    status: submissionData.status,
                }
            });
        } else {
            return NextResponse.json({
                output: 'Code executed successfully (no output)',
                stats: {
                    time: submissionData.time,
                    memory: submissionData.memory,
                    status: submissionData.status,
                }
            });
        }
    } catch (error) {
        console.error('Execution error:', error);
        return NextResponse.json(
            { error: 'Failed to execute code' },
            { status: 500 }
        );
    }
}
