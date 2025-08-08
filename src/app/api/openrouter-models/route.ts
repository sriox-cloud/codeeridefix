import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        // OpenRouter models API
        const response = await fetch('https://openrouter.ai/api/v1/models', {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
        }

        const data = await response.json();

        // Filter for free models and commonly used ones
        const models = data.data.map((model: any) => ({
            id: model.id,
            name: model.name || model.id,
            pricing: model.pricing,
            context_length: model.context_length,
            top_provider: model.top_provider
        }));

        // Sort by pricing (free models first) and then by name
        const sortedModels = models.sort((a: any, b: any) => {
            // Free models first
            const aFree = a.pricing?.prompt === '0' || a.pricing?.prompt === 0;
            const bFree = b.pricing?.prompt === '0' || b.pricing?.prompt === 0;

            if (aFree && !bFree) return -1;
            if (!aFree && bFree) return 1;

            // Then sort by name
            return a.name.localeCompare(b.name);
        });

        return NextResponse.json({
            success: true,
            models: sortedModels,
            total: sortedModels.length
        });

    } catch (error) {
        console.error('Models fetch error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
