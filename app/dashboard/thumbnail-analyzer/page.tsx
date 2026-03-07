'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PhotoIcon } from '@heroicons/react/24/outline'
import { TrendingUp, Eye, Zap, Star } from 'lucide-react'

const ANALYZED = [
  { title: 'Product Launch Hero', ctr: '8.4%', score: 94, verdict: 'Excellent' },
  { title: 'Behind the Scenes Banner', ctr: '5.1%', score: 72, verdict: 'Good' },
  { title: 'Tutorial Thumbnail v2', ctr: '3.2%', score: 48, verdict: 'Weak' },
]

const TIPS = [
  'Use high contrast between text and background',
  'Include a human face for 40% higher CTR',
  'Keep text to 5 words or fewer',
  'Use emotions: surprise, curiosity, or excitement',
  'Bright colors outperform dark in feeds',
]

export default function ThumbnailAnalyzerPage() {
  const [tab, setTab] = useState<'analyze' | 'history'>('analyze')

  return (
    <div className="space-y-8 w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
            <PhotoIcon style={{ width: 22, height: 22, color: '#06b6d4' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Thumbnail Analyzer</h1>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>AI-powered CTR prediction and thumbnail optimization</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{ label: 'Thumbnails Analyzed', value: '1,204', color: '#06b6d4' }, { label: 'Avg. CTR Lift', value: '+34%', color: '#10b981' }, { label: 'A/B Tests Run', value: '89', color: '#8B5CF6' }, { label: 'Top Score', value: '98/100', color: '#f59e0b' }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06 }} className="glass-card p-5">
            <div className="text-xs mb-2" style={{ color: '#A1A1AA' }}>{s.label}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Tab switch */}
      <div className="flex gap-2">
        {(['analyze', 'history'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={tab === t ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.35)' } : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'analyze' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card p-8 text-center" style={{ borderStyle: 'dashed', borderColor: 'rgba(6,182,212,0.3)', minHeight: 220 }}>
            <PhotoIcon style={{ width: 40, height: 40, color: 'rgba(6,182,212,0.4)', margin: '0 auto 16px' }} />
            <h3 className="text-lg font-semibold mb-2">Upload Thumbnail</h3>
            <p className="text-sm mb-6" style={{ color: '#A1A1AA' }}>PNG, JPG up to 10MB. AI will score CTR potential instantly.</p>
            <button className="glow-btn px-8 py-3 text-white text-sm font-semibold">Analyze Thumbnail</button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="glass-card p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Star size={16} style={{ color: '#06b6d4' }} />Optimization Tips</h2>
            <div className="space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold" style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>{i + 1}</div>
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h2 className="font-semibold flex items-center gap-2"><Eye size={16} style={{ color: '#06b6d4' }} />Analysis History</h2>
          </div>
          {ANALYZED.map((r, i) => (
            <div key={r.title} className="flex items-center justify-between px-6 py-4" style={{ borderBottom: i < ANALYZED.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div>
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs mt-0.5 flex items-center gap-3" style={{ color: '#A1A1AA' }}>
                  <span className="flex items-center gap-1"><TrendingUp size={11} />CTR: {r.ctr}</span>
                  <span className="flex items-center gap-1"><Zap size={11} />Score: {r.score}/100</span>
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={r.verdict === 'Excellent' ? { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }
                  : r.verdict === 'Good' ? { background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' }
                    : { background: 'rgba(244,63,94,0.12)', color: '#f87171', border: '1px solid rgba(244,63,94,0.25)' }}>
                {r.verdict}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
