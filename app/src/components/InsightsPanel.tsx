'use client';

import { Brain, Hash, TrendingUp, Compass } from 'lucide-react';

type Insights = {
    totalEntries: number;
    topEmotion: string;
    mostUsedAmbience: string;
    recentKeywords: string[];
};

export default function InsightsPanel({ insights, loading }: { insights: Insights | null, loading: boolean }) {
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                    <div className="h-8 bg-gray-100 rounded w-full"></div>
                </div>
            </div>
        );
    }

    if (!insights || insights.totalEntries === 0) {
        return (
            <div className="bg-gradient-to-br from-indigo-50 leading-relaxed to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100">
                <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-500" />
                    Analytics Dashboard
                </h3>
                <p className="text-sm text-indigo-600/80">Start journaling to see your insights and emotional trends.</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 text-white sticky top-6">
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-2 text-white">
                <Brain className="w-5 h-5 text-blue-400" />
                Mental State Insights
            </h3>

            <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Total Sessions</span>
                    </div>
                    <span className="font-semibold text-xl">{insights.totalEntries}</span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Hash className="w-4 h-4 text-purple-400" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Dominant Emotion</span>
                    </div>
                    <span className="font-semibold text-lg capitalize">{insights.topEmotion}</span>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <Compass className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Favorite Ambience</span>
                    </div>
                    <span className="font-semibold text-lg capitalize">{insights.mostUsedAmbience}</span>
                </div>
            </div>

            {insights.recentKeywords.length > 0 ? (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Trending Themes</p>
                    <div className="flex flex-wrap gap-2">
                        {insights.recentKeywords.map((kw) => (
                            <span key={kw} className="bg-slate-700/50 text-slate-200 border border-slate-600 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                                #{kw}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
