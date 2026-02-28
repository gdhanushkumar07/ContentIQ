'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  SparklesIcon,
  DocumentTextIcon,
  ShareIcon,
  ShieldCheckIcon,
  MicrophoneIcon,
  GlobeAltIcon,
  PhotoIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'
import { Sparkles } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard',           href: '/dashboard',                    icon: HomeIcon },
  { label: 'Video Intelligence',  href: '/dashboard/video-intelligence', icon: SparklesIcon },
  { label: 'Script Generator',    href: '/dashboard/script-generator',   icon: DocumentTextIcon },
  { label: 'Distribution',        href: '/dashboard/distribution',       icon: ShareIcon },
  { label: 'Privacy Filter',      href: '/dashboard/privacy-filter',     icon: ShieldCheckIcon },
  { label: 'Voice Tracker',       href: '/dashboard/voice-tracker',      icon: MicrophoneIcon },
  { label: 'Multilingual Dubbing',href: '/dashboard/multilingual-dubbing',icon: GlobeAltIcon },
  { label: 'Thumbnail Analyzer',  href: '/dashboard/thumbnail-analyzer', icon: PhotoIcon },
  { label: 'BGM Suggestor',       href: '/dashboard/bgm-suggestor',      icon: MusicalNoteIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #080f20 0%, #050816 100%)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Content<span className="gradient-text">IQ</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const isParentActive = pathname.startsWith(item.href) && item.href !== '/dashboard'

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: isActive ? 0 : 4 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative"
                style={{
                  background: isActive || isParentActive ? 'rgba(139,92,246,0.12)' : 'transparent',
                  color: isActive || isParentActive ? '#fff' : 'rgba(255,255,255,0.5)',
                  borderLeft: isActive || isParentActive ? '2px solid #8B5CF6' : '2px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive && !isParentActive) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive && !isParentActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                {/* Active glow */}
                {(isActive || isParentActive) && (
                  <div className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 20px rgba(139,92,246,0.08)' }} />
                )}

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.15 }}
                >
                  <item.icon
                    className="flex-shrink-0"
                    style={{
                      width: 20, height: 20,
                      color: isActive || isParentActive ? '#8B5CF6' : 'currentColor',
                    }}
                  />
                </motion.div>
                <span className="truncate">{item.label}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom: plan badge */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="rounded-xl p-4" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="text-xs font-semibold mb-1" style={{ color: '#8B5CF6' }}>HACKATHON BUILD</div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>AI-for-Bharat 2026</div>
        </div>
      </div>
    </aside>
  )
}
