import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import connectToDatabase from '@/lib/server/db';
import JournalEntry from '@/lib/server/models/JournalEntry';

export const runtime = 'nodejs';

const journalEntrySchema = z.object({
    userId: z.string().min(1),
    ambience: z.enum(['forest', 'ocean', 'mountain']),
    text: z.string().min(1),
    emotion: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    summary: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = journalEntrySchema.parse(body);

        await connectToDatabase();

        const entry = await JournalEntry.create({
            ...data,
            emotion: data.emotion || 'unknown',
            keywords: data.keywords || [],
            summary: data.summary || ''
        });

        return NextResponse.json(entry, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation Error',
                details: error.issues
            }, { status: 400 });
        }

        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
