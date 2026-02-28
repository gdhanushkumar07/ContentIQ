'use client'

import { motion } from 'framer-motion'
import { ShareIcon } from '@heroicons/react/24/outline'
import { CheckCircle, Globe, TrendingUp, Clock } from 'lucide-react'

const PLATFORMS = [
  { name:'YouTube',   color:'#f43f5e', reach:'2.1B users',  status:'Connected' },
  { name:'Instagram', color:'#a855f7', reach:'1.4B users',  status:'Connected' },
  { name:'TikTok',    color:'#06b6d4', reach:'1.0B users',  status:'Connected' },
  { name:'LinkedIn',  color:'#38BDF8', reach:'900M users',  status:'Connected' },
  { name:'Twitter/X', color:'#A1A1AA', reach:'350M users',  status:'Connect'   },
  { name:'Facebook',  color:'#3b82f6', reach:'2.9B users',  status:'Connect'   },
]

const RECENT = [
  { title:'Behind the Scenes Edit',     platforms:6, views:'48.2K', time:'2h ago' },
  { title:'Product Launch Highlight',   platforms:4, views:'112K',  time:'Yesterday' },
  { title:'Team Culture Reel',          platforms:5, views:'29.7K', time:'3d ago' },
]

export default function DistributionPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(16,185,129,0.12)',border:'1px solid rgba(16,185,129,0.25)'}}>
            <ShareIcon style={{width:22,height:22,color:'#10b981'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Distribution</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>Publish to 40+ platforms simultaneously with one click</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:'Platforms Connected',value:'4',color:'#10b981'},{label:'Posts This Week',value:'12',color:'#38BDF8'},{label:'Total Reach',value:'5.2M',color:'#8B5CF6'},{label:'Avg. Post Time',value:'1.2s',color:'#f59e0b'}].map(s=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.06}} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform grid */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.12}} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Globe size={16} style={{color:'#10b981'}}/>Connected Platforms</h2>
          <div className="space-y-3">
            {PLATFORMS.map(p=>(
              <div key={p.name} className="flex items-center justify-between py-2 px-3 rounded-xl" style={{background:'rgba(255,255,255,0.03)'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{background:`${p.color}20`,color:p.color}}>{p.name[0]}</div>
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs" style={{color:'#A1A1AA'}}>{p.reach}</div>
                  </div>
                </div>
                <button className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all`}
                  style={p.status==='Connected'
                    ? {background:'rgba(16,185,129,0.12)',color:'#34d399',border:'1px solid rgba(16,185,129,0.25)'}
                    : {background:'rgba(139,92,246,0.12)',color:'#8B5CF6',border:'1px solid rgba(139,92,246,0.25)'}}>
                  {p.status==='Connected'? <span className="flex items-center gap-1"><CheckCircle size={12}/>Connected</span> : '+ Connect'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent publishes */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.18}} className="glass-card p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp size={16} style={{color:'#38BDF8'}}/>Recent Publishes</h2>
          <div className="space-y-4">
            {RECENT.map(r=>(
              <div key={r.title} className="p-4 rounded-xl" style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="font-medium text-sm mb-2">{r.title}</div>
                <div className="flex items-center gap-4 text-xs" style={{color:'#A1A1AA'}}>
                  <span className="flex items-center gap-1"><ShareIcon style={{width:12,height:12}}/>{r.platforms} platforms</span>
                  <span className="flex items-center gap-1"><TrendingUp size={12}/>{r.views} views</span>
                  <span className="flex items-center gap-1"><Clock size={12}/>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="glow-btn w-full mt-4 py-3 text-white text-sm font-semibold">Publish New Content</button>
        </motion.div>
      </div>
    </div>
  )
}
