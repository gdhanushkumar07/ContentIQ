"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

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
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        `
        absolute left-0 w-full cursor-pointer
        select-none flex-col justify-between
        rounded-2xl
        border border-white/10
        bg-white/5
        backdrop-blur-xl
        px-6 py-5
        shadow-xl
        transition-all duration-500 ease-out
        `,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/10 p-2 backdrop-blur-md">
          {icon}
        </div>
        <p className={cn("text-lg font-semibold text-white", titleClassName)}>
          {title}
        </p>
      </div>

      <p className="text-sm text-neutral-300 leading-relaxed break-words mt-4 mb-2">
        {description}
      </p>

      <p className="text-xs text-neutral-500">
        {date}
      </p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "top-0 z-30 group-hover:translate-y-0",
    },
    {
      className: "top-4 z-20 group-hover:translate-y-8",
    },
    {
      className: "top-8 z-10 group-hover:translate-y-16",
    },
    {
      className: "top-12 z-0 group-hover:translate-y-24",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="relative w-[420px] h-[260px] group">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
