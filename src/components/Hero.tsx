"use client";

import { Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-r from-brand-400/20 via-violet-400/20 to-brand-400/20 rounded-full blur-3xl" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-300 text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 animate-pulse-slow" />
                Powered by GPT-4o
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-slide-up">
                <span className="text-slate-900 dark:text-white">Summarize</span>
                <br />
                <span className="gradient-text">Anything, Instantly</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-slide-up">
                Paste any text or upload a file — get a brilliant AI-powered summary in seconds.
                Choose your style: bullet points, paragraph, key insights, or executive brief.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 animate-fade-in">
                {[
                    { value: "4", label: "Summary Styles" },
                    { value: "3", label: "Length Options" },
                    { value: "PDF, DOCX", label: "File Support" },
                    { value: "GPT-4o", label: "AI Engine" },
                ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
