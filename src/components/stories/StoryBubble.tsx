import { motion } from "framer-motion";
import { Plus, Instagram, Youtube, Zap } from "lucide-react";
import { cn } from "../../lib/utils";
import { Creator } from "../../types/stories";

interface StoryBubbleProps {
  creator: Creator;
  isUser?: boolean;
  onClick: (creator: Creator) => void;
}

export const StoryBubble = ({ creator, isUser, onClick }: StoryBubbleProps) => {
  const PlatformIcon = creator.platform === 'instagram' ? Instagram : creator.platform === 'youtube' ? Youtube : Zap;

  return (
    <div className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer" onClick={() => onClick(creator)}>
      <div className="relative">
        {/* Ring */}
        <div className={cn(
          "w-[68px] h-[68px] md:w-[76px] md:h-[76px] rounded-full flex items-center justify-center p-[3px] transition-all duration-500",
          creator.isBrand 
            ? "bg-gradient-to-tr from-amber-400 to-yellow-600 shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
            : creator.hasUnread 
              ? "bg-gradient-to-tr from-pink-500 to-blue-500 animate-gradient-pulse" 
              : "bg-slate-200"
        )}>
          <div className="w-full h-full rounded-full bg-white p-1">
            <div className="w-full h-full rounded-full overflow-hidden relative border border-slate-100 shadow-inner">
              <img 
                src={creator.avatar} 
                alt={creator.handle} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {isUser && !creator.stories.length && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Plus className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Badge */}
        {!isUser && (
          <div className={cn(
            "absolute bottom-0 right-0 w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110",
            creator.platform === 'instagram' ? 'bg-pink-500' : creator.platform === 'youtube' ? 'bg-red-600' : 'bg-slate-950'
          )}>
            <PlatformIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Label */}
      <div className="flex flex-col items-center">
        <span className={cn(
          "text-[10px] md:text-[11px] font-mono uppercase tracking-widest transition-colors leading-tight",
          creator.hasUnread ? "text-slate-950 font-black" : "text-slate-400 font-bold"
        )}>
          {isUser ? "You" : creator.handle.slice(0, 10)}
        </span>
        {creator.isTrending && (
          <span className="text-[7px] font-black uppercase text-orange-500 tracking-tighter mt-0.5 animate-pulse">
            🔥 Trending
          </span>
        )}
      </div>
    </div>
  );
};
