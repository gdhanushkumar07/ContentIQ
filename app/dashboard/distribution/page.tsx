"use client";

import { useState } from "react";
import { ShareIcon, SparklesIcon, CheckCircleIcon, DocumentDuplicateIcon, LinkIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useDistributionStore, distributionStore, generateDistributionPlan, PlatformContent, DistributionPlan } from "./store";

const PLATFORMS = [
  { id: "youtube", name: "YouTube", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  { id: "shorts", name: "YT Shorts", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  { id: "instagram", name: "Instagram", color: "text-pink-500", bg: "bg-pink-500/10", border: "border-pink-500/20" },
  { id: "x", name: "X (Twitter)", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  { id: "facebook", name: "Facebook", color: "text-blue-600", bg: "bg-blue-600/10", border: "border-blue-600/20" },
] as const;

export default function DistributionPage() {
  const { title, category, description, sourceLinks, selectedPlatformsForSources, loading, plan, error } = useDistributionStore();

  // Local UI state
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState("");

  const togglePlatform = (platformId: string) => {
    distributionStore.setState({
      selectedPlatformsForSources: selectedPlatformsForSources.includes(platformId)
        ? selectedPlatformsForSources.filter((id) => id !== platformId)
        : [...selectedPlatformsForSources, platformId]
    });
  };

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleShare = async (text: string, platformId: string) => {
    setShareContent(text);
    setShareModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto w-full" style={{ backgroundColor: "var(--bg-main)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-10 px-6 py-4 lg:px-8 border-b"
        style={{
          backgroundColor: "rgba(9, 9, 11, 0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 lg:p-2.5 rounded-xl lg:rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.1), rgba(139,92,246,0.1))",
              border: "1px solid rgba(139,92,246,0.2)",
            }}>
            <ShareIcon className="w-5 h-5 lg:w-6 lg:h-6 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Social Distribution
            </h1>
            <p className="text-sm lg:text-base text-zinc-400 mt-0.5 lg:mt-1">
              Generate platform-optimized titles, descriptions, and hashtags using Amazon Nova.
            </p>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 w-full mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-fuchsia-400" />
                Video Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Video Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => distributionStore.setState({ title: e.target.value })}
                    placeholder="e.g. Building an AI App in 10 Minutes"
                    className="w-full px-4 py-2.5 rounded-xl border bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
                    style={{ borderColor: "var(--border-subtle)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => distributionStore.setState({ category: e.target.value })}
                    placeholder="e.g. Technology, Education, Vlog"
                    className="w-full px-4 py-2.5 rounded-xl border bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
                    style={{ borderColor: "var(--border-subtle)" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1.5">
                    Video Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => distributionStore.setState({ description: e.target.value })}
                    placeholder="Briefly describe what your video is about..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all resize-none"
                    style={{ borderColor: "var(--border-subtle)" }}
                  />
                </div>

                <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <label className="flex items-center gap-2 text-sm font-medium text-zinc-300 mb-1.5">
                    <LinkIcon className="w-4 h-4 text-fuchsia-400" />
                    Sources & Links <span className="text-xs text-zinc-500 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    value={sourceLinks}
                    onChange={(e) => distributionStore.setState({ sourceLinks: e.target.value })}
                    placeholder="Paste URLs, articles, or references here..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border bg-black/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all resize-none mb-3"
                    style={{ borderColor: "var(--border-subtle)" }}
                  />

                  {sourceLinks.trim().length > 0 && (
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2">
                      <p className="text-xs text-zinc-400">Include these links in:</p>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORMS.map((platform) => {
                          const isSelected = selectedPlatformsForSources.includes(platform.id);
                          return (
                            <button
                              key={platform.id}
                              onClick={() => togglePlatform(platform.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${isSelected
                                ? `${platform.bg} ${platform.border} ${platform.color}`
                                : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              {platform.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={() => generateDistributionPlan()}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-all relative overflow-hidden group mt-2"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5" />
                      Generate Plan
                    </>
                  )}
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {plan ? (
              <div className="space-y-6">
                {PLATFORMS.map((platform) => {
                  const platformData = plan[platform.id as keyof DistributionPlan];
                  if (!platformData) return null;

                  const fullContent = platformData.content + "\n\n" + platformData.hashtags.join(" ");

                  return (
                    <div
                      key={platform.id}
                      className="p-6 rounded-2xl border transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: "var(--card-bg)",
                        borderColor: "var(--border-color)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${platform.bg} ${platform.border}`}>
                          <span className={`text-sm font-medium ${platform.color}`}>
                            {platform.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(fullContent, platform.id)}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            title="Copy to clipboard"
                          >
                            {copiedSection === platform.id ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-400" />
                            ) : (
                              <DocumentDuplicateIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleShare(fullContent, platform.id)}
                            className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title={`Share to ${platform.name}`}
                          >
                            <PaperAirplaneIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-black/30 border border-white/5 whitespace-pre-wrap text-zinc-300 text-sm leading-relaxed">
                          {platformData.content}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {platformData.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 text-xs font-medium rounded-md bg-white/5 text-fuchsia-300 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed"
                style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(217,70,239,0.1))" }}>
                  <ShareIcon className="w-8 h-8 text-fuchsia-400 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">No Plan Generated Yet</h3>
                <p className="text-zinc-500 max-w-sm">
                  Fill in your video details and click generate to get AI-optimized distribution content for all your social platforms.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#212121] rounded-2xl w-full max-w-md overflow-hidden text-white flex flex-col border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-medium">Share in a post</h3>
              <button onClick={() => setShareModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 flex overflow-x-auto gap-6 scrollbar-hide py-6 items-start justify-start">
              {/* Embed / Copy Full Text */}
              <button onClick={() => { navigator.clipboard.writeText(shareContent); alert("Copied to clipboard!"); }} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:opacity-90 transition-opacity">
                  <DocumentDuplicateIcon className="w-7 h-7 text-black" />
                </div>
                <span className="text-xs text-zinc-300">Copy text</span>
              </button>

              {/* WhatsApp */}
              <button onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareContent)}`, '_blank')} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button onClick={() => { navigator.clipboard.writeText(shareContent); window.open('https://facebook.com', '_blank'); }} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">Facebook</span>
              </button>

              {/* YouTube */}
              <button onClick={() => { navigator.clipboard.writeText(shareContent); window.open('https://youtube.com', '_blank'); }} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 1.502 6.186C1 8.07 1 12 1 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">YouTube</span>
              </button>

              {/* Instagram */}
              <button onClick={() => { navigator.clipboard.writeText(shareContent); window.open('https://www.instagram.com/create/style/', '_blank'); }} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">Instagram</span>
              </button>

              {/* X */}
              <button onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent)}`, '_blank')} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-black border border-white/20 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">X</span>
              </button>

              {/* Email */}
              <button onClick={() => window.open(`mailto:?subject=Social Output&body=${encodeURIComponent(shareContent)}`)} className="flex flex-col items-center gap-2 min-w-[72px]">
                <div className="w-14 h-14 rounded-full bg-zinc-600 flex items-center justify-center hover:opacity-90 transition-opacity">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-xs text-zinc-300">Email</span>
              </button>
            </div>

            <div className="p-4 border-t border-white/10 m-4 rounded-xl border flex items-center gap-3 bg-black/40">
              <div className="flex-1 truncate text-sm text-zinc-300 px-2 font-mono">
                {shareContent.length > 50 ? shareContent.substring(0, 50) + "..." : shareContent}
              </div>
              <button onClick={() => {
                navigator.clipboard.writeText(shareContent);
                alert("Copied text!");
              }} className="bg-[#3EA6FF] text-black font-medium px-4 py-2 rounded-full text-sm hover:bg-[#3EA6FF]/90 transition-colors">
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
