import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { RefreshCcw, Sparkles, Zap, TrendingUp, Info, Megaphone, Trophy, Handshake } from 'lucide-react';
import { usePulse, PulseFeedItem } from '@/contexts/PulseContext';
import { PulseCard } from '@/components/pulse/PulseCard';
import { PulseFilters, FilterType, NewUpdatesChip } from '@/components/pulse/PulseFilters';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/shared/MotionComponents';

export const PulseFeed: React.FC = () => {
  const { feedItems, newFeedItemsCount, clearNewFeedItems } = usePulse();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredItems = feedItems.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TRENDS') return item.type === 'TRENDING_POST' || item.type === 'LIVE_TREND';
    if (activeFilter === 'COLLABS') return item.type === 'COLLAB_MATCH';
    if (activeFilter === 'BRANDS') return item.type === 'BRAND_OPPORTUNITY';
    if (activeFilter === 'WINS') return item.type === 'CREATOR_WIN';
    if (activeFilter === 'INTELLIGENCE') return item.type === 'INDUSTRY_INSIGHT' || item.type === 'PERFORMANCE_FLASH' || item.type === 'COMMUNITY_POLL';
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearNewFeedItems();
    setIsRefreshing(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearNewFeedItems();
  };

  return (
    <PageTransition className="flex flex-col min-h-screen bg-slate-50/50">
      <div className="bg-white border-b border-slate-100 p-8 md:p-12 space-y-6">
         <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-[1.2rem] bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-950 uppercase leading-none">The Pulse</h1>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px] md:text-xs">
              Neural Creator Intelligence Feed • Real-time Node Activity
            </p>
         </div>
      </div>

      <PulseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <main className="flex-1 w-full max-w-2xl mx-auto py-12 px-6 space-y-12 pb-32">
        <NewUpdatesChip count={newFeedItemsCount} onClick={scrollToTop} />

        {/* Slot Machine Refresh Trigger (Desktop) */}
        <div className="hidden lg:flex justify-center mb-8">
           <button 
             onClick={handleRefresh}
             disabled={isRefreshing}
             className="group flex items-center gap-4 px-10 py-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600 hover:shadow-xl transition-all font-black text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 active:scale-95"
           >
             <div className={cn("relative", isRefreshing && "animate-spin")}>
               <RefreshCcw className="w-5 h-5" />
             </div>
             {isRefreshing ? 'Synchronising Node...' : 'Manual Re-sync'}
           </button>
        </div>

        {/* Branded Refresh (Mobile Simulation) */}
        <div className="flex flex-col items-center justify-center py-6 opacity-0 hover:opacity-100 transition-opacity">
           <Zap className="w-8 h-8 text-slate-200" />
           <p className="text-[8px] font-black uppercase text-slate-200 tracking-widest mt-2">Pull to orbit</p>
        </div>

        <section className="space-y-10">
           <AnimatePresence mode="popLayout">
             {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={item.isNew ? { opacity: 0, y: -50, scale: 0.95 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: i * 0.1 }}
                >
                  <PulseCard item={item} />
                </motion.div>
             ))}
           </AnimatePresence>
        </section>

        {filteredItems.length === 0 && (
           <div className="py-32 text-center space-y-8">
              <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 opacity-40">
                 <Zap className="w-10 h-10 text-slate-400" />
              </div>
              <div className="space-y-2">
                 <p className="text-xl font-black text-slate-950 uppercase tracking-tight">Intelligence Node Quiet</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No updates found for "{activeFilter}" filter</p>
              </div>
           </div>
        )}
      </main>
    </PageTransition>
  );
};
