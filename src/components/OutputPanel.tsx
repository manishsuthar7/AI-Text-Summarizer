"use client";

import { useState } from "react";
import { Copy, Download, Check, Clock, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { countWords, estimateReadingTime } from "@/lib/summarize";

interface OutputPanelProps {
    summary: string;
    isStreaming: boolean;
}

export default function OutputPanel({ summary, isStreaming }: OutputPanelProps) {
    const [copied, setCopied] = useState(false);
    const wordCount = countWords(summary);
    const readingTime = estimateReadingTime(wordCount);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(summary);
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDownload = () => {
        const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `summary-${new Date().toISOString().slice(0, 10)}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Summary downloaded!");
    };

    if (!summary && !isStreaming) return null;

    return (
        <div className="glass-card p-6 animate-slide-up glow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        {isStreaming ? "Generating Summary…" : "Summary"}
                    </h3>
                </div>

                {!isStreaming && summary && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className="btn-secondary flex items-center gap-1.5 text-xs"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                        <button onClick={handleDownload} className="btn-secondary flex items-center gap-1.5 text-xs">
                            <Download className="w-3.5 h-3.5" />
                            Save
                        </button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div
                className={`min-h-[100px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base custom-scroll ${isStreaming ? "cursor-blink" : ""
                    }`}
            >
                {summary || <span className="text-slate-400 dark:text-slate-500 italic">Starting…</span>}
            </div>

            {/* Stats */}
            {!isStreaming && summary && (
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        {wordCount.toLocaleString()} words
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {readingTime} min read
                    </div>
                </div>
            )}
        </div>
    );
}
