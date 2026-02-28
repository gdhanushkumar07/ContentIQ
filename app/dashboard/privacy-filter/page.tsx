'use client'

import { motion } from 'framer-motion'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { CheckCircle, AlertCircle, Eye } from 'lucide-react'

const LOG = [
  { file:'vlog-ep12.mp4',      faces:3, pii:0,  status:'Passed',  time:'5 min ago' },
  { file:'team-offsite.mp4',   faces:7, pii:2,  status:'Redacted',time:'1 hr ago'  },
  { file:'product-demo-v3.mp4',faces:1, pii:0,  status:'Passed',  time:'3 hr ago'  },
  { file:'interview-raw.mp4',  faces:2, pii:5,  status:'Redacted',time:'Yesterday' },
]

export default function PrivacyFilterPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(245,158,11,0.12)',border:'1px solid rgba(245,158,11,0.25)'}}>
            <ShieldCheckIcon style={{width:22,height:22,color:'#f59e0b'}} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Privacy Filter</h1>
            <p className="text-sm" style={{color:'#A1A1AA'}}>GDPR-compliant AI face blur and PII redaction</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[{label:'Files Scanned',value:'1,024',color:'#f59e0b'},{label:'Faces Blurred',value:'9,382',color:'#38BDF8'},{label:'PII Redacted',value:'218',color:'#ef4444'},{label:'Compliance Rate',value:'99.8%',color:'#10b981'}].map((s,i)=>(
          <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:i*0.06}} className="glass-card p-5">
            <div className="text-xs mb-2" style={{color:'#A1A1AA'}}>{s.label}</div>
            <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Upload zone */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.12}}
        className="glass-card p-8 text-center" style={{borderStyle:'dashed',borderColor:'rgba(245,158,11,0.3)'}}>
        <ShieldCheckIcon style={{width:40,height:40,color:'rgba(245,158,11,0.5)',margin:'0 auto 16px'}} />
        <h3 className="text-lg font-semibold mb-2">Upload for Privacy Scan</h3>
        <p className="text-sm mb-6" style={{color:'#A1A1AA'}}>AI will auto-detect faces, names, phone numbers, and sensitive content.</p>
        <button className="glow-btn px-8 py-3 text-white text-sm font-semibold">Run Privacy Filter</button>
      </motion.div>

      {/* Log table */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5,delay:0.18}} className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold flex items-center gap-2"><Eye size={16} style={{color:'#f59e0b'}}/>Scan Log</h2>
        </div>
        {LOG.map((r,i)=>(
          <div key={r.file} className="flex items-center justify-between px-6 py-4" style={{borderBottom: i<LOG.length-1?'1px solid rgba(255,255,255,0.05)':'none'}}>
            <div>
              <div className="text-sm font-medium">{r.file}</div>
              <div className="text-xs mt-0.5" style={{color:'#A1A1AA'}}>{r.faces} faces · {r.pii} PII items · {r.time}</div>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5"
              style={r.status==='Passed'
                ? {background:'rgba(16,185,129,0.12)',color:'#34d399',border:'1px solid rgba(16,185,129,0.25)'}
                : {background:'rgba(245,158,11,0.12)',color:'#fcd34d',border:'1px solid rgba(245,158,11,0.25)'}}>
              {r.status==='Passed'?<CheckCircle size={12}/>:<AlertCircle size={12}/>}
              {r.status}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
