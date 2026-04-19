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
    <div className="sticky top-[var(--header-h)] z-[100] bg-white/95 backdrop-blur-3xl border-b border-slate-100 py-3 px-4 md:px-0">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
           <input 
            type="text" 
            placeholder="Explore creators, trends, brands, niches..." 
            className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-6 text-sm font-semibold text-slate-950 placeholder:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/5 focus:bg-white transition-all shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {niches.map((n) => {
            const label = n.split(' ')[0];
            const isActive = activeNiche === label || (activeNiche === 'All' && label === 'All');
            return (
              <button
                key={n}
                onClick={() => setActiveNiche(label)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-[0.1em] transition-all duration-300",
                  isActive 
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200" 
                    : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-600 hover:text-slate-950 active:scale-95"
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
