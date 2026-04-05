import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Trophy, Zap, 
  Target, Handshake, Sparkles, 
  Globe, BarChart3, Clock, 
  Instagram, Youtube, Play, 
  Check, ArrowRight, MessageSquare, 
  ChevronRight, Megaphone, Info
} from 'lucide-react';
import { PulseFeedItem, usePulse } from '@/contexts/PulseContext';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { toast } from '@/components/ui/sonner';

interface PulseCardProps {
  item: PulseFeedItem;
  isWidget?: boolean;
}

export const PulseCard: React.FC<PulseCardProps> = ({ item, isWidget = false }) => {
  const { votePoll } = usePulse();
  const [hasVoted, setHasVoted] = useState(item.content.hasVoted);

  useEffect(() => {
    if (item.type === 'CREATOR_WIN' && !isWidget) {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.8 },
          colors: ['#4f46e5', '#6366f1', '#f59e0b']
        });
      }, 500);
    }
  }, [item.type, isWidget]);

  const renderCardContent = () => {
    switch (item.type) {
      case 'TRENDING_POST':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                 {item.content.platform === 'Instagram' ? <Instagram className="w-5 h-5 text-pink-500" /> : <Play className="w-5 h-5 text-slate-950" />}
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Niche: {item.content.niche}</span>
               </div>
               {item.isNew && <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
            </div>
            <h4 className="text-xl md:text-2xl font-black text-slate-950 leading-tight uppercase tracking-tight">
              {item.content.message}
            </h4>
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-slate-950 aspect-[16/9]">
               <img src={item.content.thumbnail} className="w-full h-full object-cover opacity-40 blur-sm group-hover:blur-none group-hover:scale-110 transition-all duration-700" alt="Thumb" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white fill-white opacity-20 group-hover:opacity-100 transition-opacity" />
               </div>
               <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                  Live Velocity
               </div>
            </div>
            <div className="flex items-center justify-between py-4 border-y border-slate-50">
               <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Reach Growing</p>
                  <p className="text-lg font-black text-emerald-600">{item.content.growth}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Format</p>
                  <p className="text-lg font-black text-slate-950">{item.content.format}</p>
               </div>
            </div>
            <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100/50 space-y-2">
               <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest">Hook Detection AI</p>
               <p className="text-sm font-bold text-slate-700 italic">{item.content.hook}</p>
            </div>
            {!isWidget && (
              <button 
                onClick={() => toast.success("Script Hub Calibrated 🚀")}
                className="w-full h-16 rounded-[1.5rem] bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-indigo-600 transition-all active:scale-95 group shadow-floating-blue"
              >
                Jump on this trend <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        );

      case 'CREATOR_WIN':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16 shrink-0">
                <img src={item.content.creatorAvatar} className="w-full h-full rounded-[1.5rem] object-cover ring-4 ring-indigo-50" alt="Av" />
                <div className="absolute -top-2 -right-2 bg-amber-400 p-1.5 rounded-full shadow-lg">
                  <Trophy className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">{item.content.creatorHandle}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 min ago • Milestone Node</p>
              </div>
            </div>
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 relative overflow-hidden group">
               <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:scale-150 transition-transform duration-700">
                  <Zap className="w-40 h-40 text-indigo-600" />
               </div>
               <p className="text-[11px] font-black uppercase text-indigo-600 tracking-[0.4em] mb-4">Strategic Accomplishment</p>
               <p className="text-3xl font-black text-slate-950 leading-tight uppercase tracking-tighter mb-4">{item.content.message}</p>
            </div>
            {!isWidget && (
              <div className="flex gap-4">
                <button className="flex-1 h-14 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all">
                  🔥 Congrats!
                </button>
                <button className="flex-1 h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                  🤝 Collab?
                </button>
              </div>
            )}
          </div>
        );

      case 'LIVE_TREND':
        return (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="px-5 py-2.5 bg-rose-50 text-rose-500 rounded-full border border-rose-100 flex items-center gap-3">
                   <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Trend Detection</span>
                </div>
                <Play className="w-6 h-6 text-slate-950" />
             </div>
             <div className="space-y-2">
                <h4 className="text-3xl font-black text-slate-950 leading-tight uppercase tracking-tighter">
                  "{item.content.trendName}" trending in {item.content.niche}
                </h4>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Velocity</p>
                   <p className="text-lg font-black text-slate-950">📈 {item.content.velocity.split(' creators')[0]}</p>
                </div>
                <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100/50">
                   <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-1">Peak Prediction</p>
                   <p className="text-lg font-black text-indigo-600">{item.content.peakPredicted}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                <div className="flex -space-x-3">
                   {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=P${i}`} alt="P" />
                     </div>
                   ))}
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">+{item.content.participantCount} creators on it</p>
             </div>
             {!isWidget && (
               <button className="w-full h-18 rounded-[2rem] bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-floating-blue flex items-center justify-center gap-4 hover:bg-indigo-700 transition-all active:scale-95 group">
                  Create content for this <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
               </button>
             )}
          </div>
        );

      case 'BRAND_OPPORTUNITY':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
               <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                 <Megaphone className="w-5 h-5 text-amber-600" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Brand Casting Node</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center p-2 shadow-lg shadow-amber-400/20 ring-4 ring-amber-50">
                 <Sparkles className="w-full h-full text-white" />
               </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-white border border-slate-100 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <img src={item.content.brandLogo} className="w-14 h-14 rounded-2xl bg-white" alt="Brand" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">{item.content.brandName}</h4>
                 <p className="text-xs font-bold text-slate-400">{item.content.description}</p>
              </div>
            </div>
            <div className="bg-slate-950 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Megaphone className="w-32 h-32 text-amber-400 rotate-12" />
               </div>
               <div className="space-y-2 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Guaranteed Budget</p>
                  <p className="text-4xl font-black text-amber-400">{item.content.budget.split(' – ')[0]}</p>
               </div>
               <div className="flex items-center gap-10 relative z-10">
                  <div>
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">Deliverables</p>
                    <p className="text-sm font-black text-white">{item.content.deliverables}</p>
                  </div>
                  <div className="text-right ml-auto">
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">Spots Left</p>
                    <p className="text-sm font-black text-amber-400">{item.content.spotsLeft} of {item.content.totalSpots}</p>
                  </div>
               </div>
            </div>
            {!isWidget && (
              <button 
                onClick={() => toast.success("Opening Deal Pipeline...")}
                className="w-full h-20 rounded-[2.5rem] bg-amber-500 text-black font-black text-[12px] uppercase tracking-[0.3em] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-4 hover:bg-amber-600 transition-all active:scale-95 group"
              >
                Apply for Casting <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
            )}
          </div>
        );

      case 'COLLAB_MATCH':
        return (
          <div className="space-y-8">
             <div className="flex items-center justify-between">
                <div className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-3">
                   <Sparkles className="w-4 h-4 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Strategic Match</span>
                </div>
                <div className="text-indigo-600 font-black text-lg">{item.content.compatibility}%</div>
             </div>
             <div className="flex flex-col items-center justify-center py-10 relative">
                <div className="flex -space-x-12">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 p-2 shadow-2xl relative z-10">
                      <img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'} className="w-full h-full rounded-[2.2rem] object-cover ring-8 ring-white" alt="M1" />
                   </div>
                   <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 p-2 shadow-2xl relative z-0">
                      <img src={'https://api.dicebear.com/7.x/avataaars/svg?seed=Me'} className="w-full h-full rounded-[2.2rem] object-cover ring-8 ring-white opacity-40 group-hover:opacity-100 transition-opacity" alt="M2" />
                   </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                   <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">{item.content.creatorName} posted a collab</h4>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.content.message}</p>
                </div>
             </div>
             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center h-20">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Audience Overlap</span>
                   <span className="text-lg font-black text-indigo-600">{item.content.overlap}% Match</span>
                </div>
                <div className="text-right flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</span>
                   <span className="text-lg font-black text-slate-950">{item.content.lastActive}</span>
                </div>
             </div>
             {!isWidget && (
               <div className="grid grid-cols-2 gap-4">
                  <button className="h-16 px-8 rounded-[1.5rem] bg-white border border-slate-200 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center">View Profile</button>
                  <button onClick={() => toast.success("Collab Request Synchronised 🤝")} className="h-16 px-8 rounded-[1.5rem] bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-floating-blue flex items-center justify-center hover:bg-indigo-700 transition-all">Send Request</button>
               </div>
             )}
          </div>
        );

      case 'PERFORMANCE_FLASH':
        return (
          <div className="space-y-8 bg-slate-950 rounded-[3.5rem] p-12 overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <TrendingUp className="w-48 h-48 text-emerald-400" />
             </div>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white fill-white" />
                   </div>
                   <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">Growth Engine Alert</span>
                </div>
                <h4 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tighter">
                   Your post is <span className="text-emerald-400 border-b-4 border-emerald-400/30">blowing up</span> 🚀
                </h4>
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                   <p className="text-[12px] font-black text-white/40 uppercase tracking-widest">{item.content.message}</p>
                </div>
                <div className="grid grid-cols-2 gap-8 py-4 border-y border-white/5">
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Current Reach</p>
                      <p className="text-4xl font-black text-white">{item.content.reach}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Multiplier</p>
                      <p className="text-4xl font-black text-emerald-400">{item.content.multiplier}x</p>
                   </div>
                </div>
                {!isWidget && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                     <button className="flex-1 h-16 bg-white rounded-3xl text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">View Stats</button>
                     <button className="flex-1 h-16 bg-emerald-500 rounded-3xl text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">Create Follow-up</button>
                  </div>
                )}
             </div>
          </div>
        );

      case 'INDUSTRY_INSIGHT':
        return (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 flex items-center gap-3">
                   <Info className="w-4 h-4" />
                   <span className="text-[10px] font-black uppercase tracking-[0.3em]">Niche Intelligence</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.content.niche} Ecosystem</span>
             </div>
             <p className="text-2xl font-black text-slate-950 leading-tight uppercase tracking-tight">
               {item.content.insight}
             </p>
             <div className="p-10 rounded-[3rem] bg-indigo-950 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Target className="w-32 h-32 text-indigo-400" />
                </div>
                <p className="text-[11px] font-black uppercase text-white/30 tracking-[0.4em] mb-4">Strategic Optimisation</p>
                <div className="flex items-end gap-6 mb-8">
                   <p className="text-5xl font-black text-indigo-400 leading-none">2.4x</p>
                   <p className="text-xs font-bold text-white/60 uppercase tracking-widest pb-1 underline decoration-indigo-400 decoration-2">More Effectiveness Predicted</p>
                </div>
                <button 
                  onClick={() => toast.success("Scheduling Node Updated 🕒")}
                  className="w-full h-18 bg-white rounded-3xl text-indigo-950 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-100 transition-all active:scale-95 group"
                >
                  Reschedule next post <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        );

      case 'COMMUNITY_POLL':
        return (
          <motion.div layout className="space-y-8">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-6 h-6 text-white" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">Community Pulse</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.content.voters.toLocaleString()} Creators Voting</p>
                   </div>
                </div>
                {hasVoted && <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 animate-in fade-in zoom-in"><Check className="w-3.5 h-3.5" /> Synchronised</div>}
             </div>
             <p className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-tight">{item.content.question}</p>
             <div className="space-y-4">
                {item.content.options.map((opt: any, idx: number) => (
                  <button 
                    key={idx}
                    disabled={hasVoted}
                    onClick={() => {
                        votePoll(item.id, idx);
                        setHasVoted(true);
                        toast.success("Intelligence Recorded 📊");
                    }}
                    className={cn(
                      "w-full h-20 rounded-[2rem] border relative overflow-hidden transition-all group active:scale-[0.98]",
                      hasVoted ? "border-slate-100 bg-slate-50 cursor-default" : "border-slate-100 bg-white hover:border-indigo-600 hover:shadow-premium"
                    )}
                  >
                     <AnimatePresence>
                        {hasVoted && (
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${opt.percentage}%` }}
                            transition={{ duration: 1, ease: 'circOut' }}
                            className="absolute inset-y-0 left-0 bg-indigo-600/10"
                          />
                        )}
                     </AnimatePresence>
                     <div className="relative z-10 px-10 flex items-center justify-between h-full">
                        <span className={cn(
                          "text-[12px] font-black uppercase tracking-[0.2em] transition-all",
                          hasVoted ? "text-slate-950" : "text-slate-400 group-hover:text-indigo-600"
                        )}>{opt.label}</span>
                        {hasVoted && (
                          <motion.span 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-2xl font-black text-indigo-600"
                          >
                            {opt.percentage}%
                          </motion.span>
                        )}
                     </div>
                  </button>
                ))}
             </div>
             {!hasVoted && <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.4em]">Vote to see real-time intelligence</p>}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!isWidget ? { y: -10, transition: { duration: 0.3 } } : {}}
      className={cn(
        "rounded-[4rem] group transition-all duration-500",
        isWidget 
          ? "bg-white p-8 border border-slate-100" 
          : "bg-white p-12 border border-slate-100 shadow-premium hover:shadow-floating-indigo cursor-pointer"
      )}
    >
      {renderCardContent()}
    </motion.div>
  );
};
