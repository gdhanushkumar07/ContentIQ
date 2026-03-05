'use client'

import { SparklesIcon } from '@heroicons/react/24/outline'
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
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'spin 2.5s linear infinite',
          }}>
            <SparklesIcon style={{ width: 28, height: 28, color: '#a78bfa' }} />
          </div>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Analyzing your video</h2>
        <p style={{ color: '#64748b', fontSize: 13 }}>Running through parallel intelligence stages — this takes ~30s</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STAGES.map(s => {
          const done = s.id < currentStage
          const active = s.id === currentStage
          const pending = s.id > currentStage

          if (s.isParallel) {
            return (
              <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {s.tasks.map((task: any, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 14px', borderRadius: 12,
                    background: active ? 'rgba(56,189,248,0.12)' : done ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
                    border: active ? '1px solid rgba(56,189,248,0.4)' : done ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s ease',
                    opacity: pending ? 0.4 : 1,
                  }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      background: done ? '#22c55e' : active ? '#38bdf8' : 'rgba(255,255,255,0.06)',
                      color: done || active ? '#fff' : '#64748b',
                      boxShadow: active ? '0 0 12px rgba(56,189,248,0.5)' : 'none',
                      marginTop: 2
                    }}>
                      {done ? '✓' : `${s.id}${idx === 0 ? 'A' : 'B'}`}
                    </div>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? '#7dd3fc' : done ? '#4ade80' : '#e2e8f0', marginBottom: 2 }}>
                        {task.label}
                      </div>
                      <div style={{ fontSize: 11, color: active ? '#bae6fd' : '#475569', lineHeight: 1.3 }}>{task.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            )
          }

          return (
            <div key={s.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 16px', borderRadius: 12,
              background: active ? 'rgba(139,92,246,0.12)' :
                done ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
              border: active ? '1px solid rgba(139,92,246,0.4)' :
                done ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.3s ease',
              opacity: pending ? 0.4 : 1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700,
                background: done ? '#22c55e' : active ? '#8b5cf6' : 'rgba(255,255,255,0.06)',
                color: done || active ? '#fff' : '#64748b',
                boxShadow: active ? '0 0 12px rgba(139,92,246,0.6)' : 'none',
              }}>
                {done ? '✓' : s.id}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#c4b5fd' : done ? '#4ade80' : '#e2e8f0' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 11.5, color: '#475569' }}>{s.sub}</div>
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
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)' }}>
            <SparklesIcon style={{ width: 22, height: 22, color: '#38BDF8' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Video Intelligence</h1>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>
              Pre-posting private evaluation — 10-stage AWS-native analysis
            </p>
          </div>
        </div>

        {/* Upload box */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center"
          style={{ minHeight: 220, borderStyle: 'dashed', borderColor: 'rgba(139,92,246,0.35)' }}>
          <SparklesIcon style={{ width: 40, height: 40, color: 'rgba(139,92,246,0.6)', marginBottom: 16 }} />
          <h3 className="text-lg font-semibold mb-2">Upload your video for private evaluation</h3>
          <p className="text-sm mb-2" style={{ color: '#A1A1AA', maxWidth: 440 }}>
            Your video stays private — never indexed, never shared. The AI simulates how a real audience
            would react, then gives you exact reshoot instructions per scene.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 24 }}>
            {['🔒 Private & encrypted', '🎬 10-stage pipeline', '📊 Per-scene scoring', '🎯 Reshoot direction'].map(t => (
              <span key={t} style={{
                fontSize: 12, color: '#94a3b8', background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: '4px 12px'
              }}>{t}</span>
            ))}
          </div>

          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>Select Category:</label>
            <select
              value={category}
              onChange={(e) => videoIntelligenceStore.setState({ category: e.target.value })}
              style={{
                background: 'rgba(15,10,35,0.8)', color: '#e2e8f0', border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: 8, padding: '8px 16px', fontSize: 14, outline: 'none', cursor: 'pointer'
              }}
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
          <button onClick={() => fileInputRef.current?.click()} className="glow-btn px-8 py-3 text-white text-sm font-semibold">
            Start Private Analysis
          </button>
          {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 16 }}>{error}</p>}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <f.icon size={20} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm" style={{ color: '#A1A1AA', lineHeight: 1.6 }}>{f.desc}</p>
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
    <div style={{ maxWidth: 1100, color: '#e2e8f0', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Header bar ──────────────────────────────────────────────────────── */}
      <div style={{
        background: glassBg, border: glassBorder, borderRadius: 20,
        padding: '18px 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 24,
        backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <SparklesIcon style={{ width: 18, height: 18, color: '#a78bfa' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Intelligence Report</div>
            <div style={{ color: '#a78bfa', fontSize: 12, marginTop: 2 }}>
              {result.totalScenes} scenes · {videoMeta.estimatedDuration} · {videoMeta.fileSizeMB} MB
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>High Scenes</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#4ade80' }}>{highEngagementCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Low Scenes</div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#f87171' }}>{lowEngagementCount}</div>
          </div>
          <button
            onClick={reset}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 12,
              background: 'transparent', border: '1px solid rgba(139,92,246,0.45)',
              color: '#c4b5fd', fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,92,246,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <RefreshCcw size={13} /> New Analysis
          </button>
        </div>
      </div>

      {/* ── Bento row: signal overview ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px 1fr', gap: 18, marginBottom: 24 }}>

        {/* Low engagement zones */}
        <div style={{ background: glassBg, border: glassBorder, borderRadius: 20, padding: 20, backdropFilter: 'blur(16px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.7)' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Recommended Deletions</span>
          </div>
          {lowScenes.length === 0 ? (
            <div style={{
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#4ade80', fontStyle: 'italic'
            }}>
              No critical drop-off zones detected 🎉
            </div>
          ) : (
            lowScenes.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(239,68,68,0.09)', border: '1px solid rgba(239,68,68,0.22)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13, color: '#fca5a5'
              }}>
                <strong>{s.timestamp}</strong> — {s.whyItFailed ?? 'Low engagement zone'}
              </div>
            ))
          )}

          <div style={{ height: 1, background: 'rgba(139,92,246,0.12)', margin: '16px 0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.7)' }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Improvement Actions</span>
          </div>
          {improvementTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.55 }}>{tip}</span>
            </div>
          ))}
        </div>

        {/* Avg score ring */}
        <div style={{
          background: glassBg, border: glassBorder, borderRadius: 20, padding: 20,
          backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16
        }}>
          <CircularProgress score={avgEngagementScore} size={140} />
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#94a3b8', marginBottom: 6
            }}>AVG ENGAGEMENT</div>
            <div style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.6 }}>
              Across all {result.totalScenes} scenes
            </div>
          </div>
        </div>

        {/* Signal breakdown */}
        <div style={{
          background: glassBg, border: glassBorder, borderRadius: 20, padding: 20,
          backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: 0
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Signal Breakdown (avg)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(() => {
              const avgDel = Math.round(scenes.reduce((a, s) => a + s.deliveryQuality, 0) / scenes.length)
              const avgVis = Math.round(scenes.reduce((a, s) => a + s.visualVariation, 0) / scenes.length)
              const avgSem = Math.round(scenes.reduce((a, s) => a + s.semanticInterest, 0) / scenes.length)
              return (
                <>
                  <SignalBar label="Speech & Delivery" value={avgDel} icon={Mic} color="#38bdf8" />
                  <SignalBar label="Visual Variation" value={avgVis} icon={Eye} color="#a78bfa" />
                  <SignalBar label="Semantic Interest" value={avgSem} icon={Brain} color="#34d399" />
                  <SignalBar label="Overall Score" value={avgEngagementScore} icon={BarChart2} color="#f59e0b" />
                </>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── 15-Point Video Intelligence Report ───────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Brain size={18} style={{ color: '#a78bfa' }} />
          <h2 style={{ fontWeight: 700, fontSize: 17 }}>Comprehensive Intelligence Report</h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16
        }}>
          {[
            { label: 'Category Suitability', value: result.categorySuitabilityScore, icon: Target, c: '#a78bfa' },
            { label: 'Hook Strength', value: result.hookStrength, icon: Zap, c: '#f59e0b' },
            { label: 'Content Value', value: result.contentValue, icon: Brain, c: '#34d399' },
            { label: 'Information Density', value: result.informationDensity, icon: BarChart2, c: '#38bdf8' },
            { label: 'Delivery Strength', value: result.deliveryStrength, icon: Mic, c: '#a78bfa' },
            { label: 'Visual Quality', value: result.visualQuality, icon: Eye, c: '#22c55e' },
            { label: 'Editing Quality', value: result.editingQuality, icon: Clock, c: '#f472b6' },
            { label: 'Emotional Impact', value: result.emotionalImpact, icon: TrendingUp, c: '#ef4444' },
            { label: 'Competitor Benchmark', value: result.competitorBenchmark, icon: Target, c: '#fbbf24' },
            { label: 'Content Uniqueness', value: result.contentUniqueness, icon: SparklesIcon, c: '#c084fc' },
            { label: 'Safety Confidence', value: result.safetyScore, icon: Shield, c: '#10b981' }
          ].map(m => (
            <div key={m.label} style={{
              background: glassBg, border: glassBorder, borderRadius: 16, padding: 18,
              backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', gap: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <m.icon size={16} style={{ color: m.c ?? '#fff' }} />
                <span style={{ fontWeight: 800, fontSize: 18, color: m.c }}>{m.value}%</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{m.label}</div>
              <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${m.value}%`, background: m.c, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Virality Prediction Banner */}
        <div style={{
          marginTop: 16, background: 'linear-gradient(90deg, rgba(139,92,246,0.15), rgba(56,189,248,0.15))',
          border: '1px solid rgba(139,92,246,0.4)', borderRadius: 16, padding: '24px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <div style={{ fontSize: 13, color: '#c4b5fd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Final Viral Prediction
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>
              {result.viralityPrediction}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Virality Score
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>
              {result.viralityScore}<span style={{ fontSize: 18, color: '#94a3b8' }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scene-by-Scene Timeline ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Target size={18} style={{ color: '#a78bfa' }} />
          <h2 style={{ fontWeight: 700, fontSize: 17 }}>Scene-by-Scene Intelligence Timeline</h2>
        </div>

        <div style={{
          background: glassBg, border: glassBorder, borderRadius: 20, padding: '28px 28px',
          backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <div style={{ position: 'relative' }}>
            {/* Glow spine */}
            <div style={{
              position: 'absolute', left: 24, top: 24, bottom: 24, width: 2,
              background: 'linear-gradient(to bottom, rgba(139,92,246,0.6), rgba(56,189,248,0.15))',
              boxShadow: '0 0 8px rgba(139,92,246,0.4)'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {scenes.map((scene, idx) => {
                const colors = getScoreColor(scene.viralityScore ?? scene.engagementScore)
                const pillSt = getPillStyle(scene.recommendation)
                const catStyle = getCategoryStyle(scene.category)
                return (
                  <div key={idx} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    {/* Virality score badge */}
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(0,0,0,0.5)',
                      border: `2px solid ${colors.border}`,
                      boxShadow: `0 0 18px ${colors.glow}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column', position: 'relative', zIndex: 1
                    }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: colors.text, lineHeight: 1 }}>{scene.viralityScore ?? scene.engagementScore}</span>
                      <span style={{ fontSize: 8, color: '#7c3aed', fontWeight: 600, letterSpacing: '0.04em', marginTop: 2 }}>VIRAL</span>
                    </div>

                    {/* Scene card */}
                    <div style={{
                      flex: 1, background: 'rgba(15,10,35,0.6)',
                      border: '1px solid rgba(139,92,246,0.15)', borderRadius: 14, padding: '16px 20px'
                    }}>

                      {/* Top row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                        <span style={{
                          fontWeight: 700, fontSize: 14, background: 'rgba(139,92,246,0.2)',
                          border: '1px solid rgba(139,92,246,0.3)', borderRadius: 8, padding: '4px 12px',
                          color: '#c4b5fd'
                        }}>{scene.timestamp}</span>
                        <span style={{
                          fontWeight: 700, fontSize: 12, background: pillSt.bg, border: pillSt.border,
                          borderRadius: 20, padding: '4px 14px', color: pillSt.color,
                          letterSpacing: '0.05em', textTransform: 'uppercase' as const
                        }}>{scene.recommendation}</span>
                        <span style={{
                          fontWeight: 700, fontSize: 11.5, background: catStyle.bg, border: catStyle.border,
                          borderRadius: 20, padding: '3px 12px', color: catStyle.color,
                          letterSpacing: '0.05em'
                        }}>{scene.category}</span>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Shield size={12} style={{ color: '#22c55e' }} />
                          <span style={{ color: '#94a3b8', fontSize: 11.5 }}>Private · Secure</span>
                        </div>
                      </div>

                      {/* What Nova actually saw in this scene (real frame analysis) */}
                      {scene.sceneContent && (
                        <div style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
                          borderRadius: 8, padding: '7px 12px', marginBottom: 8,
                        }}>
                          <span style={{ fontSize: 13, flexShrink: 0 }}>🎥</span>
                          <span style={{ fontSize: 12.5, color: '#7dd3fc', lineHeight: 1.5 }}>
                            {scene.sceneContent}
                          </span>
                        </div>
                      )}

                      {/* Audio content — what was actually said in this scene */}
                      {scene.audioContent && scene.audioContent !== '[No audio transcript for this scene]' && (
                        <div style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)',
                          borderRadius: 8, padding: '7px 12px', marginBottom: 8,
                        }}>
                          <span style={{ fontSize: 13, flexShrink: 0 }}>🎤</span>
                          <div>
                            <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>Spoken Audio</div>
                            <span style={{ fontSize: 12.5, color: '#e9d5ff', lineHeight: 1.6, fontStyle: 'italic' }}>
                              &ldquo;{scene.audioContent}&rdquo;
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Audience review quote */}
                      {scene.audienceReview && (
                        <div style={{
                          fontSize: 13.5, color: '#c4b5fd', fontStyle: 'italic',
                          background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)',
                          borderRadius: 8, padding: '8px 12px', marginBottom: 10, lineHeight: 1.6
                        }}>
                          "{scene.audienceReview}"
                        </div>
                      )}

                      {/* Why it worked / failed */}
                      {scene.whyItWorked && (
                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: '#4ade80', flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 13, color: '#86efac', lineHeight: 1.5 }}>{scene.whyItWorked}</span>
                        </div>
                      )}
                      {scene.whyItFailed && (
                        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: '#f87171', flexShrink: 0 }}>✗</span>
                          <span style={{ fontSize: 13, color: '#fca5a5', lineHeight: 1.5 }}>{scene.whyItFailed}</span>
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