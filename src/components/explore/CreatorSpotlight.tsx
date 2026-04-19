import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, MessageSquare, Plus, Zap, Heart, Star, Target, TrendingUp, Trophy } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

const CreatorCard = ({ creator, index }: { creator: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative h-[220px] rounded-2xl bg-slate-950 overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
       <div className="absolute inset-0 z-0">
          <img src={creator.thumbnail} className="w-full h-full object-cover opacity-30 blur-sm group-hover:scale-105 transition-all duration-700" alt="BG" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950" />
       </div>

       <div className="relative z-10 h-full p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl border border-white/10 p-0.5">
                 <img src={creator.avatar} className="w-full h-full rounded-lg object-cover" alt="Av" />
              </div>
              <div className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md border border-white/10 text-[7px] font-black uppercase text-white">
                 {creator.er}% ER
              </div>
          </div>

          <div className="space-y-3">
             <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white uppercase tracking-tight leading-none truncate">{creator.name}</h4>
                <p className="text-[7px] font-medium text-white/40 uppercase tracking-widest">{creator.handle}</p>
             </div>

             <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                   <p className="text-[6px] font-bold uppercase text-white/30 tracking-widest leading-none">Scale</p>
                   <p className="text-[10px] font-bold text-white">{creator.followers}</p>
                </div>
                <div className="text-right">
                   <p className="text-[6px] font-bold uppercase text-white/30 tracking-widest leading-none">Score</p>
                   <p className="text-[10px] font-bold text-indigo-400">{creator.score}</p>
                </div>
             </div>

             <button 
               onClick={() => toast.success("Synergy Logged 🤝")}
               className="w-full h-8 bg-white rounded-lg text-slate-950 font-black text-[8px] uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-1"
             >
               Sync <Plus className="w-3 h-3" />
             </button>
          </div>
       </div>
    </motion.div>
  );
};

export const CreatorSpotlight = () => {
  const { creators } = useExplore();

  return (
    <section className="space-y-6 px-4 md:px-8">
      <div className="flex items-center gap-3">
         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Star className="w-4 h-4 text-white fill-white" />
         </div>
         <div className="space-y-0.5">
            <h3 className="text-xl font-semibold uppercase tracking-tighter text-slate-950">Rising Stars</h3>
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em]">Neural Intelligence Selection</p>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {creators.map((creator, i) => (
          <CreatorCard key={creator.id} creator={creator} index={i} />
        ))}
        {/* Placeholder for more cards (Compressed) */}
        <div className="h-[220px] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-2 opacity-50 hover:opacity-100 transition-all cursor-pointer group">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all">
               <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Explore Hub</p>
        </div>
      </div>
    </section>
  );
};
