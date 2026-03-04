"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface TechItem {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

export default function TechMarquee({ items }: { items: TechItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden w-full group"
    >
      <motion.div
        className="flex gap-8 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        }}
        // Using a hack for pausing on hover: the parent handles the event
        // But Framer Motion animations in JS can't be easily paused via simple style
        // We will stick to the infinite loop as requested.
      >
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            className="
              min-w-[320px]
              rounded-2xl
              p-6
              bg-white/5 backdrop-blur-2xl
              border border-white/10
              shadow-[0_20px_50px_rgba(0,0,0,0.4)]
              transition-all duration-500
              hover:scale-105
            "
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-emerald-400">{item.icon}</div>
              <h4 className="text-lg font-semibold text-white">
                {item.title}
              </h4>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed mb-3">
              {item.description}
            </p>

            <span className="text-xs text-neutral-500">
              {item.category}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
