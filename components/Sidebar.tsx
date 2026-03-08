'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { VideoAIIcon } from './icons/VideoAIIcon'
import {
  HomeIcon,
  DocumentTextIcon,
  ShareIcon,
  ShieldCheckIcon,
  MicrophoneIcon,
  GlobeAltIcon,
  PhotoIcon,
  MusicalNoteIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { label: 'Video Intelligence', href: '/dashboard/video-intelligence', icon: VideoAIIcon },
  { label: 'Script Generator', href: '/dashboard/script-generator', icon: DocumentTextIcon },
  { label: 'Privacy Filter', href: '/dashboard/privacy-filter', icon: ShieldCheckIcon },
  { label: 'Voice Tracker', href: '/dashboard/voice-tracker', icon: MicrophoneIcon },
  { label: 'Multilingual Dubbing', href: '/dashboard/translator', icon: LanguageIcon },
  { label: 'Thumbnail Analyzer', href: '/dashboard/thumbnail-analyzer', icon: PhotoIcon },
  { label: 'BGM Suggestor', href: '/dashboard/bgm-suggestor', icon: MusicalNoteIcon },
  { label: 'Distribution', href: '/dashboard/distribution', icon: ShareIcon },
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
      <div className="flex items-center justify-center gap-3 px-[14px] py-6 whitespace-nowrap" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <img src="/logo.png" alt="ContentIQ Logo" className="h-9 w-9 object-contain flex-shrink-0" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-[6px] py-4 space-y-0.5 overflow-hidden flex flex-col">
        {NAV_ITEMS.filter(i => !['Voice Tracker', 'Privacy Filter', 'Thumbnail Analyzer'].includes(i.label)).map((item) => {
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
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                }}
              >
                {/* Hover ring */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                    style={{ background: 'var(--bg-card-hover)' }}
                  />
                )}

                {/* Icon */}
                <item.icon
                  className={['flex-shrink-0 transition-all duration-300 ease-out', !isActive && 'group-hover/item:scale-110'].join(' ')}
                  style={{
                    width: 20, height: 20,
                    color: isActive ? 'var(--primary)' : 'currentColor',
                  }}
                />

                {/* Label */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap relative z-10">{item.label}</span>

                {/* Active left-glow pip */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 rounded-r-full"
                    style={{
                      background: 'var(--primary)',
                    }}
                  />
                )}
              </div>
            </Link>
          )
        })}

        {/* Future Implementation Section */}
        <div className="mt-6 mb-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden whitespace-nowrap">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>Future Implementation</span>
        </div>

        {NAV_ITEMS.filter(i => ['Voice Tracker', 'Privacy Filter', 'Thumbnail Analyzer'].includes(i.label)).map((item) => {
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
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                }}
              >
                {/* Hover ring */}
                {!isActive && (
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                    style={{ background: 'var(--bg-card-hover)' }}
                  />
                )}

                {/* Icon */}
                <item.icon
                  className={['flex-shrink-0 transition-all duration-300 ease-out', !isActive && 'group-hover/item:scale-110'].join(' ')}
                  style={{
                    width: 20, height: 20,
                    color: isActive ? 'var(--primary)' : 'currentColor',
                  }}
                />

                {/* Label */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap relative z-10">{item.label}</span>

                {/* Active left-glow pip */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 rounded-r-full"
                    style={{
                      background: 'var(--primary)',
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
