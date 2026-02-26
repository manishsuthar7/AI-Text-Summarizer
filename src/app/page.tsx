"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Summarizer from "@/components/Summarizer";
import HistorySidebar from "@/components/HistorySidebar";
import { getHistory } from "@/lib/history";
import { HistoryItem } from "@/lib/types";
import { History, X } from "lucide-react";

export default function Home() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [restoredItem, setRestoredItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        setHistory(getHistory());
    }, []);

    const handleRestore = (item: HistoryItem) => {
        setRestoredItem(item);
        setShowSidebar(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f] transition-colors duration-300">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <Hero />

                {/* Layout: 2-col on large screens */}
                <div className="relative flex gap-6 mt-4">
                    {/* Main panel */}
                    <div className="flex-1 min-w-0">
                        <Summarizer
                            onHistoryUpdate={(h) => setHistory(h)}
                            restoredItem={restoredItem}
                        />
                    </div>

                    {/* Sidebar — desktop always visible */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24">
                            <HistorySidebar
                                history={history}
                                onRestore={handleRestore}
                                onHistoryChange={setHistory}
                                onClose={() => setShowSidebar(false)}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile history button */}
                <button
                    onClick={() => setShowSidebar(true)}
                    className="fixed bottom-6 right-6 lg:hidden btn-primary rounded-2xl flex items-center gap-2 px-5 py-3 shadow-xl shadow-brand-500/30 text-sm"
                >
                    <History className="w-4 h-4" />
                    History
                    {history.length > 0 && (
                        <span className="bg-white/20 text-white text-xs font-bold rounded-full px-1.5 py-0.5 ml-1">
                            {history.length}
                        </span>
                    )}
                </button>

                {/* Mobile sidebar overlay */}
                {showSidebar && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowSidebar(false)}
                        />
                        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#111118] p-4 shadow-2xl overflow-y-auto">
                            <HistorySidebar
                                history={history}
                                onRestore={handleRestore}
                                onHistoryChange={setHistory}
                                onClose={() => setShowSidebar(false)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-white/10 py-8 text-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    Built with{" "}
                    <span className="gradient-text font-semibold">Next.js + GPT-4o</span>
                    {" "}&mdash; Summarize smarter, not harder.
                </p>
            </footer>
        </div>
    );
}
