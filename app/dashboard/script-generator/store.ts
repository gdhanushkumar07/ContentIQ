import { addRecentActivity } from '@/lib/useRecentActivity';

export interface State {
    topic: string;
    tone: string;
    length: string;
    customReq: string;
    mode: string;
    phase: 'input' | 'loading' | 'results';
    data: any | null;
    error: string;
}

let state: State = {
    topic: '',
    tone: '',
    length: '',
    customReq: '',
    mode: 'Director Mode',
    phase: 'input',
    data: null,
    error: '',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const scriptGeneratorStore = {
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
            topic: '',
            tone: 'Casual',
            length: '1-3 minutes',
            customReq: '',
            mode: 'Director Mode',
            phase: 'input',
            data: null,
            error: '',
        };
        notify();
    },
};

import { useState, useEffect } from 'react';

export function useScriptGeneratorStore() {
    const [localState, setLocalState] = useState(scriptGeneratorStore.getState());

    useEffect(() => {
        return scriptGeneratorStore.subscribe(() => {
            setLocalState(scriptGeneratorStore.getState());
        });
    }, []);

    return localState;
}

export async function generateScript() {
    const store = scriptGeneratorStore;
    const s = store.getState();
    if (!s.topic) return;

    store.setState({ phase: 'loading', data: null, error: '' });

    try {
        const res = await fetch('/api/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: s.topic,
                tone: s.tone,
                length: s.length,
                customRequirements: s.customReq,
                mode: s.mode,
            }),
        });
        const result = await res.json();

        if (res.ok && result.results) {
            store.setState({ data: result, phase: 'results' });
            addRecentActivity('Script generated', s.topic);
        } else {
            throw new Error(result.details || result.error || 'Failed to generate script');
        }
    } catch (err: any) {
        console.error(err);
        store.setState({ error: err.message || 'An unexpected error occurred', phase: 'input' });
    }
}
