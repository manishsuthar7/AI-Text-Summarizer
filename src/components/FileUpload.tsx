"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FileUploadProps {
    onTextExtracted: (text: string, fileName: string) => void;
}

export default function FileUpload({ onTextExtracted }: FileUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{ name: string; chars: number } | null>(null);

    const processFile = useCallback(
        async (file: File) => {
            setIsLoading(true);
            setUploadedFile(null);

            const ext = file.name.split(".").pop()?.toLowerCase();
            if (!["txt", "pdf", "docx"].includes(ext ?? "")) {
                toast.error("Unsupported file type. Please upload TXT, PDF, or DOCX.");
                setIsLoading(false);
                return;
            }

            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/extract-text", { method: "POST", body: formData });
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to extract text");

                onTextExtracted(data.text, file.name);
                setUploadedFile({ name: file.name, chars: data.text.length });
                toast.success("File text extracted successfully!");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to process file");
            } finally {
                setIsLoading(false);
            }
        },
        [onTextExtracted]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (files) => files[0] && processFile(files[0]),
        accept: {
            "text/plain": [".txt"],
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        },
        multiple: false,
        maxSize: 10 * 1024 * 1024, // 10MB
        onDropRejected: () => toast.error("File too large or unsupported format (max 10MB)"),
    });

    if (uploadedFile) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
                    <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {uploadedFile.chars.toLocaleString()} characters extracted
                    </p>
                </div>
                <button
                    onClick={() => setUploadedFile(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                    aria-label="Remove file"
                >
                    <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
            </div>
        );
    }

    return (
        <div
            {...getRootProps()}
            className={`
        relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
        ${isDragActive
                    ? "border-brand-400 bg-brand-50 dark:bg-brand-950/30 scale-[1.01]"
                    : "border-slate-200 dark:border-white/20 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-white/5"
                }
      `}
        >
            <input {...getInputProps()} />
            {isLoading ? (
                <>
                    <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Extracting text…</p>
                </>
            ) : (
                <>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDragActive ? "animated-gradient" : "bg-slate-100 dark:bg-white/10"} transition-all duration-200`}>
                        <Upload className={`w-6 h-6 ${isDragActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    {isDragActive ? (
                        <p className="text-base font-semibold text-brand-600 dark:text-brand-400">Drop it here!</p>
                    ) : (
                        <>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                    Drag & drop or <span className="text-brand-500">browse</span>
                                </p>
                                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">PDF, DOCX, TXT · Max 10MB</p>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
