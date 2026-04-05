import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, MessageSquare, Plus, Zap, Heart, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

const CreatorCard = ({ creator, index }: { creator: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on scroll
  const { scrollXProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollXProgress, [0, 1], [20, -20]);
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale }}
      className="flex-shrink-0 w-80 h-[500px] rounded-[3.5rem] bg-slate-950 relative overflow-hidden group snap-start shadow-premium hover:shadow-floating-indigo transition-all duration-500"
    >
       {/* Blurred Background Thumbnail */}
       <div className="absolute inset-0 z-0">
          <img src={creator.thumbnail} className="w-full h-full object-cover opacity-40 blur-md group-hover:scale-110 group-hover:blur-sm transition-all duration-1000" alt="BG" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950 shadow-inner" />
       </div>

       {/* Parallax Content Layer */}
       <motion.div style={{ x }} className="relative z-10 h-full p-8 flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="relative">
                <div className="w-20 h-20 rounded-[2rem] border-2 border-white/20 p-1 group-hover:scale-110 transition-transform">
                   <img src={creator.avatar} className="w-full h-full rounded-[1.8rem] object-cover ring-4 ring-white/10" alt="Av" />
                </div>
                {creator.isRisingStar && (
                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-slate-950 group-hover:rotate-12 transition-transform">
                     <TrendingUp className="w-4 h-4" />
                  </div>
                )}
             </div>
             <div className="flex flex-col items-end gap-3">
                <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                   {creator.er} ER%
                </div>
                {creator.isRisingStar && (
                   <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">Rising Star 🚀</span>
                )}
             </div>
          </div>

          <div className="space-y-6">
             <div className="space-y-1">
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform">{creator.name}</h4>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{creator.handle}</p>
             </div>

             <div className="flex flex-wrap gap-2">
                {creator.niches.map((n: string) => (
                   <span key={n} className="px-3 py-1.5 bg-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest text-white/60 border border-white/5">{n}</span>
                ))}
             </div>

             <div className="grid grid-cols-2 gap-4 py-6 border-y border-white/5 relative">
                <div>
                   <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Followers Node</p>
                   <p className="text-xl font-black text-white">{creator.followers}</p>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Creator Score</p>
                   <div className="flex items-center justify-end gap-2 text-indigo-400 font-black text-xl">
                      <Target className="w-4 h-4" /> {creator.score}
                   </div>
                </div>
                
                {/* Score Indicator Ring */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 blur-xl group-hover:opacity-30 transition-opacity">
                   <div className="w-20 h-20 bg-indigo-600 rounded-full animate-pulse" />
                </div>
             </div>

             <div className="flex gap-4 pt-2 relative z-20">
                <button 
                  onClick={() => toast.success("Synergy Logged 🤝")}
                  className="flex-1 h-14 bg-white rounded-2xl text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Connect <Plus className="w-4 h-4" />
                </button>
                <button className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 transition-all group/btn">
                  <MessageSquare className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
             </div>
          </div>
       </motion.div>
    </motion.div>
  );
};

export const CreatorSpotlight = () => {
  const { creators } = useExplore();

  return (
    <section className="space-y-10 px-8">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Star className="w-6 h-6 text-white fill-white" />
         </div>
         <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Creators to watch this week</h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Neural Algorithm Selection • High Velocity Hubs</p>
         </div>
      </div>

      <div className="flex gap-10 overflow-x-auto no-scrollbar pb-10 snap-x snap-mandatory px-4">
        {creators.map((creator, i) => (
          <CreatorCard key={creator.id} creator={creator} index={i} />
        ))}
        {/* Placeholder for more cards */}
        <div className="flex-shrink-0 w-80 h-[500px] border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-50 hover:opacity-100 transition-all group">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-all">
               <Plus className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Explore all Creators in our Network</p>
        </div>
      </div>
    </section>
  );
};
