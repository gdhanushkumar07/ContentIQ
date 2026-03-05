"use client";

import ThreeDSlider from "@/components/ui/three-d-slider";
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
    <section id="tech-stack" className="relative w-full py-36 z-10 overflow-visible scroll-mt-32">
      <div className="max-w-7xl mx-auto px-6 overflow-visible">

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

        <div className="flex flex-col gap-40 overflow-visible">
          {/* AI & Intelligence */}
          <div className="grid md:grid-cols-2 gap-24 items-center overflow-visible">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                AI & Intelligence
              </h3>
              <p className="text-neutral-400 text-lg max-w-md">
                Proprietary machine learning models and enterprise-grade computer vision APIs.
              </p>
            </div>
            <div className="flex justify-center items-center overflow-visible">
              <ThreeDSlider
                cards={[
                  {
                    icon: <Brain className="w-6 h-6 text-cyan-400" />,
                    title: "AWS Rekognition",
                    description: "Advanced computer vision & facial analysis for automated scene tagging and compliance.",
                    date: "Vision AI",
                  },
                  {
                    icon: <Mic className="w-6 h-6 text-purple-400" />,
                    title: "AWS Transcribe",
                    description: "Highly accurate speech-to-text processing for dynamic multi-language subtitle generation.",
                    date: "Speech AI",
                  },
                ]}
              />
            </div>
          </div>

          {/* Cloud & Infrastructure (Mirror Layout) */}
          <div className="grid md:grid-cols-2 gap-24 items-center overflow-visible">
            <div className="flex justify-center items-center order-2 md:order-1 overflow-visible">
              <ThreeDSlider
                cards={[
                  {
                    icon: <Server className="w-6 h-6 text-yellow-400" />,
                    title: "AWS Lambda",
                    description: "Serverless compute architecture scaling instantly to handle high-resolution video processing.",
                    date: "Compute",
                  },
                  {
                    icon: <Layers className="w-6 h-6 text-blue-400" />,
                    title: "Amazon S3",
                    description: "Durable, high-performance object storage for massive raw media assets and deliverables.",
                    date: "Storage",
                  },
                  {
                    icon: <Database className="w-6 h-6 text-emerald-400" />,
                    title: "DynamoDB",
                    description: "Scalable, blazing-fast NoSQL database operating globally with single-digit millisecond latency.",
                    date: "Database",
                  },
                  {
                    icon: <Bell className="w-6 h-6 text-orange-400" />,
                    title: "Amazon SNS",
                    description: "Robust event-driven pub/sub messaging coordinating the entire automated processing pipeline.",
                    date: "Messaging",
                  },
                ]}
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-4xl font-bold text-white mb-6">
                Cloud & Infrastructure
              </h3>
              <p className="text-neutral-400 text-lg max-w-md">
                Battle-tested, elastically scalable backend systems built on AWS.
              </p>
            </div>
          </div>

          {/* Application Layer */}
          <div className="grid md:grid-cols-2 gap-24 items-center overflow-visible">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                Application Layer
              </h3>
              <p className="text-neutral-400 text-lg max-w-md">
                Fast, responsive, and deeply interactive interfaces engineered for a seamless, desktop-grade web experience.
              </p>
            </div>
            <div className="flex justify-center items-center overflow-visible">
              <ThreeDSlider
                cards={[
                  {
                    icon: <Code className="w-6 h-6 text-cyan-400" />,
                    title: "Next.js",
                    description: "The modern React framework handling hybrid server and client side rendering effortlessly.",
                    date: "Frontend Framework",
                  },
                  {
                    icon: <Code className="w-6 h-6 text-blue-400" />,
                    title: "React",
                    description: "The industry-standard component architecture driving complex dashboard state.",
                    date: "UI Library",
                  },
                  {
                    icon: <Code className="w-6 h-6 text-purple-400" />,
                    title: "TypeScript",
                    description: "Strict end-to-end type safety catching edge cases before they ever hit production.",
                    date: "Language",
                  },
                  {
                    icon: <Shield className="w-6 h-6 text-emerald-400" />,
                    title: "Tailwind CSS",
                    description: "Utility-first styling system powering our dynamic dark mode and glassmorphism designs.",
                    date: "Styling",
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
