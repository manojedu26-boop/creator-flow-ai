import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, BarChart3, TrendingUp, Megaphone, Sparkles, Target, Trophy } from 'lucide-react';
import { usePulse, PulseFeedItem } from '@/contexts/PulseContext';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const MiniPulseCard = ({ item }: { item: PulseFeedItem }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'TRENDING_POST': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'CREATOR_WIN': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'LIVE_TREND': return <Zap className="w-4 h-4 text-rose-500" />;
      case 'BRAND_OPPORTUNITY': return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'COLLAB_MATCH': return <Target className="w-4 h-4 text-indigo-600" />;
      case 'PERFORMANCE_FLASH': return <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />;
      case 'INDUSTRY_INSIGHT': return <BarChart3 className="w-4 h-4 text-indigo-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getLabel = () => {
    switch (item.type) {
      case 'TRENDING_POST': return 'Niche Trend 🔥';
      case 'CREATOR_WIN': return 'Milestone Win 🎉';
      case 'LIVE_TREND': return 'Live Velocity 📈';
      case 'BRAND_OPPORTUNITY': return 'Brand Casting 💰';
      case 'COLLAB_MATCH': return 'AI Match ✨';
      case 'PERFORMANCE_FLASH': return 'Growth Alert 🚀';
      case 'INDUSTRY_INSIGHT': return 'Intelligence 📊';
      default: return 'Creator Pulse 🔴';
    }
  };

  return (
    <motion.div 
      layout
      className="p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-indigo-600 transition-all group relative overflow-hidden"
    >
       <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
             {getIcon()}
          </div>
          <span className="pro-label">{getLabel()}</span>
       </div>
       <p className="text-sm font-semibold text-slate-950 truncate uppercase tracking-tight">{item.content.message || item.content.milestone || item.content.trendName || item.content.insight || 'New Update'}</p>
       <div className="flex items-center justify-between mt-4">
          <p className="pro-label text-[8px] opacity-40">Node sync active</p>
          <ChevronRight className="w-3 h-3 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
       </div>
    </motion.div>
  );
};

export const PulseWidget: React.FC = () => {
  const { feedItems } = usePulse();
  const recentItems = feedItems.slice(0, 4);

  return (
    <div className="rounded-[4rem] bg-white border border-slate-100 p-10 shadow-premium premium-card overflow-hidden relative">
      <div className="absolute top-0 right-0 p-10 opacity-5">
         <div className="w-32 h-32 bg-indigo-600 rounded-full blur-[80px]" />
      </div>

      <div className="flex items-center justify-between mb-10 relative z-10">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[1rem] bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
               <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-950 uppercase tracking-tighter">Live Pulse</h3>
         </div>
         <Link 
            to="/pulse" 
            className="pro-label text-indigo-600 hover:text-indigo-700 transition-all underline decoration-indigo-200 decoration-4 underline-offset-4"
         >
           View Hub
         </Link>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {recentItems.map((item) => (
            <MiniPulseCard key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>

      <Link 
        to="/pulse"
        className="w-full mt-10 h-16 rounded-[1.5rem] bg-slate-950 text-white font-bold text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:shadow-floating transition-all active:scale-95 group shadow-xl"
      >
        Sync All Nodes <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
};
