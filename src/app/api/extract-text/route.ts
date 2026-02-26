import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const ext = file.name.split(".").pop()?.toLowerCase();
        let text = "";

        if (ext === "txt") {
            text = await file.text();
        } else if (ext === "pdf") {
            const { extractTextFromPdf } = await import("@/lib/pdf-extract");
            const buffer = await file.arrayBuffer();
            text = await extractTextFromPdf(Buffer.from(buffer));
        } else if (ext === "docx") {
            const mammoth = await import("mammoth");
            const buffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            return NextResponse.json({ error: "Unsupported file type. Use .txt, .pdf, or .docx" }, { status: 400 });
        }

        text = text.replace(/\s+/g, " ").trim();
        if (text.length < 20) {
            return NextResponse.json({ error: "Extracted text is too short to summarize." }, { status: 400 });
        }

        return NextResponse.json({ text: text.slice(0, 50000) });
    } catch (err) {
        console.error("Extract text error:", err);
        return NextResponse.json({ error: "Failed to extract text from file." }, { status: 500 });
    }
}
