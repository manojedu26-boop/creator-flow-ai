import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ExploreTrend {
  id: string;
  name: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  velocity: number; // 0-100
  creatorCount: number;
}

export interface ExploreCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  thumbnail: string;
  niches: string[];
  followers: string;
  er: string; // Engagement Rate
  score: number;
  isRisingStar?: boolean;
}

export interface BentoCard {
  id: string;
  type: 'POST' | 'BRAND' | 'AUDIO' | 'USER' | 'HOOK' | 'NICHE';
  title: string;
  content: any;
  span?: 'COL' | 'ROW' | 'NONE';
}

export interface ExploreBrand {
  id: string;
  logo: string;
  name: string;
  campaignType: string;
  niches: string[];
  budget: string;
  deadline: string;
  spotsRemaining: number;
  totalSpots: number;
}

export interface ExploreCollab {
  id: string;
  avatar: string;
  name: string;
  niche: string;
  audienceSize: string;
  lookingFor: string;
  matchScore: number;
}

interface ExploreContextType {
  trends: ExploreTrend[];
  creators: ExploreCreator[];
  bentoCards: BentoCard[];
  brands: ExploreBrand[];
  collabs: ExploreCollab[];
  activeNiche: string;
  setActiveNiche: (niche: string) => void;
  flipBento: () => void;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

const MOCK_TRENDS: ExploreTrend[] = [
  { id: 't1', name: '5am Morning Routine', platform: 'TikTok', velocity: 88, creatorCount: 2400 },
  { id: 't2', name: 'AI Workspace Setup', platform: 'YouTube', velocity: 74, creatorCount: 1100 },
  { id: 't3', name: 'Summer Shred Challenge', platform: 'Instagram', velocity: 92, creatorCount: 5600 },
];

const MOCK_CREATORS: ExploreCreator[] = [
  { 
    id: 'c1', name: 'Maya Hills', handle: '@mayahills', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    niches: ['Lifestyle', 'Aesthetics'], followers: '142K', er: '4.8%', score: 88, isRisingStar: true 
  },
  { 
    id: 'c2', name: 'Zane Tech', handle: '@zanetech', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zane',
    thumbnail: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
    niches: ['Tech', 'Gaming'], followers: '84K', er: '6.2%', score: 92 
  },
  { 
    id: 'c3', name: 'Chef Elena', handle: '@chefelena', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    niches: ['Food', 'Travel'], followers: '215K', er: '3.9%', score: 84, isRisingStar: true 
  },
];

const MOCK_BENTO: BentoCard[] = [
  { id: 'b1', type: 'POST', span: 'COL', title: 'Most engaged post in Fitness today', content: { thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80', reach: 48200, niche: 'Fitness' } },
  { id: 'b2', type: 'BRAND', title: 'Brand casting this week', content: { brands: 3, logos: ['A', 'B', 'C'] } },
  { id: 'b3', type: 'AUDIO', title: 'Trending audio', content: { name: 'Sunset Vibes (Lo-fi)', count: 2400 } },
  { id: 'b4', type: 'USER', span: 'ROW', title: "This week's top creator", content: { name: 'Alex Rivera', handle: '@alex_r', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' } },
  { id: 'b5', type: 'HOOK', title: 'Most used hook today', content: { text: "Nobody told me this about..." } },
  { id: 'b6', type: 'NICHE', title: 'Niches growing fastest', content: { list: ['Tech', 'Lifestyle', 'Gaming'] } },
];

const MOCK_BRANDS: ExploreBrand[] = [
  { id: 'br1', name: 'Adobe', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Adobe', campaignType: 'Standard Release', niches: ['Design', 'Tech'], budget: '₹40K - ₹2L', deadline: '2 days left', spotsRemaining: 2, totalSpots: 5 },
  { id: 'br2', name: 'MuscleBlaze', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=MB', campaignType: 'Impact Campaign', niches: ['Fitness'], budget: '₹25K - ₹80K', deadline: '5 days left', spotsRemaining: 1, totalSpots: 3 },
  { id: 'br3', name: 'Lenskart', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=LK', campaignType: 'Quick Launch', niches: ['Lifestyle'], budget: '₹15K - ₹45K', deadline: 'Tomorrow', spotsRemaining: 4, totalSpots: 10 },
];

const MOCK_COLLABS: ExploreCollab[] = [
  { id: 'cl1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', name: 'Priya Yoga', niche: 'Fitness', audienceSize: '50K', lookingFor: 'Yoga & Wellness collab', matchScore: 94 },
  { id: 'cl2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', name: 'Rohan Tech', niche: 'Tech', audienceSize: '20K', lookingFor: 'Gadget review partner', matchScore: 87 },
  { id: 'cl3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', name: 'Sara Travel', niche: 'Travel', audienceSize: '120K', lookingFor: 'Vlog series co-creator', matchScore: 72 },
];

export const ExploreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trends] = useState<ExploreTrend[]>(MOCK_TRENDS);
  const [creators] = useState<ExploreCreator[]>(MOCK_CREATORS);
  const [bentoCards, setBentoCards] = useState<BentoCard[]>(MOCK_BENTO);
  const [brands] = useState<ExploreBrand[]>(MOCK_BRANDS);
  const [collabs] = useState<ExploreCollab[]>(MOCK_COLLABS);
  const [activeNiche, setActiveNiche] = useState('All');

  // Simulate Bento Flip every 15 minutes (shortened for demo visibility if needed, or stick to logic)
  const flipBento = () => {
    setBentoCards(prev => [...prev].reverse()); // Simple flip simulation
  };

  useEffect(() => {
    const interval = setInterval(flipBento, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ExploreContext.Provider value={{ 
      trends, creators, bentoCards, brands, collabs, 
      activeNiche, setActiveNiche, flipBento 
    }}>
      {children}
    </ExploreContext.Provider>
  );
};

export const useExplore = () => {
  const context = useContext(ExploreContext);
  if (!context) throw new Error('useExplore must be used within an ExploreProvider');
  return context;
};
