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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Caption Writer</h2>
        <p className="text-zinc-500 text-sm mt-1">AI generates 3 captions + 25 hashtags tailored to your niche</p>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">What is this post about?</label>
        <AutoResizeTextarea
          placeholder={`e.g. My morning ${niche} routine with a focus on natural energy...`}
          value={captionTopic}
          onChange={(e: any) => setCaptionTopic(e.target.value)}
          className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
          maxLength={500}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Platform */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Platform</label>
            <div className="flex gap-1">
              {["IG", "YT", "TT"].map(p => (
                <button key={p} onClick={() => setCaptionPlatform(p)} className={`flex-1 py-2.5 rounded-xl border text-[10px] font-black transition-all ${captionPlatform === p ? "bg-primary border-primary text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"}`}>{p}</button>
              ))}
            </div>
          </div>
          {/* Tone */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Tone</label>
            <select value={captionTone} onChange={e => setCaptionTone(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold focus:outline-none text-white">
              {["Funny", "Inspiring", "Educational", "Storytelling", "Bold", "Casual"].map(t => <option key={t} className="text-black">{t}</option>)}
            </select>
          </div>
          {/* Length */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Length</label>
            <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {["S", "M", "L"].map(l => (
                <button key={l} onClick={() => setCaptionLength(l)} className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${captionLength === l ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}>{l}</button>
              ))}
            </div>
          </div>
          {/* Goal */}
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Goal</label>
            <select value={captionGoal} onChange={e => setCaptionGoal(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold focus:outline-none text-white">
              {["Grow Followers", "Drive Clicks", "Boost Saves", "Get Comments"].map(g => <option key={g} className="text-black">{g}</option>)}
            </select>
          </div>
        </div>

        {/* Upload */}
        <div className="p-5 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group relative overflow-hidden">
          <UploadCloud className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Upload post for AI context (optional)</p>
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <button
          onClick={() => runGenerate(() => { setCaptions(SEED_CAPTIONS(niche)); toast.success("3 captions ready!", { description: "Review, edit, and copy your favorites." }); })}
          disabled={isGenerating}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-3 overflow-hidden relative"
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /><span className="text-[11px]">{thinkingMsg}</span></>
          ) : (
            <><Sparkles className="w-5 h-5" /> Generate Captions</>
          )}
          {!isGenerating && <motion.div className="absolute inset-x-0 h-full w-20 bg-white/10 -skew-x-12" animate={{ x: [-100, 1200] }} transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }} />}
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
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 flex flex-col gap-4 hover:border-primary/30 transition-all group relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">{c.label}</span>
                    {/* Tweak Tone */}
                    <div className="relative">
                      <button
                        onClick={() => setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, toneOpen: !v.toneOpen } : { ...v, toneOpen: false }))}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity hover:border-primary/30"
                      >
                        Tweak Tone <ChevronDown className="w-3 h-3" />
                      </button>
                      <AnimatePresence>
                        {c.toneOpen && (
                          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-1 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden z-20 w-36">
                            {["Funny", "Bold", "Professional", "Casual", "Emotional"].map(tone => (
                              <button key={tone} onClick={() => {
                                setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, toneOpen: false } : v));
                                toast.info(`Regenerating with ${tone} tone...`);
                                runGenerate(() => setCaptions(SEED_CAPTIONS(niche)));
                              }} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                                {tone}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-zinc-300 flex-1">{c.text}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCopy(c.text, i, setCaptions)}
                        className={`p-2 rounded-xl transition-all ${c.copied ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
                        title="Copy"
                      >
                        {c.copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { saveToLibrary(c.text, "caption", captionPlatform); setCaptions(prev => prev!.map((v, j) => j === i ? { ...v, saved: true } : v)); }} className={`p-2 rounded-xl transition-all ${c.saved ? "text-primary bg-primary/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`} title="Save">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button onClick={() => runGenerate(() => setCaptions(prev => {
                        const next = [...prev!];
                        next[i] = { ...SEED_CAPTIONS(niche)[i], copied: false, saved: false, toneOpen: false };
                        return next;
                      }))} className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all" title="Regenerate this one">
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => setPreviewCaption(c.text)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">
                      <Eye className="w-3 h-3" /> Preview
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Script Generator</h2>
        <p className="text-zinc-500 text-sm mt-1">AI builds your full script section by section — each part is individually editable</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Inputs */}
        <div className="md:col-span-2 space-y-4 bg-white/[0.03] border border-white/10 p-6 rounded-3xl h-fit">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Topic or Description</label>
            <AutoResizeTextarea placeholder="e.g. 5 steps to building a high-income skill in 2025..." value={scriptTopic} onChange={(e: any) => setScriptTopic(e.target.value)} className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" maxLength={250} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Format</label>
            <select value={scriptFormat} onChange={e => setScriptFormat(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold focus:outline-none text-white">
              {["Hook Reel / Short", "Long-form YT Video", "TikTok Story", "Educational Series", "Product Review"].map(f => <option key={f} className="text-black">{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Duration</label>
              <select value={scriptDuration} onChange={e => setScriptDuration(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold focus:outline-none text-white">
                {["30s", "60s", "3 min", "8 min"].map(d => <option key={d} className="text-black">{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Audience</label>
              <select value={scriptAudience} onChange={e => setScriptAudience(e.target.value)} className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold focus:outline-none text-white">
                {["Beginner", "Intermediate", "Advanced"].map(a => <option key={a} className="text-black">{a}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => runGenerate(() => { setScriptSections(SEED_SCRIPT()); toast.success("Script generated!", { description: "Edit each section inline." }); })} disabled={isGenerating} className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2">
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> {thinkingMsg}</> : <><Sparkles className="w-4 h-4" /> Generate Script</>}
          </button>
        </div>

        {/* Script output */}
        <div className="md:col-span-3 min-h-[400px]">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SkeletonCard className="h-full min-h-[400px]" />
              </motion.div>
            ) : scriptSections ? (
              <motion.div key="out" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="bg-white/[0.03] border border-white/10 border-l-4 border-l-primary rounded-3xl p-6 space-y-8 max-h-[500px] overflow-y-auto no-scrollbar">
                  {scriptSections.map((sec, i) => (
                    <div key={i} className="group border-b border-white/5 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{sec.act}</span>
                        <button onClick={() => {
                          setScriptSections(prev => prev!.map((s, j) => j === i ? { ...s, editing: !s.editing } : s));
                        }} className="text-[9px] font-black uppercase text-zinc-500 hover:text-primary transition-colors border border-transparent hover:border-primary/30 rounded-lg px-2 py-1">
                          {sec.editing ? "Done" : "Edit"}
                        </button>
                      </div>
                      {sec.editing ? (
                        <AutoResizeTextarea value={sec.text} onChange={(e: any) => setScriptSections(prev => prev!.map((s, j) => j === i ? { ...s, text: e.target.value } : s))} className="w-full bg-white/5 border border-primary/30 rounded-xl p-3 text-sm focus:outline-none resize-none" />
                      ) : (
                        <p className={`text-sm leading-relaxed ${sec.act.includes("HOOK") ? "text-xl font-black text-white" : "text-zinc-300 font-medium"}`}>{sec.text}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { const full = scriptSections.map(s => `${s.act}\n${s.text}`).join("\n\n"); handleCopy(full); }} className="h-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <Copy className="w-4 h-4" /> Copy Full Script
                  </button>
                  <button onClick={() => { saveToLibrary(scriptSections.map(s => `${s.act}: ${s.text}`).join(" | "), "script"); }} className="h-10 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                    <Bookmark className="w-4 h-4" /> Save to Library
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="ph" className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-zinc-600">
                <Video className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Your script will appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderHookGenerator = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Hook Generator</h2>
        <p className="text-zinc-500 text-sm mt-1">10 high-performing hooks per topic — copy any, save your favorites</p>
      </div>
      <div className="flex gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-3xl">
        <input placeholder="Enter post topic (e.g. Productivity Hacks for Creators)..." value={hookTopic} onChange={e => setHookTopic(e.target.value)} className="flex-1 h-12 bg-transparent border-none px-3 text-sm font-medium focus:outline-none placeholder:text-zinc-600" />
        <button onClick={() => runGenerate(() => { setHooks(SEED_HOOKS()); toast.success("10 hooks generated!"); })} disabled={isGenerating} className="h-12 px-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center gap-2 shrink-0">
          {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> {thinkingMsg}</> : <><Sparkles className="w-4 h-4" /> Generate 10 Hooks</>}
        </button>
      </div>
      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {[0, 1, 2].map(i => <SkeletonCard key={i} className="h-20" />)}
          </motion.div>
        )}
        {hooks && !isGenerating && (
          <motion.div key="out" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="flex justify-end">
              <button onClick={() => runGenerate(() => setHooks(SEED_HOOKS()))} className="h-9 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
                <RefreshCcw className="w-3.5 h-3.5" /> Regenerate All
              </button>
            </div>
            {hooks.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl flex items-center justify-between gap-4 group hover:border-primary/30 transition-all">
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">{h.type}</span>
                  <p className="text-[13px] font-bold text-zinc-200">{h.text}</p>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => handleCopy(h.text)} className="p-2 bg-white/5 border border-white/10 rounded-xl hover:text-white transition-all"><Copy className="w-4 h-4" /></button>
                  <button
                    onClick={() => {
                      setHooks(prev => prev!.map((item, j) => j === i ? { ...item, saved: !item.saved } : item));
                      if (!h.saved) saveToLibrary(h.text, "hook");
                    }}
                    className={`p-2 rounded-xl border transition-all ${h.saved ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 hover:text-white"}`}
                  >
                    <Bookmark className="w-4 h-4" />
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
      case "hashtag": return <HashtagEnginePanel niche={niche} saveToLibrary={saveToLibrary} />;
      case "audio": return <TrendingAudioPanel onUseForReel={() => { setActiveTool("script"); toast.info("Script Generator opened with audio context!"); }} />;
      default: return renderComingSoon(activeTool);
    }
  };

  // ── Library History ──────────────────────────────────────────────────────
  const renderHistory = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Content Library</h2>
        <p className="text-zinc-500 text-sm mt-1">Last 10 AI-generated pieces saved across all tools</p>
      </div>
      {history.length === 0 ? (
        <div className="h-48 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Generate and save content to see it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map(item => (
            <div key={item.id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 hover:border-white/20 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg">{item.type}</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase">{item.date}</span>
              </div>
              <p className="text-[12px] font-medium leading-relaxed text-zinc-300 line-clamp-3 mb-4">{item.text}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{item.platform}</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleCopy(item.text)} className="p-1.5 text-zinc-500 hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => { db.delete("content", item.id); setHistory(prev => prev.filter(h => h.id !== item.id)); toast.info("Removed."); }} className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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
      <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
        <button onClick={() => setActiveHistoryTab("tool")} className={`h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeHistoryTab === "tool" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}>
          <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />{tools.find(t => t.id === activeTool)?.label}
        </button>
        <button onClick={() => setActiveHistoryTab("history")} className={`h-9 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${activeHistoryTab === "history" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}>
          <BookOpen className="w-3.5 h-3.5" />Library {history.length > 0 && <span className="w-4 h-4 bg-primary/30 rounded-full text-[8px] flex items-center justify-center">{history.length}</span>}
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
        <div className="w-[260px] border-r border-white/5 bg-black/20 overflow-y-auto no-scrollbar pt-6 shrink-0 relative z-20">
          <div className="px-5 mb-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
            <Zap className="w-3 h-3 text-primary fill-primary" /> AI Content Suite
          </div>
          <div className="px-3 space-y-0.5">
            {tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id as ToolType); setActiveHistoryTab("tool"); if (isMobile) setIsSheetOpen(true); }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative group ${activeTool === tool.id ? "bg-primary/10 text-primary" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}
              >
                {activeTool === tool.id && (
                  <motion.div layoutId="toolHighlight" className="absolute left-0 top-3 bottom-3 w-[3px] bg-primary rounded-full shadow-[2px_0_8px_rgba(255,60,172,0.6)]" />
                )}
                <tool.icon className={`w-4 h-4 shrink-0 ${activeTool === tool.id ? "text-primary" : "group-hover:text-white transition-colors"}`} />
                <span className="text-[11px] font-black uppercase tracking-wide truncate">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT WORKSPACE (Desktop) */}
        {!isMobile && (
          <div className="flex-1 overflow-y-auto px-8 relative bg-background no-scrollbar">
            {workspaceContent}
          </div>
        )}

        {/* Bottom sheet (Mobile) */}
        {isMobile && (
          <BottomSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} height="90vh" title={tools.find(t => t.id === activeTool)?.label}>
            <div className="pt-4 pb-safe px-4">{workspaceContent}</div>
          </BottomSheet>
        )}
      </div>

      {/* Social Preview Modal */}
      <AnimatePresence>
        {previewCaption && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewCaption(null)} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-[340px] bg-zinc-950 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden" style={{ aspectRatio: "9/19" }}>
              <div className="h-10 border-b border-white/5 flex items-center px-6 justify-between">
                <div className="w-20 h-3 bg-white/10 rounded-full" />
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-[10px]">{user?.firstName?.[0]}</div>
                  <span className="text-xs font-black uppercase">{user?.handle || "@creator"}</span>
                </div>
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-violet-500/20 border-y border-white/5" />
                <div className="p-5">
                  <div className="flex gap-4 mb-4 text-zinc-500">
                    <Play className="w-5 h-5" /><RefreshCcw className="w-5 h-5" /><Share2 className="w-5 h-5" />
                  </div>
                  <p className="text-[11px] leading-relaxed"><span className="font-black mr-2">{user?.handle}</span>{previewCaption}</p>
                </div>
              </div>
              <button onClick={() => setPreviewCaption(null)} className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full"><X className="w-4 h-4" /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

// ── Proper sub-components (hooks used at component top level) ─────────────────

const HashtagEnginePanel = ({ niche, saveToLibrary }: { niche: string; saveToLibrary: (text: string, type: string) => void }) => {
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight">Hashtag Engine</h2>
        <p className="text-zinc-500 text-sm mt-1">30 hashtags grouped by size tier — tap to deselect, copy only what you want</p>
      </div>
      <div className="flex gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-3xl">
        <input placeholder="Topic / niche / post description..." value={topic} onChange={e => setTopic(e.target.value)} className="flex-1 h-12 bg-transparent border-none px-3 text-sm font-medium focus:outline-none placeholder:text-zinc-600" />
        <button onClick={generate} disabled={running} className="h-12 px-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-[0.99] disabled:opacity-60 flex items-center gap-2 shrink-0">
          {running ? <><Loader2 className="w-4 h-4 animate-spin" /><span className="text-[10px] max-w-[80px] truncate hidden sm:block">{thinkLocal}</span></> : <><Hash className="w-4 h-4" /> Generate Hashtags</>}
        </button>
      </div>
      {pills && !running && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {[
            { label: "🔴 Mega (1M+ posts)", tier: "mega" as const },
            { label: "🟡 Mid (100K–1M)", tier: "mid" as const },
            { label: "🟢 Niche (< 100K)", tier: "niche" as const },
          ].map(group => (
            <div key={group.tier} className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{group.label}</span>
              <div className="flex flex-wrap gap-2">
                {pills.filter(p => p.tier === group.tier).map(p => (
                  <button key={p.text} onClick={() => setPills(prev => prev!.map(h => h.text === p.text ? { ...h, selected: !h.selected } : h))} className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${p.selected ? "bg-primary/10 border-primary/40 text-primary" : "bg-white/5 border-white/5 text-zinc-600 line-through"}`}>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(selected.map(h => h.text).join(" ")); toast.success(`${selected.length} hashtags copied!`); }} className="h-10 px-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy Selected ({selected.length})
            </button>
            <button onClick={() => { navigator.clipboard.writeText(pills.map(h => h.text).join(" ")); toast.success("All hashtags copied!"); }} className="h-10 px-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy All
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
    toast.success("Trending audio refreshed!");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Trending Audio</h2>
          <p className="text-zinc-500 text-sm mt-1">Top sounds trending across TikTok & Reels — click Use for Reel to start scripting</p>
        </div>
        <button onClick={refresh} disabled={loading} className="h-10 px-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 disabled:opacity-50 transition-all">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
        </button>
      </div>
      <div className="space-y-2">
        {list.map((audio, i) => (
          <motion.div key={audio.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:border-white/20 transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-black text-[13px]">{audio.name}</p>
                {audio.trending && <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black uppercase rounded-full shrink-0">🔥 Hot</span>}
              </div>
              <p className="text-[11px] text-zinc-500">{audio.creator} · {audio.uses} uses</p>
            </div>
            <button onClick={onUseForReel} className="shrink-0 h-9 px-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all flex items-center gap-1.5">
              <Play className="w-3 h-3" /> Use for Reel
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
