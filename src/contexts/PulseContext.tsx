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

export type FeedItemType = 
  | 'TRENDING_POST' 
  | 'CREATOR_WIN' 
  | 'LIVE_TREND' 
  | 'BRAND_OPPORTUNITY' 
  | 'COLLAB_MATCH' 
  | 'PERFORMANCE_FLASH' 
  | 'INDUSTRY_INSIGHT' 
  | 'COMMUNITY_POLL';

export interface PulseFeedItem {
  id: string;
  type: FeedItemType;
  timestamp: number;
  content: any;
  isNew?: boolean;
}

interface PulseContextType {
  stories: PulseStory[];
  feedItems: PulseFeedItem[];
  unreadStoriesCount: number;
  newFeedItemsCount: number;
  markAsRead: (storyId: string) => void;
  addStory: (story: Omit<PulseStory, 'id' | 'isRead' | 'timestamp'>) => void;
  clearNewFeedItems: () => void;
  votePoll: (itemId: string, optionIndex: number) => void;
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
    timestamp: Date.now() - 1000 * 60 * 60,
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
    content: { message: 'Setting up for the big review!' },
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    isRead: false,
    isTrending: true,
  },
];

const MOCK_FEED: PulseFeedItem[] = [
  {
    id: 'f1',
    type: 'TRENDING_POST',
    timestamp: Date.now() - 1000 * 120,
    content: {
      platform: 'Instagram',
      niche: 'Fitness',
      message: 'This reel is EXPLODING in your niche right now 🔥',
      thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d3?w=400&q=80',
      format: 'Reel',
      growth: '+14K in last 2 hours',
      hook: '"Nobody told me this about home workouts..."',
    }
  },
  {
    id: 'f2',
    type: 'CREATOR_WIN',
    timestamp: Date.now() - 1000 * 300,
    content: {
      creatorHandle: '@naveenfitlife',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen',
      milestone: '50,000 followers on Instagram!',
      message: 'Naveen just crossed 50,000 followers on Instagram!',
    }
  },
  {
    id: 'f3',
    type: 'BRAND_OPPORTUNITY',
    timestamp: Date.now() - 1000 * 600,
    content: {
      brandLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=MB',
      brandName: 'MuscleBlaze',
      description: 'Looking for fitness creators with 10K–100K followers',
      budget: '₹25,000 – ₹50,000 per post',
      deadline: 'Friday',
      deliverables: '1 Reel + 2 Stories',
      spotsLeft: 3,
      totalSpots: 5
    }
  },
  {
    id: 'f4',
    type: 'COMMUNITY_POLL',
    timestamp: Date.now() - 1000 * 1200,
    content: {
      question: "What's your biggest struggle right now?",
      voters: 2847,
      options: [
        { label: 'Brand deals', votes: 1195, percentage: 42 },
        { label: 'Growth stall', votes: 882, percentage: 31 },
        { label: 'Content ideas', votes: 770, percentage: 27 }
      ],
      hasVoted: false
    }
  },
  {
    id: 'f5',
    type: 'LIVE_TREND',
    timestamp: Date.now() - 1000 * 1800,
    content: {
      platform: 'TikTok',
      trendName: '5am routine',
      niche: 'Fitness',
      velocity: '2,400 creators used this audio in last 6 hours',
      peakPredicted: 'in ~14 hours',
      participants: ['p1', 'p2', 'p3', 'p4', 'p5'],
      participantCount: 23
    }
  }
];

export const PulseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<PulseStory[]>(MOCK_STORIES);
  const [feedItems, setFeedItems] = useState<PulseFeedItem[]>(MOCK_FEED);
  const [newItemsCount, setNewItemsCount] = useState(0);

  // Auto-refresh logic (every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
      // Logic to inject a new mock item periodically to keep it "alive"
      const types: FeedItemType[] = ['TRENDING_POST', 'COLLAB_MATCH', 'PERFORMANCE_FLASH', 'INDUSTRY_INSIGHT'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      const newItem: PulseFeedItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: randomType,
        timestamp: Date.now(),
        isNew: true,
        content: generateMockContent(randomType)
      };

      setFeedItems(prev => [newItem, ...prev]);
      setNewItemsCount(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  const clearNewFeedItems = () => {
    setNewItemsCount(0);
    setFeedItems(prev => prev.map(item => ({ ...item, isNew: false })));
  };

  const votePoll = (itemId: string, optionIndex: number) => {
    setFeedItems(prev => prev.map(item => {
      if (item.id === itemId && item.type === 'COMMUNITY_POLL') {
        const newOptions = [...item.content.options];
        newOptions[optionIndex].votes += 1;
        // Simplified percentage recalc
        const total = newOptions.reduce((acc, opt) => acc + opt.votes, 0);
        newOptions.forEach(opt => opt.percentage = Math.round((opt.votes / total) * 100));
        return { ...item, content: { ...item.content, options: newOptions, hasVoted: true } };
      }
      return item;
    }));
  };

  const unreadStoriesCount = stories.filter(s => !s.isRead).length;

  return (
    <PulseContext.Provider value={{ 
      stories, 
      feedItems, 
      unreadStoriesCount, 
      newFeedItemsCount: newItemsCount,
      markAsRead, 
      addStory,
      clearNewFeedItems,
      votePoll
    }}>
      {children}
    </PulseContext.Provider>
  );
};

const generateMockContent = (type: FeedItemType) => {
  switch (type) {
    case 'COLLAB_MATCH':
      return {
        compatibility: 94,
        creatorName: '@yogawithpriya',
        message: 'Creates yoga content for the same 25–34 female audience as you',
        overlap: 68,
        lastActive: '3 min ago',
        avatars: ['a1', 'a2']
      };
    case 'PERFORMANCE_FLASH':
      return {
        reach: '40K',
        multiplier: '3.8x',
        message: 'Your Tuesday Reel just crossed 40K reach — that\'s 3.8x your average'
      };
    case 'INDUSTRY_INSIGHT':
      return {
        niche: 'Fitness',
        insight: 'Creators who post Reels between 6–8PM on weekdays get 2.4x more saves than those who post in the morning. You currently post at 10AM.'
      };
    default:
      return { message: 'New intelligence available' };
  }
};

export const usePulse = () => {
  const context = useContext(PulseContext);
  if (!context) throw new Error('usePulse must be used within a PulseProvider');
  return context;
};
