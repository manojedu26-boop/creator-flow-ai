import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Sparkles, Clock, History } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = [
  "March Brand Deals",
  "Instagram Reach Trends",
  "MuscleBlaze Contract",
  "Affiliate Revenue Q1"
];

const trendingTopics = [
  { text: "Best time to post on Reels", icon: Clock },
  { text: "Fitness niche growth hacks", icon: TrendingUp },
  { text: "New tax rules for creators", icon: Sparkles }
];

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex flex-col p-6"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button 
              onClick={onClose}
              className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-zinc-400 active:scale-95 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button key={s} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-6 flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Trending Insights
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <button key={topic.text} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:border-primary/50 transition-all text-left">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <topic.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300 group-hover:text-white">
                      {topic.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
             <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-[10px] font-bold text-white/90">
                  Try asking "Who were my top 3 brand partners in January?"
                </p>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
