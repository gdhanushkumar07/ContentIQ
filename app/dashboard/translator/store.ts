export interface TranslationResult {
    originalText: string;
    translatedText: string;
    type: "audio" | "text";
    audioBase64?: string;
    warning?: string;
}

import { addRecentActivity } from '@/lib/useRecentActivity';

export interface State {
    file: File | null;
    inputMode: "file" | "text";
    inputText: string;
    sourceLang: string;
    targetLang: string;
    voiceGender: string;
    voiceAge: string;
    voiceTone: string;
    isUploading: boolean;
    result: TranslationResult | null;
    error: string;
}

let state: State = {
    file: null,
    inputMode: "file",
    inputText: "",
    sourceLang: "en",
    targetLang: "ja",
    voiceGender: "any",
    voiceAge: "any",
    voiceTone: "any",
    isUploading: false,
    result: null,
    error: "",
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const translatorStore = {
    getState: () => state,
    subscribe: (listener: Listener) => {
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    },
    setState: (newState: Partial<State>) => {
        state = { ...state, ...newState };
        notify();
    },
    reset: () => {
        state = {
            file: null,
            inputMode: "file",
            inputText: "",
            sourceLang: "en",
            targetLang: "ja",
            voiceGender: "any",
            voiceAge: "any",
            voiceTone: "any",
            isUploading: false,
            result: null,
            error: "",
        };
        notify();
    },
};

import { useState, useEffect } from 'react';

export function useTranslatorStore() {
    const [localState, setLocalState] = useState(translatorStore.getState());

    useEffect(() => {
        return translatorStore.subscribe(() => {
            setLocalState(translatorStore.getState());
        });
    }, []);

    return localState;
}

export async function translateContent() {
    const store = translatorStore;
    const s = store.getState();

    if (s.inputMode === "file" && !s.file) return;
    if (s.inputMode === "text" && !s.inputText.trim()) return;

    store.setState({ isUploading: true, error: "", result: null });

    const formData = new FormData();

    if (s.inputMode === "file" && s.file) {
        formData.append("file", s.file);
    } else if (s.inputMode === "text") {
        formData.append("inputText", s.inputText);
    }

    formData.append("sourceLanguage", s.sourceLang);
    formData.append("targetLanguage", s.targetLang);
    formData.append("voiceGender", s.voiceGender);
    formData.append("voiceAge", s.voiceAge);
    formData.append("voiceTone", s.voiceTone);

    try {
        const res = await fetch("/api/translate", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        if (!res.ok || data.error) {
            throw new Error(data.error || "Failed to translate file");
        }

        store.setState({ result: data });
        addRecentActivity('Multilingual Dubbing', s.inputMode === 'file' && s.file ? s.file.name : `Text to ${s.targetLang}`);
    } catch (err: any) {
        store.setState({ error: err.message });
    } finally {
        store.setState({ isUploading: false });
    }
}
