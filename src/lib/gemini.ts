import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export interface CreatorData {
  niche: string;
  platforms: string[];
  metrics?: {
    followers: number;
    avgEngagement: string;
  };
}

export interface ContentSuggestion {
  type: "Reel" | "Carousel" | "Story" | "Long-form" | "Post" | "Video" | "Short";
  topic: string;
  bestTime: string;
  caption: string;
  hashtags: string[];
  hook: string;
  reason?: string;
}

export interface CalendarEvent {
  day: number;
  type: string;
  platform: "ig" | "yt" | "tt";
  topic: string;
  time: string;
}

/**
 * Generates a single high-fidelity content suggestion for "What should I post today?"
 */
export async function generateDailyPostIdea(data: CreatorData): Promise<ContentSuggestion> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a world-class content strategist for elite creators.
    Creator Context:
    - Niche: ${data.niche}
    - Platforms: ${data.platforms.join(", ")}
    
    Task: Generate ONE specific, high-engagement content idea for TODAY.
    
    Return the response in STRICTR_ JSON format only:
    {
      "type": "Reel" | "Carousel" | "Story" | "Long-form",
      "topic": "Specific actionable topic based on the niche",
      "bestTime": "Optimal time to post (e.g., 7:00 PM)",
      "caption": "A full, professional caption written in the creator's voice",
      "hashtags": ["list", "of", "exactly", "15", "hashtags"],
      "hook": "One powerful hook line for the first 3 seconds",
      "reason": "Brief technical logic why this works best for their metrics"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

/**
 * Generates 30 days of content suggestions for the automated calendar.
 */
export async function generate30DayStrategy(data: CreatorData, month: string): Promise<CalendarEvent[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Generate a 30-day content calendar strategy for a creator in the ${data.niche} niche.
    Target Month: ${month}
    Platforms: ${data.platforms.join(", ")}
    
    Strategy: Mix highly educational content with lifestyle behind-the-scenes and viral trend hooks.
    
    Return a JSON array of exactly 30 items:
    [
      {
        "day": 1,
        "type": "Reel" | "Video" | "Post" | "Story",
        "platform": "ig" | "yt" | "tt",
        "topic": "Short catchy topic",
        "time": "e.g. 10:00 AM"
      },
      ...
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedJson);
  } catch (error) {
    console.error("Strategy Generation Error:", error);
    throw error;
  }
}

/**
 * Rewrites a caption based on a target tone.
 */
export async function rewriteCaption(caption: string, tone: "Professional" | "Casual" | "Funny" | "Inspirational"): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Rewrite the following social media caption to have a ${tone} tone. 
    Maintain the core message but optimize for engagement and the specific vibe of ${tone}.
    
    Original Caption:
    "${caption}"
    
    Return only the rewritten caption text.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Caption Rewrite Error:", error);
    throw error;
  }
}
