'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { Sparkles, Copy, Check, Rocket, ScrollText, Clock, BarChart3, TrendingUp, Zap, Target, ChevronRight } from 'lucide-react'
import { useScriptGeneratorStore, scriptGeneratorStore, generateScript } from './store'

const TONES = ['Casual', 'Educational', 'Storytelling', 'Professional', 'Humorous', 'Mysterious']
const LENGTHS = [
  { label: 'Short (1-3 min)', value: '1-3 minutes' },
  { label: 'Medium (5-8 min)', value: '5-8 minutes' },
  { label: 'Long (10-15 min)', value: '10-15 minutes' }
]
const MODES = [
  { label: 'Director Mode', icon: Rocket, sub: 'Full Storyboard' },
  { label: 'Outline Mode', icon: ScrollText, sub: 'Talking Points' }
]

function SceneCard({ scene, i }: { scene: any; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ delay: i * 0.05 }}
      className="sticky glass-card rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] backdrop-blur-2xl shadow-2xl p-8 group hover:border-purple-500/30 transition-all origin-top"
      style={{
        top: `${48 + (i * 32)}px`, // Staggered sticky position
        zIndex: i + 1,
        marginBottom: '2rem' // Space for stacking look
      }}>
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs text-white font-black shadow-lg shadow-purple-500/30">
              {i + 1}
            </span>
            <h3 className="text-xl font-black text-white tracking-tight group-hover:text-purple-300 transition-colors uppercase leading-none">{scene.title}</h3>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-11">{scene.purpose}</p>
        </div>
        <div className="p-2 rounded-full hover:bg-white/5 transition-colors cursor-help opacity-30 hover:opacity-100">
          <Sparkles size={16} className="text-purple-400" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Influencer Dialogue Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <DocumentTextIcon style={{ width: 14, height: 14, color: '#A855F7' }} />
            <label className="text-[10px] uppercase font-black tracking-widest text-purple-400">Influencer Dialogue</label>
          </div>
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 relative">
            <div className="absolute top-0 left-4 -translate-y-1/2 px-2 py-0.5 rounded bg-purple-500 text-[8px] font-black text-white italic">Spoken</div>
            <p className="text-base text-gray-200 leading-[1.8] font-medium tracking-tight">
              {scene.dialogue}
            </p>
          </div>
        </div>

        {/* Visual Blueprint Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-400" />
            <label className="text-[10px] uppercase font-black tracking-widest text-blue-400">Visual Blueprint</label>
          </div>
          <div className="text-[13px] text-blue-100/80 bg-blue-500/5 p-5 rounded-3xl border border-blue-500/10 italic leading-relaxed">
            {scene.visual || "Describe visual context here."}
          </div>
        </div>

        {/* Editing Logic Block */}
        {scene.editing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-green-400" />
              <label className="text-[10px] uppercase font-black tracking-widest text-green-400">Editing Logic</label>
            </div>
            <div className="text-[12px] text-green-100/70 bg-green-500/5 p-4 rounded-3xl border border-green-500/10 font-medium">
              {scene.editing}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function ScriptGeneratorPage() {
  const { topic, tone, length, customReq, mode, phase, data, error } = useScriptGeneratorStore()
  const [copied, setCopied] = useState(false)

  const copyScript = () => {
    let text = ''
    const s = data?.results?.script || data?.results?.scenes || data?.results

    if (mode === 'Director Mode' && Array.isArray(s)) {
      text = s.map((scene: any) => `${scene.title}\nPurpose: ${scene.purpose}\nDialogue: ${scene.dialogue}\nVisual: ${scene.visual}`).join('\n\n')
    } else if (s.hook) {
      text = `Hook: ${s.hook}\n\nPoints:\n${s.valuePoints?.map((p: any) => `- ${p.point} (B-Roll: ${p.broll})`).join('\n')}\n\nCTA: ${s.cta}`
    } else {
      text = JSON.stringify(s, null, 2)
    }

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const s = data ? (data.results.script || data.results.scenes || data.results) : null;
  const stats = data?.results?.stats;

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <DocumentTextIcon style={{ width: 24, height: 24, color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Trend-to-Script</h1>
            <p className="text-sm text-gray-400">High-retention video blueprints following a strict 1:450 word ratio</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6 border border-white/10 bg-white/5 backdrop-blur-xl rounded-[2rem] space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles size={18} />
              </div>
              <h2 className="font-bold text-sm uppercase tracking-widest text-gray-300">Configuration</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Topic / Niche</label>
                <input value={topic} onChange={e => scriptGeneratorStore.setState({ topic: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500/50 bg-black/20 border border-white/10"
                  placeholder="e.g., AI Tools for Productivity" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Tone</label>
                <input value={tone} onChange={e => scriptGeneratorStore.setState({ tone: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500/50 bg-black/20 border border-white/10 mb-3"
                  placeholder="e.g., Casual, Direct, Urgent..." />
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button key={t} onClick={() => scriptGeneratorStore.setState({ tone: t })}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: tone === t ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${tone === t ? '#06B6D4' : 'rgba(255,255,255,0.08)'}`,
                        color: tone === t ? '#67E8F9' : '#94A3B8',
                      }}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Target Length</label>
                <input value={length} onChange={e => scriptGeneratorStore.setState({ length: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500/50 bg-black/20 border border-white/10 mb-3"
                  placeholder="e.g., 3 minutes, 60 seconds..." />
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map(l => (
                    <button key={l.value} onClick={() => scriptGeneratorStore.setState({ length: l.value })}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: length === l.value ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${length === l.value ? '#0EA5E9' : 'rgba(255,255,255,0.08)'}`,
                        color: length === l.value ? '#7DD3FC' : '#94A3B8',
                      }}>{l.label}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Custom Rules (Optional)</label>
                <textarea value={customReq} onChange={e => scriptGeneratorStore.setState({ customReq: e.target.value })}
                  className="w-full px-5 py-3.5 rounded-2xl text-sm text-white outline-none transition-all focus:ring-2 focus:ring-cyan-500/50 bg-black/20 border border-white/10 h-24 resize-none"
                  placeholder="Must mention my newsletter, avoid slang..." />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 ml-1">Generation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  {MODES.map(m => (
                    <button key={m.label} onClick={() => scriptGeneratorStore.setState({ mode: m.label })}
                      className="group flex flex-col p-4 rounded-2xl transition-all border relative overflow-hidden text-center"
                      style={{
                        background: mode === m.label ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)',
                        borderColor: mode === m.label ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.06)',
                      }}>
                      <div className="flex flex-col items-center gap-1">
                        <m.icon size={18} className={mode === m.label ? 'text-cyan-400' : 'text-gray-500'} />
                        <span className="text-xs font-bold" style={{ color: mode === m.label ? '#67E8F9' : '#94A3B8' }}>{m.label.split(' ')[0]}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{m.sub}</span>
                      {mode === m.label && <motion.div layoutId="active-mode" className="absolute inset-0 bg-cyan-500/5" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button onClick={() => generateScript()} disabled={!topic || phase === 'loading'}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden group shadow-lg shadow-cyan-500/20"
              style={{ background: 'linear-gradient(135deg, #0891B2 0%, #06B6D4 100%)' }}>
              {phase === 'loading' ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <Zap size={18} className="group-hover:rotate-12 transition-transform" />
                  Generate Script
                </>
              )}
            </motion.button>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-xs text-red-300">⚠️ Model Error</div>
                {error}
                <div className="mt-2 text-[10px] opacity-60">Tip: Check if us.amazon.nova-premier-v1:0 access is granted.</div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-8 flex flex-col">
          <AnimatePresence mode="wait">
            {phase === 'input' && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 glass-card rounded-[2.5rem] border-dashed border-white/10 bg-white/[0.01]">
                <div className="w-32 h-32 rounded-3xl bg-white/5 flex items-center justify-center mb-6 relative group overflow-hidden">
                  <DocumentTextIcon style={{ width: 64, height: 64, color: 'rgba(255,255,255,0.05)' }} />
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 bg-cyan-500/10 rounded-3xl blur-2xl" />
                </div>
                <h3 className="text-white/60 font-bold text-xl mb-2">Awaiting Instructions</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Configure your niche on the left and our AI will architect a 1:100 ratio blueprint.
                </p>
              </motion.div>
            )}

            {phase === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[600px] flex flex-col items-center justify-center glass-card rounded-[2.5rem] bg-white/[0.02] border border-white/5 shadow-inner">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin" />
                  <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400" size={28} />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white tracking-tight">Architecting Content...</h3>
                  <div className="flex gap-1.5 justify-center">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2], y: [0, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                        className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'results' && data && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex-1 max-h-[1200px] overflow-auto custom-scrollbar px-1 pb-10">

                {/* Unified Stats Box */}
                <div className="glass-card p-6 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden backdrop-blur-3xl shadow-2xl">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BarChart3 size={100} />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 scale-90">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Predicted Performance Matrix</h3>
                  </div>

                  <div className="grid grid-cols-4 gap-0.5 bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                    {[
                      { label: 'Duration', val: stats?.estimatedDuration, icon: Clock, color: 'text-blue-400' },
                      { label: 'Retention', val: stats?.retention, icon: TrendingUp, color: 'text-green-400' },
                      { label: 'Hook', val: stats?.hookStrength, icon: Target, color: 'text-red-400' },
                      { label: 'Pacing', val: stats?.pacing, icon: Zap, color: 'text-yellow-400' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-black/20 p-4 flex flex-col items-center text-center transition-colors hover:bg-black/30 first:border-l-0 border-l border-white/5">
                        <stat.icon size={16} className={`${stat.color} mb-2 opacity-80`} />
                        <div className="text-[8px] uppercase tracking-tighter text-gray-500 font-black mb-1 leading-none">{stat.label}</div>
                        <div className="text-sm font-black text-white leading-tight">{stat.val || '--'}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-6 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        {mode === 'Director Mode' ? <Rocket size={20} /> : <ScrollText size={20} />}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white tracking-tight">{mode === 'Director Mode' ? 'Production Stack' : 'Content Outline'}</h2>
                        <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                          <Check size={10} className="text-green-500" /> Verified 1:100 Delivery Ratio
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <motion.button onClick={copyScript} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10 shadow-sm">
                        {copied ? <><Check size={14} className="text-green-400" /> Copied</> : <><Copy size={14} /> Copy All</>}
                      </motion.button>
                    </div>
                  </div>

                  {/* Scene/Script Cards with Stacking Effect & Animations */}
                  <div className="space-y-4 relative">
                    {mode === 'Director Mode' && Array.isArray(s) ? (
                      <div className="space-y-4 pb-10">
                        {s.map((scene: any, i: number) => (
                          <SceneCard key={i} scene={scene} i={i} />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                          className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 shadow-2xl relative overflow-hidden group">
                          <div className="absolute -top-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
                            <Target size={120} />
                          </div>
                          <h3 className="text-red-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Zap size={16} /> Compulsory Viral Hook
                          </h3>
                          <p className="text-lg text-white leading-relaxed font-bold tracking-tight italic">"{s.hook}"</p>
                        </motion.div>

                        <div className="space-y-4">
                          <h3 className="text-cyan-400 font-black text-xs uppercase tracking-widest ml-4 mb-2 flex items-center gap-2">
                            <ScrollText size={16} /> High-Value Segments
                          </h3>
                          {(s.valuePoints || []).map((vp: any, i: number) => (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                              className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-cyan-500/20 transition-all hover:bg-white/[0.04]">
                              <div className="flex gap-6">
                                <div className="mt-1 w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-xs font-black text-cyan-400 shrink-0">
                                  {String(i + 1).padStart(2, '0')}
                                </div>
                                <div className="flex-1 space-y-4">
                                  <p className="text-base text-gray-200 font-medium leading-[1.7]">{vp.point}</p>
                                  <div className="p-4 rounded-[1.5rem] bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden">
                                    <div className="flex items-center gap-2 text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                                      <Rocket size={12} /> B-Roll Visual Recommendation
                                    </div>
                                    <p className="text-[13px] text-indigo-200/60 leading-relaxed italic">{vp.broll}</p>
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                      <Target size={40} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                          className="p-8 rounded-[2.5rem] bg-green-500/5 border border-green-500/10 text-center relative overflow-hidden group shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <h3 className="text-green-400 font-black text-xs uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                            <Check size={16} /> Community CTA
                          </h3>
                          <p className="text-base text-gray-200 leading-relaxed font-bold tracking-tight italic">"{s.cta}"</p>
                        </motion.div>
                      </div>
                    )}
                  </div>


                </div>



                <div className="flex justify-center pt-6">
                  <motion.button onClick={() => scriptGeneratorStore.reset()}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    className="px-10 py-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all shadow-lg hover:shadow-cyan-500/5">
                    Reset Session
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Styles for Stacked Scroll & Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}
