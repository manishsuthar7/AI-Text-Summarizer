"use client";

import { HistoryItem } from "@/lib/types";
import { deleteHistoryItem, getStyleLabel, getLengthLabel } from "@/lib/history";
import { Clock, Trash2, X, History } from "lucide-react";
import { useState } from "react";

interface HistorySidebarProps {
    history: HistoryItem[];
    onRestore: (item: HistoryItem) => void;
    onHistoryChange: (newHistory: HistoryItem[]) => void;
    onClose: () => void;
}

export default function HistorySidebar({ history, onRestore, onHistoryChange, onClose }: HistorySidebarProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = (id: string) => {
        setDeletingId(id);
        setTimeout(() => {
            const updated = deleteHistoryItem(id);
            onHistoryChange(updated);
            setDeletingId(null);
        }, 200);
    };

    return (
        <aside className="glass-card p-5 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-brand-500" />
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">History</h2>
                    <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-full px-2 py-0.5">
                        {history.length}
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors lg:hidden"
                >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
            </div>

            {/* List */}
            {history.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No history yet</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Your recent summaries will appear here</p>
                </div>
            ) : (
                <ul className="flex-1 overflow-y-auto custom-scroll space-y-2 pr-1">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className={`group relative p-3.5 rounded-xl border border-transparent hover:border-brand-200 dark:hover:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-950/30 cursor-pointer transition-all duration-200 ${deletingId === item.id ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                            onClick={() => onRestore(item)}
                        >
                            {/* Badge row */}
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-md px-1.5 py-0.5">
                                    {getStyleLabel(item.style)}
                                </span>
                                <span className="text-xs bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-md px-1.5 py-0.5">
                                    {getLengthLabel(item.length)}
                                </span>
                            </div>

                            {/* Preview */}
                            <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                {item.summary}
                            </p>

                            {/* Timestamp and delete */}
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {new Date(item.timestamp).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
                                    aria-label="Delete"
                                >
                                    <Trash2 className="w-3 h-3 text-red-400 dark:text-red-500" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
