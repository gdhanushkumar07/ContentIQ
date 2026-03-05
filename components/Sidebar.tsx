'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  LanguageIcon,
} from '@heroicons/react/24/outline'
import { Sparkles } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { label: 'Video Intelligence', href: '/dashboard/video-intelligence', icon: SparklesIcon },
  { label: 'Script Generator', href: '/dashboard/script-generator', icon: DocumentTextIcon },
  { label: 'Distribution', href: '/dashboard/distribution', icon: ShareIcon },
  { label: 'Privacy Filter', href: '/dashboard/privacy-filter', icon: ShieldCheckIcon },
  { label: 'Voice Tracker', href: '/dashboard/voice-tracker', icon: MicrophoneIcon },
  { label: 'Multilingual Dubbing', href: '/dashboard/translator', icon: LanguageIcon },
  { label: 'Thumbnail Analyzer', href: '/dashboard/thumbnail-analyzer', icon: PhotoIcon },
  { label: 'BGM Suggestor', href: '/dashboard/bgm-suggestor', icon: MusicalNoteIcon },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="group w-[64px] hover:w-[260px] transition-all duration-300 z-50 relative"
      style={{
        minHeight: '100vh',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-[14px] py-6 whitespace-nowrap" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}
        >
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="text-lg font-bold tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
          Content<span className="gradient-text">IQ</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-[6px] py-4 space-y-0.5 overflow-hidden">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== '/dashboard')

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={[
                  'group/item relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
                  'transition-all duration-300 ease-out overflow-hidden',
                  !isActive && 'hover:translate-x-[5px]',
                ].filter(Boolean).join(' ')}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(139,92,246,0.15) 0%, rgba(56,189,248,0.05) 100%)'
                    : 'transparent',
                  borderLeft: isActive ? '2px solid #8B5CF6' : '2px solid transparent',
                  boxShadow: isActive
                    ? '0 0 16px rgba(139,92,246,0.18), inset 0 0 16px rgba(139,92,246,0.04)'
                    : undefined,
                }}
              >
                {/* Hover gradient overlay (inactive only) */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(139,92,246,0.08) 0%, rgba(56,189,248,0.03) 100%)',
                    }}
                  />
                )}
                {/* Hover glow ring */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ease-out pointer-events-none dark:block"
                    style={{ boxShadow: '0 0 16px rgba(139,92,246,0.20)' }}
                  />
                )}

                {/* Icon */}
                <item.icon
                  className={['flex-shrink-0 transition-all duration-300 ease-out', !isActive && 'group-hover/item:scale-110'].join(' ')}
                  style={{
                    width: 20, height: 20,
                    color: isActive ? '#8B5CF6' : 'currentColor',
                    filter: isActive ? 'drop-shadow(0 0 5px rgba(139,92,246,0.65))' : undefined,
                  }}
                />

                {/* Label */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap relative z-10">{item.label}</span>

                {/* Active left-glow pip */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #38BDF8 0%, #8B5CF6 100%)',
                      boxShadow: '0 0 8px rgba(139,92,246,0.8)',
                    }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
