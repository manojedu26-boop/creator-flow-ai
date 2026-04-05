import React, { useState } from 'react';
import { PulseBubble } from './PulseBubble';
import { usePulse, PulseStory } from '@/contexts/PulseContext';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryViewer } from './StoryViewer';
import { StoryCreator } from './StoryCreator';
import { cn } from '@/lib/utils';

interface PulseStripProps {
  className?: string;
  sticky?: boolean;
}

export const PulseStrip: React.FC<PulseStripProps> = ({ className, sticky }) => {
  const { stories } = usePulse();
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // ... (sorting logic)
  
  const sortedStories = [...stories].sort((a, b) => {
    // Brand stories first
    if (a.isBrand && !b.isBrand) return -1;
    if (!a.isBrand && b.isBrand) return 1;
    
    // Then Unread
    if (!a.isRead && b.isRead) return -1;
    if (a.isRead && !b.isRead) return 1;
    
    // Then most recent
    return b.timestamp - a.timestamp;
  });

  return (
    <div className={cn(
      "w-full relative transition-all duration-300",
      sticky && "sticky top-[var(--header-h)] z-30 bg-background/80 backdrop-blur-xl border-b border-border/10 lg:static lg:bg-transparent lg:backdrop-blur-none lg:border-none",
      className
    )}>
      <div className="flex items-start gap-6 overflow-x-auto no-scrollbar py-6 px-4 md:px-0">
        {/* Your Story Bubble */}
        <PulseBubble 
          isOwn 
          story={stories.find(s => s.creatorId === 'me')} 
          onClick={() => setIsCreatorOpen(true)} 
        />

        {/* Other Stories */}
        {sortedStories.map((story, idx) => (
          <PulseBubble 
            key={story.id} 
            story={story} 
            onClick={() => setSelectedStoryIndex(idx)} 
          />
        ))}
      </div>

      {/* Immersive Viewer Overlay */}
      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer 
            stories={sortedStories} 
            initialIndex={selectedStoryIndex} 
            onClose={() => setSelectedStoryIndex(null)} 
          />
        )}
      </AnimatePresence>

      {/* Story Creator Bottom Sheet */}
      <StoryCreator 
        isOpen={isCreatorOpen} 
        onClose={() => setIsCreatorOpen(false)} 
      />
    </div>
  );
};
