'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import {
  SparklesIcon, DocumentTextIcon, ShareIcon,
  ShieldCheckIcon, MicrophoneIcon, GlobeAltIcon,
  PhotoIcon, MusicalNoteIcon,
} from '@heroicons/react/24/outline'
import { TrendingUp, Zap, Eye, CheckCircle } from 'lucide-react'

const STATS = [
  { label: 'Videos Processed', value: '1,284', delta: '+12%', color: '#38BDF8' },
  { label: 'Scripts Generated', value: '347', delta: '+8%', color: '#8B5CF6' },
  { label: 'Platforms Reached', value: '40+', delta: '', color: '#10b981' },
  { label: 'Avg. Engagement Lift', value: '3.2x', delta: '+0.4x', color: '#f59e0b' },
]

const QUICK_LINKS = [
  { label: 'Video Intelligence', href: '/dashboard/video-intelligence', icon: SparklesIcon, color: '#38BDF8' },
  { label: 'Script Generator', href: '/dashboard/script-generator', icon: DocumentTextIcon, color: '#8B5CF6' },
  { label: 'Distribution', href: '/dashboard/distribution', icon: ShareIcon, color: '#10b981' },
  { label: 'Privacy Filter', href: '/dashboard/privacy-filter', icon: ShieldCheckIcon, color: '#f59e0b' },
  { label: 'Voice Tracker', href: '/dashboard/voice-tracker', icon: MicrophoneIcon, color: '#f43f5e' },
  { label: 'Multilingual Dubbing', href: '/dashboard/multilingual-dubbing', icon: GlobeAltIcon, color: '#a855f7' },
  { label: 'Thumbnail Analyzer', href: '/dashboard/thumbnail-analyzer', icon: PhotoIcon, color: '#06b6d4' },
  { label: 'BGM Suggestor', href: '/dashboard/bgm-suggestor', icon: MusicalNoteIcon, color: '#ec4899' },
]

const RECENT_ACTIVITY = [
  { action: 'Video analyzed', subject: 'product-launch-v2.mp4', time: '2 min ago', status: 'done' },
  { action: 'Script generated', subject: 'Tech Review — LinkedIn', time: '1 hr ago', status: 'done' },
  { action: 'Published to 8 platforms', subject: 'Behind the Scenes Reel', time: '3 hr ago', status: 'done' },
  { action: 'Privacy filter applied', subject: 'interview-raw.mp4', time: 'Yesterday', status: 'done' },
  { action: 'BGM suggested', subject: 'Product Walk-through', time: 'Yesterday', status: 'done' },
]

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const } }
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const name = session?.user?.name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Good morning, <span className="gradient-text">{name}</span> 👋
        </h1>
        <p className="text-sm" style={{ color: '#A1A1AA' }}>
          Here&apos;s what&apos;s happening with your content pipeline today.
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="glass-card p-6">
            <div className="text-xs font-medium mb-3" style={{ color: '#A1A1AA' }}>{s.label}</div>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</span>
              {s.delta && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
                  <TrendingUp size={10} />{s.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick access */}
      <motion.div {...fadeUp(0.14)}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap size={18} style={{ color: '#8B5CF6' }} />
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map((item) => (
            <a key={item.href} href={item.href}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="glass-card p-4 flex flex-col items-center gap-3 text-center cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
                  <item.icon style={{ width: 22, height: 22, color: item.color }} />
                </div>
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>{item.label}</span>
              </motion.div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div {...fadeUp(0.2)}>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye size={18} style={{ color: '#38BDF8' }} />
          Recent Activity
        </h2>
        <div className="glass-card overflow-hidden">
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i}
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div className="flex items-center gap-3">
                <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                <div>
                  <div className="text-sm font-medium text-white">{item.action}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{item.subject}</div>
                </div>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
