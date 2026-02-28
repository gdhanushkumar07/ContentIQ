'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        name,
        email,
        password,
        isSignup: 'true',
        redirect: false,
      })
      if (res?.error) {
        setError(res.error)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #050816 0%, #0B1120 100%)' }}>

      <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none z-0" />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div animate={{ x:[0,60,0], y:[0,40,0] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
          className="blob" style={{ width:700, height:700, background:'radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%)', top:-250, left:-250 }} />
        <motion.div animate={{ x:[0,-60,0], y:[0,50,0] }} transition={{ duration:18, repeat:Infinity, ease:'easeInOut', delay:2 }}
          className="blob" style={{ width:800, height:800, background:'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', bottom:-300, right:-350 }} />
      </div>

      <motion.div
        initial={{ opacity:0, y:32 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-card p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background:'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Content<span className="gradient-text">IQ</span>
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">Create account</h1>
          <p className="text-sm mb-8" style={{ color:'#A1A1AA' }}>
            Start your AI content journey.{' '}
            <Link href="/login" className="text-[#8B5CF6] hover:text-[#38BDF8] transition-colors">
              Already have an account?
            </Link>
          </p>

          {error && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-xl text-sm"
              style={{ background:'rgba(239,68,68,0.10)', border:'1px solid rgba(239,68,68,0.25)', color:'#FCA5A5' }}>
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color:'#A1A1AA' }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#A1A1AA' }} />
                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium text-white outline-none transition-colors"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}
                  onFocus={e => e.currentTarget.style.borderColor='rgba(139,92,246,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
                  placeholder="Your name" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color:'#A1A1AA' }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#A1A1AA' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium text-white outline-none transition-colors"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}
                  onFocus={e => e.currentTarget.style.borderColor='rgba(139,92,246,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
                  placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color:'#A1A1AA' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#A1A1AA' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium text-white outline-none transition-colors"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}
                  onFocus={e => e.currentTarget.style.borderColor='rgba(139,92,246,0.5)'}
                  onBlur={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.12)'}
                  placeholder="Min. 6 characters" />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              className="glow-btn w-full py-3.5 flex items-center justify-center gap-2 text-white font-semibold text-sm">
              {loading ? (
                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <><span>Create Account</span><ArrowRight size={16} /></>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
