
'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MusicalNoteIcon, CloudArrowUpIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { Play, Heart, Plus, Square, Loader2, X } from 'lucide-react'
import { bgmSuggestorStore, generateBgm, useBgmSuggestorStore, TONES } from './store'

export default function BGMSuggestorPage() {
  const { file, textInput, loading, duration, tone, suggestions, extractedText, errorMsg } = useBgmSuggestorStore()
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [isToneOpen, setIsToneOpen] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('audio/') || selectedFile.type.startsWith('video/')) {
        bgmSuggestorStore.setState({ file: selectedFile, textInput: "", errorMsg: "" });
      } else {
        bgmSuggestorStore.setState({ file: null, errorMsg: "Please upload an audio or video file." });
      }
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    bgmSuggestorStore.setState({ textInput: e.target.value });
  }

  const handleGenerate = async () => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlayingIdx(null);
    await generateBgm();
  }

  const filtered = suggestions

  const togglePlay = (index: number, track: any) => {
    if (playingIdx === index) {
      // pause
      if (audioRef.current) audioRef.current.pause();
      setPlayingIdx(null);
    } else {
      // play
      if (audioRef.current) {
        if (track.audioBase64) {
          audioRef.current.src = `data:audio/mpeg;base64,${track.audioBase64}`;
          audioRef.current.play().catch(e => console.error("Playback failed", e));
        } else {
          // Dummy demo track playing
          audioRef.current.src = ""; // Stop previous
          // Simulate playing a dummy track (no actual sound but UI updates)
        }
      }
      setPlayingIdx(index);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <audio ref={audioRef} onEnded={() => setPlayingIdx(null)} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}>
            <MusicalNoteIcon style={{ width: 22, height: 22, color: '#ec4899' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BGM Suggestor</h1>
            <p className="text-sm" style={{ color: '#A1A1AA' }}>AI-matched background music for your content mood</p>
          </div>
        </div>
      </motion.div>

      {/* Upload area */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-card p-6">
        <label className="block text-sm font-medium mb-3">Upload Video, Audio or Text to get started</label>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-1 w-full flex flex-col gap-4">
            {/* Direct Text input */}
            <div className="relative">
              <textarea
                value={textInput}
                onChange={handleTextChange}
                disabled={!!file}
                placeholder={file ? 'Remove the uploaded file to type text instead.' : 'Describe a scene, e.g., "She rejected me...'}
                className="w-full h-24 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500/50 resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: textInput ? 'rgba(236,72,153,0.05)' : 'rgba(0,0,0,0.2)' }}
              />
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              <span className="flex-1 h-px bg-white/5"></span>
              OR UPLOAD MEDIA
              <span className="flex-1 h-px bg-white/5"></span>
            </div>

            {/* File uploader */}
            <div className={`relative w-full ${textInput ? 'opacity-50' : ''}`}>
              <input
                type="file"
                id="bgm-file-upload"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                disabled={!!textInput}
                className={`absolute inset-0 w-full h-full opacity-0 z-10 ${textInput ? 'cursor-not-allowed hidden' : 'cursor-pointer'}`}
              />
              <div className="w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors"
                style={{ borderColor: file ? '#ec4899' : 'rgba(255,255,255,0.1)', background: file ? 'rgba(236,72,153,0.05)' : 'rgba(255,255,255,0.02)' }}>
                {file ? (
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); bgmSuggestorStore.setState({ file: null }); }}
                      className="absolute top-2 right-2 p-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg z-20 transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                    <MusicalNoteIcon className="w-6 h-6 text-pink-500 mb-1" />
                    <p className="font-medium text-pink-400 text-sm truncate max-w-[80%]">{file.name}</p>
                    <p className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-6 h-6 text-zinc-400 mb-1" />
                    <p className="font-medium text-sm">{textInput ? 'Clear text to upload file' : 'Click or drag file here'}</p>
                    <p className="text-xs text-zinc-400">Audio or Video</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-64 flex flex-col gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Target Duration ({duration}s)</label>
              <input
                type="range"
                min="5" max="22"
                value={duration}
                onChange={(e) => bgmSuggestorStore.setState({ duration: parseInt(e.target.value) })}
                className="w-full accent-pink-500"
              />
              <div className="flex justify-between text-xs text-zinc-500 px-1 mt-1">
                <span>5s</span>
                <span>Max 22s</span>
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-zinc-300 mb-2 flex justify-between items-center">
                <span>Optional Tone</span>
                {tone !== 'Auto' && (
                  <button onClick={() => bgmSuggestorStore.setState({ tone: 'Auto' })} className="text-[10px] text-pink-400 hover:text-pink-300 px-1.5 py-0.5 rounded-md bg-pink-500/10 transition-colors">Clear</button>
                )}
              </label>

              <div className="relative">
                <div
                  onClick={() => setIsToneOpen(!isToneOpen)}
                  className="w-full flex justify-between items-center bg-black/20 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all cursor-pointer shadow-inner"
                  style={{
                    background: tone !== 'Auto' ? 'linear-gradient(to right, rgba(236,72,153,0.05), rgba(0,0,0,0.2))' : 'rgba(0,0,0,0.2)'
                  }}
                >
                  <span className={tone === 'Auto' ? 'text-zinc-400' : 'text-pink-100'}>{tone === 'Auto' ? 'Let AI Decide (Auto)' : tone}</span>
                  <div className={`text-zinc-400 transition-transform duration-200 ${isToneOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                  </div>
                </div>

                {isToneOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsToneOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 bottom-[105%] z-50 p-1.5 rounded-xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden mb-1"
                      style={{ background: 'rgba(20, 20, 25, 0.95)' }}
                    >
                      <div className="max-h-[125px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {TONES.map(t => (
                          <div
                            key={t}
                            onClick={() => { bgmSuggestorStore.setState({ tone: t }); setIsToneOpen(false); }}
                            className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all flex items-center justify-between ${tone === t ? 'bg-pink-500/15 text-pink-300 font-medium' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}
                          >
                            {t === 'Auto' ? 'Let AI Decide (Auto)' : t}
                            {tone === t && <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={(!file && !textInput.trim()) || loading}
              className="w-full py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                opacity: ((!file && !textInput.trim()) || loading) ? 0.5 : 1,
                cursor: ((!file && !textInput.trim()) || loading) ? 'not-allowed' : 'pointer',
                color: 'white',
              }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MusicalNoteIcon className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Generate Options"}
            </button>
            {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}
          </div>
        </div>
      </motion.div>

      {/* Extracted Text (Optional but cool to show) */}
      {extractedText && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-5">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4 text-zinc-400" /> Context Used for BGM Generation
          </h3>
          <p className="text-sm text-zinc-300 italic line-clamp-2">"{extractedText}"</p>
        </motion.div>
      )}

      {/* Track list */}
      {(suggestions.length > 0 || loading) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="glass-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2"><MusicalNoteIcon style={{ width: 16, height: 16, color: '#ec4899' }} />Suggestions List</h2>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-50">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-pink-500" />
              <p>Curating perfect tracks...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-zinc-500">No tracks found for this filter.</div>
          ) : filtered.map((track, i) => (
            <div key={`${track.title}-${i}`} className="flex items-center gap-4 px-6 py-4 transition-colors group"
              style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

              {/* Play button */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={() => togglePlay(i, track)}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: playingIdx === i ? 'rgba(236,72,153,0.25)' : 'rgba(255,255,255,0.07)', border: `1px solid ${playingIdx === i ? 'rgba(236,72,153,0.5)' : 'rgba(255,255,255,0.1)'}` }}>
                {playingIdx === i ? (
                  <Square size={14} className="text-pink-400 fill-pink-400" />
                ) : <Play size={14} style={{ color: 'rgba(255,255,255,0.7)', marginLeft: 2 }} />}
              </motion.button>

              {/* Indicator */}
              {playingIdx === i && (
                <div className="flex gap-[3px] items-center absolute left-16">
                  {[0, 1, 2].map(b => (
                    <motion.div key={b} animate={{ scaleY: [1, 2, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: b * 0.15 }}
                      className="w-0.5 h-3 rounded-full origin-bottom" style={{ background: '#ec4899' }} />
                  ))}
                </div>
              )}

              {/* Info */}
              <div className={`flex-1 min-w-0 ${playingIdx === i ? 'pl-4' : ''} transition-all`}>
                <div className="text-sm font-medium flex items-center gap-2">
                  {track.title}
                  {track.audioBase64 && <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded uppercase tracking-wider">AI Gen</span>}
                </div>
                <div className="text-xs mt-0.5 flex gap-3" style={{ color: '#A1A1AA' }}>
                  <span>{track.genre}</span><span>{track.bpm} BPM</span><span>{track.duration}s</span>
                </div>
              </div>

              {/* Mood */}
              <span className="text-xs px-2.5 py-1 rounded-full hidden md:inline-flex"
                style={{ background: 'rgba(236,72,153,0.10)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)' }}>
                {track.mood}
              </span>

              {/* Match */}
              <span className="text-sm font-bold" style={{ color: '#10b981', minWidth: 40, textAlign: 'right' }}>{track.match}</span>

              {/* Actions */}
              <div className="flex gap-2 ml-2">
                <motion.button whileHover={{ scale: 1.1 }} onClick={() => setLiked(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })}
                  className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Heart size={14} style={{ color: liked.has(i) ? '#ec4899' : 'rgba(255,255,255,0.4)', fill: liked.has(i) ? '#ec4899' : 'none' }} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Plus size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </motion.button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}