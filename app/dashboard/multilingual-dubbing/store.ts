export const LANGUAGES = [
    'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada',
    'Malayalam', 'Punjabi', 'Odia', 'Spanish', 'French', 'Arabic', 'Mandarin',
    'Portuguese', 'Japanese'
];

export interface Job {
    name: string;
    langs: string[];
    status: 'Done' | 'Processing' | 'Queued';
    pct: number;
}

export interface State {
    jobs: Job[];
}

let state: State = {
    jobs: [
        { name: 'startup-pitch.mp4', langs: ['Hindi', 'Tamil', 'Spanish'], status: 'Done', pct: 100 },
        { name: 'product-demo-v3.mp4', langs: ['Bengali', 'Arabic'], status: 'Processing', pct: 67 },
        { name: 'vlog-ep12.mp4', langs: ['French', 'Japanese'], status: 'Queued', pct: 0 },
    ],
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const multilingualDubbingStore = {
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
            jobs: [
                { name: 'startup-pitch.mp4', langs: ['Hindi', 'Tamil', 'Spanish'], status: 'Done', pct: 100 },
                { name: 'product-demo-v3.mp4', langs: ['Bengali', 'Arabic'], status: 'Processing', pct: 67 },
                { name: 'vlog-ep12.mp4', langs: ['French', 'Japanese'], status: 'Queued', pct: 0 },
            ],
        };
        notify();
    },
};

import { useState, useEffect } from 'react';

export function useMultilingualDubbingStore() {
    const [localState, setLocalState] = useState(multilingualDubbingStore.getState());

    useEffect(() => {
        return multilingualDubbingStore.subscribe(() => {
            setLocalState(multilingualDubbingStore.getState());
        });
    }, []);

    return localState;
}

// In the future this function will trigger the dubbing API
export async function generateDubbingPlan() {
    // unimplemented for now as per plan
}
