"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CardItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
  date?: string;
}

interface ThreeDSliderProps {
  cards?: CardItem[];
}

export default function ThreeDSlider({ cards }: ThreeDSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const defaultCards: CardItem[] = [
    { title: "AWS Rekognition", description: "Advanced computer vision analysis." },
    { title: "AWS Transcribe", description: "Accurate speech-to-text generation." },
    { title: "AWS Lambda", description: "Serverless compute scaling instantly." },
    { title: "Amazon S3", description: "Durable object storage at scale." },
  ];

  const displayCards = cards || defaultCards;
  const total = displayCards.length;
  const angle = total > 0 ? 360 / total : 0;

  useEffect(() => {
    if (paused || total <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, total]);

  if (total === 0) return null;

  return (
    <div
      className="flex flex-col items-center gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-[700px] h-[320px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1600px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(-${index * angle}deg)`,
          }}
        >
          {displayCards.map((card, i) => (
            <div
              key={i}
              className="absolute w-[380px] h-[240px]
              rounded-2xl border border-white/10
              bg-white/5 backdrop-blur-xl
              shadow-[0_30px_80px_rgba(0,0,0,0.5)]
              px-6 py-5
              left-1/2 top-1/2 flex flex-col justify-between"
              style={{
                transform: `
                  translate(-50%, -50%)
                  rotateY(${i * angle}deg)
                  translateZ(280px)
                `,
              }}
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/10 p-2 backdrop-blur-md">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                </div>
                <p className="text-white/70 mt-4 leading-relaxed">{card.description}</p>
              </div>
              {card.date && (
                <p className="text-xs text-neutral-500">{card.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <div className="flex gap-6 z-40">
          <button
            onClick={() => setIndex((prev) => (prev - 1 + total) % total)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md border border-white/10"
          >
            <ChevronLeft className="text-white w-5 h-5" />
          </button>

          <button
            onClick={() => setIndex((prev) => (prev + 1) % total)}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-md border border-white/10"
          >
            <ChevronRight className="text-white w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
