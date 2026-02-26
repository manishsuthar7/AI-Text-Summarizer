import type { HistoryItem, SummaryStyle, SummaryLength } from "./types";

const HISTORY_KEY = "ai-summarizer-history";
const MAX_HISTORY = 10;

export function saveToHistory(item: Omit<HistoryItem, "id" | "timestamp">): HistoryItem {
    const newItem: HistoryItem = {
        ...item,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
    };

    const history = getHistory();
    const updated = [newItem, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
}

export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
    const history = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
}

export function clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY);
}

export function getStyleLabel(id: SummaryStyle["id"]): string {
    const labels: Record<SummaryStyle["id"], string> = {
        bullet: "Bullet Points",
        paragraph: "Paragraph",
        key_points: "Key Points",
        executive: "Executive Brief",
    };
    return labels[id] ?? id;
}

export function getLengthLabel(id: SummaryLength["id"]): string {
    const labels: Record<SummaryLength["id"], string> = {
        short: "Short",
        medium: "Medium",
        long: "Long",
    };
    return labels[id] ?? id;
}
