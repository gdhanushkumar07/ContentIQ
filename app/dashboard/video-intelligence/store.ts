'use client'

import { useState, useEffect } from 'react';

export interface SceneResult {
    sceneId: string
    timestamp: string
    start: number
    end: number
    engagementScore: number
    viralityScore: number
    category: 'LOW' | 'AVERAGE' | 'HIGH'
    recommendation: 'Highlight' | 'Keep' | 'Trim' | 'Cut'
    sceneContent: string
    audioContent: string      // Actual words spoken in this scene segment
    audienceReview: string
    whyItWorked: string | null
    whyItFailed: string | null
    reshootGuide: {
        delivery: string
        visual: string
        script: string
        duration: string
        pacing: string
        emotion: string
        musicSuggestion: string
    }
    deliveryQuality: number
    visualVariation: number
    semanticInterest: number
}

export interface AnalysisResult {
    success: boolean
    videoMeta: {
        s3Key: string
        contentType: string
        fileSizeMB: number
        estimatedDurationSeconds: number
        estimatedDuration: string
    }
    avgEngagementScore: number
    totalScenes: number
    scenes: SceneResult[]
    lowEngagementCount: number
    highEngagementCount: number
    improvementTips: string[]
    // New comprehensive metrics
    categorySuitabilityScore: number
    hookStrength: number
    contentValue: number
    informationDensity: number
    deliveryStrength: number
    visualQuality: number
    editingQuality: number
    emotionalImpact: number
    competitorBenchmark: number
    contentUniqueness: number
    safetyScore: number
    viralityScore: number
    viralityPrediction: string
}

interface State {
    stage: number;
    uploadedKey: string | null;
    result: AnalysisResult | null;
    error: string | null;
    category: string;
}

let state: State = {
    stage: 0,
    uploadedKey: null,
    result: null,
    error: null,
    category: "Tech Review",
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((listener) => listener());
}

export const videoIntelligenceStore = {
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
            stage: 0,
            uploadedKey: null,
            result: null,
            error: null,
            category: "Tech Review",
        };
        notify();
    },
};

export function useVideoIntelligenceStore() {
    const [localState, setLocalState] = useState(videoIntelligenceStore.getState());

    useEffect(() => {
        return videoIntelligenceStore.subscribe(() => {
            setLocalState(videoIntelligenceStore.getState());
        });
    }, []);

    return localState;
}

export async function startVideoAnalysis(file: File) {
    if (state.stage !== 0) return;

    const store = videoIntelligenceStore;
    store.setState({ error: null, result: null });

    const readVideoDuration = (f: File): Promise<number> =>
        new Promise((resolve) => {
            const url = URL.createObjectURL(f)
            const v = document.createElement('video')
            v.preload = 'metadata'
            v.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(Math.round(v.duration)) }
            v.onerror = () => { URL.revokeObjectURL(url); resolve(60) }
            v.src = url
        })

    const extractFrames = (f: File, timestamps: number[]): Promise<{ timestamp: number; base64: string }[]> =>
        new Promise((resolve) => {
            const url = URL.createObjectURL(f)
            const video = document.createElement('video')
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const frames: { timestamp: number; base64: string }[] = []
            let idx = 0

            video.preload = 'auto'
            video.muted = true

            const captureNext = () => {
                if (idx >= timestamps.length) {
                    URL.revokeObjectURL(url)
                    resolve(frames)
                    return
                }
                video.currentTime = timestamps[idx];
            }

            video.onseeked = () => {
                canvas.width = Math.min(video.videoWidth, 640)
                canvas.height = Math.min(video.videoHeight, 360)
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                const base64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1]
                frames.push({ timestamp: timestamps[idx], base64 })
                idx++
                captureNext()
            }

            video.onerror = () => { URL.revokeObjectURL(url); resolve(frames) }
            video.onloadeddata = captureNext
            video.src = url
        })

    try {
        const durationSeconds = await readVideoDuration(file)
        const sampleCount = Math.min(20, Math.max(5, durationSeconds))
        const timestamps = Array.from({ length: sampleCount }, (_, i) =>
            Math.max(0, Math.round((i / (sampleCount - 1)) * Math.max(0, durationSeconds - 0.1)))
        )
        const frames = await extractFrames(file, timestamps)

        store.setState({ stage: 1 })
        const formData = new FormData()
        formData.append('file', file)

        let s3Key: string
        const resUpload = await fetch('/api/upload-video', { method: 'POST', body: formData })
        const dataUpload = await resUpload.json()
        if (!dataUpload.success) {
            store.setState({ error: 'Upload failed — please try again', stage: 0 });
            return;
        }
        s3Key = dataUpload.key;
        store.setState({ uploadedKey: s3Key });

        store.setState({ stage: 2 })
        const stageTimer = setInterval(() => {
            const currentStage = videoIntelligenceStore.getState().stage;
            if (currentStage >= 7 || currentStage === 0) {
                clearInterval(stageTimer);
                return;
            }
            store.setState({ stage: currentStage + 1 });
        }, 2600)

        const resAnalyze = await fetch('/api/analyze-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ s3Key, durationSeconds, frames, category: state.category }),
        })
        const dataAnalyze = await resAnalyze.json()

        clearInterval(stageTimer)

        if (!dataAnalyze.success) {
            store.setState({ error: dataAnalyze.error ?? 'Analysis failed', stage: 0 });
            return;
        }
        store.setState({ stage: 8 });
        await new Promise(r => setTimeout(r, 600));
        store.setState({ result: dataAnalyze, stage: 9 });

    } catch (err) {
        store.setState({ error: 'Analysis error: ' + String(err), stage: 0 });
    }
}
