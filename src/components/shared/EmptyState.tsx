import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  ctaText, 
  onCtaClick,
  className,
  compact = false
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center text-center overflow-hidden",
      compact ? "p-8 rounded-[2rem]" : "p-16 rounded-[3rem]",
      "bg-white/40 backdrop-blur-xl border border-white/60 shadow-glass-sm",
      className
    )}>
      {/* Background Polish */}
      <div className="absolute inset-0 bg-mesh-primary opacity-5 pointer-events-none" />
      
      {/* Icon Area */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className={cn(
          "relative rounded-3xl bg-white border border-slate-200 shadow-elevated-sm flex items-center justify-center text-blue-600",
          compact ? "w-16 h-16" : "w-24 h-24"
        )}>
          <Icon className={compact ? "w-8 h-8" : "w-12 h-12"} strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative space-y-3 max-w-sm">
        <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 uppercase">
          {title}
        </h3>
        <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* CTA */}
      {ctaText && onCtaClick && (
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCtaClick}
          className="relative mt-10 h-14 px-10 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-elevated-blue hover:shadow-floating-blue transition-all"
        >
          {ctaText}
        </motion.button>
      )}
    </div>
  );
};
