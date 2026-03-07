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
      className="sticky bg-white dark:bg-[#0a0a0a] rounded-[24px] dark:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-2xl p-8 group border border-slate-100 dark:border-white/10 dark:backdrop-blur-2xl transition-all origin-top dark:hover:border-purple-500/30"
      style={{
        top: `${48 + (i * 32)}px`, // Staggered sticky position
        zIndex: i + 1,
        marginBottom: '2rem' // Space for stacking look
      }}>
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 dark:w-8 dark:h-8 rounded-full dark:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-purple-500 dark:to-indigo-600 flex items-center justify-center text-lg dark:text-xs text-white font-black shadow-lg shadow-indigo-500/30 dark:shadow-purple-500/30">
              {i + 1}
            </span>
            <h3 className="text-[22px] dark:text-xl font-black text-[#8B5CF6] dark:text-white tracking-tight uppercase leading-none dark:group-hover:text-purple-300 transition-colors">
              {scene.title}
            </h3>
          </div>
          <p className="text-[13px] dark:text-[10px] font-black text-slate-900 dark:text-gray-500 uppercase tracking-wide dark:tracking-widest ml-[52px] dark:ml-11">
            {scene.purpose || "Introduce the concept and set the tone"}
          </p>
        </div>
        <div className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-help opacity-40 dark:opacity-30 hover:opacity-100">
          <Sparkles size={18} className="text-[#8B5CF6] dark:text-purple-400" />
        </div>
      </div>

      <div className="space-y-8 dark:space-y-6">
        {/* Influencer Dialogue Block */}
        <div className="space-y-4 dark:space-y-3">
          <div className="flex items-center gap-2 mb-2 dark:mb-1">
            <DocumentTextIcon className="w-5 h-5 dark:w-4 dark:h-4 text-[#8B5CF6] dark:text-[#A855F7]" strokeWidth={2.5} />
            <label className="text-[13px] dark:text-[10px] uppercase font-black tracking-wide dark:tracking-widest text-[#8B5CF6] dark:text-purple-400">Influencer Dialogue</label>
          </div>
          <div className="relative pl-1 dark:pl-0 dark:p-6 dark:rounded-3xl dark:bg-white/[0.02] dark:border dark:border-white/5">
            <div className="inline-block dark:absolute dark:top-0 dark:left-4 dark:-translate-y-1/2 px-3 dark:px-2 py-1 dark:py-0.5 rounded-md dark:rounded bg-[#8B5CF6] dark:bg-purple-500 text-[10px] dark:text-[8px] font-bold dark:font-black text-white mb-3 dark:mb-0 tracking-wider dark:italic">
              Spoken
            </div>
            <p className="text-[17px] dark:text-base text-slate-800 dark:text-gray-200 leading-[1.6] dark:leading-[1.8] font-medium tracking-tight">
              {scene.dialogue}
            </p>
          </div>
        </div>

        {/* Visual Blueprint Block */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#0284C7] dark:text-blue-400" strokeWidth={2.5} />
            <label className="text-[13px] dark:text-[10px] uppercase font-black tracking-wide dark:tracking-widest text-[#0284C7] dark:text-blue-400">Visual Blueprint</label>
          </div>
          <div className="text-[15px] dark:text-[13px] font-medium text-slate-800 dark:text-blue-100/80 bg-[#EFF6FF] dark:bg-blue-500/5 px-6 dark:px-5 py-4 dark:py-5 rounded-3xl border border-[#DBEAFE] dark:border-blue-500/10 leading-relaxed dark:italic">
            {scene.visual || "Describe visual context here."}
          </div>
        </div>

        {/* Editing Logic Block */}
        {scene.editing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#059669] dark:text-green-400" strokeWidth={2.5} />
              <label className="text-[13px] dark:text-[10px] uppercase font-black tracking-wide dark:tracking-widest text-[#059669] dark:text-green-400">Editing Logic</label>
            </div>
            <div className="text-[15px] dark:text-[12px] font-medium text-slate-800 dark:text-green-100/70 bg-[#ECFDF5] dark:bg-green-500/5 px-6 dark:px-4 py-4 rounded-3xl border border-[#D1FAE5] dark:border-green-500/10">
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
    <div className="space-y-8 w-full pb-20">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <DocumentTextIcon style={{ width: 24, height: 24, color: 'white' }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Trend-to-Script</h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">High-retention video blueprints following a strict 1:450 word ratio</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/95 dark:bg-white/5 dark:backdrop-blur-xl rounded-[20px] dark:rounded-[2rem] p-6 shadow-sm dark:shadow-none border border-gray-100 dark:border-white/10 space-y-6 max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-cyan-500/20 text-teal-400 dark:text-cyan-400">
                <Sparkles size={18} />
              </div>
              <h2 className="font-bold text-[13px] dark:text-sm uppercase tracking-widest text-slate-700 dark:text-gray-300">Configuration</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] dark:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-500 mb-2 ml-1">Topic / Niche</label>
                <input value={topic} onChange={e => scriptGeneratorStore.setState({ topic: e.target.value })}
                  className="w-full px-4 dark:px-5 py-3 dark:py-3.5 rounded-xl dark:rounded-2xl text-sm text-slate-800 dark:text-white outline-none transition-all focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-cyan-500/50 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 placeholder:text-gray-400 dark:placeholder-gray-500"
                  placeholder="e.g., AI Tools for Productivity" />
              </div>

              <div>
                <label className="block text-[11px] dark:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-500 mb-2 ml-1">Tone</label>
                <input value={tone} onChange={e => scriptGeneratorStore.setState({ tone: e.target.value })}
                  className="w-full px-4 dark:px-5 py-3 dark:py-3.5 rounded-xl dark:rounded-2xl text-sm text-slate-800 dark:text-white outline-none transition-all focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-cyan-500/50 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 placeholder:text-gray-400 dark:placeholder-gray-500 mb-3"
                  placeholder="e.g., Casual, Direct, Urgent..." />
                <div className="flex flex-wrap gap-2">
                  {TONES.map(t => (
                    <button key={t} onClick={() => scriptGeneratorStore.setState({ tone: t })}
                      className={`px-3 py-1.5 rounded-full dark:rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 border ${tone === t ? 'bg-[#E0F2FE] dark:bg-cyan-500/15 border-[#38BDF8] dark:border-cyan-500 text-[#0284C7] dark:text-cyan-300' : 'bg-white dark:bg-white/5 border-[#F3F4F6] dark:border-white/10 text-[#64748B] dark:text-slate-400'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] dark:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-500 mb-2 ml-1">Target Length</label>
                <input value={length} onChange={e => scriptGeneratorStore.setState({ length: e.target.value })}
                  className="w-full px-4 dark:px-5 py-3 dark:py-3.5 rounded-xl dark:rounded-2xl text-sm text-slate-800 dark:text-white outline-none transition-all focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-cyan-500/50 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 placeholder:text-gray-400 dark:placeholder-gray-500 mb-3"
                  placeholder="e.g., 3 minutes, 60 seconds..." />
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map(l => (
                    <button key={l.value} onClick={() => scriptGeneratorStore.setState({ length: l.value })}
                      className={`px-3 py-1.5 rounded-full dark:rounded-xl text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 border ${length === l.value ? 'bg-[#E0F2FE] dark:bg-cyan-500/15 border-[#38BDF8] dark:border-cyan-500 text-[#0284C7] dark:text-cyan-300' : 'bg-white dark:bg-white/5 border-[#F3F4F6] dark:border-white/10 text-[#64748B] dark:text-slate-400'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] dark:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-500 mb-2 ml-1">Custom Rules (Optional)</label>
                <textarea value={customReq} onChange={e => scriptGeneratorStore.setState({ customReq: e.target.value })}
                  className="w-full px-4 dark:px-5 py-3 dark:py-3.5 rounded-xl dark:rounded-2xl text-sm text-slate-800 dark:text-white outline-none transition-all focus:ring-2 focus:ring-teal-500/30 dark:focus:ring-cyan-500/50 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 h-24 resize-none placeholder:text-gray-400 dark:placeholder-gray-500"
                  placeholder="Must mention my newsletter, avoid slang..." />
              </div>

              <div>
                <label className="block text-[11px] dark:text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-gray-500 mb-3 ml-1">Generation Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  {MODES.map(m => (
                    <button key={m.label} onClick={() => scriptGeneratorStore.setState({ mode: m.label })}
                      className={`group flex flex-col p-4 rounded-xl dark:rounded-2xl transition-all border relative overflow-hidden text-center ${mode === m.label ? 'bg-[#E0F2FE] dark:bg-cyan-500/10 border-[#38BDF8] dark:border-cyan-500/40' : 'bg-white dark:bg-white/5 border-[#F3F4F6] dark:border-white/10'}`}>
                      <div className="flex flex-col items-center gap-1 z-10">
                        <m.icon size={18} className={mode === m.label ? 'text-[#0284C7] dark:text-cyan-400' : 'text-gray-400 dark:text-gray-500'} />
                        <span className={`text-[11px] font-extrabold tracking-wide ${mode === m.label ? 'text-[#0284C7] dark:text-[#67E8F9]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>{m.label.split(' ')[0]}</span>
                      </div>
                      <span className="text-[9px] dark:text-[10px] text-gray-400 dark:text-gray-500 font-semibold z-10">{m.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button onClick={() => generateScript()} disabled={!topic || phase === 'loading'}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-[100%] py-4 rounded-xl dark:rounded-2xl text-white text-sm font-bold flex items-center justify-center gap-2 relative overflow-hidden group mt-6 shadow-none dark:shadow-lg dark:shadow-cyan-500/20 bg-[#00B4D8] dark:bg-gradient-to-br dark:from-cyan-600 dark:to-cyan-500">
              {phase === 'loading' ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full" />
                  Generating...
                </>
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
                className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-white/[0.01] rounded-[24px] dark:rounded-[2.5rem] shadow-sm dark:shadow-none dark:border dark:border-dashed dark:border-white/10">
                <div className="w-24 h-24 mb-6 flex items-center justify-center rounded-3xl dark:bg-white/5">
                  <DocumentTextIcon className="w-12 h-12 text-gray-200 dark:text-white/10" />
                </div>
                <h3 className="hidden dark:block text-white/60 font-bold text-xl mb-2">Awaiting Instructions</h3>
                <p className="text-[13px] dark:text-sm text-gray-500 max-w-sm leading-relaxed font-medium">
                  Configure your niche on the left and our AI will architect a 1:100 ratio blueprint.
                </p>
              </motion.div>
            )}

            {phase === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white dark:bg-white/[0.02] dark:border dark:border-white/5 rounded-[24px] dark:rounded-[2.5rem] shadow-sm dark:shadow-inner">
                <div className="relative mb-8">
                  <div className="w-20 h-20 border-[3px] border-cyan-50 dark:border-cyan-500/10 border-t-cyan-400 dark:border-t-cyan-500 rounded-full animate-spin" />
                  <Rocket className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400" size={24} />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="hidden dark:block text-xl font-bold text-white tracking-tight">Architecting Content...</h3>
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                        className="w-2 h-2 bg-cyan-400 rounded-full dark:shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'results' && data && (
              <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 flex-1 max-h-[1200px] overflow-auto custom-scrollbar px-1 pb-10">

                {/* Unified Stats Box */}
                <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

                  {/* Background Icon */}
                  <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-[0.03] text-slate-300 dark:text-white">
                    <BarChart3 size={100} />
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 scale-90">
                      <TrendingUp size={20} />
                    </div>

                    <h3 className="text-xs font-black uppercase tracking-widest text-black dark:text-white">
                      Predicted Performance Matrix
                    </h3>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mt-6 relative z-10">
                    {[
                      {
                        label: 'Duration',
                        val: stats?.estimatedDuration,
                        icon: Clock,
                        color: 'text-[#60A5FA] dark:text-blue-400',
                        c: '#3b82f6'
                      },
                      {
                        label: 'Retention',
                        val: stats?.retention,
                        icon: TrendingUp,
                        color: 'text-[#4ADE80] dark:text-green-400',
                        c: '#22c55e'
                      },
                      {
                        label: 'Hook',
                        val: stats?.hookStrength,
                        icon: Target,
                        color: 'text-[#F87171] dark:text-red-400',
                        c: '#ef4444'
                      },
                      {
                        label: 'Pacing',
                        val: stats?.pacing,
                        icon: Zap,
                        color: 'text-[#FACC15] dark:text-yellow-400',
                        c: '#eab308'
                      }
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="border border-slate-200 dark:border-white/10 rounded-[18px] p-4 sm:p-5 flex flex-col justify-between h-full min-h-[140px] bg-white dark:bg-[#020617] shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-1"
                      >
                        {/* Top Section */}
                        <div className="flex items-center justify-between mb-4">
                          <stat.icon size={22} className={stat.color} />

                          <span
                            className="font-extrabold text-[20px]"
                            style={{ color: stat.c }}
                          >
                            {stat.val || '--'}
                          </span>
                        </div>

                        {/* Label + Progress */}
                        <div>
                          <div className="text-[14px] font-bold text-slate-800 dark:text-white mb-3 leading-tight pr-4">
                            {stat.label}
                          </div>

                          <div className="h-[5px] rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: stat.label === 'Retention' ? stat.val : '100%',
                                backgroundColor: stat.c,
                                opacity: stat.val ? 1 : 0.2
                              }}
                            />
                          </div>
                        </div>
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
                        <h2 className="text-lg font-black text-black dark:text-white tracking-tight">
                          {mode === 'Director Mode' ? 'Production Stack' : 'Content Outline'}
                        </h2>
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
