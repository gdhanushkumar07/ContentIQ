import { useState, useEffect, useCallback } from 'react';

export type ActivityItem = {
    action: string;
    subject: string;
    time: string; // ISO string
};

// Helper to format time like "2 min ago" or "Yesterday"
export function formatTimeAgo(dateString: string) {
    if (!dateString) return '';

    // If it's already a formatted string like "2 min ago", "Yesterday", etc from the old mock data
    if (!dateString.includes('T') && !dateString.includes('-')) {
        return dateString;
    }

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `Just now`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hr ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return `Yesterday`;
        if (diffInDays < 7) return `${diffInDays} days ago`;
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks === 1) return `1 week ago`;
        return `${Math.floor(diffInDays / 7)} weeks ago`;
    } catch (e) {
        return dateString;
    }
}

export const useRecentActivity = () => {
    const [activities, setActivities] = useState<ActivityItem[]>([]);

    const loadActivities = () => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('contentIQ_recentActivities');
            if (stored) {
                try {
                    setActivities(JSON.parse(stored));
                } catch (e) {
                    console.error(e);
                }
            } else {
                // Default mock data when localstorage is empty
                const defaultActivities = [
                    { action: 'Video analyzed', subject: 'product-launch-v2.mp4', time: new Date(Date.now() - 120000).toISOString() },
                    { action: 'Script generated', subject: 'Tech Review — LinkedIn', time: new Date(Date.now() - 3600000).toISOString() },
                    { action: 'Published to 8 platforms', subject: 'Behind the Scenes Reel', time: new Date(Date.now() - 10800000).toISOString() },
                    { action: 'Privacy filter applied', subject: 'interview-raw.mp4', time: new Date(Date.now() - 86400000).toISOString() },
                    { action: 'BGM suggested', subject: 'Product Walk-through', time: new Date(Date.now() - 86400000).toISOString() },
                    { action: 'Thumbnail analyzed', subject: 'thumbnail-v1.png', time: new Date(Date.now() - 2 * 86400000).toISOString() },
                    { action: 'Script generated', subject: 'Company Update', time: new Date(Date.now() - 2 * 86400000).toISOString() },
                    { action: 'Voice tracked', subject: 'voiceover-v3.mp3', time: new Date(Date.now() - 3 * 86400000).toISOString() },
                ];
                setActivities(defaultActivities);
                localStorage.setItem('contentIQ_recentActivities', JSON.stringify(defaultActivities));
            }
        }
    };

    useEffect(() => {
        loadActivities();
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'contentIQ_recentActivities') {
                loadActivities();
            }
        };
        const handleCustomUpdate = () => {
            loadActivities();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('recentActivityUpdate', handleCustomUpdate);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('recentActivityUpdate', handleCustomUpdate);
        };
    }, []);

    const addActivity = useCallback((action: string, subject: string) => {
        addRecentActivity(action, subject);
    }, []);

    return { activities, addActivity };
};

// Standalone function for use outside of React hooks (e.g. Zustand stores)
export const addRecentActivity = (action: string, subject: string) => {
    if (typeof window === 'undefined') return;

    const newActivity: ActivityItem = {
        action,
        subject,
        time: new Date().toISOString()
    };

    const stored = localStorage.getItem('contentIQ_recentActivities');
    let currentActivities: ActivityItem[] = [];
    if (stored) {
        try { currentActivities = JSON.parse(stored); } catch (e) { }
    } else {
        // Fallback for standalone
        currentActivities = [
            { action: 'Video analyzed', subject: 'product-launch-v2.mp4', time: new Date(Date.now() - 120000).toISOString() },
            { action: 'Script generated', subject: 'Tech Review — LinkedIn', time: new Date(Date.now() - 3600000).toISOString() },
            { action: 'Published to 8 platforms', subject: 'Behind the Scenes Reel', time: new Date(Date.now() - 10800000).toISOString() },
            { action: 'Privacy filter applied', subject: 'interview-raw.mp4', time: new Date(Date.now() - 86400000).toISOString() },
            { action: 'BGM suggested', subject: 'Product Walk-through', time: new Date(Date.now() - 86400000).toISOString() },
        ];
    }

    const updated = [newActivity, ...currentActivities].slice(0, 50);
    localStorage.setItem('contentIQ_recentActivities', JSON.stringify(updated));

    // Dispatch custom event to update other instances in the same tab
    window.dispatchEvent(new Event('recentActivityUpdate'));
};
