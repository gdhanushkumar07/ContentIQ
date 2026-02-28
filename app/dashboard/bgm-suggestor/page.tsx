'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import { Play, Heart, Plus } from 'lucide-react'

const SUGGESTIONS = [
  { title:'Epic Sunrise',      genre:'Cinematic',    bpm:78,  mood:'Uplifting',    match:'97%',  duration:'3:12' },
  { title:'Future Pulse',      genre:'Electronic',   bpm:128, mood:'Energetic',    match:'94%',  duration:'2:48' },
  { title:'Soft Horizon',      genre:'Lo-Fi',        bpm:72,  mood:'Calm',         match:'91%',  duration:'4:05' },
  { title:'Urban Drive',       genre:'Hip-Hop',      bpm:95,  mood:'Confident',    match:'88%',  duration:'2:30' },
  { title:'Deep Discovery',    genre:'Ambient',      bpm:60,  mood:'Thoughtful',   match:'85%',  duration:'5:20' },
]

const MOODS = ['All','Uplifting','Energetic','Calm','Confident','Thoughtful','Dramatic']

export default function BGMSuggestorPage() {
  const [playing, setPlaying]   = useState<string|null>(null)
  const [liked, setLiked]       = useState<Set<string>>(new Set())
  const [mood, setMood]         = useState('All')

  const filtered = mood==='All' ? SUGGESTIONS : SUGGESTIONS.filter(s=>s.mood===mood)

  return (
    <div className="space-y-8 max-w-5xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(236,72,153,0.12)',border:'1px solid rgba(236,72,153,0.25)'}}>
            <MusicalNoteIcon style={{width:22,height:22,color:'#ec4899'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BGM Suggestor</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>AI-matched background music for your content mood</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:'Tracks Available',value:'12,400+',color:'#ec4899'},{label:'Suggested This Month',value:'284',color:'#8B5CF6'},{label:'Avg. Match Score',value:'93%',color:'#10b981'},{label:'Royalty-Free',value:'100%',color:'#38BDF8'}].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.06}} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Mood filter */}
      <div className="flex flex-wrap gap-2">
        {MOODS.map(m=>(
          <button key={m} onClick={()=>setMood(m)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={mood===m?{background:'rgba(236,72,153,0.15)',color:'#ec4899',border:'1px solid rgba(236,72,153,0.35)'}:{background:'rgba(255,255,255,0.05)',color:'rgba(255,255,255,0.5)',border:'1px solid rgba(255,255,255,0.1)'}}>
            {m}
          </button>
        ))}
      </div>

      {/* Track list */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.1}} className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold flex items-center gap-2"><MusicalNoteIcon style={{width:16,height:16,color:'#ec4899'}}/>AI Suggestions</h2>
        </div>
        {filtered.map((track,i)=>(
          <div key={track.title} className="flex items-center gap-4 px-6 py-4 transition-colors group"
            style={{borderBottom:i<filtered.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}
            onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.02)'}
            onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>

            {/* Play button */}
            <motion.button whileHover={{scale:1.1}} whileTap={{scale:0.9}}
              onClick={()=>setPlaying(playing===track.title?null:track.title)}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{background:playing===track.title?'rgba(236,72,153,0.25)':'rgba(255,255,255,0.07)',border:`1px solid ${playing===track.title?'rgba(236,72,153,0.5)':'rgba(255,255,255,0.1)'}`}}>
              {playing===track.title ? (
                <div className="flex gap-0.5 items-center">
                  {[0,1,2].map(b=>(
                    <motion.div key={b} animate={{scaleY:[1,2,1]}} transition={{duration:0.5,repeat:Infinity,delay:b*0.15}}
                      className="w-0.5 h-3 rounded-full origin-bottom" style={{background:'#ec4899'}} />
                  ))}
                </div>
              ) : <Play size={14} style={{color:'rgba(255,255,255,0.7)',marginLeft:2}} />}
            </motion.button>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{track.title}</div>
              <div className="text-xs mt-0.5 flex gap-3" style={{color:'#A1A1AA'}}>
                <span>{track.genre}</span><span>{track.bpm} BPM</span><span>{track.duration}</span>
              </div>
            </div>

            {/* Mood */}
            <span className="text-xs px-2.5 py-1 rounded-full hidden sm:inline-flex"
              style={{background:'rgba(236,72,153,0.10)',color:'#ec4899',border:'1px solid rgba(236,72,153,0.2)'}}>
              {track.mood}
            </span>

            {/* Match */}
            <span className="text-sm font-bold" style={{color:'#10b981',minWidth:40,textAlign:'right'}}>{track.match}</span>

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button whileHover={{scale:1.1}} onClick={()=>setLiked(s=>{const n=new Set(s);n.has(track.title)?n.delete(track.title):n.add(track.title);return n})}
                className="p-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)'}}>
                <Heart size={14} style={{color:liked.has(track.title)?'#ec4899':'rgba(255,255,255,0.4)',fill:liked.has(track.title)?'#ec4899':'none'}} />
              </motion.button>
              <motion.button whileHover={{scale:1.1}} className="p-2 rounded-lg" style={{background:'rgba(255,255,255,0.05)'}}>
                <Plus size={14} style={{color:'rgba(255,255,255,0.4)'}} />
              </motion.button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
