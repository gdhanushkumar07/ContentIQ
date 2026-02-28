'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { Sparkles, Copy, Check } from 'lucide-react'

const PLATFORMS = ['YouTube', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'Facebook']
const TONES = ['Professional', 'Casual', 'Humorous', 'Inspirational', 'Educational']

export default function ScriptGeneratorPage() {
  const [platform, setPlatform] = useState('YouTube')
  const [tone, setTone]         = useState('Professional')
  const [topic, setTopic]       = useState('')
  const [script, setScript]     = useState('')
  const [copied, setCopied]     = useState(false)
  const [loading, setLoading]   = useState(false)

  function generate() {
    if (!topic) return
    setLoading(true)
    setTimeout(() => {
      setScript(`🎬 [HOOK – first 3 seconds]
"Did you know ${topic} could change everything? Here's what no one tells you..."

📖 [INTRO – 15s]
Welcome back. Today we're diving deep into ${topic} — and I promise this is going to be different from everything you've seen before.

💡 [MAIN CONTENT – 60–90s]
Point 1: The most overlooked aspect of ${topic} is...
Point 2: What really separates top creators when it comes to ${topic}...
Point 3: The exact framework that's working right now...

📣 [CALL TO ACTION]
If you found value, smash that like button and subscribe — we drop new content every week.
Drop a comment: What's your biggest challenge with ${topic}?

#${topic.replace(/\s+/g,'').toLowerCase()} #contentcreator #${platform.toLowerCase()}`)
      setLoading(false)
    }, 1400)
  }

  function copyScript() {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(139,92,246,0.12)',border:'1px solid rgba(139,92,246,0.25)'}}>
            <DocumentTextIcon style={{width:22,height:22,color:'#8B5CF6'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Script Generator</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>AI-written hooks, scripts, and CTAs tuned to your platform</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.08}}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-widest" style={{color:'#A1A1AA'}}>Configure</h2>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'#A1A1AA'}}>Topic / Hook</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none"
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)'}}
              placeholder="e.g. AI tools for creators" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'#A1A1AA'}}>Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p=>(
                <button key={p} onClick={()=>setPlatform(p)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: platform===p ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${platform===p ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    color: platform===p ? '#8B5CF6' : 'rgba(255,255,255,0.6)',
                  }}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{color:'#A1A1AA'}}>Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t=>(
                <button key={t} onClick={()=>setTone(t)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: tone===t ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${tone===t ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: tone===t ? '#38BDF8' : 'rgba(255,255,255,0.6)',
                  }}>{t}</button>
              ))}
            </div>
          </div>

          <motion.button onClick={generate} disabled={!topic||loading}
            whileHover={{scale:1.02}} whileTap={{scale:0.98}}
            className="glow-btn w-full py-3 text-white text-sm font-semibold flex items-center justify-center gap-2">
            {loading ? (
              <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/>
            ) : <><Sparkles size={16}/> Generate Script</>}
          </motion.button>
        </div>

        {/* Output */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm uppercase tracking-widest" style={{color:'#A1A1AA'}}>Output</h2>
            {script && (
              <motion.button onClick={copyScript} whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium btn-secondary text-white">
                {copied ? <><Check size={13}/> Copied!</> : <><Copy size={13}/> Copy</>}
              </motion.button>
            )}
          </div>
          {script ? (
            <pre className="text-sm flex-1 overflow-auto whitespace-pre-wrap leading-7"
              style={{color:'rgba(255,255,255,0.85)',fontFamily:'inherit'}}>{script}</pre>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{color:'rgba(255,255,255,0.2)'}}>
              <DocumentTextIcon style={{width:40,height:40,marginBottom:12,opacity:0.3}}/>
              <p className="text-sm">Your generated script will appear here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
