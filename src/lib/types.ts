export interface SummaryStyle {
    id: "bullet" | "paragraph" | "key_points" | "executive";
    label: string;
    description: string;
    icon: string;
}

export interface SummaryLength {
    id: "short" | "medium" | "long";
    label: string;
    words: string;
}

export interface HistoryItem {
    id: string;
    inputText: string;
    summary: string;
    style: SummaryStyle["id"];
    length: SummaryLength["id"];
    timestamp: number;
    wordCount: number;
}

export interface SummarizeRequest {
    text: string;
    style: SummaryStyle["id"];
    length: SummaryLength["id"];
}

export const SUMMARY_STYLES: SummaryStyle[] = [
    {
        id: "bullet",
        label: "Bullet Points",
        description: "Clean, scannable bullet list",
        icon: "📋",
    },
    {
        id: "paragraph",
        label: "Paragraph",
        description: "Flowing prose summary",
        icon: "📝",
    },
    {
        id: "key_points",
        label: "Key Points",
        description: "Numbered highlights & insights",
        icon: "🔑",
    },
    {
        id: "executive",
        label: "Executive Brief",
        description: "TL;DR for decision makers",
        icon: "⚡",
    },
];

export const SUMMARY_LENGTHS: SummaryLength[] = [
    { id: "short", label: "Short", words: "~80 words" },
    { id: "medium", label: "Medium", words: "~200 words" },
    { id: "long", label: "Long", words: "~400 words" },
];
