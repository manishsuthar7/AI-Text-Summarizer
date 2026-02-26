import type { SummarizeRequest } from "./types";

export async function summarizeText(
    request: SummarizeRequest,
    onChunk: (chunk: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: string) => void
): Promise<void> {
    try {
        const response = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: "Unknown error" }));
            onError(error.error || `Server error: ${response.status}`);
            return;
        }

        if (!response.body) {
            onError("No response body received");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            onChunk(chunk);
        }

        onComplete(fullText);
    } catch (err) {
        onError(err instanceof Error ? err.message : "Failed to connect to the server");
    }
}

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / 200);
}
