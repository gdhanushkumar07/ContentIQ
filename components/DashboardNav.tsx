'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function DashboardNav() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()

  const getPageTitle = () => {
    if (!pathname) return 'Dashboard'
    if (pathname.includes('/video-intelligence')) return 'Video Intelligence'
    if (pathname.includes('/script-generator')) return 'Script Generator'
    if (pathname.includes('/distribution')) return 'Distribution'
    if (pathname.includes('/privacy-filter')) return 'Privacy Filter'
    if (pathname.includes('/voice-tracker')) return 'Voice Tracker'
    if (pathname.includes('/translator')) return 'Multilingual Dubbing'
    if (pathname.includes('/thumbnail-analyzer')) return 'Thumbnail Analyzer'
    if (pathname.includes('/bgm-suggestor')) return 'BGM Suggestor'
    return 'Dashboard'
  }

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'DU'

  const name = session?.user?.name || 'Demo User'
  const email = session?.user?.email || 'demo@contentiq.ai'

  return (
    <header
      className="flex items-center justify-between px-6 h-[72px] flex-shrink-0"
      style={{
        background: 'var(--bg-main)', // Use the main background instead of transparent
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', // For Safari support
        backgroundColor: 'rgba(var(--bg-main-rgb), 0.8)', // Fallback if using RGB var, or just rely on CSS
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* ── Left: Path ─────────────────────────────── */}
      <div className="flex items-center gap-6">
        {/* Dashboard Title / Breadcrumb */}
        <div className="hidden sm:flex items-center gap-3">
          <img src="/logo.png" alt="ContentIQ Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* ── Right: Theme + Notifications + Profile ─────────────────────────────── */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-[10px] rounded-xl transition-all duration-300 flex items-center justify-center group"
          style={{
            background: 'var(--btn-bg)',
            border: '1px solid var(--border-color)',
          }}
        >
          <Bell size={18} className="transition-colors" style={{ color: 'var(--text-secondary)' }} />
          <div className="absolute top-[8px] right-[8px] w-[6px] h-[6px] bg-[#38BDF8] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
        </motion.button>

        {/* User Card Button (Profile) */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.01 }}
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-3 px-[10px] py-[8px] rounded-xl transition-colors ml-2"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            {/* Avatar block */}
            <div className="w-10 h-10 flex items-center justify-center rounded-lg text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)' }}>
              {initials}
            </div>

            {/* Name & Email */}
            <div className="flex flex-col items-start pr-1">
              <span className="text-sm font-semibold leading-tight mb-[2px]" style={{ color: 'var(--text-primary)' }}>
                {name}
              </span>
              <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
                {email}
              </span>
            </div>

            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: 'var(--dropdown-bg)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: 'var(--dropdown-shadow)',
                  }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{email}</div>
                  </div>
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                  ].map(item => (
                    <button key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                      style={{ color: 'var(--text-secondary)' }}>
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left hover:bg-red-500/[0.08]"
                      style={{ color: '#F87171' }}>
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

