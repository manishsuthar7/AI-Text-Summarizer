export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    // Dynamic import to avoid SSR issues with pdfjs-dist
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map((item: { str?: string }) => item.str || "")
            .join(" ");
        fullText += pageText + "\n";
    }

    return fullText;
}
