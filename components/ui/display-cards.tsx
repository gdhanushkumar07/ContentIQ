"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover what's new",
  date = "Just now",
  iconClassName,
  titleClassName,
}: DisplayCardProps) {
  return (
    <motion.div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-white/10 [&>*]:flex [&>*]:items-center [&>*]:gap-2 border border-white/10 bg-white/5 backdrop-blur-xl",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-black/20 p-1.5 border border-white/10">
          {icon}
        </span>
        <p className={cn("text-lg font-medium text-white", titleClassName)}>
          {title}
        </p>
      </div>
      <p className="whitespace-nowrap text-lg text-neutral-400">{description}</p>
      <p className="text-neutral-500 text-sm font-medium">{date}</p>
    </motion.div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 hover:shadow-xl hover:shadow-cyan-500/10 z-30",
    },
    {
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 z-20",
    },
    {
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10 hover:shadow-xl hover:shadow-emerald-500/10 z-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-start max-w-3xl py-12">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
