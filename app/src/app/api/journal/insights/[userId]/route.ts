import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/server/db';
import JournalEntry from '@/lib/server/models/JournalEntry';

export const runtime = 'nodejs';

export async function GET(_: Request, context: { params: Promise<{ userId: string }> }) {
    try {
        const { userId } = await context.params;

        await connectToDatabase();
        const entries = await JournalEntry.find({ userId });

        if (!entries.length) {
            return NextResponse.json({
                totalEntries: 0,
                topEmotion: 'None',
                mostUsedAmbience: 'None',
                recentKeywords: []
            });
        }

        const emotionCounts: Record<string, number> = {};
        const ambienceCounts: Record<string, number> = {};
        const keywordCounts: Record<string, number> = {};

        for (const entry of entries) {
            if (entry.emotion && entry.emotion !== 'unknown' && entry.emotion !== 'neutral') {
                emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
            }

            if (entry.ambience) {
                ambienceCounts[entry.ambience] = (ambienceCounts[entry.ambience] || 0) + 1;
            }

            for (const keyword of entry.keywords || []) {
                const normalized = keyword.toLowerCase().trim();
                if (!normalized) continue;
                keywordCounts[normalized] = (keywordCounts[normalized] || 0) + 1;
            }
        }

        const getTop = (counts: Record<string, number>) =>
            Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'None';

        const recentKeywords = Object.keys(keywordCounts)
            .sort((a, b) => keywordCounts[b] - keywordCounts[a])
            .slice(0, 5);

        return NextResponse.json({
            totalEntries: entries.length,
            topEmotion: getTop(emotionCounts),
            mostUsedAmbience: getTop(ambienceCounts),
            recentKeywords
        });
    } catch {
        return NextResponse.json({ error: 'Server error computing insights' }, { status: 500 });
    }
}
