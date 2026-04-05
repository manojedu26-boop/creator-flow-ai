import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePulse } from '@/contexts/PulseContext';

export type FilterType = 'ALL' | 'TRENDS' | 'COLLABS' | 'BRANDS' | 'WINS' | 'INTELLIGENCE';

interface PulseFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters = [
  { id: 'ALL', label: 'All', icon: null },
  { id: 'TRENDS', label: 'Trends', icon: '🔥' },
  { id: 'COLLABS', label: 'Collabs', icon: '🤝' },
  { id: 'BRANDS', label: 'Brands', icon: '💰' },
  { id: 'WINS', label: 'Wins', icon: '🎉' },
  { id: 'INTELLIGENCE', label: 'Intelligence', icon: '📊' },
];

export const PulseFilters: React.FC<PulseFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const { newFeedItemsCount } = usePulse();

  return (
    <div className="sticky top-[var(--header-h)] z-nav bg-white/80 backdrop-blur-3xl border-b border-slate-100 py-6 px-8 md:px-0 scroll-smooth">
      <div className="max-w-2xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const hasNew = filter.id === 'ALL' && newFeedItemsCount > 0;

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id as FilterType)}
              className={cn(
                "relative flex-shrink-0 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300",
                isActive 
                  ? "bg-slate-950 text-white shadow-xl shadow-slate-200" 
                  : "bg-white text-slate-400 border border-slate-100 hover:border-indigo-600 hover:text-slate-950"
              )}
            >
              {filter.icon && <span className="mr-3">{filter.icon}</span>}
              {filter.label}
              
              <AnimatePresence>
                 {hasNew && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white shadow-sm"
                    />
                 )}
              </AnimatePresence>

              {isActive && (
                <motion.div
                  layoutId="activeFilterUnderline"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const NewUpdatesChip: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-32 left-1/2 -translate-x-1/2 z-[100]"
        >
          <button
            onClick={onClick}
            className="px-8 py-4 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-floating-red border border-rose-500 flex items-center gap-3 active:scale-95 transition-all hover:bg-rose-700"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            {count} New Updates
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
