"use client";
import { Timeline } from "@/components/ui/timeline";
import { Upload, Brain, ShieldCheck, Sparkles, Share2 } from "lucide-react";

export default function HowItWorksTimeline() {
  const data = [
    {
      title: "Upload",
      icon: <Upload className="w-5 h-5 text-[#00d4ff]" />,
      content: (
        <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
          Drop raw video footage from any device or cloud source and let{" "}
          <span className="font-semibold text-white">
            AI analyze it instantly
          </span>.
        </p>
      ),
    },
    {
      title: "Analyze",
      icon: <Brain className="w-5 h-5 text-[#00d4ff]" />,
      content: (
        <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
          Scene Intelligence <span className="font-semibold text-white">dissects every frame in seconds</span> using AI.
        </p>
      ),
    },
    {
      title: "Filter",
      icon: <ShieldCheck className="w-5 h-5 text-[#7c3aed]" />,
      content: (
        <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
          Privacy-first AI ensures <span className="font-semibold text-white">compliance and authenticity</span>.
        </p>
      ),
    },
    {
      title: "Optimize",
      icon: <Sparkles className="w-5 h-5 text-[#7c3aed]" />,
      content: (
        <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
          Trend Prediction finds the <span className="font-semibold text-white">best format and timing automatically</span>.
        </p>
      ),
    },
    {
      title: "Distribute",
      icon: <Share2 className="w-5 h-5 text-[#00d4ff]" />,
      content: (
        <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
          Automated publishing to <span className="font-semibold text-white">40+ global platforms</span>.
        </p>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="relative w-full py-24 scroll-mt-32">
      <div className="max-w-7xl mx-auto">
        <Timeline data={data} />
      </div>
    </section>
  );
}
