'use client'

import { motion } from 'framer-motion'
import { MicrophoneIcon } from '@heroicons/react/24/outline'
import { Activity, TrendingUp, Clock, AlertCircle } from 'lucide-react'

const SAMPLES = [
  { creator:'@devdhanush',   score:94, emotion:'Motivational', clarity:'High', trend:'+12%' },
  { creator:'@ai_creators',  score:87, emotion:'Educational',  clarity:'High', trend:'+8%'  },
  { creator:'@contentlab',   score:71, emotion:'Casual',       clarity:'Med',  trend:'-2%'  },
]

export default function VoiceTrackerPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(244,63,94,0.12)',border:'1px solid rgba(244,63,94,0.25)'}}>
            <MicrophoneIcon style={{width:22,height:22,color:'#f43f5e'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Voice Tracker</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>Preserve your authentic creator voice with emotion-aware AI</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:'Voice Score',value:'94/100',color:'#f43f5e'},{label:'Authenticity Index',value:'98%',color:'#10b981'},{label:'Tone Consistency',value:'91%',color:'#38BDF8'},{label:'Videos Analyzed',value:'347',color:'#8B5CF6'}].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.06}} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Voice waveform visual */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.12}} className="glass-card p-8">
        <h2 className="font-semibold mb-6 flex items-center gap-2"><Activity size={16} style={{color:'#f43f5e'}}/>Live Voice Analysis</h2>
        <div className="flex items-center justify-center gap-1 h-20">
          {Array.from({length:60},(_,i)=>(
            <motion.div key={i}
              animate={{scaleY:[0.2, Math.random()*0.8+0.2, 0.2]}}
              transition={{duration:0.8+Math.random()*0.8, repeat:Infinity, delay:i*0.03, ease:'easeInOut'}}
              style={{
                width:4, borderRadius:2,
                background:`linear-gradient(to top, #f43f5e, #8B5CF6)`,
                opacity: 0.6+Math.random()*0.4,
              }}
              className="h-full origin-bottom"
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs" style={{color:'#A1A1AA'}}>
          <span>Detected Tone: <strong className="text-white">Motivational</strong></span>
          <span>Clarity: <strong style={{color:'#10b981'}}>High</strong></span>
          <span>Energy: <strong style={{color:'#f59e0b'}}>94/100</strong></span>
        </div>
      </motion.div>

      {/* Comparison table */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.18}} className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold flex items-center gap-2"><TrendingUp size={16} style={{color:'#f43f5e'}}/>Creator Voice Benchmarks</h2>
        </div>
        {SAMPLES.map((r,i)=>(
          <div key={r.creator} className="flex items-center justify-between px-6 py-4" style={{borderBottom:i<SAMPLES.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold" style={{background:'rgba(244,63,94,0.15)',color:'#f43f5e'}}>{r.score}</div>
              <div>
                <div className="text-sm font-medium">{r.creator}</div>
                <div className="text-xs mt-0.5" style={{color:'#A1A1AA'}}>{r.emotion} · Clarity: {r.clarity}</div>
              </div>
            </div>
            <span className="text-xs font-semibold" style={{color:r.trend.startsWith('+')?'#34d399':'#f87171'}}>{r.trend}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
