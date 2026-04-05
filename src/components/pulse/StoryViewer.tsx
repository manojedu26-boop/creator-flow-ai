import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageSquare, Send, Zap, Trophy, TrendingUp, Users, Target, Briefcase } from 'lucide-react';
import { PulseStory, usePulse } from '@/contexts/PulseContext';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface StoryViewerProps {
  stories: PulseStory[];
  initialIndex: number;
  onClose: () => void;
}

const ReactionButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.2 }}
    whileTap={{ scale: 0.9 }}
    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-xl"
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const { markAsRead } = usePulse();
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (currentStory) {
      markAsRead(currentStory.id);
    }
  }, [currentIndex, currentStory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2; // 50 steps * 100ms = 5s
      });
    }, 100);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const renderTemplate = () => {
    switch (currentStory.type) {
      case 'WIN':
        return (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10"
          >
            <div className="w-40 h-40 rounded-[3rem] bg-indigo-600/20 backdrop-blur-3xl flex items-center justify-center mb-8 relative">
              <Trophy className="w-20 h-20 text-indigo-400" />
              <div className="absolute inset-0 bg-indigo-500/10 blur-[60px] animate-pulse" />
            </div>
            <h2 className="text-7xl font-black text-white px-4 leading-none uppercase tracking-tighter">
              {currentStory.content.milestone}
            </h2>
            <p className="text-2xl font-bold text-indigo-200 uppercase tracking-widest leading-tight">
              {currentStory.content.message}
            </p>
          </motion.div>
        );

      case 'BRAND':
        return (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex-1 flex flex-col p-12 justify-center space-y-12"
          >
            <div className="space-y-6">
              <span className="px-6 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-500 rounded-full text-[12px] font-black uppercase tracking-[0.3em]">
                Live Brand Casting
              </span>
              <h2 className="text-5xl font-black text-white leading-[0.9] uppercase tracking-tighter">
                {currentStory.content.casting}
              </h2>
              <div className="flex items-center gap-4 py-8 border-y border-white/10">
                <div className="p-4 bg-white/5 rounded-2xl">
                   <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.3em]">Budget Rate</p>
                   <p className="text-3xl font-black text-amber-400">{currentStory.content.budget}</p>
                </div>
              </div>
            </div>
            <button className="w-full h-20 bg-amber-500 text-black font-black uppercase tracking-[0.3em] rounded-3xl text-[14px] shadow-2xl active:scale-95 transition-all">
              Apply Now
            </button>
          </motion.div>
        );

      case 'TREND':
        return (
          <motion.div 
             initial={{ x: 30, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             className="flex-1 flex flex-col p-12 justify-center items-center text-center space-y-12"
          >
            <TrendingUp className="w-24 h-24 text-primary animate-float" />
            <div className="space-y-4">
              <p className="text-sm font-black uppercase tracking-[0.4em] text-primary">New Trend Alert</p>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">#{currentStory.content.trendName}</h3>
            </div>
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-slate-800" />
               ))}
               <div className="w-12 h-12 rounded-full border-4 border-black bg-primary flex items-center justify-center text-[10px] font-black text-white">
                 +{currentStory.content.participants}
               </div>
            </div>
            <button 
               onClick={() => toast.success("Added to Trend Group! 🔥")}
               className="h-16 px-12 bg-white text-black font-black uppercase tracking-[0.2em] rounded-full text-[11px] active:scale-95 transition-all"
            >
              Me Too!
            </button>
          </motion.div>
        );

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Story Layer: Standard View</p>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col touch-none"
    >
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex gap-2 z-20">
        {stories.map((_, i) => (
          <div key={i} className="story-progress-container">
            <div 
              className="story-progress-fill" 
              style={{ width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%' }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-white/20 p-0.5">
            <img src={currentStory.creatorPhoto} className="w-full h-full rounded-[1.1rem] object-cover" />
          </div>
          <div>
            <h4 className="text-white font-black text-sm uppercase flex items-center gap-2">
              {currentStory.creatorHandle}
              {currentStory.isBrand && <span className="bg-amber-500 w-2 h-2 rounded-full" />}
            </h4>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{currentStory.niche} • {currentIndex + 1} of {stories.length}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Tap Areas */}
      <div className="absolute inset-0 flex z-10">
        <div className="flex-1" onClick={handlePrev} />
        <div className="flex-1" onClick={handleNext} />
      </div>

      {/* Content Area */}
      <div className={cn(
        "flex-1 relative flex flex-col",
        currentStory.type === 'WIN' ? 'bg-gradient-to-b from-indigo-950 via-black to-black' :
        currentStory.type === 'BRAND' ? 'bg-gradient-to-b from-amber-950 via-black to-black' : 'bg-black'
      )}>
        {renderTemplate()}
      </div>

      {/* Interactivity Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-10 pb-20 space-y-10 z-20"
      >
        <div className="flex items-center justify-center gap-8">
           <ReactionButton onClick={() => toast.success("Reacted with 🔥")}>🔥</ReactionButton>
           <ReactionButton onClick={() => toast.success("Reacted with ❤️")}>❤️</ReactionButton>
           <ReactionButton onClick={() => toast.success("Reacted with 🙌")}>🙌</ReactionButton>
        </div>
        <div className="relative">
           <input 
             placeholder="Reply to this story..." 
             className="w-full h-16 bg-white/10 backdrop-blur-md rounded-2xl px-8 pr-20 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
           />
           <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/40 hover:text-white transition-colors">
             <Send className="w-5 h-5" />
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
