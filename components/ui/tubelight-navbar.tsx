'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, Sparkles, ChevronRight, Menu, X } from 'lucide-react'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className = '' }: NavBarProps) {
  const [activeNav, setActiveNav] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      if (window.scrollY < 200) {
        setActiveNav('home')
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track which section is in view for active highlight
  useEffect(() => {
    const sections = document.querySelectorAll("section")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-40% 0px -40% 0px"
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (item: NavItem) => {
    const navId = item.url.startsWith('#') ? item.url.slice(1) : ''
    if (navId) setActiveNav(navId)
    setIsMobileOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-6 left-0 right-0 z-[100] ${className}`}
    >
      <div className="max-w-7xl mx-auto flex justify-center px-6 w-full pointer-events-none">
        <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg pointer-events-auto">
          {/* ── Logo ─────────────────────────────────────────────── */}
          <motion.div
            className="flex items-center gap-2.5 shrink-0"
            whileHover={{ scale: 1.03 }}
          >
            <Link href="#home" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="ContentIQ Logo" className="h-[36px] object-contain" />
              <span className="text-lg font-bold tracking-tight text-white">
                Content<span className="gradient-text">IQ</span>
              </span>
            </Link>
          </motion.div>

          {/* ── Center Navigation Items ────────────────────────────── */}
          <div className="hidden md:flex items-center gap-6">
            {items.map((item) => {
              const navId = item.url.startsWith('#') ? item.url.slice(1) : ''
              const isActive = activeNav === navId
              const Icon = item.icon

              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={() => handleNavClick(item)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none flex items-center gap-2 ${isActive
                    ? 'bg-white/10 text-white shadow-inner'
                    : 'text-white/70 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tubelight-highlight"
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow:
                          '0 0 20px rgba(56,189,248,0.2), 0 0 40px rgba(139,92,246,0.1)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    <span className="hidden lg:inline">{item.name}</span>
                  </span>
                </a>
              )
            })}
          </div>

          {/* ── Spacer ───────────────────────────────────────────── */}
          <div className="flex-1 hidden md:block"></div>

          {/* ── Auth buttons — Desktop ──────────────────────────── */}
          <div className="hidden md:flex items-center gap-3 ml-6">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-lg border border-white/15 text-white/80 hover:bg-white/10 text-sm transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                className="glow-btn px-5 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Early Access <ChevronRight size={16} />
              </motion.button>
            </Link>
          </div>

          {/* ── Mobile hamburger ────────────────────────────────── */}
          <motion.button
            className="md:hidden flex items-center justify-center cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile dropdown ────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,15,32,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="p-4 flex flex-col gap-1">
              {items.map((item) => {
                const navId = item.url.startsWith('#') ? item.url.slice(1) : ''
                const isActive = activeNav === navId
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    onClick={() => handleNavClick(item)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                      background: isActive
                        ? 'rgba(56,189,248,0.08)'
                        : 'transparent',
                    }}
                  >
                    <Icon size={18} />
                    {item.name}
                  </a>
                )
              })}
            </div>

            <div
              className="p-4 pt-2 flex flex-col gap-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Link href="/login" onClick={() => setIsMobileOpen(false)}>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-sm font-semibold cursor-pointer"
                  style={{
                    padding: '10px',
                    color: 'rgba(255,255,255,0.7)',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                  }}
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileOpen(false)}>
                <motion.button
                  className="glow-btn w-full text-sm font-semibold cursor-pointer"
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  Get Early Access <ChevronRight size={16} />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  )
}
