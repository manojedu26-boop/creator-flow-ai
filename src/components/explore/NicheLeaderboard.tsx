import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUp, Zap, Star, Share2, TrendingUp, Users, Heart, Crown, Medal, Activity } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

const LeaderboardRow = ({ creator, rank, isSelf }: { creator: any, rank: number, isSelf?: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        "flex items-center gap-4 p-5 rounded-[2rem] transition-all group",
        isSelf ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" : "bg-white hover:bg-slate-50 border border-slate-100"
      )}
    >
       <div className="w-12 flex items-center justify-center shrink-0">
          {rank === 1 ? <Crown className="w-6 h-6 text-amber-500 animate-bounce" /> :
           rank === 2 ? <Medal className="w-6 h-6 text-slate-400" /> :
           rank === 3 ? <Medal className="w-6 h-6 text-amber-700" /> :
           <span className={cn("text-sm font-black text-slate-300", isSelf && "text-white/50")}>#{rank}</span>}
       </div>

       <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden border border-slate-100 shrink-0">
             <img src={creator.avatar} className="w-full h-full object-cover" alt="Av" />
          </div>
          <div className="truncate">
             <p className={cn("text-[11px] font-black uppercase tracking-widest truncate", isSelf ? "text-white" : "text-slate-950")}>{creator.name}</p>
             <p className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest", isSelf ? "text-white/60" : "text-slate-400")}>{creator.handle}</p>
          </div>
       </div>

       <div className="hidden md:flex flex-col items-end w-32 border-l border-slate-100 px-6 gap-0.5">
          <span className={cn("text-[9px] font-black uppercase tracking-widest text-slate-400", isSelf && "text-white/50")}>Scale Node</span>
          <span className={cn("text-[12px] font-black", isSelf ? "text-white" : "text-slate-400")}>{creator.followers}</span>
       </div>

       <div className="flex flex-col items-end w-28 border-l border-slate-100 px-6 gap-0.5">
          <span className={cn("text-[9px] font-black uppercase tracking-widest text-slate-400", isSelf && "text-white/50")}>Velocity</span>
          <span className={cn("text-[12px] font-black", isSelf ? "text-white" : "text-emerald-500")}>+{rank * 2 + 5}%</span>
       </div>

       <div className="hidden md:flex flex-col items-end w-20 border-l border-slate-100 pl-6 gap-0.5">
          <span className={cn("text-[9px] font-black uppercase tracking-widest text-slate-400", isSelf && "text-white/50")}>ER%</span>
          <span className={cn("text-[12px] font-black", isSelf ? "text-white" : "text-slate-400")}>{creator.er}</span>
       </div>
    </motion.div>
  );
};

export const NicheLeaderboard = () => {
  const { creators, activeNiche } = useExplore();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'Growth' | 'Engagement' | 'Posts'>('Growth');

  // Simulated leaderboard data (taking spotlight creators as a base)
  const leaderboardCreators = [...creators, ...creators].slice(0, 10);
  
  // Simulated "Self" creator entry
  const selfCreatorNode = {
    name: user?.name || "Neural Operator",
    handle: user?.handle || "@operator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Operator",
    followers: "48.2K",
    er: "5.4%",
    score: 95
  };

  const handleShare = () => {
    toast.info("Generating Social Signature Card... 📸");
    setTimeout(() => toast.success("Signature Card ready for Export!"), 1500);
  };

  return (
    <section className="space-y-10 px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Trophy className="w-6 h-6 text-white" />
           </div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Top Creators in {activeNiche} this week</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Niche Dominance Analysis • Global Stack Ranking</p>
           </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
           {(['Growth', 'Engagement', 'Posts'] as const).map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                 filter === f ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:text-slate-950"
               )}
             >
               By {f}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-3 relative">
         {leaderboardCreators.map((creator, i) => (
           <LeaderboardRow key={`${creator.id}-${i}`} creator={creator} rank={i + 1} />
         ))}

         {/* Self Highlight Overlay simulated */}
         <div className="pt-8 mt-10 border-t-4 border-dashed border-slate-100">
            <div className="flex items-center justify-between mb-6">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
                  <Activity className="w-4 h-4 text-indigo-600" /> Your Niche Deployment Position
               </p>
               <button 
                  onClick={handleShare}
                  className="h-10 px-6 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-sm"
               >
                  Share My Ranking <Share2 className="w-4 h-4" />
               </button>
            </div>
            <LeaderboardRow creator={selfCreatorNode} rank={42} isSelf />
         </div>
         
         <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-slate-100 rounded-full" />
      </div>
    </section>
  );
};
