import { cn } from "@/lib/utils";
import React from "react";

export type BentoItem = {
  title: string;
  meta?: string;
  description: string;
  icon: React.ReactNode;
  status?: string;
  tags: string[];
  colSpan?: number;
  hasPersistentHover?: boolean;
};

export const BentoGrid = ({
  items,
  className,
}: {
  items: BentoItem[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "group relative p-6 rounded-2xl overflow-hidden transition-all duration-500",
            "border border-white/10",
            "bg-white/5 backdrop-blur-xl",
            "hover:bg-white/10",
            "hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]",
            "hover:-translate-y-1",
            "will-change-transform",
            item.colSpan === 2 ? "md:col-span-2" : ""
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
              {item.icon}
            </div>
            {item.status && (
              <span className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                {item.status}
              </span>
            )}
          </div>
          
          <div className="mb-2">
            {item.meta && (
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1 block">
                {item.meta}
              </span>
            )}
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 absolute bottom-6 left-6 right-6">
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400 text-xs backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
