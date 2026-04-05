import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Sparkles, Zap, Star, Heart, Target, TrendingUp, Handshake, ChevronRight } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

const CollabCard = ({ collab, index }: { collab: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-premium hover:shadow-floating-indigo transition-all group flex flex-col justify-between h-[380px]"
    >
       <div className="space-y-6">
          <div className="flex justify-between items-start">
             <div className="relative group/avatar">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 ring-4 ring-slate-50">
                   <img src={collab.avatar} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" alt="Av" />
                </div>
                <div className="absolute -top-2 -right-2 bg-indigo-600 p-1.5 rounded-lg text-white shadow-lg shadow-indigo-500/20 translate-y-1 group-hover/avatar:translate-y-0 transition-transform">
                   <Handshake className="w-3.5 h-3.5" />
                </div>
             </div>
             <div className="flex flex-col items-end gap-1.5">
                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                   <Sparkles className="w-3.5 h-3.5" /> {collab.matchScore}% Match
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Neural Synergy Probability</span>
             </div>
          </div>

          <div className="space-y-3">
             <div className="space-y-0.5">
                <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">{collab.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{collab.niche} • {collab.audienceSize} Analytics</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group-hover:bg-white transition-all overflow-hidden h-[110px]">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:rotate-12 transition-transform">
                   <MessageSquare className="w-12 h-12 text-slate-950" />
                </div>
                <p className="text-[11px] font-bold text-slate-600 italic line-clamp-3 relative z-10">"{collab.lookingFor}"</p>
             </div>
          </div>
       </div>

       <button 
          onClick={() => toast.success("Synergy Protocols Initialized... 🤝")}
          className="w-full h-14 bg-white border border-slate-950 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-slate-950 hover:text-white transition-all active:scale-95 group shadow-sm"
       >
          Reach Out <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
       </button>
    </motion.div>
  );
};

export const CollabBazaar = () => {
  const { collabs } = useExplore();

  return (
    <section className="space-y-10 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Users className="w-6 h-6 text-white" />
           </div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Open Collab Requests this week</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Network Topology • Synergy Node Optimization</p>
           </div>
        </div>
        <button className="h-12 px-8 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-slate-950 hover:border-slate-300 transition-all flex items-center gap-3">
          Post Request <Plus className="w-4 h-4 text-indigo-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {collabs.map((collab, i) => (
           <CollabCard key={collab.id} collab={collab} index={i} />
         ))}
         
         <div className="flex flex-col items-center justify-center p-12 bg-indigo-600 rounded-[3rem] text-center space-y-6 shadow-2xl shadow-indigo-200 group hover:shadow-indigo-300 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 transition-transform duration-1000 rotate-12">
               <Zap className="w-48 h-48 text-white fill-white" />
            </div>
            
            <div className="w-20 h-20 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20 relative z-10 group-hover:rotate-12 transition-transform">
               <Sparkles className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="space-y-2 relative z-10">
               <h4 className="text-2xl font-black text-white uppercase tracking-tight">AI Synergy Matching</h4>
               <p className="text-[10px] font-black uppercase text-white/60 tracking-widest max-w-[200px] mx-auto leading-relaxed">Let our neural engine find your 99% audience match automatically.</p>
            </div>
            <button className="w-full h-14 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 relative z-10 hover:bg-slate-50 transition-all font-sans">
              Enable Intelligence <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </section>
  );
};

const Plus = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
