import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Briefcase, Users, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePulse } from '../../contexts/PulseContext';

export const WhatsHappeningWidget = () => {
  const [index, setIndex] = useState(0);
  const { stories } = usePulse();

  const slides = [
    {
      id: 'live',
      title: 'RIGHT NOW IN FITNESS',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-sm animate-pulse">🔴 LIVE</span>
            <span className="text-[11px] font-black text-slate-900">412 fitness creators active</span>
          </div>
          <p className="text-sm font-bold text-slate-600 leading-tight">
            Top trend: <span className="text-indigo-600">#MorningRoutine</span> — 89 creators posting today
          </p>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:gap-3 transition-all pt-2">
            See what's trending <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )
    },
    {
      id: 'opportunity',
      title: 'OPPORTUNITY ALERT',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center shadow-lg">
              <img src="https://api.dicebear.com/7.x/initials/svg?seed=NK" alt="Nike" className="w-8 h-8 rounded-lg" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-950">Nike Brand Brief</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">₹60,000 BUDGET</p>
            </div>
          </div>
          <button className="p-3 w-full bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
            Quick Apply →
          </button>
        </div>
      )
    },
    {
      id: 'network',
      title: 'YOUR NETWORK',
      content: (
        <div className="space-y-5">
          <div className="flex -space-x-3">
             {stories.slice(1, 4).map((s, i) => (
               <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm relative group cursor-pointer">
                  <img src={s.creatorPhoto} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                +12
             </div>
          </div>
          <p className="text-[11px] font-bold text-slate-600">3 of your connections just posted. See what they're up to.</p>
          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
            View Stories →
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="rounded-[3rem] bg-white border border-slate-100 p-8 shadow-premium group relative overflow-hidden h-[240px]">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Zap className="w-24 h-24" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
               {slides[index].title}
            </h4>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={prev} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-400" />
               </button>
               <button onClick={next} className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
               <motion.div
                  key={index}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0"
               >
                  {slides[index].content}
               </motion.div>
            </AnimatePresence>
         </div>

         <div className="flex gap-1.5 mt-auto">
            {slides.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === index ? "w-8 bg-indigo-600" : "w-2 bg-slate-100"
                )} 
              />
            ))}
         </div>
      </div>
    </div>
  );
};
