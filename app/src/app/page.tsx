'use client';

import { useEffect, useState } from 'react';
import JournalForm from '@/components/JournalForm';
import EntriesList from '@/components/EntriesList';
import InsightsPanel from '@/components/InsightsPanel';
import { getJournalEntries, getInsights } from '@/services/api';

const USER_ID = 'test-user-123';

export default function Home() {
  const [entries, setEntries] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [loadingInsights, setLoadingInsights] = useState(true);

  const fetchData = async () => {
    try {
      setLoadingEntries(true);
      setLoadingInsights(true);

      const [entriesData, insightsData] = await Promise.all([
        getJournalEntries(USER_ID).catch((e) => { console.error(e); return []; }),
        getInsights(USER_ID).catch((e) => { console.error(e); return null; })
      ]);

      setEntries(entriesData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoadingEntries(false);
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl filter drop-shadow-sm">🌿</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
              Mindscape Journal
            </h1>
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            {USER_ID}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 relative">

          <div className="lg:col-span-8 space-y-8">
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <JournalForm userId={USER_ID} onEntryAdded={fetchData} />
            </section>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
              <EntriesList entries={entries} loading={loadingEntries} />
            </section>
          </div>

          <aside className="lg:col-span-4 relative animate-in fade-in slide-in-from-right-4 duration-500 delay-300 fill-mode-both">
            <InsightsPanel insights={insights} loading={loadingInsights} />
          </aside>

        </div>
      </main>
    </div>
  );
}
