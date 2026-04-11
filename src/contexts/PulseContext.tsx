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

export interface PulseScore {
  score: number;
  tier: 'Seedling' | 'Growing' | 'Electric' | 'On Fire' | 'Diamond' | 'ICON';
  breakdown: {
    consistency: number;
    engagement: number;
    growth: number;
    activity: number;
    deals: number;
    network: number;
  };
}

export interface CollabRoom {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  lastActive: string;
  unreadCount: number;
}

interface PulseContextType {
  stories: PulseStory[];
  feedItems: PulseFeedItem[];
  unreadStoriesCount: number;
  newFeedItemsCount: number;
  pulseScore: PulseScore;
  collabRooms: CollabRoom[];
  markAsRead: (storyId: string) => void;
  addStory: (story: Omit<PulseStory, 'id' | 'isRead' | 'timestamp'>) => void;
  clearNewFeedItems: () => void;
  votePoll: (itemId: string, optionIndex: number) => void;
  updateScore: (newScore: number) => void;
}

const PulseContext = createContext<PulseContextType | undefined>(undefined);

const getTier = (score: number) => {
  if (score < 200) return 'Seedling';
  if (score < 400) return 'Growing';
  if (score < 600) return 'Electric';
  if (score < 800) return 'On Fire';
  if (score < 950) return 'Diamond';
  return 'ICON';
};

const MOCK_STORIES: PulseStory[] = [
  {
    id: '0',
    creatorId: 'me',
    creatorName: 'Your Story',
    creatorHandle: 'me',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Me',
    platform: 'IG',
    niche: 'Lifestyle',
    type: 'BTS',
    content: { message: 'Add to your story' },
    timestamp: Date.now(),
    isRead: true,
  },
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
    timestamp: Date.now() - 1000 * 60 * 15,
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
    timestamp: Date.now() - 1000 * 60 * 45,
    isRead: false,
    isTrending: true,
  },
  {
    id: '3',
    creatorId: 'c3',
    creatorName: 'Marcus Go',
    creatorHandle: 'marcusgo',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    platform: 'TikTok',
    niche: 'Fitness',
    type: 'TREND',
    content: { message: 'New morning routine check' },
    timestamp: Date.now() - 1000 * 60 * 120,
    isRead: false,
  },
  {
    id: '4',
    creatorId: 'c4',
    creatorName: 'Zoe Venture',
    creatorHandle: 'zoeventure',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    platform: 'IG',
    niche: 'Travel',
    type: 'BTS',
    content: { message: 'Bali is calling...' },
    timestamp: Date.now() - 1000 * 60 * 180,
    isRead: true,
  },
  {
    id: '5',
    creatorId: 'c5',
    creatorName: 'Tech Titan',
    creatorHandle: 'techtitan',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Titan',
    platform: 'YT',
    niche: 'Gaming',
    type: 'POLL',
    content: { message: 'Next setup tour?' },
    timestamp: Date.now() - 1000 * 60 * 240,
    isRead: true,
    isBrand: true,
  },
  {
    id: '6',
    creatorId: 'c6',
    creatorName: 'Chef Rahul',
    creatorHandle: 'chefrahul',
    creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    platform: 'IG',
    niche: 'Food',
    type: 'BTS',
    content: { message: 'Secret masala revealed' },
    timestamp: Date.now() - 1000 * 60 * 300,
    isRead: false,
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
  const [pulseScore, setPulseScore] = useState<PulseScore>({
    score: 842,
    tier: 'Diamond',
    breakdown: { consistency: 92, engagement: 88, growth: 76, activity: 95, deals: 82, network: 85 }
  });
  const [collabRooms, setCollabRooms] = useState<CollabRoom[]>([
    { id: 'cr1', partnerName: '@yogawithpriya', partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', status: 'ACTIVE', lastActive: '12m ago', unreadCount: 2 },
    { id: 'cr2', partnerName: '@fit_marcus', partnerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', status: 'PENDING', lastActive: '2d ago', unreadCount: 0 }
  ]);

  // Auto-refresh logic (every 60s)
  useEffect(() => {
    const interval = setInterval(() => {
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
        const total = newOptions.reduce((acc, opt) => acc + opt.votes, 0);
        newOptions.forEach(opt => opt.percentage = Math.round((opt.votes / total) * 100));
        return { ...item, content: { ...item.content, options: newOptions, hasVoted: true } };
      }
      return item;
    }));
  };

  const updateScore = (newScore: number) => {
    setPulseScore(prev => ({
      ...prev,
      score: newScore,
      tier: getTier(newScore)
    }));
  };

  const unreadStoriesCount = stories.filter(s => !s.isRead).length;

  return (
    <PulseContext.Provider value={{ 
      stories, 
      feedItems, 
      unreadStoriesCount, 
      newFeedItemsCount: newItemsCount,
      pulseScore,
      collabRooms,
      markAsRead, 
      addStory,
      clearNewFeedItems,
      votePoll,
      updateScore
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
