import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { message, apiKey, code, language, model } = await request.json();

        if (!apiKey) {
            return NextResponse.json({ error: 'API key is required' }, { status: 400 });
        }

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Create system message with code context
        const systemMessage = {
            role: 'system',
            content: `You are a helpful coding assistant. The user is working with ${language} code. Here's their current code:

\`\`\`${language}
${code}
\`\`\`

Please help them with their questions about this code, debugging, optimization, or general programming questions. Keep responses concise but helpful.`
        };

        const userMessage = {
            role: 'user',
            content: message
        };

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'Codeer IDE'
            },
            body: JSON.stringify({
                model: model || 'gpt-4o-mini',
                messages: [systemMessage, userMessage],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('OpenRouter API Error:', errorData);
            return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || 'No response generated';

        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error('AI Assistant error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
