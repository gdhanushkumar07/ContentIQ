"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, FileAudio, Languages, Loader2, Download } from "lucide-react";

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "te", name: "Telugu" },
    { code: "ta", name: "Tamil" },
    { code: "mr", name: "Marathi" },
    { code: "bn", name: "Bengali" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "it", name: "Italian" },
    { code: "de", name: "German" },
    { code: "ja", name: "Japanese" },
    { code: "zh", name: "Mandarin" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
    { code: "ko", name: "Korean" },
];

export default function TranslationForm() {
    const [file, setFile] = useState<File | null>(null);
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("ja");
    const [voiceGender, setVoiceGender] = useState("any");
    const [voiceAge, setVoiceAge] = useState("any");
    const [voiceTone, setVoiceTone] = useState("any");

    const [isUploading, setIsUploading] = useState(false);

    const [result, setResult] = useState<{
        originalText: string;
        translatedText: string;
        type: "audio" | "text";
        audioBase64?: string;
        warning?: string;
    } | null>(null);

    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResult(null);
            setError("");
        }
    };

    const handleTranslate = async () => {
        if (!file) return;
        setIsUploading(true);
        setError("");
        setResult(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("sourceLanguage", sourceLang);
        formData.append("targetLanguage", targetLang);
        formData.append("voiceGender", voiceGender);
        formData.append("voiceAge", voiceAge);
        formData.append("voiceTone", voiceTone);

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                throw new Error(data.error || "Failed to translate file");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const downloadText = () => {
        if (!result?.translatedText) return;
        const blob = new Blob([result.translatedText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `translated_${file?.name || "text"}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full max-w-5xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden h-full border border-purple-500/20">

                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 -m-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -m-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 grid md:grid-cols-2 gap-8 h-full">

                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">From (Source)</label>
                                <div className="relative">
                                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                                    <select
                                        value={sourceLang}
                                        onChange={(e) => setSourceLang(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/50 text-zinc-200 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="auto">Auto Detect</option>
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-zinc-300">To (Target)</label>
                                <div className="relative">
                                    <Languages className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                                    <select
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 text-zinc-200 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ElevenLabs Voice Customization options */}
                        <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 space-y-4">
                            <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                                <Languages className="w-4 h-4" />
                                Voice Style (ElevenLabs)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-zinc-400">Gender</label>
                                    <select value={voiceGender} onChange={(e) => setVoiceGender(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none hover:border-zinc-500/50 transition-colors">
                                        <option value="any">Any</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-zinc-400">Age</label>
                                    <select value={voiceAge} onChange={(e) => setVoiceAge(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none hover:border-zinc-500/50 transition-colors">
                                        <option value="any">Any</option>
                                        <option value="young">Young</option>
                                        <option value="middle aged">Middle Aged</option>
                                        <option value="old">Old</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium mb-1 text-zinc-400">Tone / Category</label>
                                    <select value={voiceTone} onChange={(e) => setVoiceTone(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none hover:border-zinc-500/50 transition-colors">
                                        <option value="any">Any</option>
                                        <option value="narration">Narration</option>
                                        <option value="news">News</option>
                                        <option value="conversational">Conversational</option>
                                        <option value="characters">Characters / Animation</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2 text-zinc-300">Upload File (Audio or Text)</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 h-[200px] text-center cursor-pointer transition-all ${file ? 'border-purple-500/50 bg-purple-500/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/30'}`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".txt,audio/*,video/*"
                                    onChange={handleFileChange}
                                />

                                {file ? (
                                    <div className="flex flex-col items-center gap-3">
                                        {file.type.startsWith('audio') ? <FileAudio className="w-10 h-10 text-purple-400" /> : <FileText className="w-10 h-10 text-blue-400" />}
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">{file.name}</div>
                                            <div className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
                                            <UploadCloud className="w-6 h-6 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-300">Click or drag file to upload</p>
                                            <p className="text-xs text-zinc-500 mt-1">Supports .mp3, .wav, .txt</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleTranslate}
                            disabled={!file || isUploading}
                            className="w-full glow-btn py-3 rounded-xl font-semibold text-white/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Languages className="w-5 h-5" />
                                    Translate Now
                                </>
                            )}
                        </button>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </motion.div>
                        )}
                    </div>

                    {/* Results Area */}
                    <div className="bg-zinc-900/40 rounded-xl border border-zinc-800 p-6 flex flex-col h-full min-h-[350px]">
                        <h3 className="font-medium text-zinc-200 mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-400" />
                            Translation Result
                        </h3>

                        <AnimatePresence mode="wait">
                            {isUploading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center text-center gap-4 text-zinc-400">
                                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                    <p className="text-sm px-4">
                                        {file?.type.startsWith('audio')
                                            ? "Transcribing and translating audio... This can take up to a minute for larger files."
                                            : "Translating document..."}
                                    </p>
                                </motion.div>
                            ) : result ? (
                                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-4">
                                    <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-1 text-zinc-300">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Source Text</span>
                                            <div className="text-sm bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/50">
                                                {result.originalText}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-semibold text-purple-400/80 uppercase tracking-wider">Translated ({LANGUAGES.find(l => l.code === targetLang)?.name})</span>
                                            <div className="text-sm bg-purple-500/5 p-3 rounded-lg border border-purple-500/20 text-zinc-200">
                                                {result.translatedText}
                                            </div>
                                        </div>
                                    </div>

                                    {result.type === "audio" && result.audioBase64 && (
                                        <div className="mt-auto pt-4 border-t border-zinc-800">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Audio Output</label>
                                            <audio
                                                controls
                                                className="w-full h-11 rounded-lg"
                                                src={`data:audio/mp3;base64,${result.audioBase64}`}
                                            />
                                        </div>
                                    )}

                                    {result.type === "text" && (
                                        <button onClick={downloadText} className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors text-zinc-200">
                                            <Download className="w-4 h-4" /> Download Translated Text
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-zinc-500 space-y-3">
                                    <Languages className="w-10 h-10 opacity-20" />
                                    <div className="text-sm">Upload a file to see results</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
