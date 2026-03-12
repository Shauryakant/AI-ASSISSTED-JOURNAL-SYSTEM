'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { analyzeEmotion, createJournalEntry } from '../services/api';

type AnalysisResult = {
    emotion: string;
    keywords: string[];
    summary: string;
};

export default function JournalForm({ userId, onEntryAdded }: { userId: string, onEntryAdded: () => void }) {
    const [text, setText] = useState('');
    const [ambience, setAmbience] = useState('forest');
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

    const handleAnalyze = async () => {
        if (!text) return;
        setAnalyzing(true);
        try {
            const result = await analyzeEmotion(text);
            setAnalysis(result);
        } catch (error) {
            console.error('Analysis failed', error);
            alert('Failed to analyze emotion. Check the backend/Groq configuration.');
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text) return;
        setLoading(true);

        try {
            await createJournalEntry({
                userId,
                ambience,
                text,
                emotion: analysis?.emotion,
                keywords: analysis?.keywords,
                summary: analysis?.summary
            });
            setText('');
            setAnalysis(null);
            onEntryAdded();
        } catch (error) {
            console.error('Failed to save entry', error);
            alert('Failed to save. Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const ambiences = ['forest', 'ocean', 'mountain'] as const;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">New Journal Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Ambience</label>
                    <div className="flex gap-3">
                        {ambiences.map((a) => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => setAmbience(a)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${ambience === a
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {a.charAt(0).toUpperCase() + a.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Describe your current thoughts and feelings..."
                        className="w-full text-black p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32 outline-none transition-all"
                        required
                    />
                </div>

                {analysis && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            AI Insights
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                                {analysis.emotion}
                            </span>
                            {analysis.keywords.map((kw) => (
                                <span key={kw} className="bg-white border text-black border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium">
                                    {kw}
                                </span>
                            ))}
                        </div>
                        <p className="text-sm text-blue-800 leading-relaxed">{analysis.summary}</p>
                    </div>
                )}

                <div className="flex justify-between items-center pt-2">
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={!text || analyzing}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {analyzing ? 'Analyzing...' : 'Analyze Emotion'}
                    </button>

                    <button
                        type="submit"
                        disabled={!text || loading}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black disabled:opacity-70 flex items-center gap-2 transition-all hover:shadow-lg active:scale-95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                        Save Entry
                    </button>
                </div>
            </form>
        </div>
    );
}
