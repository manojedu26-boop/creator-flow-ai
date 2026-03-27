import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={cn(
        "rounded-md bg-white/5 overflow-hidden relative",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite_linear] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
    />
  );
};

export const KpiSkeleton = () => (
  <div className="p-6 rounded-[2rem] bg-card border border-border/40 space-y-4">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-2 w-full" />
  </div>
);

export const PostSkeleton = () => (
  <div className="min-w-[220px] rounded-2xl overflow-hidden bg-muted/20 border border-border/10 space-y-3 p-3">
    <Skeleton className="aspect-[4/5] w-full rounded-xl" />
    <div className="flex items-center gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1">
        <Skeleton className="h-2 w-20" />
        <Skeleton className="h-2 w-12" />
      </div>
    </div>
  </div>
);

export const ChartSkeleton = ({ height = "300px" }: { height?: string }) => (
  <div className="w-full rounded-3xl bg-card border border-border/40 p-8" style={{ height }}>
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-10 w-24 rounded-xl" />
    </div>
    <Skeleton className="flex-1 w-full h-[calc(100%-80px)] rounded-xl" />
  </div>
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-3",
          i === lines - 1 ? "w-[60%]" : i === lines - 2 ? "w-[80%]" : "w-full"
        )} 
      />
    ))}
  </div>
);

export const AvatarSkeleton = ({ size = "w-10 h-10" }: { size?: string }) => (
  <Skeleton className={cn("rounded-full", size)} />
);
