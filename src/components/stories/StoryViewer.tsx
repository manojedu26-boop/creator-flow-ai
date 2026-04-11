import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Heart, Share2, Send, MoreHorizontal, 
  MessageSquare, Flame, Star, Briefcase, 
  ChevronLeft, ChevronRight, Trophy, Zap, Sparkles
} from "lucide-react";
import { Creator, Story } from "../../types/stories";
import { cn } from "../../lib/utils";

interface StoryViewerProps {
  creator: Creator;
  onClose: () => void;
  onNextCreator: () => void;
  onPrevCreator: () => void;
}

export const StoryViewer = ({ creator, onClose, onNextCreator, onPrevCreator }: StoryViewerProps) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const story = creator.stories[activeStoryIndex] || { type: 'bts', content: 'No stories available', timestamp: 'Just now' };

  const handleNext = useCallback(() => {
    if (activeStoryIndex < creator.stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onNextCreator();
    }
  }, [activeStoryIndex, creator.stories.length, onNextCreator]);

  const handlePrev = useCallback(() => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
    } else {
      onPrevCreator();
    }
  }, [activeStoryIndex, onPrevCreator]);

  useEffect(() => {
    const duration = 5000; // 5 seconds
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [handleNext, activeStoryIndex]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      className="fixed inset-0 z-[1000] bg-slate-950 flex flex-col md:items-center md:justify-center"
    >
      {/* Background Blur of Avatar */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={creator.avatar} className="w-full h-full object-cover blur-[100px]" alt="" />
      </div>

      <div className="relative w-full max-w-lg h-full md:h-[90vh] md:aspect-[9/16] bg-slate-900 md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col group">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-50">
          {creator.stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-50"
                style={{ 
                  width: i < activeStoryIndex ? '100%' : i === activeStoryIndex ? `${progress}%` : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white/20">
              <img src={creator.avatar} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest">{creator.handle}</p>
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">{story.timestamp || 'Just now'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white/40 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
          </div>
        </div>

        {/* Interaction Areas (Tap to navigate) */}
        <div className="absolute inset-0 flex z-30">
          <div className="flex-1 cursor-pointer" onClick={handlePrev} />
          <div className="flex-1 cursor-pointer" onClick={handleNext} />
        </div>

        {/* Story Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10 transition-all duration-500">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${creator.id}-${activeStoryIndex}`}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.1 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              {story.type === 'win' && (
                <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-12 flex flex-col items-center justify-center text-center space-y-8 shadow-2xl relative overflow-hidden group/win">
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                   />
                   <div className="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl animate-float">
                      <Trophy className="w-12 h-12 text-white fill-white" />
                   </div>
                   <div className="space-y-4 relative z-10">
                      <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none italic ring-offset-black drop-shadow-2xl">
                        {story.content}
                      </h3>
                      <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/60">Milestone Unlocked</p>
                   </div>
                   <button className="px-8 py-4 bg-white text-indigo-600 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                      Congratulate
                   </button>
                </div>
              )}

              {story.type === 'casting' && (
                <div className="w-full h-full rounded-[2.5rem] bg-slate-50 border-4 border-amber-400 p-12 flex flex-col justify-between relative overflow-hidden">
                   <div className="space-y-6">
                      <div className="flex items-center gap-4 text-amber-600">
                         <Briefcase className="w-6 h-6 fill-amber-600" />
                         <span className="text-sm font-black uppercase tracking-[0.3em]">Casting Call</span>
                      </div>
                      <h3 className="text-4xl font-black text-slate-950 leading-[0.9] uppercase italic">
                        {story.content}
                      </h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-800 font-bold text-xs">
                        Looking for high-engagement creators with interest in sustainable fitness.
                      </div>
                      <button className="w-full h-16 bg-amber-400 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all">
                        Apply Now
                      </button>
                   </div>
                </div>
              )}

              {story.type === 'poll' && (
                <div className="w-full h-full rounded-[2.5rem] bg-card/10 backdrop-blur-xl border border-white/10 p-12 flex flex-col items-center justify-center space-y-12">
                   <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-3xl font-black text-white text-center uppercase leading-none">{story.content}</h3>
                   <div className="w-full space-y-4">
                      {story.pollOptions?.map((opt, i) => (
                        <button key={i} className="w-full h-16 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all flex items-center justify-between px-8">
                           {opt}
                           <span className="opacity-0 group-hover:opacity-100 transition-opacity">0%</span>
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {story.type === 'bts' && (
                <div className="w-full h-full rounded-[2.5rem] bg-slate-950 p-6 flex flex-col justify-end relative group overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
                   <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <Zap className="w-40 h-40 text-blue-600 animate-pulse" />
                   </div>
                   <div className="relative z-20 space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md">BTS</div>
                         <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase italic">Node Sequence Active</span>
                      </div>
                      <p className="text-2xl font-black text-white leading-tight">{story.content}</p>
                      <button className="h-14 px-8 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center truncate gap-3">
                         Collab? <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Interaction Bar */}
        <div className="absolute bottom-10 left-6 right-6 z-50 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Send a message..." 
                className="w-full h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 text-xs text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-blue-400 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-4 px-2">
              <button className="text-white hover:text-rose-500 transition-colors transform hover:scale-125"><Flame className="w-6 h-6" /></button>
              <button className="text-white hover:text-red-500 transition-colors transform hover:scale-125"><Heart className="w-6 h-6" /></button>
              <button className="text-white hover:text-blue-500 transition-colors transform hover:scale-125"><Sparkles className="w-6 h-6" /></button>
            </div>
          </div>
        </div>

      </div>

      {/* Desktop Navigation Arrows */}
      <div className="hidden md:flex absolute inset-x-0 top-1/2 -translate-y-1/2 px-20 items-center justify-between pointer-events-none">
        <button 
          onClick={onPrevCreator}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/20 transition-all flex items-center justify-center pointer-events-auto shadow-2xl active:scale-90"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          onClick={onNextCreator}
          className="w-16 h-16 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-950 border border-white/20 transition-all flex items-center justify-center pointer-events-auto shadow-2xl active:scale-90"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </motion.div>
  );
};
