import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Megaphone, Music, Sparkles, Copy, Check, ChevronRight, Activity, ArrowUpRight, Trophy } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

const BentoCard = ({ card, index }: { card: any, index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Periodic flip simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 10000 + index * 2000); // Varied flip times for realistic platform feel
    return () => clearInterval(interval);
  }, [index]);

  const handleCopy = (text: string) => {
    setCopied(true);
    toast.success("Intelligence Copied 🤖");
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFront = () => {
    switch (card.type) {
      case 'POST':
        return (
          <div className="h-full bg-slate-950 p-10 relative overflow-hidden group">
             <img src={card.content.thumb} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-all duration-700" alt="Post" />
             <div className="absolute inset-x-8 bottom-8 z-10 space-y-4">
                <div className="px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest text-white w-fit">
                   {card.content.niche} Network
                </div>
                <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{card.title}</h4>
                <div className="flex items-center gap-4">
                   <p className="text-4xl font-black text-white">{card.content.reach.toLocaleString()}</p>
                   <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em]">Live Growth 📈</p>
                </div>
             </div>
          </div>
        );
      case 'BRAND':
        return (
          <div className="h-full bg-white p-8 border border-slate-100 space-y-6 flex flex-col justify-between group">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shadow-sm">
                   <Megaphone className="w-5 h-5" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-950">Brand Casting Hub</h4>
             </div>
             <div className="flex -space-x-4">
                {['A', 'B', 'C'].map(l => (
                   <div key={l} className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black uppercase shadow-lg group-hover:scale-110 transition-transform">
                      {l}
                   </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-slate-950 text-white border-2 border-white flex items-center justify-center text-[10px] font-black uppercase shadow-lg group-hover:rotate-12 transition-transform">
                   +12
                </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">3 Verified Casting Calls Today</p>
          </div>
        );
      case 'AUDIO':
        return (
          <div className="h-full bg-indigo-600 p-8 flex flex-col justify-between group hover:bg-indigo-700 transition-all">
             <div className="flex justify-between items-start">
                <Music className="w-8 h-8 text-white fill-white animate-bounce" />
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-45 transition-transform">
                   <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
             </div>
             <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Trending Hub Audio</p>
                <h4 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">"{card.content.name}"</h4>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Used by {card.content.count} creators 📈</p>
             </div>
          </div>
        );
      case 'USER':
        return (
          <div className="h-full bg-slate-50 p-8 flex flex-col justify-between group hover:bg-slate-100 border border-slate-100 transition-all">
             <div className="space-y-6">
                <div className="px-4 py-2 bg-slate-950 text-white rounded-full text-[9px] font-black uppercase tracking-widest w-fit">Top Creator Hub</div>
                <div className="relative mx-auto w-32 h-32 group-hover:scale-105 transition-transform">
                   <img src={card.content.img} className="w-full h-full rounded-[2.5rem] object-cover ring-8 ring-white shadow-2xl" alt="Top" />
                   <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl text-white shadow-lg">
                      <Trophy className="w-4 h-4" />
                   </div>
                </div>
             </div>
             <div className="text-center space-y-1">
                <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">{card.content.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{card.content.handle}</p>
             </div>
             <button className="w-full h-14 bg-white border border-slate-200 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-slate-950 hover:bg-slate-950 hover:text-white transition-all shadow-sm">View Node Profile</button>
          </div>
        );
      case 'HOOK':
        return (
          <div className="h-full bg-white p-8 flex flex-col justify-between group hover:border-indigo-600 border border-slate-100 transition-all">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                   <Copy className="w-5 h-5" />
                </div>
                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-600">Hook Discovery</h4>
             </div>
             <p className="text-lg font-black text-slate-950 leading-tight italic line-clamp-3">"{card.content.text}"</p>
             <button 
                onClick={() => handleCopy(card.content.text)}
                className="w-full h-12 border border-slate-100 rounded-xl flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-sans"
             >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Hook Node'}
             </button>
          </div>
        );
      case 'NICHE':
        return (
          <div className="h-full bg-slate-950 p-8 flex flex-col justify-between group">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                   <Activity className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">Niche Velocity</h4>
             </div>
             <div className="space-y-4">
                {card.content.list.map((n: string, i: number) => (
                  <div key={n} className="flex items-center justify-between text-white/60">
                     <span className="text-[11px] font-black uppercase tracking-widest">{n}</span>
                     <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400">+{20 - i*5}%</span>
                     </div>
                  </div>
                ))}
             </div>
             <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">7 Day Growth Neural Analytics</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderBack = () => (
    <div className="h-full w-full bg-white border border-slate-100 p-8 flex flex-col items-center justify-center text-center space-y-4 group">
       <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-all">
          <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
       </div>
       <div className="space-y-2">
          <h4 className="text-xs font-black uppercase text-slate-950 tracking-[0.3em]">Refining Insights</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discovery Engine is extracting live platform intelligence nodes...</p>
       </div>
    </div>
  );

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative perspective-1000",
        card.span === 'COL' ? "md:col-span-2 col-span-1" : 
        card.span === 'ROW' ? "md:row-span-2 row-span-1" : ""
      )}
    >
       <motion.div
         animate={{ rotateY: isFlipped ? 180 : 0 }}
         transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
         className="w-full h-full relative preserve-3d"
         style={{ transformStyle: 'preserve-3d', minHeight: card.span === 'ROW' ? '500px' : '240px' }}
       >
          {/* Front Face */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden shadow-premium" style={{ backfaceVisibility: 'hidden' }}>
             {renderFront()}
          </div>
          
          {/* Back Face (Optional: Flip to reveal "New" data or just loading state) */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden shadow-premium" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
             {renderBack()}
          </div>
       </motion.div>
    </motion.div>
  );
};

export const BentoDiscovery = () => {
  const { bentoCards } = useExplore();

  return (
    <section className="space-y-8 px-4 md:px-0">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-[1.2rem] bg-slate-950 flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white fill-white" />
         </div>
         <div className="space-y-1">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Discovery Hub Timeline</h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Live Platform Activity Node • Sync: 15m</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
         {bentoCards.map((card, i) => (
           <BentoCard key={card.id} card={card} index={i} />
         ))}
      </div>
    </section>
  );
};
