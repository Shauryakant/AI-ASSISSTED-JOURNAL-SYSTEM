'use client';

import { Calendar, Tag } from 'lucide-react';

type JournalEntry = {
    _id: string;
    ambience: 'forest' | 'ocean' | 'mountain';
    text: string;
    emotion?: string;
    keywords?: string[];
    summary?: string;
    createdAt: string;
};

export default function EntriesList({ entries, loading }: { entries: JournalEntry[], loading: boolean }) {
    if (loading) return <div className="text-center py-8 text-gray-500 animate-pulse">Loading entries...</div>;
    if (!entries.length) return <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">No journal entries yet.</div>;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-800 px-1">Recent Entries</h3>
            {entries.map((entry) => (
                <div key={entry._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${entry.ambience === 'forest'
                            ? 'bg-green-100 text-green-700'
                            : entry.ambience === 'ocean'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                            {entry.ambience}
                        </span>
                        <div className="flex items-center text-xs text-gray-400 gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-4 leading-relaxed whitespace-pre-wrap">{entry.text}</p>

                    {entry.emotion && entry.emotion !== 'unknown' ? (
                        <div className="mt-4 pt-4 border-t border-gray-50 bg-gray-50/80 -mx-5 -mb-5 p-5 rounded-b-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Detected Emotion:</span>
                                <span className="text-sm font-bold capitalize text-blue-700">{entry.emotion}</span>
                            </div>
                            {entry.summary ? <p className="text-sm text-gray-600 mb-3 italic">&ldquo;{entry.summary}&rdquo;</p> : null}
                            <div className="flex gap-2 flex-wrap mt-2">
                                {entry.keywords?.map((kw) => (
                                    <span key={kw} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wide">
                                        <Tag className="w-2.5 h-2.5" />
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}
