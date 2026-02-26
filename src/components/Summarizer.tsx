"use client";

import { useState, useRef } from "react";
import { Sparkles, Loader2, AlignLeft, File } from "lucide-react";
import toast from "react-hot-toast";
import FileUpload from "@/components/FileUpload";
import OutputPanel from "@/components/OutputPanel";
import { SUMMARY_STYLES, SUMMARY_LENGTHS, type SummaryStyle, type SummaryLength, type HistoryItem } from "@/lib/types";
import { summarizeText, countWords } from "@/lib/summarize";
import { saveToHistory, getHistory } from "@/lib/history";

interface SummarizerProps {
    onHistoryUpdate: (history: HistoryItem[]) => void;
    restoredItem: HistoryItem | null;
}

export default function Summarizer({ onHistoryUpdate, restoredItem }: SummarizerProps) {
    const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
    const [inputText, setInputText] = useState(restoredItem?.inputText ?? "");
    const [style, setStyle] = useState<SummaryStyle["id"]>(restoredItem?.style ?? "bullet");
    const [length, setLength] = useState<SummaryLength["id"]>(restoredItem?.length ?? "medium");
    const [summary, setSummary] = useState(restoredItem?.summary ?? "");
    const [isStreaming, setIsStreaming] = useState(false);
    const abortRef = useRef<boolean>(false);

    // Restore from history
    const handleRestore = (item: HistoryItem) => {
        setInputText(item.inputText);
        setStyle(item.style);
        setLength(item.length);
        setSummary(item.summary);
    };

    // Keep parent in sync when restored item changes
    if (restoredItem && restoredItem.id !== undefined) {
        // handled via parent
    }

    const wordCount = countWords(inputText);
    const charCount = inputText.length;

    const handleSummarize = async () => {
        const text = inputText.trim();
        if (text.length < 20) {
            toast.error("Please enter at least 20 characters.");
            return;
        }

        setSummary("");
        setIsStreaming(true);
        abortRef.current = false;

        let accumulated = "";

        await summarizeText(
            { text, style, length },
            (chunk) => {
                if (abortRef.current) return;
                accumulated += chunk;
                setSummary(accumulated);
            },
            (fullText) => {
                setIsStreaming(false);
                const saved = saveToHistory({
                    inputText: text,
                    summary: fullText,
                    style,
                    length,
                    wordCount: countWords(fullText),
                });
                onHistoryUpdate(getHistory());
                void saved;
            },
            (error) => {
                setIsStreaming(false);
                toast.error(error);
            }
        );
    };

    return (
        <div className="space-y-6">
            {/* Main card */}
            <div className="glass-card p-6 space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/10 rounded-xl w-fit">
                    {[
                        { id: "paste", label: "Paste Text", icon: AlignLeft },
                        { id: "upload", label: "Upload File", icon: File },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id as "paste" | "upload")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === id
                                    ? "bg-white dark:bg-white/20 text-brand-600 dark:text-brand-300 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Input area */}
                {activeTab === "paste" ? (
                    <div className="relative">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste your article, essay, report, or any text here…"
                            rows={10}
                            className="w-full resize-none rounded-xl border border-slate-200 dark:border-white/20 bg-white dark:bg-white/5 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:focus:ring-brand-600 transition"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg">
                            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
                        </div>
                    </div>
                ) : (
                    <FileUpload
                        onTextExtracted={(text) => {
                            setInputText(text);
                            setActiveTab("paste");
                        }}
                    />
                )}

                {/* Summary Styles */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Summary Style
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {SUMMARY_STYLES.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setStyle(s.id)}
                                className={`flex flex-col items-start gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200 ${style === s.id
                                        ? "border-brand-400 dark:border-brand-600 bg-brand-50 dark:bg-brand-950/40 shadow-sm shadow-brand-500/20"
                                        : "border-slate-100 dark:border-white/10 hover:border-brand-200 dark:hover:border-brand-800 hover:bg-slate-50 dark:hover:bg-white/5"
                                    }`}
                            >
                                <span className="text-xl">{s.icon}</span>
                                <span className={`text-xs font-semibold ${style === s.id ? "text-brand-600 dark:text-brand-300" : "text-slate-700 dark:text-slate-300"}`}>
                                    {s.label}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">{s.description}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Length selector */}
                <div>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                        Summary Length
                    </p>
                    <div className="flex items-center gap-3">
                        {SUMMARY_LENGTHS.map((l) => (
                            <button
                                key={l.id}
                                onClick={() => setLength(l.id)}
                                className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-center transition-all duration-200 ${length === l.id
                                        ? "border-brand-400 dark:border-brand-600 bg-brand-50 dark:bg-brand-950/40"
                                        : "border-slate-100 dark:border-white/10 hover:border-brand-200 dark:hover:border-brand-800"
                                    }`}
                            >
                                <span className={`text-sm font-semibold block ${length === l.id ? "text-brand-600 dark:text-brand-300" : "text-slate-700 dark:text-slate-300"}`}>
                                    {l.label}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">{l.words}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSummarize}
                    disabled={isStreaming || inputText.trim().length < 20}
                    className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 text-base"
                >
                    {isStreaming ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Summarize
                        </>
                    )}
                </button>
            </div>

            {/* Output */}
            <OutputPanel summary={summary} isStreaming={isStreaming} />
        </div>
    );
}
