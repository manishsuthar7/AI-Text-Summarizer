import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { SummarizeRequest } from "@/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const STYLE_PROMPTS: Record<SummarizeRequest["style"], string> = {
    bullet: "Summarize the following text as a clean, scannable list of bullet points (use • as the bullet character). Each bullet should be concise and informative.",
    paragraph: "Summarize the following text into a coherent, well-written paragraph that captures the key ideas in flowing prose.",
    key_points: "Extract and list the key insights and takeaways from the following text as numbered points. Focus on the most important and actionable information.",
    executive: "Write an executive brief / TL;DR for the following text. Start with a one-sentence core message, then provide 3-4 critical points a decision-maker needs to know. Be concise and direct.",
};

const LENGTH_TOKENS: Record<SummarizeRequest["length"], number> = {
    short: 150,
    medium: 350,
    long: 650,
};

const LENGTH_INSTRUCTIONS: Record<SummarizeRequest["length"], string> = {
    short: "Keep it very concise, around 80 words.",
    medium: "Aim for around 200 words.",
    long: "Provide a thorough summary of around 400 words.",
};

export async function POST(req: NextRequest) {
    if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
            { error: "OpenAI API key is not configured. Add OPENAI_API_KEY to your .env.local file." },
            { status: 500 }
        );
    }

    let body: SummarizeRequest;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { text, style, length } = body;

    if (!text || typeof text !== "string" || text.trim().length < 20) {
        return NextResponse.json({ error: "Please provide at least 20 characters of text to summarize." }, { status: 400 });
    }

    const systemPrompt = `You are an expert summarizer. ${STYLE_PROMPTS[style]} ${LENGTH_INSTRUCTIONS[length]}
Only return the summary itself — no preamble, no title, no "Here is your summary:" prefix.`;

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text.slice(0, 16000) }, // safety limit
            ],
            max_tokens: LENGTH_TOKENS[length],
            temperature: 0.7,
            stream: true,
        });

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.choices[0]?.delta?.content ?? "";
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "Cache-Control": "no-cache",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message.includes("API key")
                    ? "Invalid OpenAI API key. Please check your .env.local file."
                    : err.message
                : "An unexpected error occurred.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
