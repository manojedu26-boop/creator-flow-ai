import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Video, Hash, Music, Zap, Mail, Layout, UserCircle,
  Grid, Lightbulb, Copy, RefreshCcw, Check, Sparkles, Download,
  ExternalLink, Eye, FileText, Share2, ChevronDown, UploadCloud,
  Play, Bookmark, X, Clock, Loader2, ArrowRight, Trash2, BookOpen,
  Calendar
} from "lucide-react";
import { PageTransition, SkeletonCard } from "../../components/shared/MotionComponents";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { useAuth } from "../../contexts/AuthContext";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { 
  ContentSuggestion, 
  CalendarEvent 
} from "../../lib/gemini";
import { supabase } from "../../lib/supabase";
import { DailyPostCard } from "../../components/studio/DailyPostCard";
import { CaptionRewriter } from "../../components/studio/CaptionRewriter";
import { Calendar as MonthPlanner } from "./Calendar";

// ── Types ───────────────────────────────────────────────────────────────────
type ToolType = "command" | "caption" | "script" | "hook" | "hashtag" | "audio" | "pitch" | "bio" | "carousel" | "reel" | "thumbnail";

interface CaptionVariant { label: string; text: string; copied: boolean; saved: boolean; toneOpen: boolean; }
interface ScriptSection { act: string; text: string; editing: boolean; }
interface HookItem { type: string; text: string; saved: boolean; }
interface HashtagItem { text: string; selected: boolean; tier: "mega" | "mid" | "niche"; }
interface AudioItem { id: string; name: string; creator: string; uses: string; trending: boolean; }
interface HistoryItem { id: string; type: string; text: string; date: string; platform: string; }

// ── Tool Definitions ─────────────────────────────────────────────────────────
const tools = [
  { id: "command", icon: Layout, label: "Command Center" },
  { id: "caption", icon: PenTool, label: "Caption Writer" },
  { id: "hook", icon: Zap, label: "Hook Generator" },
  { id: "hashtag", icon: Hash, label: "Hashtag Engine" },
  { id: "audio", icon: Music, label: "Trending Audio" },
  { id: "script", icon: Video, label: "Script Generator" },
  { id: "reel", icon: Lightbulb, label: "Reel & Short Ideas" },
  { id: "pitch", icon: Mail, label: "Brand Pitch Writer" },
  { id: "carousel", icon: Grid, label: "Carousel Builder" },
  { id: "thumbnail", icon: Layout, label: "Thumbnail Concept" },
  { id: "bio", icon: UserCircle, label: "Bio Optimizer" },
];

const THINKING_MESSAGES = [
  "Analyzing your niche trends...",
  "Optimizing for high engagement...",
  "Generating viral hooks...",
  "Perfecting your brand voice...",
  "Almost there! Polishing the output...",
];

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED_CAPTIONS = (niche: string = "fitness"): CaptionVariant[] => [
  { label: "Punchy & Short", text: `${niche.charAt(0).toUpperCase() + niche.slice(1)} goals: Sweat, Stretch, Slay. No days off. 🚀 Save this if you needed to hear it.`, copied: false, saved: false, toneOpen: false },
  { label: "Engaging & Medium", text: `Struggling with ${niche}? Here's my 10-minute ritual that changes everything. Three weeks in and the results speak for themselves. Try it tomorrow! ⬇️ Drop a 🔥 if you're in.`, copied: false, saved: false, toneOpen: false },
  { label: "Story-Led & Long", text: `I used to skip ${niche} routines for years. I told myself I didn't have time. I paid the price — burnout, zero energy, zero progress. Then I found this 10-minute flow. Now it's non-negotiable. Here's exactly what I do every morning. Save this. You will thank yourself at the 3-month mark.`, copied: false, saved: false, toneOpen: false },
];

const SEED_HOOKS = (): HookItem[] => [
  { type: "🔥 Shocking Stat", text: "92% of creators fail because they skip this one morning ritual.", saved: false },
  { type: "🧐 Controversial Opinion", text: "Posting more content is actually killing your growth. Here's why.", saved: false },
  { type: "😩 Relatable Problem", text: "Ever feel like you're working all day but getting nothing done?", saved: false },
  { type: "📖 Story Opener", text: "I lost 10,000 followers in one week. Here's what I learned.", saved: false },
  { type: "🚀 Bold Claim", text: "You can build a 100K following with just 3 posts a week. Let me show you.", saved: false },
  { type: "❓ Open Loop", text: "What if the algorithm actually wants you to post LESS? (stay till the end)", saved: false },
  { type: "🏆 Challenge", text: "I challenge you to try this for 7 days. Your analytics will never look the same.", saved: false },
  { type: "💡 Counterintuitive", text: "Stop trying to go viral. Here's what actually builds an audience.", saved: false },
  { type: "📊 Data Proof", text: "I studied 500 creator accounts. The top 1% all do one weird thing in common.", saved: false },
  { type: "⏱️ Urgency", text: "This trend expires in 48 hours. Creator who use it now will get 10x the reach.", saved: false },
];

const SEED_HASHTAGS = (niche: string = "fitness"): HashtagItem[] => [
  ...["#fitness", "#lifestyle", "#health", "#wellness", "#creator", "#reels"].map(t => ({ text: t, selected: true, tier: "mega" as const })),
  ...["#fitnessmotivation", "#workouttips", "#dailyroutine", "#creatorforge", "#motivationmonday"].map(t => ({ text: t, selected: true, tier: "mid" as const })),
  ...["#mumbaifit", "#deskworkout", "#morningstretch", "#fitfamindia", `#${niche}creator`, "#homegym", "#fitnessindia"].map(t => ({ text: t, selected: true, tier: "niche" as const })),
];

const SEED_AUDIO = (): AudioItem[] => [
  { id: "a1", name: "Escapism", creator: "Metro Boomin", uses: "4.2M", trending: true },
  { id: "a2", name: "Blinding Lights (Sped Up)", creator: "The Weeknd", uses: "8.8M", trending: true },
  { id: "a3", name: "Peh Gaya Khalara", creator: "Aditya A", uses: "2.1M", trending: true },
  { id: "a4", name: "Die With A Smile", creator: "Lady Gaga", uses: "12.3M", trending: false },
  { id: "a5", name: "Calm Down", creator: "Rema & Selena Gomez", uses: "9.7M", trending: true },
  { id: "a6", name: "As It Was", creator: "Harry Styles", uses: "6.5M", trending: false },
  { id: "a7", name: "Tum Kya Mile", creator: "Sachet - Parampara", uses: "3.8M", trending: true },
  { id: "a8", name: "Kem Cho", creator: "Aayesha Majumdar", uses: "1.9M", trending: true },
  { id: "a9", name: "Glimpse of Us", creator: "Joji", uses: "5.1M", trending: false },
  { id: "a10", name: "Die Hard", creator: "Kendrick Lamar", uses: "2.8M", trending: false },
];

const SEED_SCRIPT = (): ScriptSection[] => [
  { act: "🎬 HOOK (0–3 sec)", text: "90% of creators fail because they focus on the wrong thing. Here's what actually works.", editing: false },
  { act: "📖 INTRO (3–15 sec)", text: "I've spent 5 years studying the top 1% of earners. They all follow the same repeatable pattern.", editing: false },
  { act: "📌 POINT 1: THE FOUNDATION", text: "Stop looking for tricks. Master the psychology of attention first. Everything else follows.", editing: false },
  { act: "📌 POINT 2: SYSTEMIZATION", text: "Build a repeatable workflow. Content is a game of consistency, not luck or pure talent.", editing: false },
  { act: "📌 POINT 3: THE COMPOUND EFFECT", text: "Small wins lead to massive results over 12 months. Don't quit in month two.", editing: false },
  { act: "🎯 CTA", text: "Save this post if you're ready to be in that 1%. Drop a comment — what's your biggest block right now?", editing: false },
];

const SEED_PITCH = (): string => `Hi [Brand Manager Name],

I've been following [Brand Name]'s recent campaigns, and I love how you're leaning into [Specific Aesthetic/Value]. 

With [My Follower Count] focused followers in the [My Niche] space, I've managed a [My Engagement Rate]% engagement rate this quarter. I'd love to propose a [Specific Content Format, e.g., 3-part Reel series] showcasing [Brand Product] integrated into my [Daily Routine/Content Category].

Attached is my Media Kit. Let's discuss how we can drive [Specific Goal, e.g., brand awareness/conversions] for your upcoming launch.

Best,
[My Name]`;

const SEED_REEL_IDEAS = (niche: string): any[] => [
  { title: "The 3-Second Rule", concept: `Show 3 quick ${niche} mistakes in the first 3 seconds to trigger the 'wait, do I do that?' response.`, audio: "Trending: 'In This Shirt'" },
  { title: "Day In The Life (POV)", concept: `Fast-cut POV of your ${niche} workflow. Use text overlays to explain the 'invisible work' nobody sees.`, audio: "Trending: 'Lofi Beats'" },
  { title: "The Transformation Archive", concept: `Looping transition from 1 year ago vs. today. The hook: 'I almost quit at month 3.'`, audio: "Trending: 'Success Mantra'" },
];

const SEED_CAROUSEL = (topic: string): any[] => [
  { slide: 1, title: "The Hook", content: `Why your ${topic || 'content'} isn't converting (and the 5-min fix).` },
  { slide: 2, title: "The Problem", content: "Most people focus on quantity, but the algorithm craves 'Retention-Value Density'." },
  { slide: 3, title: "The Solution", content: "Apply the '1-Post, 3-Wins' framework to every piece of static content." },
  { slide: 4, title: "The CTA", content: "Save this for your next design session. Link in bio for the full template." },
];

const SEED_BIO = (niche: string): any[] => [
  { platform: "SEO / Growth", text: `📍 Helping [Target Audience] master ${niche}\n📈 [Stat, e.g., 100K+] community builders\n🔗 Free [Lead Magnet] below!` },
  { platform: "Creative / Minimal", text: `Narrating the ${niche} era.\nDigital Architect. [Location].\nNew series every Tuesday.` },
];

// ── Main Component ────────────────────────────────────────────────────────────
export const ContentStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolType>("command");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [thinkingMsg, setThinkingMsg] = useState("");
  const [previewCaption, setPreviewCaption] = useState<string | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<"tool" | "history">("tool");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const niche = (user as any)?.niche || "fitness";

  // Tool-specific state
  const [captions, setCaptions] = useState<CaptionVariant[] | null>(null);
  const [scriptSections, setScriptSections] = useState<ScriptSection[] | null>(null);
  const [hooks, setHooks] = useState<HookItem[] | null>(null);
  const [hashtags, setHashtags] = useState<HashtagItem[] | null>(null);
  const [audioList, setAudioList] = useState<AudioItem[]>(SEED_AUDIO());
  const [audioLoading, setAudioLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationPhase, setGenerationPhase] = useState("");

  // AI Content Planner State
  const [dailySuggestion, setDailySuggestion] = useState<ContentSuggestion | null>(null);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);


  const ThinkingOverlay = ({ progress, phase }: { progress: number, phase: string }) => {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl"
        />
        
        {/* Ambient Neural Grid */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: Math.random() * 0.5 
              }}
              animate={{
                y: [null, Math.random() * -100, Math.random() * -200],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-xl bg-white rounded-[4rem] p-16 shadow-premium border border-white/20 text-center space-y-12 overflow-hidden"
        >
          <div className="relative z-10 space-y-10">
            <div className="relative w-40 h-40 mx-auto">
              {/* Outer Ring */}
              <svg className="w-full h-full rotate-[-90deg]">
                <circle
                  cx="80" cy="80" r="74"
                  fill="none" stroke="#f1f5f9" strokeWidth="4"
                />
                <motion.circle
                  cx="80" cy="80" r="74"
                  fill="none" stroke="#4f46e5" strokeWidth="4"
                  strokeDasharray="464.9"
                  animate={{ strokeDashoffset: 464.9 - (464.9 * progress / 100) }}
                  transition={{ duration: 0.5, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Pulsing Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl" 
                  />
                  <div className="relative w-full h-full bg-white border border-indigo-100 rounded-[2rem] flex items-center justify-center shadow-lg">
                    <Sparkles className="w-10 h-10 text-indigo-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">Phase {Math.ceil(progress / 25)}</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{progress}% Complete</span>
              </div>
              <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none">Neural Synthesis</h3>
              <div className="h-6 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={phase}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="text-[12px] font-black uppercase tracking-[0.3em] text-indigo-600"
                  >
                    {phase}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Source Nodes</p>
                <p className="text-[11px] font-bold text-slate-900 uppercase">Synchronised</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Brand Voice</p>
                <p className="text-[11px] font-bold text-slate-900 uppercase">Calibrated</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // Caption form state
  const [captionTopic, setCaptionTopic] = useState("");
  const [captionPlatform, setCaptionPlatform] = useState("IG");
  const [captionTone, setCaptionTone] = useState("Inspiring");
  const [captionGoal, setCaptionGoal] = useState("Grow Followers");
  const [captionLength, setCaptionLength] = useState("M");

  // Script form state
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptFormat, setScriptFormat] = useState("Hook Reel / Short");
  const [scriptDuration, setScriptDuration] = useState("60s");
  const [scriptAudience, setScriptAudience] = useState("Intermediate");

  // Hook form state
  const [hookTopic, setHookTopic] = useState("");

  // Other tool states
  const [pitchResult, setPitchResult] = useState<string | null>(null);
  const [reelIdeas, setReelIdeas] = useState<any[] | null>(null);
  const [carouselSlides, setCarouselSlides] = useState<any[] | null>(null);
  const [bioVariations, setBioVariations] = useState<any[] | null>(null);
  const [thumbnailConcept, setThumbnailConcept] = useState<string | null>(null);

  // Additional form states
  const [brandName, setBrandName] = useState("");
  const [pitchGoal, setPitchGoal] = useState("Long-term Partnership");
  const [reelTopic, setReelTopic] = useState("");
  const [carouselTopic, setCarouselTopic] = useState("");
  const [bioNiche, setBioNiche] = useState("");

  // Hashtag form state
  const [hashtagInput, setHashtagInput] = useState("");

  useEffect(() => {
    db.getAll<HistoryItem>("content").reverse().slice(0, 10).forEach(() => {});
    setHistory(db.getAll<HistoryItem>("content").reverse().slice(0, 10));
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const runGenerate = useCallback(async (onDone: () => void) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const phases = [
      { p: "Analyzing Niche Context", start: 0, end: 25 },
      { p: "Calibrating Brand Voice", start: 25, end: 50 },
      { p: "Synthesizing Neural Directives", start: 50, end: 75 },
      { p: "Finalizing Output Precision", start: 75, end: 100 }
    ];

    for (const phase of phases) {
      setGenerationPhase(phase.p);
      const steps = 10;
      const stepSize = (phase.end - phase.start) / steps;
      for (let i = 1; i <= steps; i++) {
        setGenerationProgress(phase.start + (i * stepSize));
        await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
      }
    }

    await new Promise(r => setTimeout(r, 600));
    setIsGenerating(false);
    onDone();
  }, []);

  const handleGenerateDaily = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Initializing Neural Broadcast...");
    
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "DAILY_POST", 
          niche: niche,
          platforms: (user as any)?.platforms || ["instagram"]
        },
      });

      if (error) throw error;

      // Simulate a bit of cinematic progress
      for (let i = 0; i <= 100; i += 10) {
        setGenerationProgress(i);
        if (i < 30) setGenerationPhase("Scanning Niche Trends...");
        else if (i < 60) setGenerationPhase("Calibrating Brand Voice...");
        else if (i < 90) setGenerationPhase("Architecting Hook Node...");
        else setGenerationPhase("Finalizing Synthesis...");
        await new Promise(r => setTimeout(r, 80));
      }

      if (data?.output) {
        setDailySuggestion(data.output);
        toast.success("Broadcast Node Ready!");
      }
    } catch (error) {
      console.error("Daily Post Error:", error);
      toast.error("Neural Synthesis Failed", { description: "Resetting alignment buffers..." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanMonth = async () => {
    setIsSyncingCalendar(true);
    setGenerationProgress(0);
    setGenerationPhase("Initializing Strategy Matrix...");
    toast.info("Generating 30-Day Automated Matrix...");
    
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "MONTH_STRATEGY", 
          niche: niche,
          month: currentMonth,
          platforms: (user as any)?.platforms || ["instagram"]
        },
      });

      if (error) throw error;

      // Map to Calendar database format
      const now = new Date();
      if (data?.output && Array.isArray(data.output)) {
        data.output.forEach((event: any, i: number) => {
          db.insert("cal_posts", {
            id: `ai_auto_${Date.now()}_${i}`,
            platforms: [event.platform],
            type: event.type.toLowerCase(),
            caption: event.topic,
            time: event.time,
            day: event.day,
            month: now.getMonth(),
            year: now.getFullYear(),
            status: "approved"
          });
        });
        toast.success("Month Plan Locked!", { description: "30 items approved and synced to your roadmap." });
      }
    } catch (error) {
      console.error("Month Plan Error:", error);
      toast.error("Strategy Matrix Error");
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  const handleGenerateHooks = async () => {
    if (!hookTopic.trim()) {
      toast.error("Enter a topic for your hooks");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Initializing Attention Matrix...");

    try {
      // Direct call to our new Edge Function
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "HOOK_GENERATOR", 
          inputData: hookTopic 
        },
      });

      if (error) throw error;

      // Simulate a bit of cinematic progress for the brand feel
      for (let i = 0; i <= 100; i += 10) {
        setGenerationProgress(i);
        if (i < 40) setGenerationPhase("Analyzing Viral Hooks...");
        else if (i < 80) setGenerationPhase("Architecting Retention Paths...");
        else setGenerationPhase("Finalizing Synthesis...");
        await new Promise(r => setTimeout(r, 100));
      }

      if (data?.output) {
        // Parse the hooks. They come as a string, often numbered.
        // We'll split them and map to our HookItem format.
        const generatedHooks = data.output.split('\n')
          .filter((h: string) => h.trim().length > 0)
          .map((text: string) => ({
            type: "🚀 AI Generated",
            text: text.replace(/^\d+\.\s*/, '').trim(),
            saved: false
          }));
        
        setHooks(generatedHooks);
        toast.success(`${generatedHooks.length} Viral Hooks Generated!`);
      }
    } catch (error: any) {
      console.error("Hook Generation Error:", error);
      toast.error("Failed to generate attention hooks.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePitch = async () => {
    if (!brandName.trim()) {
      toast.error("Enter a target brand name");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Drafting Collaboration Blueprint...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "BRAND_PITCH", 
          brandName: brandName,
          niche: niche,
          creatorName: (user as any)?.name || "Naveen" 
        },
      });

      if (error) throw error;

      // Cinematic progress
      for (let i = 0; i <= 100; i += 20) {
        setGenerationProgress(i);
        await new Promise(r => setTimeout(r, 120));
      }

      if (data?.output) {
        setPitchResult(data.output);
        toast.success("High-Conversion Pitch Ready!");
      }
    } catch (error) {
      console.error("Pitch Error:", error);
      toast.error("Pitch Synthesis Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateHashtags = async () => {
    if (!captionTopic.trim()) {
      toast.error("Enter a topic for hashtags");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Scanning Viral Clusters...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "HASHTAG_ENGINE", 
          inputData: captionTopic 
        },
      });

      if (error) throw error;

      if (data?.output) {
        // Transform the space/comma separated hashtags into our HashtagItem format
        const tags = data.output.split(/[\s,]+/)
          .filter((t: string) => t.startsWith("#"))
          .map((text: string, i: number) => ({
            text,
            selected: true,
            tier: i < 5 ? "mega" : i < 10 ? "mid" : "niche"
          }));
        setHashtags(tags);
        toast.success("Viral Clusters Synced!");
      }
    } catch (error) {
      console.error("Hashtag Error:", error);
      toast.error("Neural Tagging Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCaptions = async () => {
    if (!captionTopic.trim()) {
      toast.error("Enter a topic for your captions");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Architecting Narrative Nodes...");

    try {
      // In a real production scenario, we'd iterate or use a prompt that returns multiple.
      // For this high-velocity UX, we'll prompt for 3 variants.
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "TONE_ARCHITECT", 
          inputData: captionTopic,
          targetAesthetic: captionTone
        },
      });

      if (error) throw error;

      // Cinematic progress
      for (let i = 0; i <= 100; i += 15) {
        setGenerationProgress(i);
        await new Promise(r => setTimeout(r, 60));
      }

      if (data?.output) {
        // We'll generate 3 variants based on the single AI output for now to keep it snappy
        const coreText = data.output;
        const variants: CaptionVariant[] = [
          { label: "Punchy & Short", text: coreText.slice(0, 150) + "...", copied: false, saved: false, toneOpen: false },
          { label: "Engaging & Medium", text: coreText, copied: false, saved: false, toneOpen: false },
          { label: "Story-Led & Long", text: coreText + "\n\n" + "Save this for your next growth session. 🚀", copied: false, saved: false, toneOpen: false }
        ];
        setCaptions(variants);
        toast.success("3 Production variants locked!");
      }
    } catch (error) {
      console.error("Caption Gen Error:", error);
      toast.error("Narrative Synthesis Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!bioNiche.trim()) {
      toast.error("Enter a niche for your bio");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Optimizing Profile Signal...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "BIO_OPTIMIZER", 
          niche: bioNiche
        },
      });

      if (error) throw error;

      if (data?.output) {
        // Output comes separated by "---"
        const variants = data.output.split("---").map((text: string) => ({
          platform: "Instagram / Twitter",
          text: text.trim()
        }));
        setBioVariations(variants);
        toast.success("Bio Variations Calibrated!");
      }
    } catch (error) {
      console.error("Bio Error:", error);
      toast.error("Profile Optimization Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateScript = async () => {
    if (!scriptTopic.trim()) {
      toast.error("Enter a narrative for your script");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Sequencing Narrative Beats...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "SCRIPT_GENERATOR", 
          inputData: scriptTopic,
          format: scriptFormat,
          duration: scriptDuration,
          audience: scriptAudience
        },
      });

      if (error) throw error;

      if (data?.output) {
        setScriptSections(data.output);
        toast.success("Sequence Locked & Generated!");
      }
    } catch (error) {
      console.error("Script Error:", error);
      toast.error("Script Sequencing Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReelIdeas = async () => {
    if (!reelTopic.trim()) {
      toast.error("Enter a theme for your reels");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Synthesizing Engagement Spikes...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "REEL_IDEAS", 
          inputData: reelTopic,
          niche: niche
        },
      });

      if (error) throw error;

      if (data?.output) {
        setReelIdeas(data.output);
        toast.success("3 Production-Ready Concepts!");
      }
    } catch (error) {
      console.error("Reel Ideas Error:", error);
      toast.error("Concept Synthesis Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCarousel = async () => {
    if (!carouselTopic.trim()) {
      toast.error("Enter a topic for your carousel");
      return;
    }
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Architecting Slide Stack...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "CAROUSEL_BUILDER", 
          inputData: carouselTopic 
        },
      });

      if (error) throw error;

      if (data?.output) {
        setCarouselSlides(data.output);
        toast.success("5-Slide Framework Generated!");
      }
    } catch (error) {
      console.error("Carousel Error:", error);
      toast.error("Framework Architecture Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationPhase("Initializing Packaging Analysis...");

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "THUMBNAIL_ORACLE", 
          inputData: niche, // Using niche as context
          niche: niche
        },
      });

      if (error) throw error;

      if (data?.output) {
        setThumbnailConcept(data.output);
        toast.success("Visual Strategy Synthesized!");
      }
    } catch (error) {
      console.error("Thumbnail Error:", error);
      toast.error("Packaging Analysis Failed");
    } finally {
      setIsGenerating(false);
    }
  };


  const saveToLibrary = (text: string, type: string, platform = "Instagram") => {
    const item: HistoryItem = { id: `c_${Date.now()}`, type, text, platform, date: new Date().toISOString().split("T")[0] };
    db.insert("content", item);
    setHistory(prev => [item, ...prev].slice(0, 10));
    toast.success("Saved to Library!", { description: "Find it in your Content Library tab." });
  };

  const handleCopy = async (text: string, index?: number, setState?: (fn: (prev: any) => any) => void) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", { description: "Paste anywhere you need it." });
    if (setState !== undefined && index !== undefined) {
      setState((prev: CaptionVariant[]) => prev.map((c, i) => i === index ? { ...c, copied: true } : c));
      setTimeout(() => setState((prev: CaptionVariant[]) => prev.map((c, i) => i === index ? { ...c, copied: false } : c)), 1500);
    }
  };

  // ── Render Tools ─────────────────────────────────────────────────────────

  const renderCaptionWriter = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Caption <span className="text-blue-600">Architect</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">AI-driven narrative crafting for maximum engagement</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Post Core Topic</label>
          <AutoResizeTextarea
            placeholder={`e.g. My daily ${niche} ritual for mental clarity...`}
            value={captionTopic}
            onChange={(e: any) => setCaptionTopic(e.target.value)}
            className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-inner resize-none"
            maxLength={500}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Platform */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</label>
            <div className="flex gap-1.5">
              {["IG", "YT", "TT"].map(p => (
                <button key={p} onClick={() => setCaptionPlatform(p)} className={cn(
                  "flex-1 py-3 rounded-2xl border text-[10px] font-black transition-all",
                  captionPlatform === p ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-200" : "bg-white border-slate-200 text-slate-400 hover:border-blue-300"
                )}>{p}</button>
              ))}
            </div>
          </div>
          {/* Tone */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Voice Tone</label>
            <select value={captionTone} onChange={e => setCaptionTone(e.target.value)} className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
              {["Funny", "Inspiring", "Educational", "Storytelling", "Bold", "Casual"].map(t => <option key={t} className="text-black">{t}</option>)}
            </select>
          </div>
          {/* Length */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maturity</label>
            <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
              {["S", "M", "L"].map(l => (
                <button key={l} onClick={() => setCaptionLength(l)} className={cn(
                  "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                  captionLength === l ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-900"
                )}>{l}</button>
              ))}
            </div>
          </div>
          {/* Goal */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversion</label>
            <select value={captionGoal} onChange={e => setCaptionGoal(e.target.value)} className="w-full h-12 px-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
              {["Grow Followers", "Drive Clicks", "Boost Saves", "Get Comments"].map(g => <option key={g} className="text-black">{g}</option>)}
            </select>
          </div>
        </div>

        {/* Upload */}
        <div className="p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center gap-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group relative overflow-hidden shadow-inner">
          <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Integrate Visual Reference (Optional)</p>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <button
          onClick={handleGenerateCaptions}
          disabled={isGenerating}
          className="w-full py-5 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-4 overflow-hidden relative"
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-[11px] font-black uppercase tracking-widest">{thinkingMsg}</span></>
          ) : (
            <><Sparkles className="w-5 h-5 text-blue-400" /> Synthesize Narrative</>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map(i => <SkeletonCard key={i} className="h-52" />)}
          </motion.div>
        )}
        {captions && !isGenerating && (
          <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Caption cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {captions.map((c, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 flex flex-col gap-6 hover:border-blue-200 transition-all group relative overflow-hidden shadow-sm hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{c.label}</span>
                    {/* Tweak Tone */}
                    <div className="relative">
                      <button
                        onClick={() => setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, toneOpen: !v.toneOpen } : { ...v, toneOpen: false }))}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:border-blue-400 hover:text-blue-600"
                      >
                        Adjust Tone <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <AnimatePresence>
                        {c.toneOpen && (
                          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-20 w-44">
                            {["Funny", "Bold", "Professional", "Casual", "Emotional"].map(tone => (
                              <button key={tone} onClick={() => {
                                setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, toneOpen: false } : v));
                                toast.info(`Synthesizing with ${tone} voice...`);
                                runGenerate(() => setCaptions(SEED_CAPTIONS(niche)));
                              }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border-b border-slate-50 last:border-0">
                                {tone}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <p className="text-[14px] leading-relaxed text-slate-700 font-medium flex-1">{c.text}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(c.text, i, setCaptions)}
                        className={cn(
                          "p-2.5 rounded-2xl transition-all shadow-sm",
                          c.copied ? "text-emerald-600 bg-emerald-50 border border-emerald-200" : "text-slate-400 bg-white border border-slate-100 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                        )}
                        title="Copy"
                      >
                        {c.copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                      <button onClick={() => { saveToLibrary(c.text, "caption", captionPlatform); setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, saved: true } : v)); }} className={cn(
                        "p-2.5 rounded-2xl transition-all shadow-sm",
                        c.saved ? "text-blue-600 bg-blue-50 border border-blue-200" : "text-slate-400 bg-white border border-slate-100 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50"
                      )} title="Save">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button onClick={() => runGenerate(() => setCaptions(prev => {
                        const next = [...prev!];
                        next[i] = { ...SEED_CAPTIONS(niche)[i], copied: false, saved: false, toneOpen: false };
                        return next;
                      }))} className="p-2.5 rounded-2xl text-slate-400 bg-white border border-slate-100 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm" title="Regenerate this specific variant">
                        <RefreshCcw className="w-5 h-5" />
                      </button>
                    </div>
                    <button onClick={() => setPreviewCaption(c.text)} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10 active:scale-95">
                      <Eye className="w-4 h-4" /> Live Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Hashtag section */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-black uppercase tracking-tight flex items-center gap-2"><Hash className="w-4 h-4 text-primary" /> Your Hashtags</h4>
                <button onClick={() => { const all = SEED_HASHTAGS(niche).map(h => h.text).join(" "); navigator.clipboard.writeText(all); toast.success("All 18 hashtags copied!"); }} className="h-9 px-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5" /> Copy All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "🔴 Mega (1M+)", tier: "mega" },
                  { label: "🟡 Mid (100K–1M)", tier: "mid" },
                  { label: "🟢 Niche (<100K)", tier: "niche" },
                ].map(group => (
                  <div key={group.tier} className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{group.label}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SEED_HASHTAGS(niche).filter(h => h.tier === group.tier).map(h => (
                        <span key={h.text} className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold hover:border-primary/40 hover:text-primary cursor-pointer transition-all">{h.text}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to Calendar */}
            <div className="flex gap-3">
              <button onClick={() => { navigate("/calendar"); toast.info("Opening calendar with caption pre-filled..."); }} className="h-11 px-6 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Add to Calendar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderScriptGenerator = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Cinematic <span className="text-blue-600">Scripts</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">AI-built sequencing for high-retention content</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="md:col-span-2 space-y-6 bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] h-fit shadow-inner">
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Core Narrative</label>
            <AutoResizeTextarea placeholder="e.g. 5 steps to building a high-income skill in 2025..." value={scriptTopic} onChange={(e: any) => setScriptTopic(e.target.value)} className="w-full min-h-[100px] bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" maxLength={250} />
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Production Format</label>
            <select value={scriptFormat} onChange={e => setScriptFormat(e.target.value)} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
              {["Hook Reel / Short", "Long-form YT Video", "TikTok Story", "Educational Series", "Product Review"].map(f => <option key={f} className="text-black">{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Total Length</label>
              <select value={scriptDuration} onChange={e => setScriptDuration(e.target.value)} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
                {["30s", "60s", "3 min", "8 min"].map(d => <option key={d} className="text-black">{d}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Dialect</label>
              <select value={scriptAudience} onChange={e => setScriptAudience(e.target.value)} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
                {["Beginner", "Intermediate", "Advanced"].map(a => <option key={a} className="text-black">{a}</option>)}
              </select>
            </div>
          </div>
          <button onClick={handleGenerateScript} disabled={isGenerating} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10">
            {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[11px] font-black tracking-widest">{thinkingMsg}</span></> : <><Sparkles className="w-5 h-5 text-blue-400" /> Synthesize Script</>}
          </button>
        </div>

        {/* Script output */}
        <div className="md:col-span-3 min-h-[500px]">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkeletonCard className="h-full min-h-[500px] bg-slate-50" />
              </motion.div>
            ) : scriptSections ? (
              <motion.div key="out" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-[2.5rem] p-10 space-y-10 max-h-[600px] overflow-y-auto no-scrollbar shadow-sm">
                  {scriptSections.map((sec, i) => (
                    <div key={i} className="group border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{sec.act}</span>
                        <button onClick={() => {
                          setScriptSections(prev => prev!.map((s, j) => j === i ? { ...s, editing: !s.editing } : s));
                        }} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors border border-slate-100 hover:border-blue-200 rounded-xl px-3 py-1.5 bg-slate-50">
                          {sec.editing ? "Secure Edit" : "Refine Draft"}
                        </button>
                      </div>
                      {sec.editing ? (
                        <AutoResizeTextarea value={sec.text} onChange={(e: any) => setScriptSections(prev => prev!.map((s, j) => j === i ? { ...s, text: e.target.value } : s))} className="w-full bg-slate-50 border border-blue-200 rounded-2xl p-4 text-sm font-medium text-slate-900 focus:outline-none resize-none shadow-inner" />
                      ) : (
                        <p className={cn("text-sm leading-relaxed", sec.act.includes("HOOK") ? "text-2xl font-black text-slate-900 tracking-tight" : "text-slate-600 font-medium")}>{sec.text}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { const full = scriptSections.map(s => `${s.act}\n${s.text}`).join("\n\n"); handleCopy(full); }} className="h-14 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">
                    <Copy className="w-5 h-5" /> Copy Teleprompter
                  </button>
                  <button onClick={() => { saveToLibrary(scriptSections.map(s => `${s.act}: ${s.text}`).join(" | "), "script"); }} className="h-14 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-slate-600">
                    <Bookmark className="w-5 h-5" /> Commit to Library
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="ph" className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                <Video className="w-16 h-16 mb-6 opacity-20 text-blue-600" />
                <p className="text-[12px] font-black uppercase tracking-[0.2em]">Sequence Blueprint Pending</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderHookGenerator = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Attention <span className="text-blue-600">Hooks</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">10 high-velocity openers designed for viral retention</p>
      </div>
      <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-[2.5rem] shadow-inner">
        <input placeholder="Core topic (e.g. Productivity Hacks for Creators)..." value={hookTopic} onChange={e => setHookTopic(e.target.value)} className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400" />
        <button onClick={handleGenerateHooks} disabled={isGenerating} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center gap-3 shrink-0 shadow-xl shadow-blue-500/10">
          {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[11px] font-black tracking-widest">{thinkingMsg}</span></> : <><Sparkles className="w-5 h-5 text-blue-400" /> Synthesize Hooks</>}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {[0, 1, 2].map(i => <SkeletonCard key={i} className="h-20" />)}
          </motion.div>
        )}
        {hooks && !isGenerating && (
          <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleGenerateHooks} className="h-11 px-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
                <RefreshCcw className="w-4 h-4" /> Refresh All Directives
              </button>
            </div>
            {hooks.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between gap-6 group hover:border-blue-200 transition-all shadow-sm">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">{h.type}</span>
                  <p className="text-[15px] font-bold text-slate-900 tracking-tight">{h.text}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleCopy(h.text)} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"><Copy className="w-5 h-5" /></button>
                  <button
                    onClick={() => {
                      setHooks(prev => prev!.map((item, j) => j === i ? { ...item, saved: !item.saved } : item));
                      if (!h.saved) saveToLibrary(h.text, "hook");
                    }}
                    className={cn(
                      "p-3 rounded-2xl border transition-all shadow-sm",
                      h.saved ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200"
                    )}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderPitchWriter = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Brand <span className="text-blue-600">Pitcher</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Professional collaboration scripts to secure high-ticket deals</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] shadow-inner border border-slate-200/50">
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Target Brand Name</label>
          <input placeholder="e.g. Nike, Adobe, Myntra..." value={brandName} onChange={e => setBrandName(e.target.value)} className="w-full h-14 bg-white border border-slate-200 rounded-2xl px-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm" />
        </div>
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Collaboration Goal</label>
          <select value={pitchGoal} onChange={e => setPitchGoal(e.target.value)} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:outline-none text-slate-900 shadow-sm">
            {["Long-term Partnership", "One-off Campaign", "Product Affiliate", "Event Invite"].map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <button onClick={handleGeneratePitch} disabled={isGenerating} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10">
            {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> <span className="text-[11px] font-black tracking-widest">{thinkingMsg}</span></> : <><Mail className="w-5 h-5 text-blue-400" /> Draft Collaboration Email</>}
          </button>
        </div>
      </div>
      {pitchResult && !isGenerating && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-blue-600/5 group-hover:text-blue-600/10 transition-colors pointer-events-none">
                <Mail className="w-24 h-24" />
             </div>
             <pre className="text-sm font-medium text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{pitchResult.replace(/\[Brand Name\]/g, brandName || "[Brand Name]")}</pre>
             <div className="mt-10 flex gap-4">
                <button onClick={() => handleCopy(pitchResult.replace(/\[Brand Name\]/g, brandName || "[Brand Name]"))} className="h-12 px-8 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
                   <Copy className="w-4 h-4" /> Copy Email
                </button>
                <button onClick={() => saveToLibrary(pitchResult, "pitch")} className="h-12 px-8 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                   Save to Vault
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderReelIdeas = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Viral <span className="text-blue-600">Concepts</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Short-form storyboarding for maximum engagement spikes</p>
      </div>
      <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-[2.5rem] shadow-inner">
        <input placeholder="Aesthetic / Theme (e.g. Gritty morning routine)..." value={reelTopic} onChange={e => setReelTopic(e.target.value)} className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold text-slate-900 focus:outline-none" />
        <button onClick={handleGenerateReelIdeas} disabled={isGenerating} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95">
           Synthesize Concepts
        </button>
      </div>
      {reelIdeas && !isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {reelIdeas.map((idea, i) => (
             <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] space-y-6 hover:shadow-lg hover:border-blue-200 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                   <Lightbulb className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{idea.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{idea.concept}</p>
                <div className="pt-4 border-t border-slate-50 flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommended Sound</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><Music className="w-3 h-3" /> {idea.audio}</span>
                </div>
                <button onClick={() => { setActiveTool("script"); setScriptTopic(idea.title); toast.info(`Starting script for: ${idea.title}`); }} className="w-full h-11 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                   Draft Script →
                </button>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );

  const renderCarouselBuilder = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Slide <span className="text-blue-600">Architect</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Educational carousels designed for 'Saves' and 'Shares'</p>
      </div>
      <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-[2.5rem] shadow-inner">
        <input placeholder="Educational Topic (e.g. 5 steps to viral growth)..." value={carouselTopic} onChange={e => setCarouselTopic(e.target.value)} className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold text-slate-900 focus:outline-none" />
        <button onClick={handleGenerateCarousel} disabled={isGenerating} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95">
           Build Sequence
        </button>
      </div>
      {carouselSlides && !isGenerating && (
        <div className="space-y-6">
           <div className="flex overflow-x-auto gap-6 pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              {carouselSlides.map((slide, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="min-w-[280px] w-[320px] bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6 group hover:border-blue-400 transition-all">
                   <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs">0{slide.slide}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{slide.title}</span>
                   </div>
                   <div className="flex-1 flex items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                      <p className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-tight">{slide.content}</p>
                   </div>
                   <div className="space-y-2">
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-600" style={{ width: `${(slide.slide/4) * 100}%` }} />
                      </div>
                      <p className="text-[9px] font-black text-slate-400 text-right uppercase tracking-[0.2em]">{slide.slide} / 4</p>
                   </div>
                </motion.div>
              ))}
           </div>
           <button onClick={() => { handleCopy(carouselSlides.map(s => `Slide ${s.slide}: ${s.content}`).join("\n\n")); }} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">
              Copy Full Slide Stack
           </button>
        </div>
      )}
    </div>
  );

  const renderThumbnailConcept = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Visual <span className="text-blue-600">Hooks</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Thumbnail composition and text-overlay strategies</p>
      </div>
      <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] flex flex-col items-center gap-8 shadow-inner">
         <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Layout className="w-8 h-8" />
         </div>
         <div className="text-center space-y-2">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Strategic Packaging</h3>
            <p className="text-sm font-medium text-slate-400 max-w-sm mx-auto leading-relaxed">Let AI analyze your topic and synthesize a high-CTR visual composition.</p>
         </div>
        <button onClick={handleGenerateThumbnail} disabled={isGenerating} className="w-full md:w-fit px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-95">
            Initialize Packaging Analysis
         </button>
      </div>
      {thumbnailConcept && !isGenerating && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 shadow-sm group">
           <div className="w-full md:w-[300px] h-[170px] bg-slate-950 rounded-3xl border border-slate-900 flex items-center justify-center relative overflow-hidden shrink-0">
               <Sparkles className="w-12 h-12 text-blue-900 opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
               <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] text-white font-black uppercase tracking-widest group-hover:bg-blue-600 transition-all">Visual Preview Pending</div>
           </div>
           <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 rounded-full bg-blue-600" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Composition Directive</span>
              </div>
              <pre className="text-sm font-bold text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{thumbnailConcept}</pre>
              <button onClick={() => handleCopy(thumbnailConcept)} className="h-11 px-6 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all">
                 Secure Directive
              </button>
           </div>
        </motion.div>
      )}
    </div>
  );

  const renderBioOptimizer = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Profile <span className="text-blue-600">Oracle</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">SEO-optimized bio variations for multi-platform conversion</p>
      </div>
      <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-[2.5rem] shadow-inner">
        <input placeholder="Current Niche / Goal (e.g. Minimalist Home Fitness)..." value={bioNiche} onChange={e => setBioNiche(e.target.value)} className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold text-slate-900 focus:outline-none" />
        <button onClick={handleGenerateBio} disabled={isGenerating} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">
           Optimize Profile
        </button>
      </div>
      {bioVariations && !isGenerating && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {bioVariations.map((v, i) => (
             <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white border border-slate-100 p-8 rounded-[2.5rem] space-y-6 hover:border-blue-200 transition-all group shadow-sm">
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">{v.platform}</span>
                   <button onClick={() => handleCopy(v.text)} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                      <Copy className="w-4 h-4" />
                   </button>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 whitespace-pre-wrap text-[13px] font-bold text-slate-700 leading-relaxed font-sans shadow-inner group-hover:bg-blue-50/50 transition-colors">
                   {v.text}
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );

  const renderComingSoon = (toolId: ToolType) => (
    <div className="flex flex-col items-center justify-center h-[500px] text-center border-2 border-dashed border-white/10 rounded-3xl">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-black">{tools.find(t => t.id === toolId)?.label}</h3>
      <p className="text-zinc-500 max-w-xs mt-2 text-sm">This tool is being upgraded by our AI team — available in the next release.</p>
    </div>
  );

  const renderCommandCenter = () => (
    <div className="space-y-16 pb-20">
      {/* SECTION 1: What should I post today? */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Primary Directive</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Broadcast <span className="text-blue-600">Sync</span></h2>
           </div>
           {!dailySuggestion && (
             <button 
               onClick={handleGenerateDaily}
               className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
             >
                <Zap className="w-5 h-5 text-blue-400" /> What should I post today?
             </button>
           )}
        </div>

        {dailySuggestion ? (
          <div className="space-y-6">
             <DailyPostCard 
               suggestion={dailySuggestion} 
               onApprove={() => {
                 toast.success("Pushed to Timeline", { description: "Executing scheduled deployment..." });
                 setDailySuggestion(null);
               }} 
             />
             <button onClick={() => setDailySuggestion(null)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mx-auto block">Reset Directive</button>
          </div>
        ) : (
          <div className="h-64 border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50 flex flex-col items-center justify-center text-center p-12 group cursor-pointer hover:border-blue-400 transition-all" onClick={handleGenerateDaily}>
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Sparkles className="w-8 h-8 text-blue-100 group-hover:text-white" />
             </div>
             <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-300 group-hover:text-slate-900">Initialize Neural content Scan</p>
          </div>
        )}
      </section>

      {/* SECTION 2: Content Calendar */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Roadmap Matrix</p>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">30-Day <span className="text-blue-600">Strategy</span></h2>
           </div>
           <button 
             onClick={handlePlanMonth}
             disabled={isSyncingCalendar}
             className="h-14 px-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
           >
              {isSyncingCalendar ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
              {isSyncingCalendar ? "Synchronizing..." : "Plan my whole month in 5 minutes"}
           </button>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-[3rem] p-4 shadow-sm overflow-hidden scale-95 origin-top h-[600px]">
           <div className="h-full overflow-y-auto no-scrollbar pointer-events-auto">
              <MonthPlanner />
           </div>
        </div>
      </section>

      {/* Section 3: Caption Rewriter */}
      <section className="space-y-8">
        <div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Linguistic Refinement</p>
           <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Tone <span className="text-blue-600">Architect</span></h2>
        </div>
        <CaptionRewriter />
      </section>
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case "command": return renderCommandCenter();
      case "caption": return renderCaptionWriter();
      case "script": return renderScriptGenerator();
      case "hook": return renderHookGenerator();
      case "hashtag": return <HashtagEnginePanel niche={niche} />;
      case "audio": return <TrendingAudioPanel onUseForReel={() => { setActiveTool("script"); toast.info("Cinematic Scripting Engine activated!"); }} />;
      case "pitch": return renderPitchWriter();
      case "reel": return renderReelIdeas();
      case "carousel": return renderCarouselBuilder();
      case "thumbnail": return renderThumbnailConcept();
      case "bio": return renderBioOptimizer();
      default: return renderComingSoon(activeTool);
    }
  };

  // ── Library History ──────────────────────────────────────────────────────
  const renderHistory = () => (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Creative <span className="text-blue-600">Vault</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Archived AI outputs and refined narratives</p>
      </div>
      {history.length === 0 ? (
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center bg-slate-50/50">
          <BookOpen className="w-12 h-12 text-slate-200 mb-4" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Generate and commit content to view your vault</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {history.map(item => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-blue-200 transition-all group shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl">{item.type}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
              </div>
              <p className="text-[13px] font-medium leading-relaxed text-slate-600 line-clamp-3 mb-6">{item.text}</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.platform}</span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(item.text)} className="p-2.5 text-slate-400 bg-slate-50 rounded-xl hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"><Copy className="w-4 h-4" /></button>
                  <button onClick={() => { db.delete("content", item.id); setHistory(prev => prev.filter(h => h.id !== item.id)); toast.info("Asset decomissioned."); }} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const workspaceContent = (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-0">
      {/* Tool / History tabs */}
      <div className="flex gap-3 mb-12 bg-slate-50 p-1.5 rounded-3xl border border-slate-200 w-fit">
        <button onClick={() => setActiveHistoryTab("tool")} className={cn(
          "h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
          activeHistoryTab === "tool" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900"
        )}>
          <Sparkles className="w-4 h-4 inline mr-2 text-blue-600" />{tools.find(t => t.id === activeTool)?.label}
        </button>
        <button onClick={() => setActiveHistoryTab("history")} className={cn(
          "h-11 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
          activeHistoryTab === "history" ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-900"
        )}>
          <BookOpen className="w-4 h-4" />Library {history.length > 0 && <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-[9px] flex items-center justify-center border border-blue-200">{history.length}</span>}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeHistoryTab === "history" ? "history" : activeTool} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
          {activeHistoryTab === "history" ? renderHistory() : renderToolContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <PageTransition>
      <AnimatePresence>
        {isGenerating && (
          <ThinkingOverlay 
            progress={Math.round(generationProgress)} 
            phase={generationPhase} 
          />
        )}
      </AnimatePresence>
      <div className="h-[calc(100vh-160px)] -mx-8 -my-6 flex overflow-hidden">
        {/* LEFT TOOL PANEL */}
        <div className="w-[300px] border-r border-slate-200 bg-slate-50 overflow-y-auto no-scrollbar pt-10 shrink-0 relative z-20">
          <div className="px-8 mb-10 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" /> AI Creative Suite
          </div>
          <div className="px-4 space-y-2">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolType); setActiveHistoryTab("tool"); if (isMobile) setIsSheetOpen(true); }}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4.5 rounded-[2rem] transition-all relative group",
                  activeTool === tool.id ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:bg-white hover:text-slate-900"
                )}
              >
                {activeTool === tool.id && (
                  <motion.div layoutId="toolHighlight" className="absolute left-0 top-4 bottom-4 w-1 bg-blue-600 rounded-full" />
                )}
                <tool.icon className={cn("w-5 h-5 shrink-0", activeTool === tool.id ? "text-blue-600" : "group-hover:text-slate-900 transition-colors")} />
                <span className="text-[12px] font-black uppercase tracking-widest truncate">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT WORKSPACE (Desktop) */}
        {!isMobile && (
          <div className="flex-1 overflow-y-auto px-12 relative bg-white no-scrollbar min-h-[500px]">
            {workspaceContent}
          </div>
        )}

        {/* Bottom sheet (Mobile) */}
        {isMobile && (
          <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} height="90vh" title={tools.find(t => t.id === activeTool)?.label}>
            <div className="pt-6 pb-safe px-6 bg-white">{workspaceContent}</div>
          </BottomSheet>
        )}
      </div>

      {/* Social Preview Modal */}
      <AnimatePresence>
        {previewCaption && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewCaption(null)} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-[340px] bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden" style={{ aspectRatio: "9/19" }}>
              <div className="h-12 border-b border-slate-100 flex items-center px-8 justify-between bg-white">
                <div className="w-24 h-3 bg-slate-100 rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[12px]">{user?.name?.[0] || user?.firstName?.[0]}</div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">{user?.handle || "@creator"}</span>
                </div>
                <div className="aspect-square bg-slate-50 border-y border-slate-100 flex items-center justify-center">
                   <Sparkles className="w-12 h-12 text-blue-100" />
                </div>
                <div className="p-8">
                  <div className="flex gap-6 mb-6 text-slate-300">
                    <Play className="w-6 h-6 hover:text-blue-600 transition-colors cursor-pointer" /><RefreshCcw className="w-6 h-6" /><Share2 className="w-6 h-6" />
                  </div>
                  <p className="text-[13px] leading-relaxed text-slate-900"><span className="font-black mr-3 text-slate-900">{user?.handle}</span>{previewCaption}</p>
                </div>
              </div>
              <button onClick={() => setPreviewCaption(null)} className="absolute top-6 right-6 p-2 bg-white border border-slate-100 rounded-full shadow-lg hover:border-blue-200 transition-all active:scale-90"><X className="w-5 h-5 text-slate-400" /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

// ── Proper sub-components (hooks used at component top level) ─────────────────

const HashtagEnginePanel = ({ niche }: { niche: string }) => {
  const [pills, setPills] = useState<HashtagItem[] | null>(null);
  const [topic, setTopic] = useState("");
  const [running, setRunning] = useState(false);
  const [thinkLocal, setThinkLocal] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Enter keywords for tagging strategy");
      return;
    }
    
    setRunning(true);
    let i = 0;
    const iv = setInterval(() => { setThinkLocal(THINKING_MESSAGES[i++ % THINKING_MESSAGES.length]); }, 700);

    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "HASHTAG_ENGINE", 
          inputData: topic 
        },
      });

      if (error) throw error;

      if (data?.output) {
        const generatedTags = data.output.split(/[\s,#]+/)
          .filter((t: string) => t.trim().length > 0)
          .map((text: string, idx: number) => ({
            text: text.startsWith("#") ? text : `#${text}`,
            selected: true,
            tier: idx < 10 ? "mega" : idx < 20 ? "mid" : "niche"
          }));
        
        setPills(generatedTags);
        toast.success(`${generatedTags.length} Viral Tags Generated!`);
      }
    } catch (error) {
      console.error("Hashtag Error:", error);
      toast.error("Neural Tagging Failed");
    } finally {
      clearInterval(iv);
      setRunning(false);
    }
  };

  const selected = pills?.filter(p => p.selected) || [];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Hashtag <span className="text-blue-600">Oracle</span></h2>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Data-backed tagging strategy for algorithmic penetration</p>
      </div>
      <div className="flex gap-4 bg-slate-50 border border-slate-200 p-4 rounded-[2.5rem] shadow-inner">
        <input placeholder="Keywords / Context / Narrative..." value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 h-14 bg-transparent border-none px-6 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400" />
        <button onClick={generate} disabled={running} className="h-14 min-w-[160px] px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 shrink-0 shadow-xl shadow-blue-500/10">
          {running ? <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-[10px] font-black uppercase tracking-widest">{thinkLocal || 'Processing'}</span></> : <><Hash className="w-5 h-5 text-blue-400" /> Extract Tags</>}
        </button>
      </div>
      {pills && !running && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {[
            { label: "🔴 High Density (1M+)", tier: "mega" as const },
            { label: "🟡 Strategic Growth (100K–1M)", tier: "mid" as const },
            { label: "🟢 Precision Niche (< 100K)", tier: "niche" as const },
          ].map(group => (
            <div key={group.tier} className="space-y-3">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{group.label}</span>
              <div className="flex flex-wrap gap-2.5">
                {pills.filter(p => p.tier === group.tier).map(p => (
                  <button key={p.text} onClick={() => setPills(prev => prev!.map(h => h.text === p.text ? { ...h, selected: !h.selected } : h))} className={cn(
                    "px-4 py-2 rounded-2xl text-[12px] font-bold transition-all border shadow-sm",
                    p.selected ? "bg-white border-blue-200 text-blue-600 shadow-blue-100" : "bg-slate-50 border-slate-200 text-slate-300 line-through opacity-50"
                  )}>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-4 pt-6 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(selected.map(h => h.text).join(" ")); toast.success(`${selected.length} tags secured!`); }} className="h-14 px-8 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/10">
              <Copy className="w-5 h-5" /> Copy Selected ({selected.length})
            </button>
            <button onClick={() => { navigator.clipboard.writeText(pills.map(h => h.text).join(" ")); toast.success("Full stack copied!"); }} className="h-14 px-8 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center gap-3 text-slate-600">
              <Copy className="w-5 h-5" /> Copy Full Stack
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const TrendingAudioPanel = ({ onUseForReel }: { onUseForReel: () => void }) => {
  const [list, setList] = useState<AudioItem[]>(SEED_AUDIO());
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setList(SEED_AUDIO().sort(() => Math.random() - 0.5));
    setLoading(false);
    toast.success("Viral Index Refreshed");
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Viral <span className="text-blue-600">Frequency</span></h2>
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mt-2">Real-time trending audio spikes across social platforms</p>
        </div>
        <button onClick={refresh} disabled={loading} className="h-12 px-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white hover:text-blue-600 transition-all shadow-sm">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />} Sync
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {list.map((audio, i) => (
          <motion.div key={audio.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-200 transition-all group shadow-sm hover:shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <Music className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <p className="font-black text-[15px] text-slate-900 uppercase tracking-tight">{audio.name}</p>
                {audio.trending && <span className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-500 text-[9px] font-black uppercase rounded-full shrink-0 tracking-widest">🔥 Viral Spiking</span>}
              </div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{audio.creator} · {audio.uses} Utilizations</p>
            </div>
            <button onClick={onUseForReel} className="shrink-0 h-11 px-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/10">
              <Play className="w-4 h-4 text-blue-400" /> Initialize Reel
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
