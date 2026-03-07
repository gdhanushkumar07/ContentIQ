"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { Brain, Shield, TrendingUp, Globe } from "lucide-react";

export default function ScrollFeatureCards() {
  const items: BentoItem[] = [
    {
      title: "Video Intelligence",
      meta: "AI ANALYSIS",
      description:
        "AI analyzes raw footage frame-by-frame to detect scenes, highlights, and key moments instantly.",
      icon: <Brain className="w-4 h-4 text-cyan-400" />,
      status: "Live",
      tags: ["AI", "Scene Detection", "Highlights"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "Script Generator",
      meta: "CONTENT AI",
      description:
        "Automatically generates engaging scripts and captions from video context to speed up content creation.",
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      status: "Secure",
      tags: ["AI", "Script", "Content"],
    },
    {
      title: "Multilingual Dubbing",
      meta: "VOICE AI",
      description:
        "Generate natural voiceovers in multiple languages to make your content globally accessible.",
      icon: <TrendingUp className="w-4 h-4 text-yellow-400" />,
      tags: ["AI", "Voice", "Translation"],
      colSpan: 2,
    },
    {
      title: "BGM Suggestor",
      meta: "AUDIO AI",
      description:
        "AI recommends background music that matches the emotion and pacing of your video.",
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      status: "Active",
      tags: ["AI", "Audio", "Music"],
    },
  ];

  return (
    <section id="features" className="relative w-full py-32 z-10 max-w-7xl mx-auto scroll-mt-32">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-6xl font-bold text-white">
              Features
            </h2>
            <p className="text-neutral-400 mt-4 text-lg">
              Core AI systems powering ContentIQ’s media intelligence engine.
            </p>
          </>
        }
      >
        <BentoGrid items={items} className="p-4" />
      </ContainerScroll>
    </section>
  );
}
