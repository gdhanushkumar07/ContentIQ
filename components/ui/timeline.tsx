"use client";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-transparent font-sans md:px-10 relative"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-lg md:text-5xl mb-4 text-white font-bold max-w-4xl mx-auto tracking-tight">
          How <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]">ContentIQ</span> Works
        </h2>
        <p className="text-neutral-300 text-sm md:text-lg max-w-sm mx-auto">
          From upload to viral in five AI-powered steps
        </p>
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto py-32">
        {/* Animated Central Timeline Bar */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-white/10 -translate-x-1/2"></div>
        <div
          style={{ height: height + "px" }}
          className="absolute left-1/2 top-0 w-[2px] bg-transparent -translate-x-1/2 overflow-hidden"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-full bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>

        <div className="relative">
          {data.map((item, index) => (
            <div
              key={index}
              className={`relative w-full flex items-center mb-24 md:mb-32 ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
                {/* Center Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_0_10px_rgba(59,130,246,0.35)] z-20">
                  {item.icon}
                </div>

                {/* Card Container */}
                <div className="w-[45%]">
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: index % 2 === 0 ? -80 : 80,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{ once: false, margin: "-100px" }}
                    onViewportEnter={() => setActiveStep(index)}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="glass-card backdrop-blur-xl bg-white/10 border border-white/15 rounded-2xl shadow-lg p-8 hover:scale-[1.02] transition-all duration-300 relative z-20"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {item.icon}
                      <h3
                        className={`text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-${
                          index % 2 === 0 ? "r" : "l"
                        } from-blue-200 to-white`}
                      >
                        {item.title}
                      </h3>
                    </div>
                    {item.content}
                  </motion.div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
