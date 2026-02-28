'use client'

import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ChevronDown, LogOut, User, Settings } from 'lucide-react'

export default function DashboardNav() {
  const { data: session } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = session?.user?.name
    ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AI'

  return (
    <header
      className="flex items-center justify-between px-8 h-16 flex-shrink-0"
      style={{
        background: 'rgba(8,15,32,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: breadcrumb hint */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6', boxShadow: '0 0 8px #8B5CF6' }} />
        <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>ContentIQ Dashboard</span>
      </div>

      {/* Right: notification + user */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Bell size={18} style={{ color: 'rgba(255,255,255,0.6)' }} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: '#38BDF8', boxShadow: '0 0 6px #38BDF8' }} />
        </motion.button>

        {/* User dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl transition-colors"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-white leading-tight">
                {session?.user?.name || 'User'}
              </div>
              <div className="text-xs leading-tight" style={{ color: '#A1A1AA' }}>
                {session?.user?.email || ''}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: '#A1A1AA' }} />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(8,15,32,0.95)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <div className="text-sm font-semibold text-white">{session?.user?.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#A1A1AA' }}>{session?.user?.email}</div>
                  </div>
                  {[
                    { icon: User, label: 'Profile' },
                    { icon: Settings, label: 'Settings' },
                  ].map(item => (
                    <button key={item.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-white/[0.06]">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                      style={{ color: '#F87171' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
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
