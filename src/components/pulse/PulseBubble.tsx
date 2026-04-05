import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Instagram, Youtube, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PulseStory } from '@/contexts/PulseContext';

interface PulseBubbleProps {
  story?: PulseStory;
  isOwn?: boolean;
  onClick: () => void;
}

const PlatformIcon = ({ platform }: { platform: PulseStory['platform'] }) => {
  switch (platform) {
    case 'IG': return <Instagram className="w-2.5 h-2.5 text-white" />;
    case 'YT': return <Youtube className="w-2.5 h-2.5 text-white" />;
    case 'TikTok': return <span className="text-[8px] font-black text-white leading-none">TK</span>;
    default: return null;
  }
};

export const PulseBubble: React.FC<PulseBubbleProps> = ({ story, isOwn, onClick }) => {
  const isUnread = story && !story.isRead;
  const isBrand = story?.isBrand;

  return (
    <div className="flex flex-col items-center gap-3 shrink-0">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="relative group"
      >
        {/* Outer Ring */}
        <div className={cn(
          "w-[70px] h-[70px] md:w-[78px] md:h-[78px] rounded-full flex items-center justify-center p-[3px] transition-all duration-500",
          isOwn && !story ? "border-2 border-dashed border-slate-200" : 
          isBrand ? "pulse-brand animate-pulse-ring" :
          isUnread ? "pulse-unread animate-pulse-ring" : 
          "pulse-read"
        )}>
          {/* Inner Circle / Avatar */}
          <div className="w-full h-full rounded-full bg-white p-[2px]">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
              {isOwn && !story ? (
                <Plus className="w-6 h-6 text-slate-300" />
              ) : (
                <img 
                  src={story?.creatorPhoto || "https://api.dicebear.com/7.x/avataaars/svg?seed=Me"} 
                  alt={story?.creatorHandle} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>

        {/* Platform Badge */}
        {story && (
          <div className={cn(
            "absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm",
            story.platform === 'IG' ? 'bg-gradient-to-tr from-purple-500 to-pink-500' :
            story.platform === 'YT' ? 'bg-red-600' : 'bg-slate-900'
          )}>
            <PlatformIcon platform={story.platform} />
          </div>
        )}

        {/* Add Icon for Own Story */}
        {isOwn && !story && (
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center shadow-lg">
            <Plus className="w-4 h-4 text-white stroke-[3px]" />
          </div>
        )}
      </motion.button>

      {/* Label */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-mono font-bold text-slate-950 uppercase tracking-tight truncate w-20 text-center">
          {isOwn ? 'Your Story' : story?.creatorHandle}
        </span>
        {story?.isTrending && (
          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mt-0.5">
            🔥 Trending
          </span>
        )}
      </div>
    </div>
  );
};
