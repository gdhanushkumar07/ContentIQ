'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import PlexusBackground from '@/components/PlexusBackground'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  Upload, Play, Eye, Shield, TrendingUp, Globe,
  Zap, ChevronRight, Sparkles, Brain, Lock, Wifi,
  Star, CheckCircle, ArrowRight, Network, Camera,
  Home, User, Briefcase, FileText
} from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'
import HowItWorksTimeline from "@/components/sections/how-it-works-timeline";
import ScrollFeatureCards from "@/components/sections/scroll-feature-cards";
import TechStackLayered from "@/components/sections/tech-stack-layered";

// ─── Grid Background ───────────────────────────────────────────────────────────
function GridBackground() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 30])
  return (
    <motion.div
      className="grid-bg"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.5, y }}
    />
  )
}

// ─── Ambient Blobs ─────────────────────────────────────────────────────────────
function AmbientBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <motion.div className="blob"
        style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(56,189,248,0.10) 0%, transparent 70%)', top: -250, left: -250 }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />
      <motion.div className="blob"
        style={{ width: 800, height: 800, background: 'radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)', top: '25%', right: -350 }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear', delay: 2 }} />
      <motion.div className="blob"
        style={{ width: 550, height: 550, background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)', bottom: -80, left: '42%' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: 5 }} />
    </div>
  )
}

// ─── Navigation Items ──────────────────────────────────────────────────────────
const navItems = [
  { name: 'Home', url: '#hero', icon: Home },
  { name: 'Features', url: '#features', icon: Eye },
  { name: 'How It Works', url: '#how-it-works', icon: Briefcase },
  { name: 'Tech Stack', url: '#tech-stack', icon: FileText },
]

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20)
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20)
  }

  return (
    <section id="hero" onMouseMove={handleMouseMove}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 100px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>

      <motion.div className="hero-glow"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.28)', borderRadius: 100, padding: '8px 20px', marginBottom: 36 }}>
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
          style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8' }} />
        <span style={{ fontSize: 13, fontWeight: 500, color: '#38BDF8', letterSpacing: '0.5px' }}>AI-Powered Media Intelligence Platform</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontSize: 'clamp(44px, 7.5vw, 92px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2.5px', maxWidth: 920, marginBottom: 28, color: '#FFFFFF' }}>
        Turn Raw Content<br />
        <span className="gradient-text">Into Viral Impact</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        style={{ fontSize: 18, fontWeight: 400, color: '#A1A1AA', maxWidth: 560, lineHeight: 1.75, marginBottom: 52 }}>
        AI-powered scene intelligence, engagement prediction, and automated distribution — without losing your authentic voice.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
        style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/signup">
          <motion.button className="glow-btn" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
            style={{ padding: '15px 34px', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={18} /> Get Started Free
          </motion.button>
        </Link>
        <Link href="/login">
          <motion.button className="btn-secondary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '15px 34px', color: '#fff', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Network size={18} /> Sign In
          </motion.button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.65, ease: 'easeOut' }} style={{ marginTop: 80 }}>
        <motion.div className="stats-panel" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
          {[{ value: '70%', label: 'Faster Creation' }, { value: '40+', label: 'Platforms' }, { value: 'AI', label: 'Powered' }].map((stat, i) => (
            <span key={stat.label} style={{ display: 'contents' }}>
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-item">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
        style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ width: 24, height: 38, border: '2px solid rgba(255,255,255,0.18)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', type: 'tween' }}
            style={{ width: 4, height: 8, borderRadius: 2, background: 'rgba(56,189,248,0.8)' }} />
        </div>
      </motion.div>
    </section>
  )
}





function FooterCTA() {
  return (
    <section style={{ padding: '120px 24px', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="glass-card"
        style={{ maxWidth: 860, margin: '0 auto', padding: '80px 60px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,212,255,0.04), rgba(124,58,237,0.06))' }}>
        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block', marginBottom: 24 }}>
          <Sparkles size={40} color="#00d4ff" />
        </motion.div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 20 }}>
          Ready to make content go <span className="gradient-text">viral?</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.7 }}>
          Join ContentIQ — the AI platform that transforms raw footage into global reach, automatically.
        </p>
        <Link href="/signup">
          <motion.button className="glow-btn" animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '16px 40px', color: '#fff', fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Upload size={20} /> Get Early Access
          </motion.button>
        </Link>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginTop: 24 }}>
          Built for Hackathon 2026 · AI-for-Bharat Initiative
        </p>
      </motion.div>
      <div style={{ textAlign: 'center', marginTop: 60, color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={12} color="#fff" />
          </div>
          <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>ContentIQ</span>
        </div>
        © 2026 ContentIQ · AI Media Creation & Distribution Platform
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div style={{ background: 'linear-gradient(160deg, #050816 0%, #0B1120 100%)', backgroundAttachment: 'fixed', minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <PlexusBackground />
      <AmbientBlobs />
      <NavBar items={navItems} />
      <HeroSection />
      <div id="features"><ScrollFeatureCards /></div>
      <HowItWorksTimeline />
      <TechStackLayered />
      <FooterCTA />
    </div>
  )
}
