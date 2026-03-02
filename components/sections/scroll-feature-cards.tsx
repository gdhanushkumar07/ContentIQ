"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { Brain, Shield, TrendingUp, Globe } from "lucide-react";

export default function ScrollFeatureCards() {
  const items: BentoItem[] = [
    {
      title: "Scene Intelligence",
      meta: "AI Engine",
      description:
        "Deep frame-by-frame AI identifies key scenes, faces, and emotional arcs.",
      icon: <Brain className="w-4 h-4 text-cyan-400" />,
      status: "Live",
      tags: ["AI", "Detection", "Highlights"],
      colSpan: 2,
      hasPersistentHover: true,
    },
    {
      title: "Privacy-First Filtering",
      meta: "Security",
      description:
        "Enterprise-grade face blur and compliance automation before distribution.",
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      status: "Secure",
      tags: ["GDPR", "PII"],
    },
    {
      title: "Trend Prediction",
      meta: "Viral Windows",
      description:
        "Real-time ML forecasting for optimal publish timing and format.",
      icon: <TrendingUp className="w-4 h-4 text-yellow-400" />,
      tags: ["ML", "Forecast"],
      colSpan: 2,
    },
    {
      title: "Global Distribution",
      meta: "40+ Platforms",
      description:
        "Instant publishing across YouTube, Instagram, TikTok & LinkedIn.",
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      status: "Active",
      tags: ["Automation", "Multi-Platform"],
    },
  ];

  return (
    <section className="relative w-full py-32 z-10 max-w-7xl mx-auto">
      <ContainerScroll
        titleComponent={
          <>
            <h2 className="text-3xl md:text-6xl font-bold text-white">
              How ContentIQ Works
            </h2>
            <p className="text-neutral-400 mt-4 text-lg">
              Scroll to experience the AI engine in action.
            </p>
          </>
        }
      >
        <BentoGrid items={items} className="p-4" />
      </ContainerScroll>
    </section>
  );
}
