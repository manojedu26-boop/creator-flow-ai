import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExplore } from '@/contexts/ExploreContext';
import { motion } from 'framer-motion';

const niches = [
  "All", "Fitness 💪", "Beauty ✨", "Food 🍜", "Tech ⚡", "Travel ✈️", 
  "Finance 💰", "Gaming 🎮", "Fashion 👗", "Lifestyle 🌿", "Comedy 😂"
];

export const ExploreSearch = () => {
  const { activeNiche, setActiveNiche } = useExplore();

  return (
    <div className="sticky top-[var(--header-h)] z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100 py-6 px-4 md:px-0">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Explore creators, trends, brands, niches..." 
            className="w-full h-20 bg-slate-50 border border-slate-100 rounded-[2rem] pl-20 pr-10 text-lg font-black text-slate-950 placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
          {niches.map((n) => {
            const label = n.split(' ')[0];
            const isActive = activeNiche === label || (activeNiche === 'All' && label === 'All');
            return (
              <button
                key={n}
                onClick={() => setActiveNiche(label)}
                className={cn(
                  "flex-shrink-0 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                  isActive 
                    ? "bg-slate-950 text-white shadow-xl shadow-slate-200 scale-105" 
                    : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-600 hover:text-slate-950 active:scale-95"
                )}
              >
                {n}
                {isActive && (
                  <motion.div 
                    layoutId="nicheDot"
                    className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
