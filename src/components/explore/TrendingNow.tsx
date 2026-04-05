import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Instagram, Play, Sparkles, ChevronRight } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

export const TrendingNow = () => {
  const { trends, activeNiche } = useExplore();

  return (
    <section className="space-y-10 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
           <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl border border-rose-100 flex items-center justify-center shadow-sm">
              <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
           </div>
           <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Trending in your niche right now</h3>
        </div>
        <button className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-700 tracking-[0.25em] flex items-center gap-2 transition-all">
          View Detailed Analytics <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-10 overflow-x-auto no-scrollbar pb-6 snap-x snap-mandatory">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-96 p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-premium hover:shadow-floating-indigo group transition-all snap-start relative overflow-hidden"
          >
             <div className="absolute -top-10 -right-10 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
                {trend.platform === 'TikTok' ? <Play className="w-32 h-32 text-slate-950" /> : <Instagram className="w-32 h-32 text-pink-500" />}
             </div>

             <div className="space-y-8 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="px-5 py-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                      {trend.platform === 'TikTok' ? <Play className="w-4 h-4 text-slate-950 fill-slate-950" /> : <Instagram className="w-4 h-4 text-pink-500" />}
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{trend.platform} Network</span>
                   </div>
                   <TrendingUp className="w-6 h-6 text-emerald-500 animate-pulse" />
                </div>

                <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none h-20 line-clamp-2">
                   {trend.name}
                </h4>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Velocity Node Status</p>
                      <p className="text-xl font-black text-emerald-500">{trend.velocity}% High</p>
                   </div>
                   <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${trend.velocity}%` }}
                        transition={{ duration: 1, ease: "circOut", delay: 0.5 + i * 0.1 }}
                        className={cn(
                          "h-full rounded-full transition-all",
                          trend.velocity > 85 ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]" : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                        )}
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Scale Node</span>
                      <span className="text-lg font-black text-slate-950">{trend.creatorCount.toLocaleString()} Creators</span>
                   </div>
                   <button 
                     onClick={() => toast.success("Calibrating Script Node... 🖋️")}
                     className="h-16 px-10 bg-slate-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-indigo-600 shadow-xl transition-all active:scale-95 group"
                   >
                     Create <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                   </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
