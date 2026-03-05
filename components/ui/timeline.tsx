"use client";
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

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
      className="w-full bg-transparent font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-lg md:text-4xl mb-4 text-white font-bold max-w-4xl mx-auto">
          How <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">ContentIQ</span> Works
        </h2>
        <p className="text-neutral-300 text-sm md:text-base max-w-sm mx-auto">
          From upload to viral in five AI-powered steps
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20 space-y-28">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-start pt-10 md:pt-40 md:gap-10 group"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-black/50 border border-neutral-700/50 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                </div>
              </div>
              <h3 className="hidden md:block md:pl-20 text-5xl font-semibold tracking-tight bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-4xl mb-4 text-left font-semibold tracking-tight bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </motion.div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden bg-gradient-to-b from-blue-500/60 via-purple-500/40 to-transparent w-[2px]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
