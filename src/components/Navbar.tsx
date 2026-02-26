"use client";

import { Moon, Sun, Github, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/70 dark:bg-black/40 border-b border-slate-200/60 dark:border-white/10">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl animated-gradient flex items-center justify-center shadow-lg shadow-brand-500/30">
                    <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg tracking-tight">
                    <span className="gradient-text">AI</span>
                    <span className="text-slate-800 dark:text-white ml-1">Summarizer</span>
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary hidden sm:flex items-center gap-2 text-sm"
                >
                    <Github className="w-4 h-4" />
                    GitHub
                </a>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/20 transition-all duration-200"
                    aria-label="Toggle theme"
                >
                    {mounted ? (
                        theme === "dark" ? (
                            <Sun className="w-4 h-4 text-amber-400" />
                        ) : (
                            <Moon className="w-4 h-4 text-brand-500" />
                        )
                    ) : (
                        <div className="w-4 h-4" />
                    )}
                </button>
            </div>
        </nav>
    );
}
