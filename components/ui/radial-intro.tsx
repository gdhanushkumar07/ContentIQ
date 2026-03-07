"use client";

import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Languages,
  Music,
  Share2,
  Shield,
  Mic,
  Image as ImageIcon,
} from "lucide-react";

export default function RadialIntro() {
  const features = [
    { icon: Brain, label: "Video Intelligence" },
    { icon: FileText, label: "Script Generator" },
    { icon: Languages, label: "Multilingual Dubbing" },
    { icon: Music, label: "BGM Suggestor" },
    { icon: Share2, label: "Distribution" },
    { icon: Shield, label: "Privacy Filter" },
    { icon: Mic, label: "Voice Tracker" },
    { icon: ImageIcon, label: "Thumbnail Analyzer" },
  ];

  const orbitItems = features.slice(0, 6);
  const radius = 360; // Expanded radius for wrapping the Hero Card

  return (
    <motion.div
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
    >
      {orbitItems.map((item, index) => {
        const angle = (360 / orbitItems.length) * index;
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <motion.div
              initial={{ x: 0, scale: 0, opacity: 0 }}
              animate={{ x: radius, scale: 1, opacity: 1 }}
              transition={{
                duration: 1.2,
                delay: index * 0.1 + 0.5,
                type: "spring",
                stiffness: 60,
              }}
            >
              {/* Counter-rotation to keep icons upright */}
              <div style={{ transform: `rotate(-${angle}deg)` }}>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg group relative pointer-events-auto cursor-pointer"
                  whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <item.icon className="w-6 h-6 text-cyan-400" />
                  
                  {/* Tooltip visible on hover */}
                  <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap top-full mt-3 bg-black/80 text-white text-xs font-semibold py-1.5 px-3 rounded border border-white/10 pointer-events-none drop-shadow-xl z-50">
                    {item.label}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}
