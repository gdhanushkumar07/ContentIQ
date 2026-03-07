'use client'

import { VideoAIIcon } from '@/components/icons/VideoAIIcon'
import {
  Eye, Zap, TrendingUp, Clock, RefreshCcw, Shield,
  ChevronDown, ChevronUp, Mic, Brain, Target, BarChart2
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useVideoIntelligenceStore, startVideoAnalysis, videoIntelligenceStore } from './store'

// ── static feature cards (upload screen) ──────────────────────────────────────
const FEATURES = [
  { icon: Eye, title: 'Frame-by-Frame Analysis', desc: 'AI scans every frame for visual quality, composition, and emotional tone.' },
  { icon: Zap, title: 'Audience Simulation', desc: 'Nova Pro simulates how a real first-time viewer reacts to each scene.' },
  { icon: TrendingUp, title: 'Engagement Scoring', desc: 'Each scene is scored 0–100 across speech, visuals, semantics, and attention.' },
  { icon: Clock, title: 'Reshoot Direction', desc: 'Per-scene reshoot guides: delivery, visuals, script, and timing changes.' },
]

// ── helpers ───────────────────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 70) return { text: '#22c55e', glow: 'rgba(34,197,94,0.55)', border: 'rgba(34,197,94,0.5)' }
  if (score >= 45) return { text: '#f59e0b', glow: 'rgba(245,158,11,0.55)', border: 'rgba(245,158,11,0.5)' }
  return { text: '#ef4444', glow: 'rgba(239,68,68,0.55)', border: 'rgba(239,68,68,0.5)' }
}

function getPillStyle(rec: string) {
  switch (rec.toLowerCase()) {
    case 'highlight': return { bg: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.45)', color: '#f59e0b' }
    case 'keep': return { bg: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.45)', color: '#22c55e' }
    case 'trim': return { bg: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.45)', color: '#ef4444' }
    case 'cut': return { bg: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.45)', color: '#ef4444' }
    default: return { bg: 'rgba(139,92,246,0.18)', border: '1px solid rgba(139,92,246,0.45)', color: '#a78bfa' }
  }
}

function getCategoryStyle(cat: string) {
  if (cat === 'HIGH') return { bg: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80' }
  if (cat === 'AVERAGE') return { bg: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#fbbf24' }
  return { bg: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }
}

// ── Circular progress ring ────────────────────────────────────────────────────
function CircularProgress({ score, size = 140 }: { score: number; size?: number }) {
  const r = (size / 2) - 14
  const circ = 2 * Math.PI * r
  const off = circ - (score / 100) * circ
  const { text: scoreColor, glow } = getScoreColor(score)
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={10} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={scoreColor} strokeWidth={10}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }} />
      </svg>
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{score}%</div>
      </div>
    </div>
  )
}

// ── Mini signal bar ───────────────────────────────────────────────────────────
function SignalBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={13} style={{ color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
        </div>
        <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${value}%`, background: color, borderRadius: 4,
            boxShadow: `0 0 6px ${color}88`, transition: 'width 0.6s ease'
          }} />
        </div>
      </div>
    </div>
  )
}

// ── Reshoot accordion panel (7-field director guide) ───────────────────────────────────
function ReshootGuide({ guide }: {
  guide: {
    delivery: string; visual: string; script: string; duration: string;
    pacing: string; emotion: string; musicSuggestion: string;
  }
}) {
  const [open, setOpen] = useState(false)
  const items = [
    { label: '🎙️ Delivery', value: guide.delivery },
    { label: '🎥 Visual', value: guide.visual },
    { label: '📝 Script', value: guide.script },
    { label: '⏱️ Duration', value: guide.duration },
    { label: '⚡ Pacing', value: guide.pacing },
    { label: '💡 Emotion', value: guide.emotion },
    { label: '🎵 Music', value: guide.musicSuggestion },
  ]
  return (
    <div style={{ marginTop: 12, borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 14px', background: 'rgba(139,92,246,0.08)', border: 'none',
          cursor: 'pointer', color: '#c4b5fd', fontSize: 12.5, fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          🎬 Director’s Playbook
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div style={{ padding: '12px 14px', background: 'rgba(10,5,30,0.5)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => (
            <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 12, color: '#7c3aed', flexShrink: 0, width: 90, fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: 12.5, color: '#e2e8f0', lineHeight: 1.6 }}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Analysis progress screen ──────────────────────────────────────────────────
const STAGES: any[] = [
  { id: 1, label: 'Secure Intake', sub: 'Validating private S3 storage' },
  { id: 2, label: 'Pipeline Initialization', sub: 'Spinning up evaluation engine' },
  {
    id: 3,
    isParallel: true,
    tasks: [
      { label: 'Audio Transcription', sub: 'Lambda extracting speech to text module' },
      { label: 'Multimodal Vision', sub: 'Nova evaluating frame-by-frame visual signals' }
    ]
  },
  { id: 4, label: 'Timeline & Scene Grouping', sub: 'Detecting logical boundaries' },
  { id: 5, label: 'Semantic & Delivery Scoring', sub: 'Computing 0-100 engagement' },
  { id: 6, label: 'Audience Simulation', sub: 'Nova Pro simulating first-time viewer' },
  { id: 7, label: 'Reshoot Direction Engine', sub: 'Producing corrective action plan' },
  { id: 8, label: 'Intelligence Assembly', sub: 'Merging all signals into final report' },
]

function AnalysisProgress({ currentStage }: { currentStage: number }) {
  return (
    <div className="max-w-[640px] mx-auto py-12 px-6 lg:px-0">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F3E8FF] dark:bg-purple-500/15 border border-[#E9D5FF] dark:border-purple-500/40 animate-[spin_2.5s_linear_infinite]">
            <VideoAIIcon className="w-7 h-7 text-[#A855F7] dark:text-purple-400" />
          </div>
        </div>
        <h2 className="text-[20px] font-bold mb-1.5 text-slate-800 dark:text-white">Analyzing your video</h2>
        <p className="text-[13px] text-slate-500 dark:text-[#64748b]">Running through parallel intelligence stages — this takes ~30s</p>
      </div>

      <div className="flex flex-col gap-2">
        {STAGES.map(s => {
          const done = s.id < currentStage
          const active = s.id === currentStage
          const pending = s.id > currentStage

          if (s.isParallel) {
            return (
              <div key={s.id} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {s.tasks.map((task: any, idx: number) => (
                  <div key={idx} className={`flex items-start gap-3 px-[14px] py-[12px] rounded-xl transition-all duration-300 ${active ? 'bg-[#F0F9FF] dark:bg-[#38bdf8]/12 border border-[#BAE6FD] dark:border-[#38bdf8]/40' : done ? 'bg-[#F0FDF4] dark:bg-[#22c55e]/[0.07] border border-[#BBF7D0] dark:border-[#22c55e]/20' : 'bg-transparent dark:bg-white/[0.03] border border-transparent dark:border-white/5'} ${pending ? 'opacity-40' : 'opacity-100'}`}>
                    <div className={`w-[26px] h-[26px] rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold mt-0.5 ${done ? 'bg-[#22c55e] text-white' : active ? 'bg-[#38bdf8] text-white shadow-[0_0_12px_rgba(56,189,248,0.5)]' : 'bg-[#F1F5F9] dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'}`}>
                      {done ? '✓' : `${s.id}${idx === 0 ? 'A' : 'B'}`}
                    </div>
                    <div>
                      <div className={`text-[12.5px] mb-0.5 ${active ? 'font-bold text-[#0284C7] dark:text-[#7dd3fc]' : done ? 'font-medium text-[#166534] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-[#e2e8f0]'}`}>
                        {task.label}
                      </div>
                      <div className={`text-[11px] leading-[1.3] ${active ? 'text-[#0369A1] dark:text-[#bae6fd]' : 'text-slate-500 dark:text-[#475569]'}`}>
                        {task.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          return (
            <div key={s.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-[#F3E8FF] dark:bg-purple-500/12 border border-[#D8B4FE] dark:border-purple-500/40' : done ? 'bg-[#F0FDF4] dark:bg-[#22c55e]/[0.07] border border-[#BBF7D0] dark:border-[#22c55e]/20' : 'bg-transparent dark:bg-white/[0.03] border border-transparent dark:border-white/5'} ${pending ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[12px] font-bold ${done ? 'bg-[#22c55e] text-white' : active ? 'bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]' : 'bg-[#F1F5F9] dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'}`}>
                {done ? '✓' : s.id}
              </div>
              <div>
                <div className={`text-[13px] ${active ? 'font-bold text-[#6D28D9] dark:text-[#c4b5fd]' : done ? 'font-medium text-[#166534] dark:text-[#4ade80]' : 'font-medium text-slate-700 dark:text-[#e2e8f0]'}`}>
                  {s.label}
                </div>
                <div className="text-[11.5px] text-slate-500 dark:text-[#475569]">
                  {s.sub}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function VideoIntelligencePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { stage, uploadedKey, result, error, category } = useVideoIntelligenceStore()

  const glassBg = 'rgba(18,14,40,0.7)'
  const glassBorder = '1px solid rgba(139,92,246,0.2)'

  // ── Upload & analyse ──────────────────────────────────────────────────────

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    startVideoAnalysis(file)
  }

  const reset = () => { videoIntelligenceStore.reset() }

  // ════════════════════════════════════════════════════════════════════════════
  //  UPLOAD SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (stage === 0) {
    return (
      <div className="space-y-8 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-[#38BDF8]/12 border border-slate-200 dark:border-[#38BDF8]/25">
            <VideoAIIcon className="w-5 h-5 text-slate-700 dark:text-[#38BDF8]" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">Video Intelligence</h1>
            <p className="text-[13px] font-medium text-slate-500 dark:text-[#A1A1AA]">
              Pre-posting private evaluation — 10-stage AWS-native analysis
            </p>
          </div>
        </div>

        {/* Upload box */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-[32px] p-12 flex flex-col items-center justify-center text-center shadow-sm dark:shadow-none border border-slate-200/60 dark:border-white/10 dark:border-dashed"
          style={{ minHeight: 460 }}>
          <VideoAIIcon className="w-10 h-10 text-[#312E81] dark:text-purple-400/60 mb-6" />
          <h3 className="text-[22px] dark:text-lg font-bold dark:font-semibold mb-3 text-slate-900 dark:text-white tracking-tight">Upload your video for private evaluation</h3>
          <p className="text-[14px] dark:text-sm mb-2 text-slate-600 dark:text-[#A1A1AA] leading-relaxed font-medium dark:font-normal" style={{ maxWidth: 520 }}>
            Your video stays private — never indexed, never shared. The AI simulates how a real audience
            would react, then gives you exact reshoot instructions per scene.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10 mt-6">
            <span className="text-[13px] font-semibold text-slate-800 dark:text-[#e2e8f0] bg-[#FFEDD5] dark:bg-purple-500/20 px-4 py-2 rounded-full dark:border dark:border-purple-500/40">🔒 Private & encrypted</span>
            <span className="text-[13px] font-semibold text-slate-800 dark:text-[#e2e8f0] bg-[#F3E8FF] dark:bg-purple-500/20 px-4 py-2 rounded-full dark:border dark:border-purple-500/40">🎬 10-stage pipeline</span>
            <span className="text-[13px] font-semibold text-slate-800 dark:text-[#e2e8f0] bg-[#DCFCE7] dark:bg-purple-500/20 px-4 py-2 rounded-full dark:border dark:border-purple-500/40">📊 Per-scene scoring</span>
            <span className="text-[13px] font-semibold text-slate-800 dark:text-[#e2e8f0] bg-[#E0F2FE] dark:bg-purple-500/20 px-4 py-2 rounded-full dark:border dark:border-purple-500/40">🎯 Reshoot direction</span>
          </div>

          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
            <label className="text-[14px] text-slate-800 dark:text-slate-400 font-medium">Select Category:</label>
            <select
              value={category}
              onChange={(e) => videoIntelligenceStore.setState({ category: e.target.value })}
              className="bg-white dark:bg-purple-500/15 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-purple-500/60 rounded-xl px-4 py-2 text-[14px] dark:text-sm outline-none cursor-pointer font-medium shadow-sm dark:shadow-none transition-colors focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="Tech Review">Tech Review</option>
              <option value="Comedy">Comedy</option>
              <option value="Cooking">Cooking</option>
              <option value="Educational">Educational</option>
              <option value="Vlog">Vlog</option>
              <option value="Gaming">Gaming</option>
              <option value="Entertainment">Entertainment</option>
              <option value="General">General</option>
            </select>
          </div>

          <input type="file" accept="video/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <button onClick={() => fileInputRef.current?.click()} className="px-10 py-3.5 dark:py-3 text-white text-[15px] dark:text-sm font-semibold rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_12px_24px_rgba(91,33,182,0.3)] dark:shadow-purple-500/20 bg-gradient-to-r from-[#6D28D9] to-[#4F46E5] dark:bg-transparent dark:glow-btn">
            Start Private Analysis
          </button>
          {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 16 }}>{error}</p>}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, idx) => (
            <div key={f.title} className="bg-white dark:bg-white/5 dark:backdrop-blur-xl rounded-[20px] p-6 flex gap-4 shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${idx === 0 ? 'bg-[#F3E8FF] dark:bg-purple-500/10 border border-[#E9D5FF] dark:border-purple-500/20' : 'bg-[#FCE7F3] dark:bg-pink-500/10 border border-[#FBCFE8] dark:border-pink-500/20'}`}>
                <f.icon className={`w-5 h-5 ${idx === 0 ? 'text-[#8B5CF6] dark:text-purple-400' : 'text-[#EC4899] dark:text-pink-400'}`} />
              </div>
              <div>
                <h3 className="font-bold dark:font-semibold mb-1 text-[15px] dark:text-base text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-[14px] dark:text-sm text-slate-600 dark:text-[#A1A1AA] font-medium dark:font-normal leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  ANALYSIS PROGRESS SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (stage > 0 && !result) {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <AnalysisProgress currentStage={stage} />
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  RESULTS SCREEN
  // ════════════════════════════════════════════════════════════════════════════
  if (!result) return null

  const { scenes, avgEngagementScore, videoMeta, improvementTips, lowEngagementCount, highEngagementCount } = result
  const lowScenes = scenes.filter(s => s.category === 'LOW')

  return (
    <div style={{ maxWidth: '100%', color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-2xl px-6 py-4 flex items-center justify-between mb-6 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-purple-500/20 flex items-center justify-center">
            <VideoAIIcon className="w-5 h-5 text-purple-400 dark:text-purple-300" />
          </div>
          <div>
            <div className="font-bold text-[17px] text-slate-900 dark:text-white">Intelligence Report</div>
            <div className="text-slate-500 dark:text-purple-400 text-[12px] mt-0.5 font-medium">
              {result.totalScenes} scenes · {videoMeta.estimatedDuration} · {videoMeta.fileSizeMB} MB
            </div>
          </div>
        </div>

        <div className="flex items-center gap-7">
          <div className="text-center">
            <div className="text-slate-500 dark:text-slate-400 text-[10px] tracking-wider uppercase mb-1 font-bold">High Scenes</div>
            <div className="font-bold text-[18px] text-[#22c55e]">{highEngagementCount}</div>
          </div>
          <div className="text-center">
            <div className="text-[#991B1B] dark:text-slate-400 text-[10px] tracking-wider uppercase mb-1 font-bold">Low Scenes</div>
            <div className="font-bold text-[18px] text-[#DC2626]">{lowEngagementCount}</div>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-slate-300 dark:border-purple-500/45 text-slate-700 dark:text-[#c4b5fd] font-semibold text-[13px] hover:bg-slate-50 dark:hover:bg-purple-500/15 transition-colors ml-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" /> New Analysis
          </button>
        </div>
      </div>

      {/* ── Bento row: signal overview ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_200px_minmax(0,1.9fr)] gap-5 mb-6">

        {/* Low engagement & Actions */}
        <div className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-[24px] p-6 shadow-sm dark:shadow-none dark:backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
            <span className="font-bold text-[15px] text-slate-900 dark:text-white">Recommended Deletions</span>
          </div>
          {lowScenes.length === 0 ? (
            <div className="bg-[#f0fdf4] dark:bg-[#22c55e]/[0.08] border border-[#bbf7d0] dark:border-[#22c55e]/20 rounded-xl px-4 py-3.5 text-[14px] text-[#166534] dark:text-[#4ade80] italic">
              No critical drop-off zones detected 🎉
            </div>
          ) : (
          <div className="flex flex-col gap-2.5">
            {lowScenes.map((s, i) => (
              <div key={i} className="bg-[#fef2f2] dark:bg-[#ef4444]/[0.09] border border-[#fecaca] dark:border-[#ef4444]/20 rounded-xl px-4 py-3.5 text-[14px] text-[#991b1b] dark:text-[#fca5a5]">
                <strong className="text-slate-900 dark:text-white">{s.timestamp}</strong> — {s.whyItFailed ?? 'Low engagement zone'}
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-gray-200 dark:bg-purple-500/10 my-6" />

        <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.7)]" />
            <span className="font-bold text-[15px] text-slate-900 dark:text-white">Improvement Actions</span>
          </div>
          <div className="flex flex-col gap-3">
            {improvementTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-[2.5px] shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-[13px] text-slate-700 dark:text-[#cbd5e1] leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Avg score ring */}
        <div className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-[24px] p-6 flex flex-col items-center justify-center gap-5 shadow-sm dark:shadow-none dark:backdrop-blur-md">
          <CircularProgress score={avgEngagementScore} size={140} />
          <div className="text-center">
            <div className="font-bold text-[12px] tracking-wider uppercase text-slate-500 dark:text-[#94a3b8] mb-1">
              AVG ENGAGEMENT
            </div>
          </div>
        </div>

        {/* Signal breakdown - refactoring inside to grid layout exactly like screenshot */}
        <div className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-[24px] p-6 lg:p-7 shadow-sm dark:shadow-none dark:backdrop-blur-md flex flex-col">
          <div className="font-bold text-[18px] mb-6 text-slate-900 dark:text-white tracking-wide">Signal Breakdown (avg)</div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            {(() => {
              const scenesLen = result.scenes.length || 1
              const avgDelivery = Math.round(result.scenes.reduce((acc, s) => acc + (s.deliveryQuality || 0), 0) / scenesLen)
              const avgVisual = Math.round(result.scenes.reduce((acc, s) => acc + (s.visualVariation || 0), 0) / scenesLen)
              const avgSemantic = Math.round(result.scenes.reduce((acc, s) => acc + (s.semanticInterest || 0), 0) / scenesLen)

              const signals = [
                { label: 'Speech & Delivery', val: avgDelivery, icon: Mic, c: '#8b5cf6' },
                { label: 'Visual Variation', val: avgVisual, icon: Eye, c: '#10b981' },
                { label: 'Semantic Interest', val: avgSemantic, icon: Zap, c: '#eab308' },
                { label: 'Overall Score', val: result.avgEngagementScore, icon: Target, c: '#38bdf8' },
              ]

              return signals.map(s => (
                <div key={s.label} className="border border-slate-200 dark:border-[#2A2440] rounded-[18px] p-4 sm:p-5 flex flex-col justify-between h-full min-h-[160px] bg-white dark:bg-transparent shadow-[0_2px_10px_rgba(0,0,0,0.03)] dark:shadow-none">
                  <div className="flex items-center justify-between mb-4">
                    <s.icon size={22} style={{ color: s.c }} />
                    <span className="font-extrabold text-[20px]" style={{ color: s.c }}>{s.val}%</span>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-slate-800 dark:text-white/90 mb-3 leading-tight pr-4">{s.label}</div>
                    <div className="h-[5px] rounded-full bg-gray-200 dark:bg-[#2A2440] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.val}%`, backgroundColor: s.c }} />
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>
        </div>
      </div>

      {/* ── 15-Point Video Intelligence Report ───────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Brain className="w-[18px] h-[18px] text-purple-600 dark:text-[#a78bfa]" />
          <h2 className="font-bold text-[17px] text-slate-800 dark:text-white">Comprehensive Intelligence Report</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {[
            { label: 'Category Suitability', value: result.categorySuitabilityScore, icon: Target, c: '#a855f7' },
            { label: 'Hook Strength', value: result.hookStrength, icon: Zap, c: '#eab308' },
            { label: 'Content Value', value: result.contentValue, icon: Brain, c: '#22c55e' },
            { label: 'Information Density', value: result.informationDensity, icon: BarChart2, c: '#0ea5e9' },
            { label: 'Delivery Strength', value: result.deliveryStrength, icon: Mic, c: '#8b5cf6' },
            { label: 'Visual Quality', value: result.visualQuality, icon: Eye, c: '#10b981' },
            { label: 'Editing Quality', value: result.editingQuality, icon: Clock, c: '#ec4899' },
            { label: 'Emotional Impact', value: result.emotionalImpact, icon: TrendingUp, c: '#ef4444' },
            { label: 'Competitor Benchmark', value: result.competitorBenchmark, icon: Target, c: '#f59e0b' },
            { label: 'Content Uniqueness', value: result.contentUniqueness, icon: VideoAIIcon, c: '#d946ef' },
            { label: 'Safety Confidence', value: result.safetyScore, icon: Shield, c: '#14b8a6' }
          ].map(m => (
            <div key={m.label} className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-xl p-4 flex flex-col gap-2.5 shadow-sm dark:shadow-none dark:backdrop-blur-md">
              <div className="flex justify-between items-center">
                <m.icon className="w-4 h-4" style={{ color: m.c }} />
                <span className="font-extrabold text-[16px]" style={{ color: m.c }}>{m.value}%</span>
              </div>
              <div className="text-[12px] font-bold text-slate-700 dark:text-[#e2e8f0] leading-tight">{m.label}</div>
              <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/5 overflow-hidden mt-0.5">
                <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.c }} />
              </div>
            </div>
          ))}
        </div>

        {/* Virality Prediction Banner */}
        <div className="mt-4 rounded-2xl p-6 sm:px-8 flex items-center justify-between flex-wrap gap-5 bg-gradient-to-r from-purple-500/10 to-sky-500/10 dark:from-[#8b5cf6]/15 dark:to-[#38bdf8]/15 border border-purple-500/20 dark:border-[#8b5cf6]/40">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-wider mb-1.5 text-purple-600 dark:text-[#c4b5fd]">
              Final Viral Prediction
            </div>
            <div className="text-[28px] font-extrabold text-[#4F46E5] dark:text-white mt-1">
              {result.viralityPrediction}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-semibold uppercase tracking-wider mb-1.5 text-slate-500 dark:text-[#94a3b8]">
              Virality Score
            </div>
            <div className="text-[36px] font-extrabold text-[#38bdf8] leading-none">
              {result.viralityScore}<span className="text-[18px] text-slate-400 dark:text-[#94a3b8]">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scene-by-Scene Timeline ──────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-5">
          <Target className="w-[18px] h-[18px] text-purple-600 dark:text-[#a78bfa]" />
          <h2 className="font-bold text-[17px] text-[#c4b5fd] dark:text-white">Scene-by-Scene Intelligence Timeline</h2>
        </div>

        <div className="bg-white dark:bg-[#120E28]/70 border border-slate-200 dark:border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:backdrop-blur-md relative">
          <div className="relative">
            {/* Glow spine */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-gradient-to-b dark:from-purple-500/60 dark:to-sky-500/15 dark:shadow-[0_0_8px_rgba(139,92,246,0.4)]" />

            <div className="flex flex-col gap-6">
              {scenes.map((scene, idx) => {
                const colors = getScoreColor(scene.viralityScore ?? scene.engagementScore)
                const pillSt = getPillStyle(scene.recommendation)
                const catStyle = getCategoryStyle(scene.category)
                return (
                  <div key={idx} className="flex gap-4 sm:gap-6 items-start relative z-10">
                    {/* Virality score badge */}
                    <div className="w-[50px] h-[50px] shrink-0 rounded-full bg-white dark:bg-[#0A0710] border-2 flex flex-col items-center justify-center relative z-10"
                      style={{ borderColor: colors.border, boxShadow: `0 0 18px ${colors.glow}` }}>
                      <span className="font-extrabold text-[15px] leading-none" style={{ color: colors.text }}>{scene.viralityScore ?? scene.engagementScore}</span>
                      <span className="text-[9px] font-bold tracking-wider mt-0.5 text-purple-600 dark:text-[#a855f7]">VIRAL</span>
                    </div>

                    {/* Scene card */}
                    <div className="flex-1 bg-white dark:bg-[#0F0A23]/60 border border-slate-200 dark:border-purple-500/15 rounded-[14px] p-4 sm:p-5 shadow-sm dark:shadow-none">

                      {/* Top row */}
                      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                        <span className="font-bold text-[14px] text-slate-800 dark:text-[#c4b5fd]">
                          {scene.timestamp}
                        </span>
                        <span className="font-bold text-[11.5px] rounded-full px-3 py-1 tracking-wider uppercase border"
                          style={{ background: pillSt.bg, borderColor: pillSt.border, color: pillSt.color }}>
                          {scene.recommendation}
                        </span>
                        <div className="ml-auto flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span className="text-slate-500 dark:text-[#94a3b8] text-[11.5px] font-medium">Private · Secure</span>
                        </div>
                      </div>

                      {/* What Nova actually saw in this scene (real frame analysis) */}
                      {scene.sceneContent && (
                        <div className="flex items-start gap-2.5 bg-white dark:bg-[#38bdf8]/[0.06] border border-gray-200 dark:border-[#38bdf8]/15 rounded-lg py-2 px-3 mb-2.5">
                          <span className="text-[14px] shrink-0">👥</span>
                          <span className="text-[13px] text-slate-700 dark:text-[#7dd3fc] leading-snug font-medium">
                            {scene.sceneContent}
                          </span>
                        </div>
                      )}

                      {/* Audio content — what was actually said in this scene */}
                      {scene.audioContent && scene.audioContent !== '[No audio transcript for this scene]' && (
                        <div className="flex items-start gap-2.5 bg-white dark:bg-[#a855f7]/[0.07] border border-gray-200 dark:border-[#a855f7]/20 rounded-lg py-2 px-3 mb-2.5">
                          <span className="text-[14px] shrink-0">🎤</span>
                          <div>
                            <div className="text-[10px] text-slate-500 dark:text-[#a78bfa] font-bold tracking-wider uppercase mb-1">Spoken Audio</div>
                            <span className="text-[13px] text-slate-600 dark:text-[#e9d5ff] leading-relaxed italic font-medium">
                              "{scene.audioContent}"
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Audience review quote */}
                      {scene.audienceReview && (
                        <div className="text-[13.5px] italic text-slate-700 dark:text-[#c4b5fd] bg-white dark:bg-purple-500/[0.07] border border-gray-200 dark:border-purple-500/15 rounded-lg py-2.5 px-3.5 mb-3 leading-relaxed font-medium">
                          "{scene.audienceReview}"
                        </div>
                      )}

                      {/* Why it worked / failed */}
                      {scene.whyItWorked && (
                        <div className="flex gap-2 mb-2 items-start">
                          <span className="text-[13px] text-[#22c55e] shrink-0 font-bold">✓</span>
                          <span className="text-[13px] text-[#166534] dark:text-[#86efac] leading-snug font-medium">{scene.whyItWorked}</span>
                        </div>
                      )}
                      {scene.whyItFailed && (
                        <div className="flex gap-2 mb-2 items-start">
                          <span className="text-[13px] text-[#ef4444] shrink-0 font-bold">✗</span>
                          <span className="text-[13px] text-[#991b1b] dark:text-[#fca5a5] leading-snug font-medium">{scene.whyItFailed}</span>
                        </div>
                      )}

                      {/* Signal mini-bars */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '12px 0 4px' }}>
                        <SignalBar label="Delivery" value={scene.deliveryQuality} icon={Mic} color="#38bdf8" />
                        <SignalBar label="Visual" value={scene.visualVariation} icon={Eye} color="#a78bfa" />
                        <SignalBar label="Semantic" value={scene.semanticInterest} icon={Zap} color="#34d399" />
                      </div>

                      {/* Reshoot guide */}
                      <ReshootGuide guide={scene.reshootGuide} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}