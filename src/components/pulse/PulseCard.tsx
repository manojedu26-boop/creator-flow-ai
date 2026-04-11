import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageSquare, Send, Bookmark, MoreHorizontal,
  TrendingUp, Trophy, Zap, Target, Handshake, Sparkles, 
  Globe, BarChart3, Clock, Check, ArrowRight, Info, Play, 
  Circle, Volume2, VolumeX
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
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (item.type === 'CREATOR_WIN' && !isWidget) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#ec4899', '#f59e0b']
        });
      }, 500);
    }
  }, [item.type, isWidget]);

  // Video Autoplay Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {});
          } else if (videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) toast.success("Algorithm Fed! 🔥");
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
      <div className="flex items-center gap-3">
        <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600">
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white overflow-hidden bg-slate-100">
              <img 
                src={item.content.creatorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.content.creatorHandle || 'System'}`} 
                className="w-full h-full object-cover" 
                alt="Avatar" 
              />
           </div>
        </div>
        <div className="flex flex-col -space-y-0.5">
           <h4 className="text-[13px] md:text-[14px] font-black text-slate-900 tracking-tight flex items-center gap-1.5">
             {item.content.creatorHandle || 'Platform Intelligence'}
             {item.type === 'BRAND_OPPORTUNITY' && <Check className="w-3.5 h-3.5 fill-blue-500 text-white p-0.5 rounded-full" />}
           </h4>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.content.niche || 'Global Node'} • 2m</span>
        </div>
      </div>
      <button className="text-slate-400 hover:text-slate-600 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );

  const renderActions = () => (
    <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-3">
      <div className="flex items-center gap-5">
        <button onClick={handleLike} className={cn("transition-transform active:scale-125", isLiked ? "text-rose-500" : "text-slate-900 hover:text-slate-400")}>
          <Heart className={cn("w-6 h-6 md:w-7 md:h-7", isLiked && "fill-current")} />
        </button>
        <button className="text-slate-900 hover:text-slate-400 transition-colors">
          <MessageSquare className="w-6 h-6 md:w-7 md:h-7" />
        </button>
        <button className="text-slate-900 hover:text-slate-400 transition-colors">
          <Send className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      </div>
      <button onClick={() => setIsSaved(!isSaved)} className={cn("transition-colors", isSaved ? "text-amber-500" : "text-slate-900 hover:text-slate-400")}>
        <Bookmark className={cn("w-6 h-6 md:w-7 md:h-7", isSaved && "fill-current")} />
      </button>
    </div>
  );

  const renderContent = () => {
    switch (item.type) {
      case 'TRENDING_POST':
        return (
          <div className="space-y-4">
             <div className="relative aspect-square md:aspect-[4/5] bg-slate-950 overflow-hidden group">
                <img 
                  src={item.content.thumbnail} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                  alt="Trend Hero" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                   <p className="text-white text-lg font-black uppercase tracking-tighter mb-2 italic">Creator Forge AI detection active</p>
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{item.content.growth} velocity spike</p>
                </div>
                {/* Format Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                  Live {item.content.format}
                </div>
             </div>
             {renderActions()}
             <div className="px-4 md:px-6 pb-6 space-y-3">
                <p className="text-sm">
                   <span className="font-black mr-2">{item.content.creatorHandle || 'Platform'}</span>
                   <span className="text-slate-700 leading-relaxed tracking-tight">{item.content.message}</span>
                </p>
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/30 flex items-start gap-3">
                   <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                   <div>
                      <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-0.5 italic">Hook AI Extraction</p>
                      <p className="text-[13px] font-bold text-slate-600 leading-snug">"{item.content.hook}"</p>
                   </div>
                </div>
                {!isWidget && (
                  <button className="w-full h-14 rounded-2xl bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/10">
                     Deploy high-growth variant 🚀
                  </button>
                )}
             </div>
          </div>
        );

      case 'CREATOR_WIN':
        return (
          <div className="space-y-4">
             <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-indigo-600 to-rose-500 p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 blur-3xl">
                   <Zap className="w-full h-full" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] mx-auto flex items-center justify-center p-6 shadow-2xl">
                      <Trophy className="w-full h-full text-white animate-bounce" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/60">Milestone Reached</p>
                      <h4 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">{item.content.milestone || 'Big Win'}</h4>
                   </div>
                </div>
             </div>
             {renderActions()}
             <div className="px-4 md:px-6 pb-6">
                <p className="text-sm">
                   <span className="font-black mr-2">{item.content.creatorHandle}</span>
                   <span className="text-slate-700 leading-relaxed tracking-tight">{item.content.message}</span>
                </p>
                <div className="mt-4 flex gap-3">
                   <button className="flex-1 h-12 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest">🔥 Congratulate</button>
                   <button className="flex-1 h-12 bg-slate-50 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest">Collab Node</button>
                </div>
             </div>
          </div>
        );

      case 'PERFORMANCE_FLASH':
        return (
          <div className="space-y-4">
             <div className="aspect-square bg-slate-950 p-10 flex flex-col justify-between text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                   <TrendingUp className="w-48 h-48 text-emerald-400" />
                </div>
                <div className="relative z-10 space-y-4">
                   <div className="px-4 py-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full w-fit">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Growth Engine Sync</span>
                   </div>
                   <h4 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Your reach is <br/> exploding 🚀</h4>
                </div>
                <div className="relative z-10 grid grid-cols-2 gap-8 py-8 border-y border-white/10">
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1 leading-none">Current Reach</p>
                      <p className="text-4xl font-black text-white">{item.content.reach}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1 leading-none">Multiplier</p>
                      <p className="text-4xl font-black text-emerald-400">{item.content.multiplier}x</p>
                   </div>
                </div>
             </div>
             {renderActions()}
             <div className="px-4 md:px-6 pb-6">
                <p className="text-sm">
                   <span className="font-black mr-2">CreatorForge AI</span>
                   <span className="text-slate-700 leading-relaxed tracking-tight">{item.content.message}</span>
                </p>
                <div className="mt-4 flex gap-3">
                   <button className="flex-1 h-12 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest">View Heatmap</button>
                   <button className="flex-1 h-12 bg-slate-950 text-white rounded-xl font-black text-xs uppercase tracking-widest">Optimise Post</button>
                </div>
             </div>
          </div>
        );

      case 'BRAND_OPPORTUNITY':
        return (
          <div className="space-y-4">
             <div className="aspect-square bg-amber-400 p-12 flex flex-col justify-between relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-500" />
                <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12 group-hover:scale-110 transition-transform">
                   <Handshake className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="w-20 h-20 bg-white rounded-[2.5rem] p-4 shadow-2xl flex items-center justify-center">
                      <img src={item.content.brandLogo} className="w-full h-full object-contain" alt="Brand" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-4xl font-black text-slate-950 uppercase tracking-tighter leading-tight italic">{item.content.brandName} Casting Node</h4>
                      <p className="text-xs font-bold text-slate-900/60 uppercase tracking-widest italic">{item.content.budget} Budget</p>
                   </div>
                </div>
                <div className="relative z-10 px-8 py-5 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem]">
                   <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-900/40 tracking-widest mb-1 leading-none">Spots Remaining</p>
                        <p className="text-2xl font-black text-slate-950 italic">{item.content.spotsLeft} Left</p>
                      </div>
                      <Globe className="w-8 h-8 text-slate-900/40" />
                   </div>
                </div>
             </div>
             {renderActions()}
             <div className="px-4 md:px-6 pb-6">
                <p className="text-sm">
                   <span className="font-black mr-2">{item.content.brandName}</span>
                   <span className="text-slate-700 leading-relaxed tracking-tight">{item.content.description}</span>
                </p>
                <button className="w-full h-14 mt-4 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">Apply for Casting Node</button>
             </div>
          </div>
        );

      case 'COMMUNITY_POLL':
        return (
          <div className="space-y-4">
             <div className="aspect-square bg-slate-50 p-10 flex flex-col justify-center space-y-8 border-y border-slate-100">
                <div className="space-y-2 text-center">
                   <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.4em]">Creator Intelligence Node</p>
                   <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight italic">{item.content.question}</h4>
                </div>
                <div className="space-y-3">
                   {item.content.options.map((opt: any, idx: number) => (
                      <button 
                         key={idx}
                         disabled={hasVoted}
                         onClick={() => {
                            votePoll(item.id, idx);
                            setHasVoted(true);
                            toast.success("Intelligence Synchronised 📊");
                         }}
                         className={cn(
                            "w-full h-16 rounded-2xl border relative overflow-hidden transition-all active:scale-95",
                            hasVoted ? "bg-white border-transparent" : "bg-white border-slate-200 hover:border-indigo-600"
                         )}
                      >
                         {hasVoted && (
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${opt.percentage}%` }}
                               className="absolute inset-y-0 left-0 bg-indigo-600/10"
                            />
                         )}
                         <div className="relative z-10 px-8 flex justify-between items-center h-full">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-900">{opt.label}</span>
                            {hasVoted && <span className="text-xl font-black text-indigo-600 italic">{opt.percentage}%</span>}
                         </div>
                      </button>
                   ))}
                </div>
             </div>
             {renderActions()}
             <div className="px-4 md:px-6 pb-6">
                <p className="text-sm">
                   <span className="font-black mr-2">Platform Poll</span>
                   <span className="text-slate-700 leading-relaxed tracking-tight">Contributing your intelligence helps the network grow. {item.content.voters.toLocaleString()} nodes already synced.</span>
                </p>
             </div>
          </div>
        );

      default:
        return (
           <div className="p-12 text-center space-y-4">
              <Zap className="w-12 h-12 text-indigo-600 mx-auto" />
              <p className="text-lg font-black uppercase tracking-tighter">{item.type.replace('_', ' ')}</p>
           </div>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "bg-white transition-all duration-300",
        isWidget 
          ? "rounded-3xl border border-slate-100 shadow-sm" 
          : "rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/60 shadow-xl overflow-hidden mb-12"
      )}
    >
      {renderHeader()}
      {renderContent()}
    </motion.div>
  );
};
