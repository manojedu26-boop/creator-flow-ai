import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Sparkles, Zap, TrendingUp } from 'lucide-react';
import { usePulse, PulseStory } from '@/contexts/PulseContext';
import { cn } from '@/lib/utils';

const StoryItem = ({ story, isMe = false }: { story: PulseStory; isMe?: boolean }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
    >
      <div className="relative p-[3px] rounded-full">
        {/* Instagram-style Gradient Ring */}
        {!story.isRead && !isMe && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500 via-indigo-600 to-amber-400 animate-spin-slow" />
        )}
        {/* Viewed Story Ring */}
        {story.isRead && !isMe && (
          <div className="absolute inset-0 rounded-full border border-slate-200" />
        )}
        
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white overflow-hidden bg-slate-100 z-10">
          <img 
            src={story.creatorPhoto} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            alt={story.creatorName} 
          />
          {isMe && (
            <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full">
              <div className="bg-indigo-600 rounded-full p-0.5">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Status Badges */}
        {!isMe && story.isTrending && (
          <div className="absolute -top-1 -right-1 bg-rose-500 rounded-full p-1 text-white z-20 shadow-lg scale-75 md:scale-100">
            <TrendingUp className="w-3 h-3" />
          </div>
        )}
        {!isMe && story.isBrand && (
          <div className="absolute -top-1 -right-1 bg-amber-400 rounded-full p-1 text-white z-20 shadow-lg scale-75 md:scale-100">
            <Sparkles className="w-3 h-3" />
          </div>
        )}
      </div>
      
      <span className={cn(
        "text-[10px] md:text-[11px] font-bold tracking-tight truncate w-16 md:w-20 text-center",
        story.isRead ? "text-slate-400" : "text-slate-900"
      )}>
        {story.creatorHandle.replace('@', '')}
      </span>
    </motion.div>
  );
};

interface PulseStripProps {
  className?: string;
  sticky?: boolean;
}

export const PulseStrip: React.FC<PulseStripProps> = ({ className, sticky }) => {
  const { stories } = usePulse();

  return (
    <div className={cn(
      "w-full bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-8 mb-8 overflow-hidden transition-all",
      sticky && "sticky top-4 z-[40] shadow-xl shadow-slate-100",
      className
    )}>
      <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar pb-2">
        {stories.map((story) => (
          <StoryItem 
            key={story.id} 
            story={story} 
            isMe={story.creatorId === 'me'} 
          />
        ))}
      </div>
    </div>
  );
};
