"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TechItem {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

export default function TechCarousel({ items }: { items: TechItem[] }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      
      <div className="relative h-60 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4 }}
            className="
              absolute w-full h-full rounded-2xl p-6
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[0_0_40px_rgba(99,102,241,0.15)]
              hover:shadow-[0_0_60px_rgba(99,102,241,0.25)]
              transition-all duration-500
            "
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="text-cyan-400">{items[index].icon}</div>
              <h4 className="text-xl font-semibold text-white">
                {items[index].title}
              </h4>
            </div>

            <p className="text-neutral-400 mb-4 leading-relaxed">
              {items[index].description}
            </p>

            <span className="text-sm text-neutral-500">
              {items[index].category}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="
          absolute left-[-60px] top-1/2 -translate-y-1/2
          p-3 rounded-full
          bg-white/5 backdrop-blur-md
          border border-white/10
          hover:bg-white/10 transition-all
        "
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      <button
        onClick={next}
        className="
          absolute right-[-60px] top-1/2 -translate-y-1/2
          p-3 rounded-full
          bg-white/5 backdrop-blur-md
          border border-white/10
          hover:bg-white/10 transition-all
        "
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
    </div>
  );
}
