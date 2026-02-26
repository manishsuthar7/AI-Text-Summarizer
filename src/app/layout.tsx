import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "AI Text Summarizer — GPT-4o Powered",
    description:
        "Instantly summarize any text with AI. Paste or upload PDFs, DOCX files, and get bullet points, paragraphs, key insights, or executive briefs in seconds. Powered by GPT-4o.",
    keywords: ["AI summarizer", "text summarizer", "GPT-4o", "OpenAI", "summarize PDF", "summarize document"],
    openGraph: {
        title: "AI Text Summarizer",
        description: "Summarize anything instantly with GPT-4o",
        type: "website",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            duration: 3500,
                            style: {
                                background: "hsl(240 10% 15%)",
                                color: "#f1f5f9",
                                border: "1px solid hsl(240 10% 25%)",
                                borderRadius: "12px",
                                fontSize: "13px",
                            },
                            success: {
                                iconTheme: { primary: "#6366f1", secondary: "#fff" },
                            },
                            error: {
                                iconTheme: { primary: "#ef4444", secondary: "#fff" },
                            },
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    );
}
