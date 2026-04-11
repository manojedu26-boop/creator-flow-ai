import { Creator } from "../types/stories";

export const MOCK_CREATORS: Creator[] = [
  {
    id: "me",
    name: "Naveen Kumar",
    handle: "@naveenfitlife",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen",
    platform: "instagram",
    niche: "Fitness",
    hasUnread: false,
    stories: []
  },
  {
    id: "c1",
    name: "Maya Hills",
    handle: "@mayahills",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    platform: "instagram",
    niche: "Wellness",
    hasUnread: true,
    stories: [
      { id: "s1", type: "win", content: "Hit 50K followers on IG today! 🔥", timestamp: "2h ago", expiresAt: "" }
    ]
  },
  {
    id: "c2",
    name: "David V.",
    handle: "@davidvfx",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    platform: "tiktok",
    niche: "VFX",
    isTrending: true,
    hasUnread: true,
    stories: [
      { id: "s2", type: "bts", content: "Late night render session. 💻", timestamp: "4h ago", expiresAt: "" }
    ]
  },
  {
    id: "b1",
    name: "Lululemon",
    handle: "@lululemon",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lulu",
    platform: "instagram",
    niche: "Brand",
    isBrand: true,
    hasUnread: true,
    stories: [
      { id: "s3", type: "casting", content: "Looking for 3 fitness creators in Mumbai! ₹50K budget.", timestamp: "1h ago", expiresAt: "" }
    ]
  },
  {
    id: "c3",
    name: "Sarah Chen",
    handle: "@sarah.creates",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    platform: "youtube",
    niche: "Tech",
    hasUnread: false,
    stories: [
      { id: "s4", type: "poll", content: "Which thumbnail do you prefer?", pollOptions: ["Option A", "Option B"], timestamp: "6h ago", expiresAt: "" }
    ]
  },
  {
    id: "c4",
    name: "Leo Marcus",
    handle: "@leomar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
    platform: "tiktok",
    niche: "Gaming",
    hasUnread: true,
    stories: [
      { id: "s5", type: "trend", content: "Jumping on the #NeonDance trend!", timestamp: "30m ago", expiresAt: "" }
    ]
  }
];
