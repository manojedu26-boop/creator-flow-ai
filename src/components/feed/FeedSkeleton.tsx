import { motion } from "framer-motion";

export const FeedSkeleton = () => {
  return (
    <div className="space-y-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-3 bg-slate-100 rounded-full animate-pulse" />
              <div className="w-20 h-2 bg-slate-50 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="aspect-square bg-slate-50 rounded-[2.5rem] animate-pulse" />
          <div className="space-y-3">
            <div className="w-full h-3 bg-slate-50 rounded-full animate-pulse" />
            <div className="w-2/3 h-3 bg-slate-50 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
