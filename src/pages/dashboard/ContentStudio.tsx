import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool, Video, Hash, Music, Zap, Mail, Layout, UserCircle,
  Grid, Lightbulb, Copy, RefreshCcw, Check, Sparkles, Download,
  ExternalLink, Eye, FileText, Share2, ChevronDown, UploadCloud,
  Play, Bookmark, X, Clock, Loader2, ArrowRight, Trash2, BookOpen
} from "lucide-react";
import { PageTransition, SkeletonCard } from "../../components/shared/MotionComponents";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { useAuth } from "../../contexts/AuthContext";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

// ── Types ───────────────────────────────────────────────────────────────────
type ToolType = "caption" | "script" | "hook" | "hashtag" | "audio" | "pitch" | "bio" | "carousel" | "reel" | "thumbnail";

interface CaptionVariant { label: string; text: string; copied: boolean; saved: boolean; toneOpen: boolean; }
interface ScriptSection { act: string; text: string; editing: boolean; }
interface HookItem { type: string; text: string; saved: boolean; }
interface HashtagItem { text: string; selected: boolean; tier: "mega" | "mid" | "niche"; }
interface AudioItem { id: string; name: string; creator: string; uses: string; trending: boolean; }
interface HistoryItem { id: string; type: string; text: string; date: string; platform: string; }

// ── Tool Definitions ─────────────────────────────────────────────────────────
const tools = [
  { id: "caption", icon: PenTool, label: "Caption Writer" },
  { id: "script", icon: Video, label: "Script Generator" },
  { id: "hook", icon: Zap, label: "Hook Generator" },
  { id: "hashtag", icon: Hash, label: "Hashtag Engine" },
  { id: "audio", icon: Music, label: "Trending Audio" },
  { id: "pitch", icon: Mail, label: "Brand Pitch Writer" },
  { id: "reel", icon: Lightbulb, label: "Reel & Short Ideas" },
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

// ── Main Component ────────────────────────────────────────────────────────────
export const ContentStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolType>("caption");
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
    let i = 0;
    const iv = setInterval(() => { setThinkingMsg(THINKING_MESSAGES[i++ % THINKING_MESSAGES.length]); }, 700);
    await new Promise(r => setTimeout(r, 2200 + Math.random() * 600));
    clearInterval(iv);
    setIsGenerating(false);
    onDone();
  }, []);

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
          onClick={() => runGenerate(() => { setCaptions(SEED_CAPTIONS(niche)); toast.success("3 Professional drafts ready!"); })}
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
          <button onClick={() => runGenerate(() => { setScriptSections(SEED_SCRIPT()); toast.success("Sequence Locked & Generated!"); })} disabled={isGenerating} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10">
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
        <button onClick={() => runGenerate(() => { setHooks(SEED_HOOKS()); toast.success("10 Retention Hooks Ready!"); })} disabled={isGenerating} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center gap-3 shrink-0 shadow-xl shadow-blue-500/10">
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
              <button onClick={() => runGenerate(() => setHooks(SEED_HOOKS()))} className="h-11 px-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm">
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

  const renderComingSoon = (toolId: ToolType) => (
    <div className="flex flex-col items-center justify-center h-[500px] text-center border-2 border-dashed border-white/10 rounded-3xl">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <h3 className="text-xl font-black">{tools.find(t => t.id === toolId)?.label}</h3>
      <p className="text-zinc-500 max-w-xs mt-2 text-sm">This tool is being upgraded by our AI team — available in the next release.</p>
    </div>
  );

  const renderToolContent = () => {
    switch (activeTool) {
      case "caption": return renderCaptionWriter();
      case "script": return renderScriptGenerator();
      case "hook": return renderHookGenerator();
      case "hashtag": return <HashtagEnginePanel niche={niche} />;
      case "audio": return <TrendingAudioPanel onUseForReel={() => { setActiveTool("script"); toast.info("Cinematic Scripting Engine activated!"); }} />;
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
          <div className="flex-1 overflow-y-auto px-12 relative bg-white no-scrollbar">
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
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-[12px]">{user?.firstName?.[0]}</div>
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
    setRunning(true);
    let i = 0;
    const iv = setInterval(() => { setThinkLocal(THINKING_MESSAGES[i++ % THINKING_MESSAGES.length]); }, 700);
    await new Promise(r => setTimeout(r, 2000));
    clearInterval(iv);
    setRunning(false);
    setPills(SEED_HASHTAGS(niche));
    toast.success("30 hashtags generated!", { description: "Tap any to toggle selection." });
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
        <button onClick={generate} disabled={running} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center gap-3 shrink-0 shadow-xl shadow-blue-500/10">
          {running ? <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-[10px] max-w-[80px] truncate hidden sm:block font-black uppercase tracking-widest">{thinkLocal}</span></> : <><Hash className="w-5 h-5 text-blue-400" /> Extract Tags</>}
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
