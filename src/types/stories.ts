import { LucideIcon } from "lucide-react";

export type StoryType = 'win' | 'bts' | 'trend' | 'poll' | 'collab' | 'casting';

export interface Story {
  id: string;
  type: StoryType;
  content: string;
  timestamp: string;
  image?: string;
  video?: string;
  pollOptions?: string[];
  votes?: Record<string, number>;
  expiresAt: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: 'instagram' | 'youtube' | 'tiktok';
  niche: string;
  isTrending?: boolean;
  isBrand?: boolean;
  hasUnread: boolean;
  stories: Story[];
}
