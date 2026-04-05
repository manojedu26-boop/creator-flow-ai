import React, { createContext, useContext, useState, useEffect } from 'react';

export type StoryType = 'WIN' | 'BTS' | 'TREND' | 'POLL' | 'COLLAB' | 'BRAND';

export interface PulseStory {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorPhoto: string;
  platform: 'IG' | 'YT' | 'TikTok';
  niche: string;
  type: StoryType;
  content: any;
  timestamp: number;
  isRead: boolean;
  isTrending?: boolean;
  isBrand?: boolean;
}

interface PulseContextType {
  stories: PulseStory[];
  markAsRead: (storyId: string) => void;
  addStory: (story: Omit<PulseStory, 'id' | 'isRead' | 'timestamp'>) => void;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

const MOCK_STORIES: PulseStory[] = [
  {
    id: '1',
    creatorId: 'c1',
    creatorName: 'Maya Hills',
    creatorHandle: 'mayahills',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    platform: 'IG',
    niche: 'Lifestyle',
    type: 'WIN',
    content: { milestone: '50K', message: 'Hit 50K today 🔥' },
    timestamp: Date.now() - 1000 * 60 * 60, // 1h ago
    isRead: false,
  },
  {
    id: '2',
    creatorId: 'c2',
    creatorName: 'Elena Sun',
    creatorHandle: 'elenasun',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    platform: 'YT',
    niche: 'Tech',
    type: 'BTS',
    content: { videoUrl: '', message: 'Setting up for the big review!' },
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    isRead: false,
    isTrending: true,
  },
  {
    id: '3',
    creatorId: 'b1',
    creatorName: 'Adobe',
    creatorHandle: 'adobe',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Adobe',
    platform: 'IG',
    niche: 'Software',
    type: 'BRAND',
    content: { casting: '3 Designers wanted', budget: '₹40K' },
    timestamp: Date.now() - 1000 * 60 * 30,
    isRead: false,
    isBrand: true,
  },
  {
    id: '4',
    creatorId: 'c3',
    creatorName: 'Leo Marcus',
    creatorHandle: 'lemarcus',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
    platform: 'TikTok',
    niche: 'VFX',
    type: 'TREND',
    content: { trendName: 'VFX Transition', participants: 142 },
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    isRead: true,
  },
];

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<PulseStory[]>(MOCK_STORIES);

  const markAsRead = (storyId: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, isRead: true } : s));
  };

  const addStory = (story: Omit<PulseStory, 'id' | 'isRead' | 'timestamp'>) => {
    const newStory: PulseStory = {
      ...story,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isRead: false,
    };
    setStories(prev => [newStory, ...prev]);
  };

  return (
    <PulseContext.Provider value={{ stories, markAsRead, addStory }}>
      {children}
    </PulseContext.Provider>
  );
};

export const usePulse = () => {
  const context = useContext(PulseContext);
  if (!context) throw new Error('usePulse must be used within a PulseProvider');
  return context;
};
