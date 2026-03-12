import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/server/db';
import JournalEntry from '@/lib/server/models/JournalEntry';

export const runtime = 'nodejs';

export async function GET(_: Request, context: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await context.params;

        await connectToDatabase();
        const entries = await JournalEntry.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(entries);
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
