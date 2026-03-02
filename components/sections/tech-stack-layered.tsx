"use client";

import TechCarousel from "@/components/ui/tech-carousel";
import {
  Brain,
  Mic,
  Server,
  Database,
  Bell,
  Shield,
  Code,
  Layers,
} from "lucide-react";

export default function TechStackLayered() {
  return (
    <section id="stack" className="relative w-full py-36 z-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-40">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">
              TECHNOLOGY
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 tracking-tight">
            Built on a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">world-class</span> stack
          </h2>
          <p className="text-neutral-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Production-grade AWS infrastructure combined with cutting-edge AI.
          </p>
        </div>

        <div className="flex flex-col gap-20">
          {/* AI & Intelligence (Text Left, Carousel Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 px-4 md:px-12">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                AI & Intelligence
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                Proprietary machine learning models and enterprise-grade computer vision APIs ensure your content always hits the mark.
              </p>
            </div>
            <div className="order-1 md:order-2 px-12 md:px-0">
              <TechCarousel
                items={[
                  {
                    icon: <Brain className="w-6 h-6" />,
                    title: "AWS Rekognition",
                    description: "Advanced computer vision & facial analysis for automated scene tagging and compliance.",
                    category: "Vision AI",
                  },
                  {
                    icon: <Mic className="w-6 h-6 text-purple-400" />,
                    title: "AWS Transcribe",
                    description: "Highly accurate speech-to-text processing for dynamic multi-language subtitle generation.",
                    category: "Speech AI",
                  },
                ]}
              />
            </div>
          </div>

          {/* Cloud & Infrastructure (Carousel Left, Text Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-1 px-12 md:px-0">
              <TechCarousel
                items={[
                  {
                    icon: <Server className="w-6 h-6 text-yellow-400" />,
                    title: "AWS Lambda",
                    description: "Serverless compute architecture scaling instantly to handle high-resolution video processing.",
                    category: "Compute",
                  },
                  {
                    icon: <Layers className="w-6 h-6 text-blue-400" />,
                    title: "Amazon S3",
                    description: "Durable, high-performance object storage for massive raw media assets and deliverables.",
                    category: "Storage",
                  },
                  {
                    icon: <Database className="w-6 h-6 text-emerald-400" />,
                    title: "DynamoDB",
                    description: "Scalable, blazing-fast NoSQL database operating globally with single-digit millisecond latency.",
                    category: "Database",
                  },
                  {
                    icon: <Bell className="w-6 h-6 text-orange-400" />,
                    title: "Amazon SNS",
                    description: "Robust event-driven pub/sub messaging coordinating the entire automated processing pipeline.",
                    category: "Messaging",
                  },
                ]}
              />
            </div>
            <div className="order-2 px-4 md:px-12">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Server className="w-8 h-8 text-yellow-400" />
                Cloud & Infrastructure
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                Battle-tested, elastically scalable backend systems built entirely on serverless architecture to ensure zero downtime.
              </p>
            </div>
          </div>

          {/* Application Layer (Text Left, Carousel Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 px-4 md:px-12">
              <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Code className="w-8 h-8 text-blue-400" />
                Application Layer
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                Fast, responsive, and deeply interactive interfaces engineered for a seamless, desktop-grade web experience.
              </p>
            </div>
            <div className="order-1 md:order-2 px-12 md:px-0">
              <TechCarousel
                items={[
                  {
                    icon: <Code className="w-6 h-6 text-cyan-400" />,
                    title: "Next.js",
                    description: "The modern React framework handling hybrid server and client side rendering effortlessly.",
                    category: "Frontend Framework",
                  },
                  {
                    icon: <Code className="w-6 h-6 text-blue-400" />,
                    title: "React",
                    description: "The industry-standard component architecture driving complex dashboard state.",
                    category: "UI Library",
                  },
                  {
                    icon: <Code className="w-6 h-6 text-purple-400" />,
                    title: "TypeScript",
                    description: "Strict end-to-end type safety catching edge cases before they ever hit production.",
                    category: "Language",
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-emerald-400" />,
                    title: "Tailwind CSS",
                    description: "Utility-first styling system powering our dynamic dark mode and glassmorphism designs.",
                    category: "Styling",
                  },
                ]}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
