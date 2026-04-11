import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Zap, Sparkles } from 'lucide-react';
import { usePulse } from '@/contexts/PulseContext';
import { PulseCard } from '@/components/pulse/PulseCard';
import { PulseStrip } from '@/components/pulse/PulseStrip';
import { PulseFilters, FilterType, NewUpdatesChip } from '@/components/pulse/PulseFilters';
import { cn } from '@/lib/utils';
import { PageTransition } from '@/components/shared/MotionComponents';

export const PulseFeed: React.FC = () => {
  const { feedItems, newFeedItemsCount, clearNewFeedItems } = usePulse();
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <PageTransition className="flex flex-col min-h-screen bg-white">
      {/* IG style Top Bar (Mobile) */}
      <div className="md:hidden sticky top-0 z-[100] bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
         <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">The Pulse</h1>
         <div className="flex items-center gap-4">
            <RefreshCcw className={cn("w-5 h-5 text-slate-400", isRefreshing && "animate-spin")} onClick={handleRefresh} />
            <Sparkles className="w-5 h-5 text-indigo-600" />
         </div>
      </div>

      <main className="flex-1 w-full max-w-[630px] mx-auto pt-4 md:pt-12 pb-32">
        <div className="px-4 md:px-0">
           {/* Stories Strip */}
           <PulseStrip />
           
           {/* Filters Hub - Minimalist */}
           <div className="mb-8 overflow-x-auto no-scrollbar py-2">
              <PulseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
           </div>

           <NewUpdatesChip count={newFeedItemsCount} onClick={scrollToTop} />

           {/* The Feed */}
           <section className="space-y-4 md:space-y-8">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, i) => (
                   <motion.div
                     key={item.id}
                     initial={item.isNew ? { opacity: 0, y: -20 } : false}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
                   >
                     <PulseCard item={item} />
                   </motion.div>
                ))}
              </AnimatePresence>
           </section>

           {filteredItems.length === 0 && (
              <div className="py-32 text-center space-y-4">
                 <Zap className="w-12 h-12 text-slate-100 mx-auto" />
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Neural silence in "{activeFilter}"</p>
              </div>
           )}
        </div>
      </main>

      {/* Manual Refresh (Desktop Floating) */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleRefresh}
        className="fixed bottom-24 right-8 z-[100] hidden lg:flex w-14 h-14 bg-white border border-slate-100 rounded-full shadow-2xl items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
      >
        <RefreshCcw className={cn("w-6 h-6", isRefreshing && "animate-spin")} />
      </motion.button>
    </PageTransition>
  );
};
