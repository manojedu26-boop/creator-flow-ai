import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  circle?: boolean;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className, circle, style }: SkeletonProps) => {
  return (
    <div 
      style={style}
      className={cn(
        "skeleton-shimmer relative overflow-hidden",
        circle ? "rounded-full" : "rounded-xl",
        className
      )}
    />
  );
};

export const KpiSkeleton = () => (
  <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 space-y-6 shadow-sm">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-4" circle />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-2 w-full" />
    </div>
    <div className="pt-4 border-t border-slate-50 flex items-center gap-2">
       <Skeleton className="h-2.5 w-12" />
       <Skeleton className="h-2.5 w-16" />
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="min-w-[240px] rounded-[2rem] overflow-hidden bg-card border border-border/40 p-4 space-y-4">
    <Skeleton className="aspect-[4/5] w-full rounded-[1.5rem]" />
    <div className="px-1 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" circle />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-2 w-1/2 opacity-60" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2">
         <Skeleton className="h-3 w-16" />
         <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

export const ChartSkeleton = ({ height = "320px" }: { height?: string }) => (
  <div className="w-full rounded-[2.5rem] bg-card border border-border/50 p-10 flex flex-col" style={{ height }}>
    <div className="flex items-center justify-between mb-10">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
    <div className="flex-1 w-full flex items-end gap-4 px-2">
       {[...Array(6)].map((_, i) => (
         <Skeleton 
           key={i} 
           className="flex-1 rounded-t-xl" 
           style={{ height: `${20 + Math.random() * 60}%` }} 
         />
       ))}
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className={cn(
          "h-3.5",
          i === lines - 1 ? "w-[45%]" : i === lines - 2 ? "w-[75%]" : "w-full"
        )} 
      />
    ))}
  </div>
);

export const AvatarSkeleton = ({ size = "w-10 h-10" }: { size?: string }) => (
  <Skeleton className={size} circle />
);

// High-Fidelity Compatibility exports
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn("p-8 rounded-[2.5rem] bg-card border border-border/50 space-y-6 shadow-sm", className)}>
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-4" circle />
    </div>
    <Skeleton className="h-12 w-3/4" />
    <div className="space-y-2">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-2 w-4/5" />
    </div>
  </div>
);

export const SkeletonHeader = () => (
  <div className="space-y-4 mb-14">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-16 w-[45%]" />
    <Skeleton className="h-4 w-[60%] opacity-60" />
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <TextSkeleton lines={lines} />
);
