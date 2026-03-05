"use client";

import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";

export default function HowItWorksTimeline() {
  const data = [
    {
      title: "Upload",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
            Drop raw video footage from any device or cloud source and let{" "}
            <span className="font-semibold text-white">
              AI analyze it instantly
            </span>.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Analyze",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
            Scene Intelligence <span className="font-semibold text-white">dissects every frame in seconds</span> using AI.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Filter",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
            Privacy-first AI ensures <span className="font-semibold text-white">compliance and authenticity</span>.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Optimize",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
            Trend Prediction finds the <span className="font-semibold text-white">best format and timing automatically</span>.
          </p>
        </motion.div>
      ),
    },
    {
      title: "Distribute",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg leading-relaxed text-white/70 max-w-xl tracking-wide">
            Automated publishing to <span className="font-semibold text-white">40+ global platforms</span>.
          </p>
        </motion.div>
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
