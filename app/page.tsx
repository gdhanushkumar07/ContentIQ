'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import PlexusBackground from '@/components/PlexusBackground'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import {
  Upload, Play, Eye, Shield, TrendingUp, Globe,
  Zap, ChevronRight, Sparkles, Brain, Lock, Wifi,
  Star, CheckCircle, ArrowRight, Network, Camera
} from 'lucide-react'

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

// ─── Navigation ────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(6,6,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <motion.div style={{ display: 'flex', alignItems: 'center', gap: 10 }} whileHover={{ scale: 1.03 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px' }}>
          Content<span className="gradient-text">IQ</span>
        </span>
      </motion.div>

      <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {['Features', 'How It Works', 'Tech Stack'].map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} className="nav-link">{link}</a>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/login">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '9px 22px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, cursor: 'pointer' }}>
            Sign In
          </motion.button>
        </Link>
        <Link href="/signup">
          <motion.button className="glow-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '10px 22px', color: '#fff', fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            Get Early Access <ChevronRight size={16} />
          </motion.button>
        </Link>
      </div>
    </motion.nav>
  )
}

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

// ─── Bento Card ────────────────────────────────────────────────────────────────
function BentoCard({ card, index }: { card: any; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div className="glass-card"
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.12 }} whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      style={{ padding: 32, cursor: 'pointer', gridColumn: card.wide ? 'span 2' : 'span 1', minHeight: card.tall ? 340 : 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>

      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${card.glowColor}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
        )}
      </AnimatePresence>

      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <motion.div animate={{ rotate: hovered ? 360 : 0 }} transition={{ duration: 0.6 }}
            style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${card.glowColor}33, ${card.glowColor}11)`, border: `1px solid ${card.glowColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <card.icon size={24} color={card.glowColor} />
          </motion.div>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: card.glowColor, background: `${card.glowColor}15`, padding: '4px 12px', borderRadius: 100, border: `1px solid ${card.glowColor}30` }}>
            {card.tag}
          </span>
        </div>
        <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 12 }}>{card.title}</h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{card.description}</p>
      </div>

      <div style={{ marginTop: 24 }}>
        <div className="progress-bar" style={{ width: `${card.progress}%`, marginBottom: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {card.features.map((f: string) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={14} color={card.glowColor} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div animate={{ x: hovered ? 6 : 0 }}
        style={{ position: 'absolute', bottom: 28, right: 28, width: 36, height: 36, borderRadius: '50%', background: `${card.glowColor}15`, border: `1px solid ${card.glowColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowRight size={16} color={card.glowColor} />
      </motion.div>
    </motion.div>
  )
}

const BENTO_CARDS = [
  { icon: Eye, title: 'Scene Intelligence', tag: 'Video Analysis', description: 'Deep frame-by-frame AI analysis identifies key scenes, objects, faces, and emotional arcs — automatically extracting your best moments.', glowColor: '#00d4ff', progress: 92, features: ['Multi-object detection', 'Emotion recognition', 'Auto highlight reel', 'Scene segmentation'], wide: true, tall: false },
  { icon: Shield, title: 'Privacy-First Filtering', tag: 'Security & Authenticity', description: 'Enterprise-grade AI automatically blurs faces, removes sensitive content, and ensures GDPR compliance before any distribution.', glowColor: '#a855f7', progress: 98, features: ['Face anonymization', 'PII detection', 'GDPR compliant', 'Watermark removal'], wide: false, tall: false },
  { icon: TrendingUp, title: 'Trend Prediction', tag: 'Viral Windows', description: 'Proprietary ML models analyze real-time social signals to forecast the optimal publish time and format for maximum virality across platforms.', glowColor: '#f59e0b', progress: 85, features: ['Real-time trend signals', 'Platform-specific timing', 'Hashtag intelligence', 'Engagement forecasting'], wide: false, tall: false },
  { icon: Globe, title: 'Global Distribution', tag: 'Automated Publishing', description: 'One-click content deployment to 40+ platforms simultaneously — YouTube, Instagram, TikTok, LinkedIn — with auto-localized subtitles.', glowColor: '#10b981', progress: 78, features: ['40+ platforms', 'Auto-subtitles (50+ langs)', 'A/B testing', 'Analytics dashboard'], wide: true, tall: false },
]

function BentoSection() {
  return (
    <section id="features" style={{ padding: '120px 24px', position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: 80 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 100, padding: '8px 20px', marginBottom: 24 }}>
          <Zap size={14} color="#a855f7" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#a855f7', letterSpacing: '0.5px' }}>CORE CAPABILITIES</span>
        </div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 20 }}>
          Everything you need to go <span className="gradient-text">viral</span>
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
          Four powerful AI modules work in harmony to turn raw footage into globally distributed, engagement-maximized content.
        </p>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {BENTO_CARDS.map((card, i) => <BentoCard key={card.title} card={card} index={i} />)}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: Upload, label: 'Upload', desc: 'Drop raw video footage from any device or cloud source.', color: '#00d4ff' },
    { icon: Brain, label: 'Analyze', desc: 'Scene Intelligence dissects every frame in 3 seconds.', color: '#a855f7' },
    { icon: Shield, label: 'Filter', desc: 'Privacy-first AI ensures compliance and authenticity.', color: '#f59e0b' },
    { icon: TrendingUp, label: 'Optimize', desc: 'Trend Prediction finds the best format and timing.', color: '#10b981' },
    { icon: Globe, label: 'Distribute', desc: 'Automated publishing to 40+ global platforms.', color: '#f43f5e' },
  ]
  return (
    <section id="how-it-works" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: 72 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            How <span className="gradient-text">ContentIQ</span> Works
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>From upload to viral in five AI-powered steps</p>
        </motion.div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
          {steps.map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }} whileHover={{ y: -8 }} style={{ textAlign: 'center', width: 170 }}>
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  style={{ width: 72, height: 72, borderRadius: 20, background: `${step.color}15`, border: `1px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 0 30px ${step.color}20` }}>
                  <step.icon size={28} color={step.color} />
                </motion.div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{step.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{step.desc}</div>
              </motion.div>
              {i < steps.length - 1 && (
                <div style={{ padding: '0 8px', marginTop: -40 }}>
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut', type: 'tween' }} style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(d => <div key={d} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />)}
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TECH_STACK = [
  { name: 'AWS Lambda', sub: 'Serverless Compute', emoji: '⚡', glow: '#f59e0b' },
  { name: 'Amazon S3', sub: 'Object Storage', emoji: '🪣', glow: '#00d4ff' },
  { name: 'Python 3.11', sub: 'AI & Backend', emoji: '🐍', glow: '#10b981' },
  { name: 'OpenCV', sub: 'Computer Vision', emoji: '👁️', glow: '#a855f7' },
  { name: 'TensorFlow', sub: 'ML Models', emoji: '🧠', glow: '#f43f5e' },
  { name: 'FFmpeg', sub: 'Video Processing', emoji: '🎬', glow: '#06b6d4' },
  { name: 'Redis', sub: 'Caching Layer', emoji: '🔴', glow: '#ef4444' },
  { name: 'FastAPI', sub: 'REST Backend', emoji: '🚀', glow: '#6366f1' },
  { name: 'React', sub: 'Frontend UI', emoji: '⚛️', glow: '#00d4ff' },
  { name: 'AWS Rekognition', sub: 'Face Detection', emoji: '🔍', glow: '#f59e0b' },
  { name: 'Docker', sub: 'Containerization', emoji: '🐳', glow: '#00a8e8' },
  { name: 'Whisper AI', sub: 'Transcription', emoji: '🎙️', glow: '#a855f7' },
]

function TechStackSection() {
  return (
    <section id="tech-stack" style={{ padding: '120px 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '8px 20px', marginBottom: 24 }}>
            <Network size={14} color="#10b981" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981', letterSpacing: '0.5px' }}>TECHNOLOGY</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Built on a <span className="gradient-text">world-class</span> stack
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Production-grade AWS infrastructure married with cutting-edge AI — hover the floating tech icons to explore.
          </p>
        </motion.div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {TECH_STACK.map((tech, i) => {
            const amplitude = 10 + Math.random() * 10
            return (
              <motion.div key={tech.name} className="tech-pill"
                initial={{ opacity: 0, scale: 0.5, y: 50 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.12, boxShadow: `0 0 30px ${tech.glow}40` }}
                style={{ border: `1px solid ${tech.glow}30`, cursor: 'pointer' }}>
                {/* Per-property transition for the looping animate — must use tween for 3 keyframes */}
                <motion.span
                  animate={{ y: [0, -amplitude, 0], rotate: [0, i % 2 === 0 ? 1.5 : -1.5, 0] }}
                  transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: 'easeInOut', type: 'tween', delay: i * 0.4 }}
                  style={{ fontSize: 22, display: 'block' }}>{tech.emoji}</motion.span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{tech.name}</div>
                  <div style={{ fontWeight: 400, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{tech.sub}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
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
      <Navbar />
      <HeroSection />
      <BentoSection />
      <HowItWorks />
      <TechStackSection />
      <FooterCTA />
    </div>
  )
}
