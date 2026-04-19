import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Instagram, Play, Sparkles, ChevronRight } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

export const TrendingNow = () => {
  const { trends, activeNiche } = useExplore();

  return (
    <section className="space-y-6 px-4 md:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg border border-rose-100 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
           </div>
           <h3 className="text-xl font-semibold uppercase tracking-tighter text-slate-950">Trending Hub</h3>
        </div>
        <button className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-700 tracking-[0.2em] flex items-center gap-2 transition-all">
          Intelligence <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trends.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                   <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                      {trend.platform === 'TikTok' ? <Play className="w-3 h-3 text-slate-950 fill-slate-950" /> : <Instagram className="w-3 h-3 text-pink-500" />}
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{trend.platform}</span>
                   </div>
                   <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>

                <h4 className="text-sm font-bold text-slate-950 uppercase tracking-tighter leading-tight line-clamp-1">
                   {trend.name}
                </h4>

                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Velocity</p>
                       <p className="text-xs font-black text-emerald-500">{trend.velocity}%</p>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden p-0.5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${trend.velocity}%` }}
                         className={cn(
                           "h-full rounded-full bg-emerald-500"
                         )}
                       />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-950">{trend.creatorCount.toLocaleString()} <span className="text-slate-400 font-normal">nodes</span></span>
                    <button 
                      onClick={() => toast.success("Calibrating Script... 🖋️")}
                      className="h-8 px-4 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-1.5"
                    >
                      Forge <Sparkles className="w-3 h-3" />
                    </button>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
