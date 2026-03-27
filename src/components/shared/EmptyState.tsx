import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  ctaText, 
  onCtaClick,
  className 
}: EmptyStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 bg-card/10 border border-dashed border-border/20 rounded-[2.5rem]",
      className
    )}>
      <div className="w-20 h-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-6 text-muted-foreground/60 border border-border/10">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      {ctaText && onCtaClick && (
        <button 
          onClick={onCtaClick}
          className="h-12 px-8 bg-primary text-primary-foreground rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
};
