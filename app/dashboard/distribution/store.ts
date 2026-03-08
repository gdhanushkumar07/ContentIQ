import { addRecentActivity } from '@/lib/useRecentActivity';

export interface PlatformContent {
    content: string;
    hashtags: string[];
}

export interface DistributionPlan {
    youtube: PlatformContent;
    shorts: PlatformContent;
    instagram: PlatformContent;
    x: PlatformContent;
    facebook: PlatformContent;
}

export interface State {
    title: string;
    category: string;
    description: string;
    sourceLinks: string;
    selectedPlatformsForSources: string[];
    loading: boolean;
    plan: DistributionPlan | null;
    error: string | null;
}

let state: State = {
    title: "",
    category: "",
    description: "",
    sourceLinks: "",
    selectedPlatformsForSources: [],
    loading: false,
    plan: null,
    error: null,
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const distributionStore = {
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
            title: "",
            category: "",
            description: "",
            sourceLinks: "",
            selectedPlatformsForSources: [],
            loading: false,
            plan: null,
            error: null,
        };
        notify();
    },
};

import { useState, useEffect } from 'react';

export function useDistributionStore() {
    const [localState, setLocalState] = useState(distributionStore.getState());

    useEffect(() => {
        return distributionStore.subscribe(() => {
            setLocalState(distributionStore.getState());
        });
    }, []);

    return localState;
}

export async function generateDistributionPlan() {
    const store = distributionStore;
    const s = store.getState();

    if (!s.title || !s.description) {
        store.setState({ error: "Please fill in the required fields (Title and Description)." });
        return;
    }

    store.setState({ loading: true, error: null, plan: null });

    try {
        const response = await fetch("/api/distribution", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: s.title,
                category: s.category || "General",
                description: s.description,
                sourceLinks: s.sourceLinks,
                selectedPlatformsForSources: s.selectedPlatformsForSources,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate plan");
        }

        const data = await response.json();
        store.setState({ plan: data });
        addRecentActivity('Published to multiple platforms', s.title);
    } catch (err: any) {
        store.setState({ error: err.message || "An unexpected error occurred." });
    } finally {
        store.setState({ loading: false });
    }
}
