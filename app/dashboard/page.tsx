'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Sparkles, FileText, Share2, Shield, Mic, Image as ImageIcon, Music, TrendingUp, Zap, Lock, Globe } from 'lucide-react'
import Link from 'next/link'
import { VideoAIIcon } from '@/components/icons/VideoAIIcon'
import { useRecentActivity, formatTimeAgo } from '@/lib/useRecentActivity'

// Quick Access Items
const quickAccessItems = [
  { label: 'Video Intelligence', icon: VideoAIIcon, color: 'text-[#38bdf8]', href: '/dashboard/video-intelligence' },
  { label: 'Script Generator', icon: FileText, color: 'text-[#a855f7]', href: '/dashboard/script-generator' },
  { label: 'Distribution', icon: Share2, color: 'text-[#10b981]', href: '/dashboard/distribution' },
  { label: 'Privacy Filter', icon: Shield, color: 'text-[#fbbf24]', href: '/dashboard/privacy-filter' },
  { label: 'Voice Tracker', icon: Mic, color: 'text-[#f43f5e]', href: '/dashboard/voice-tracker' },
  { label: 'Multilingual Dubbing', icon: Globe, color: 'text-[#6366f1]', href: '/dashboard/translator' },
  { label: 'Thumbnail Analyzer', icon: ImageIcon, color: 'text-[#06b6d4]', href: '/dashboard/thumbnail-analyzer' },
  { label: 'BGM Suggestor', icon: Music, color: 'text-[#ec4899]', href: '/dashboard/bgm-suggestor' },
]

// Mock Data for Quick Stats
const stats = [
  { label: 'Videos Processed', value: '1,284', trend: '+12%', colorClass: 'text-[#38bdf8]' },
  { label: 'Scripts Generated', value: '347', trend: '+8%', colorClass: 'text-[#a855f7]' },
  { label: 'Platforms Reached', value: '40+', trend: '', colorClass: 'text-[#10b981]' },
  { label: 'Avg. Engagement Lift', value: '3.2x', trend: '+0.4x', colorClass: 'text-[#fbbf24]' },
]

// Mock Future Dates for Calendar (just visual representation)
const days = ['30', '31', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '1', '2', '3', '4']

// We use useRecentActivity hook now for dynamic recent activities

function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const days = []
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false })
  }
  const realToday = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === realToday.getDate() && currentDate.getMonth() === realToday.getMonth() && currentDate.getFullYear() === realToday.getFullYear()
    days.push({ day: i, isCurrentMonth: true, isToday })
  }
  const remainingSlots = 42 - days.length
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({ day: i, isCurrentMonth: false })
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
      className="rounded-[24px] p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          {monthNames[currentDate.getMonth()]} <span className="text-blue-500 font-semibold">{currentDate.getFullYear()}</span>
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 rounded-md text-[var(--text-secondary)] hover:bg-[var(--btn-bg)] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-md text-[var(--text-secondary)] hover:bg-[var(--btn-bg)] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-sm text-[var(--text-secondary)]">
        {days.map((d, i) => (
          <div key={i} className={
            !d.isCurrentMonth ? "opacity-30" :
              d.isToday ? "bg-blue-500 text-white rounded-lg font-medium shadow-sm py-1 transform -translate-y-1 scale-110" : ""
          }>{d.day}</div>
        ))}
      </div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const userName = session?.user?.name || 'Demo User'
  const { activities } = useRecentActivity()

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-[1400px] mx-auto w-full">

      {/* LEFT COLUMN */}
      <div className="xl:col-span-2 space-y-8">

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="relative rounded-[24px] overflow-hidden p-8 flex flex-col sm:flex-row justify-between items-center"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
            color: 'white'
          }}
        >
          <div className="z-10 flex flex-col items-start gap-2 max-w-sm">
            <h1 className="text-3xl font-bold mb-1">Welcome Back, {userName}!</h1>
            <p className="text-blue-100 text-sm">Let’s see what you’ve got going on today.</p>
          </div>

          {/* Decorative abstract elements matching reference */}
          <div className="absolute right-0 bottom-0 pointer-events-none w-64 h-64 opacity-90 hidden sm:block">
            <div className="w-full h-full relative" style={{ transform: 'scale(1.2) translate(10%, 15%)' }}>
              <img src="https://illustrations.popsy.co/amber/abstract-art-1.svg" alt="Decoration" className="w-full h-full object-contain filter drop-shadow-2xl" />
            </div>
          </div>
        </motion.div>



        {/* Quick Access Grid */}
        <div className="mt-4">
          <h2 className="text-[16px] font-medium text-[var(--text-primary)] mb-4">Features Available</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickAccessItems.filter(item => !['Voice Tracker', 'Privacy Filter', 'Thumbnail Analyzer'].includes(item.label)).map((item, i) => (
              <Link href={item.href} key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="relative p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 group aspect-square sm:aspect-auto sm:h-[160px] rounded-[24px]"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div className="flex-1 flex items-center justify-center relative w-full pt-2">
                    {/* Main Icon in standard color */}
                    <item.icon size={44} className="text-[var(--text-primary)] opacity-80 group-hover:opacity-100 transition-opacity duration-300" strokeWidth={1.5} />
                  </div>

                  <span className="text-[14px] font-medium text-[var(--text-primary)] mt-3 mb-1 px-1 leading-tight">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          <h2 className="text-[16px] font-medium text-[var(--text-primary)] mt-8 mb-4">Future Implementation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickAccessItems.filter(item => ['Voice Tracker', 'Privacy Filter', 'Thumbnail Analyzer'].includes(item.label)).map((item, i) => (
              <div key={item.label} className="relative rounded-[24px] overflow-hidden cursor-not-allowed group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="relative p-4 flex flex-col items-center justify-between text-center shadow-sm transition-all duration-300 aspect-square sm:aspect-auto sm:h-[160px] rounded-[24px] opacity-60"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div className="flex-1 flex items-center justify-center relative w-full pt-2">
                    {/* Main Icon in standard color */}
                    <item.icon size={44} className="text-[var(--text-primary)] opacity-60 transition-opacity duration-300" strokeWidth={1.5} />
                  </div>

                  <span className="text-[14px] font-medium text-[var(--text-primary)] mt-3 mb-1 px-1 leading-tight">{item.label}</span>
                </motion.div>

                {/* Frosted Glass Overlay with Lock */}
                <div className="absolute inset-0 z-10 backdrop-blur-[2.5px] bg-slate-100/10 dark:bg-black/20 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
                  <div className="bg-white/90 dark:bg-[#1a1a2e]/90 p-2.5 rounded-full mb-2.5 shadow-sm border border-slate-200/50 dark:border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Lock size={16} className="text-slate-600 dark:text-slate-300" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 text-center leading-[1.3] drop-shadow-sm">
                    Future<br />Implementation
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className="xl:col-span-1 space-y-6">

        {/* Calendar Widget */}
        <CalendarWidget />

        {/* Recent Activities */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-[24px] p-6 flex flex-col"
          style={{ maxHeight: '500px' }} // Added max container height
        >
          <h3 className="text-[17px] font-semibold text-[var(--text-primary)] mb-5 shrink-0">Recent Activities</h3>

          {/* Scrollable area */}
          <div className="space-y-4 overflow-y-auto pr-2 pb-2 custom-scrollbar flex-1" style={{ maxHeight: '400px' }}>
            {activities.length > 0 ? activities.map((item, i) => (
              <div key={i} className="rounded-xl p-4 flex flex-col gap-1.5 relative overflow-hidden shrink-0"
                style={{ background: 'var(--btn-bg)' }}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl" />
                <h4 className="text-sm font-semibold text-[var(--text-primary)] ml-1">{item.action}</h4>
                <div className="flex items-center justify-between ml-1">
                  <span className="text-xs text-[var(--text-secondary)] truncate mr-2">{item.subject}</span>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] flex-shrink-0">
                    <Clock size={12} />
                    <span>{formatTimeAgo(item.time)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-sm text-[var(--text-secondary)] py-4 text-center">No recent activity yet.</div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  )
}
