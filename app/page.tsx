'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
import RadialIntro from "@/components/ui/radial-intro";

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
  { name: 'Home', url: '#home', icon: Home },
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
    <section onMouseMove={handleMouseMove}
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
        className="font-mokoto text-6xl md:text-7xl tracking-wider leading-[1.15]"
        style={{ maxWidth: 920, marginBottom: 28, color: '#FFFFFF' }}>
        Turn Raw Content<br />
        <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          Into Viral Impact
        </span>
      </motion.h1>

      <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="mt-6 max-w-2xl text-lg text-white/70 font-poppins"
        style={{ marginBottom: 52 }}>
        AI-powered scene intelligence, engagement prediction, and automated distribution — without losing your authentic voice.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
        style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/signup">
          <motion.button
            className="glow-btn"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            style={{ padding: "15px 34px", color: "#fff", fontWeight: 700, fontSize: 16 }}
          >
            Get Started Free
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
          {[
            { value: 'Frame-Level AI', label: 'Scene Detection' }, 
            { value: 'Smart Analysis', label: 'Content Intelligence' }, 
            { value: 'AI Powered', label: 'Automation' }
          ].map((stat, i) => (
            <span key={stat.label} style={{ display: 'contents' }}>
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-item">
                <div className="stat-value" style={{ fontSize: '28px' }}>{stat.value}</div>
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
    <>
      <section className="relative flex flex-col items-center justify-center py-20 z-10">
        
        <div className="relative flex items-center justify-center">
          {/* Orbit Container surrounding the card */}
          <RadialIntro />

          {/* Circular Hero Card */}
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="relative w-[560px] h-[560px] rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center text-center px-10 shadow-2xl z-10"
          >
          <Image
            src="/logo.png"
            alt="ContentIQ"
            width={56}
            height={56}
            className="object-contain mx-auto mb-6 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.3)]"
            priority
          />

        <h2 className="mokoto-font text-4xl md:text-5xl lg:text-6xl font-semibold text-center leading-tight mb-6 mt-4">
          Ready to make content go <span className="gradient-text">viral?</span>
        </h2>
        
        <p className="text-white/60 text-base md:text-lg max-w-[360px] mx-auto mb-8 leading-relaxed font-poppins">
          Join ContentIQ — the AI platform that transforms raw footage into global reach, automatically.
        </p>
        
        <Link href="/signup">
          <motion.button className="glow-btn" animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '14px 32px', color: '#fff', fontWeight: 700, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Upload size={18} /> Get Early Access
          </motion.button>
        </Link>
          </motion.div>
        </div>
      </section>

    <div className="text-center mt-24 opacity-60 text-sm relative z-10 pb-16">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Image src="/logo.png" alt="ContentIQ" width={24} height={24} className="object-contain rounded-md" />
        <span>ContentIQ</span>
      </div>
      © 2026 ContentIQ · AI Media Creation & Distribution Platform
    </div>
    </>
  )
}

export default function HomePage() {
  return (
    <div style={{ background: 'linear-gradient(160deg, #050816 0%, #0B1120 100%)', backgroundAttachment: 'fixed', minHeight: '100vh', position: 'relative' }}>
      <GridBackground />
      <PlexusBackground />
      <AmbientBlobs />
      <NavBar items={navItems} />
      <section id="home"><HeroSection /></section>
      <section id="features"><ScrollFeatureCards /></section>
      <section id="how-it-works"><HowItWorksTimeline /></section>
      <section id="tech-stack"><TechStackLayered /></section>
      <FooterCTA />
    </div>
  )
}
