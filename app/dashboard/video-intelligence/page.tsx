'use client'

import { motion } from 'framer-motion'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { Eye, Zap, TrendingUp, Clock } from 'lucide-react'

const STATS = [
  { label: 'Frames Analyzed',    value: '2.4M',  color: '#38BDF8' },
  { label: 'Scenes Detected',    value: '18,392',color: '#8B5CF6' },
  { label: 'Highlight Reels',    value: '284',   color: '#10b981' },
  { label: 'Avg. Analysis Time', value: '3.1s',  color: '#f59e0b' },
]

const FEATURES = [
  { icon: Eye,         title: 'Frame-by-Frame Analysis',  desc: 'ML models scan every frame for objects, faces, and emotional arcs in real-time.' },
  { icon: Zap,         title: 'Auto Highlight Reel',      desc: 'Top-scoring moments are auto-compiled into a shareable reel.' },
  { icon: TrendingUp,  title: 'Engagement Scoring',       desc: 'Each scene is scored by predicted viewer retention and emotional impact.' },
  { icon: Clock,       title: 'Scene Segmentation',       desc: 'Smart boundaries split your video into logical chapters automatically.' },
]

export default function VideoIntelligencePage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(56,189,248,0.12)',border:'1px solid rgba(56,189,248,0.25)'}}>
            <SparklesIcon style={{width:22,height:22,color:'#38BDF8'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Video Intelligence</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>Deep AI analysis of every frame, scene, and moment</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.08}}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Upload CTA */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.14}}
        className="glass-card p-8 flex flex-col items-center justify-center text-center"
        style={{minHeight:200, borderStyle:'dashed', borderColor:'rgba(56,189,248,0.3)'}}>
        <SparklesIcon style={{width:40,height:40,color:'rgba(56,189,248,0.5)',marginBottom:16}} />
        <h3 className="text-lg font-semibold mb-2">Upload a video to analyze</h3>
        <p className="text-sm mb-6" style={{color:'#A1A1AA',maxWidth:400}}>
          Drop your raw footage here. Our AI will scan every frame in seconds.
        </p>
        <button className="glow-btn px-8 py-3 text-white text-sm font-semibold">Start Analysis</button>
      </motion.div>

      {/* Features */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.2}}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {FEATURES.map(f => (
          <div key={f.title} className="glass-card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background:'rgba(56,189,248,0.10)',border:'1px solid rgba(56,189,248,0.2)'}}>
              <f.icon size={20} style={{color:'#38BDF8'}} />
            </div>
            <div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm" style={{color:'#A1A1AA',lineHeight:1.6}}>{f.desc}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
