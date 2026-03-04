export const DUMMY_SUGGESTIONS = [
    { title: 'Epic Sunrise', genre: 'Cinematic', bpm: 78, mood: 'Uplifting', match: '97%', duration: '3:12' },
    { title: 'Future Pulse', genre: 'Electronic', bpm: 128, mood: 'Energetic', match: '94%', duration: '2:48' },
    { title: 'Soft Horizon', genre: 'Lo-Fi', bpm: 72, mood: 'Calm', match: '91%', duration: '4:05' },
    { title: 'Urban Drive', genre: 'Hip-Hop', bpm: 95, mood: 'Confident', match: '88%', duration: '2:30' },
    { title: 'Deep Discovery', genre: 'Ambient', bpm: 60, mood: 'Thoughtful', match: '85%', duration: '5:20' },
];

export const TONES = ['Auto', 'Dramatic', 'Sad', 'Love', 'Joyful', 'Epic', 'Suspenseful', 'Relaxing', 'Calm', 'Thoughtful', 'Confident', 'Uplifting', 'Energetic', 'Chill'];

export interface State {
    file: File | null;
    textInput: string;
    loading: boolean;
    duration: number;
    tone: string;
    suggestions: any[];
    extractedText: string;
    errorMsg: string;
}

let state: State = {
    file: null,
    textInput: "",
    loading: false,
    duration: 10,
    tone: 'Auto',
    suggestions: [],
    extractedText: "",
    errorMsg: "",
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const bgmSuggestorStore = {
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
            textInput: "",
            loading: false,
            duration: 10,
            tone: 'Auto',
            suggestions: DUMMY_SUGGESTIONS,
            extractedText: "",
            errorMsg: "",
        };
        notify();
    },
};

import { useState, useEffect } from 'react';

export function useBgmSuggestorStore() {
    const [localState, setLocalState] = useState(bgmSuggestorStore.getState());

    useEffect(() => {
        return bgmSuggestorStore.subscribe(() => {
            setLocalState(bgmSuggestorStore.getState());
        });
    }, []);

    return localState;
}

export async function generateBgm() {
    const store = bgmSuggestorStore;
    const s = store.getState();

    if (!s.file && !s.textInput.trim()) return;
    store.setState({ loading: true, errorMsg: "", suggestions: [] });

    try {
        const formData = new FormData();
        if (s.file) {
            formData.append("file", s.file);
        } else {
            const blob = new Blob([s.textInput], { type: "text/plain" });
            formData.append("file", blob, "typed_input.txt");
        }
        formData.append("duration", s.duration.toString());
        if (s.tone !== 'Auto') {
            formData.append("tone", s.tone);
        }

        const res = await fetch("/api/bgm-suggestor", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");

        store.setState({
            extractedText: data.extractedText || "No text could be extracted.",
            suggestions: data.suggestions ? data.suggestions : DUMMY_SUGGESTIONS
        });
    } catch (err: any) {
        console.error(err);
        store.setState({
            errorMsg: err.message || "An error occurred",
            suggestions: DUMMY_SUGGESTIONS
        });
    } finally {
        store.setState({ loading: false });
    }
}
