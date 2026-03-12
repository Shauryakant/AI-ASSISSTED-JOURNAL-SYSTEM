import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeEmotion } from '@/lib/server/llm';

export const runtime = 'nodejs';

const analyzeSchema = z.object({
    text: z.string().min(1)
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = analyzeSchema.parse(body);
        const analysis = await analyzeEmotion(text);

        return NextResponse.json(analysis);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation Error',
                details: error.issues
            }, { status: 400 });
        }

        const message = error instanceof Error ? error.message : 'Failed to analyze text';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
