import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { StoryBubble } from "./StoryBubble";
import { Creator } from "../../types/stories";
import { MOCK_CREATORS } from "../../data/mockStories";
import { cn } from "../../lib/utils";

interface StoryBarProps {
  onStoryClick: (creator: Creator) => void;
  className?: string;
}

export const StoryBar = ({ onStoryClick, className }: StoryBarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Sorting Logic: 
  // 1. User story first
  // 2. Unread stories next (Connections)
  // 3. Brand stories
  // 4. Trending creators
  // 5. Read stories
  const sortedCreators = [...MOCK_CREATORS].sort((a, b) => {
    if (a.id === 'me') return -1;
    if (b.id === 'me') return 1;
    if (a.isBrand && !b.isBrand) return -1;
    if (b.isBrand && !a.isBrand) return 1;
    if (a.hasUnread && !b.hasUnread) return -1;
    if (b.hasUnread && !a.hasUnread) return 1;
    return 0;
  });

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  return (
    <div className={cn("relative group/bar py-2", className)}>
      {/* Scroll Indicators (Desktop only focus) */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none hidden md:block"
          />
        )}
        {canScrollRight && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none hidden md:block"
          />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        onScroll={checkScroll}
        className="flex items-center gap-6 px-4 md:px-6 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-4"
      >
        {sortedCreators.map((creator, i) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: i * 0.05, type: "spring", damping: 15 }}
            className="snap-start"
          >
            <StoryBubble 
              creator={creator} 
              isUser={creator.id === 'me'} 
              onClick={onStoryClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

import { AnimatePresence } from "framer-motion";
