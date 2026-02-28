'use client'

import { motion } from 'framer-motion'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { CheckCircle, Clock, Languages } from 'lucide-react'

const LANGUAGES = ['Hindi','Tamil','Telugu','Bengali','Marathi','Gujarati','Kannada','Malayalam','Punjabi','Odia','Spanish','French','Arabic','Mandarin','Portuguese','Japanese']

const JOBS = [
  { name:'startup-pitch.mp4',    langs:['Hindi','Tamil','Spanish'], status:'Done',       pct:100 },
  { name:'product-demo-v3.mp4',  langs:['Bengali','Arabic'],        status:'Processing', pct:67  },
  { name:'vlog-ep12.mp4',        langs:['French','Japanese'],       status:'Queued',     pct:0   },
]

export default function MultilingualDubbingPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(168,85,247,0.12)',border:'1px solid rgba(168,85,247,0.25)'}}>
            <GlobeAltIcon style={{width:22,height:22,color:'#a855f7'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Multilingual Dubbing</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>Auto-dub and subtitle your content in 50+ languages</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:'Languages Supported',value:'50+',color:'#a855f7'},{label:'Videos Dubbed',value:'892',color:'#38BDF8'},{label:'Avg. Dub Time',value:'2.4 min',color:'#f59e0b'},{label:'Accuracy Score',value:'96.2%',color:'#10b981'}].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.06}} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.12}} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2" style={{color:'white'}}><GlobeAltIcon style={{width:16,height:16,color:'#a855f7'}}/>Available Languages</h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l=>(
              <span key={l} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{background:'rgba(168,85,247,0.10)',border:'1px solid rgba(168,85,247,0.2)',color:'rgba(255,255,255,0.7)'}}>
                {l}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.18}} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Clock size={16} style={{color:'#a855f7'}}/>Dubbing Queue</h2>
          <div className="space-y-4">
            {JOBS.map(j=>(
              <div key={j.name} className="p-4 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{j.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={j.status==='Done'?{background:'rgba(16,185,129,0.12)',color:'#34d399'}
                      :j.status==='Processing'?{background:'rgba(56,189,248,0.12)',color:'#38BDF8'}
                      :{background:'rgba(255,255,255,0.06)',color:'#A1A1AA'}}>
                    {j.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {j.langs.map(l=><span key={l} className="text-xs" style={{color:'#a855f7'}}>{l}</span>)}
                </div>
                <div className="h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.08)'}}>
                  <div className="h-full rounded-full transition-all" style={{width:`${j.pct}%`,background:'linear-gradient(90deg,#a855f7,#38BDF8)'}}/>
                </div>
              </div>
            ))}
          </div>
          <button className="glow-btn w-full mt-4 py-3 text-white text-sm font-semibold">Add to Queue</button>
        </motion.div>
      </div>
    </div>
  )
}
