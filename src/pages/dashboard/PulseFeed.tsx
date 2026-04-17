import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/shared/MotionComponents';
import { StoryBar } from '@/components/stories/StoryBar';
import { DynamicFeed } from '@/components/feed/DynamicFeed';
import { MOCK_CREATORS } from '@/data/mockStories';
import { Creator } from '@/types/stories';
import { StoryViewer } from '@/components/stories/StoryViewer';
import { StoryCreationSheet } from '@/components/stories/StoryCreationSheet';

export const PulseFeed: React.FC = () => {
  const [activeStoryCreator, setActiveStoryCreator] = useState<Creator | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);

  const handleStoryClick = (creator: Creator) => {
    if (creator.id === 'me' && !creator.stories.length) {
      setIsCreatingStory(true);
    } else {
      setActiveStoryCreator(creator);
    }
  };

  const navigateCreatorStories = (direction: 'next' | 'prev') => {
    const currentIndex = creators.findIndex(c => c.id === activeStoryCreator?.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    while (nextIndex >= 0 && nextIndex < creators.length) {
      if (creators[nextIndex].stories.length > 0) {
        setActiveStoryCreator(creators[nextIndex]);
        return;
      }
      nextIndex = direction === 'next' ? nextIndex + 1 : nextIndex - 1;
    }
    setActiveStoryCreator(null);
  };

  const handlePostStory = (type: any, content: string) => {
    const updatedCreators = creators.map(c => {
      if (c.id === 'me') {
        const newStory = {
          id: `s_user_${Date.now()}`,
          type,
          content,
          timestamp: "Just now",
          expiresAt: ""
        };
        return { ...c, stories: [...c.stories, newStory] };
      }
      return c;
    });
    setCreators(updatedCreators);
  };

  return (
    <PageTransition className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 w-full max-w-[600px] mx-auto pt-4 md:pt-12 pb-32">
        <div className="px-2 md:px-0 space-y-4">
           {/* Stories Strip - The compact version */}
           <StoryBar 
             onStoryClick={handleStoryClick} 
             className="mb-8 bg-white z-[60]" 
           />
           
           {/* The Instagram-style Scrolling Feed */}
           <DynamicFeed />
        </div>
      </main>

      <AnimatePresence>
        {activeStoryCreator && (
          <StoryViewer 
            creator={activeStoryCreator}
            onClose={() => setActiveStoryCreator(null)}
            onNextCreator={() => navigateCreatorStories('next')}
            onPrevCreator={() => navigateCreatorStories('prev')}
          />
        )}
      </AnimatePresence>

      <StoryCreationSheet 
        isOpen={isCreatingStory}
        onClose={() => setIsCreatingStory(false)}
        onPost={handlePostStory}
      />
    </PageTransition>
  );
};
