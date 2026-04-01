import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Instagram, Youtube, Sparkles, Clock, Video, X, Check,
  Trash2, Loader2, Zap, Edit3, Music, Hash, Wand2, GripVertical,
  Bell, CheckCircle2, LayoutGrid, List, ArrowRight, UploadCloud, RefreshCcw
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────
type Platform = "ig" | "yt" | "tt";
type PostType = "reel" | "video" | "post" | "short" | "story" | "thread";
type PostStatus = "draft" | "scheduled" | "published";

interface ScheduledPost {
  id: string;
  platform: Platform;
  type: PostType;
  caption: string;
  time: string;
  day: number;
  month: number;
  year: number;
  status: PostStatus;
  hashtags?: string;
}

// ─── AI Time Suggestions ─────────────────────────────────────────────────────
const AI_TIME_SUGGESTIONS: Record<number, { time: string; reason: string }> = {
  0: { time: "08:00 AM", reason: "Sunday morning browsing peak — 81% higher reach" },
  1: { time: "07:00 PM", reason: "Monday evening commute scroll window" },
  2: { time: "12:00 PM", reason: "Tuesday lunch break — top engagement slot" },
  3: { time: "07:00 PM", reason: "Wednesday post-work wind-down browse" },
  4: { time: "06:00 PM", reason: "Thursday evening — your audience is most active" },
  5: { time: "09:00 PM", reason: "Friday night social media peak" },
  6: { time: "10:00 AM", reason: "Saturday morning leisure scroll — 94% reach boost" },
};

// ─── Seed Posts ─────────────────────────────────────────────────────────────
const now = new Date();
const CUR_MONTH = now.getMonth();
const CUR_YEAR = now.getFullYear();

const SEED_POSTS: ScheduledPost[] = [
  { id: "p1", platform: "ig", type: "reel", caption: "3 exercises for desk workers", time: "7:00 PM", day: 25, month: CUR_MONTH, year: CUR_YEAR, status: "scheduled" },
  { id: "p2", platform: "ig", type: "post", caption: "What I eat in a day (Clean)", time: "6:30 PM", day: 27, month: CUR_MONTH, year: CUR_YEAR, status: "draft" },
  { id: "p3", platform: "yt", type: "video", caption: "My gym bag essentials 2025", time: "8:00 AM", day: 29, month: CUR_MONTH, year: CUR_YEAR, status: "scheduled" },
  { id: "p4", platform: "ig", type: "story", caption: "Decathlon Campaign Kickoff", time: "10:00 AM", day: 24, month: CUR_MONTH, year: CUR_YEAR, status: "scheduled" },
  { id: "p5", platform: "tt", type: "short", caption: "Morning routine check 🌅", time: "8:30 AM", day: 22, month: CUR_MONTH, year: CUR_YEAR, status: "published" },
];

const PLATFORM_COLORS: Record<Platform, string> = {
  ig: "text-pink-600",
  yt: "text-red-600",
  tt: "text-cyan-600",
};
const PLATFORM_BG: Record<Platform, string> = {
  ig: "bg-pink-50 border-pink-100",
  yt: "bg-red-50 border-red-100",
  tt: "bg-cyan-50 border-cyan-100",
};
const STATUS_COLOR: Record<PostStatus, string> = {
  draft: "bg-slate-50 text-slate-400 border-slate-100",
  scheduled: "bg-blue-50 text-blue-600 border-blue-100",
  published: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const AI_OPTIMISE_PLAN = [
  { day: 22, time: "8:00 AM", type: "reel" as PostType, platform: "ig" as Platform, caption: "Morning stretches for desk workers — trending hook format" },
  { day: 24, time: "12:00 PM", type: "post" as PostType, platform: "ig" as Platform, caption: "3-day clean eating results — carousel (saves bait)" },
  { day: 26, time: "7:00 PM", type: "video" as PostType, platform: "yt" as Platform, caption: "Full gym bag unbox + review: 2025 edition" },
  { day: 28, time: "6:30 PM", type: "short" as PostType, platform: "tt" as Platform, caption: "60-second workout challenge — viral format" },
  { day: 30, time: "9:00 PM", type: "story" as PostType, platform: "ig" as Platform, caption: "Behind-the-scenes: brand shoot day" },
];

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// ─── Platform Icon ────────────────────────────────────────────────────────────
const PlatformIcon = ({ platform, className = "w-3 h-3" }: { platform: Platform; className?: string }) => {
  if (platform === "ig") return <Instagram className={cn(className, "text-pink-500")} />;
  if (platform === "yt") return <Youtube className={cn(className, "text-red-500")} />;
  return <Music className={cn(className, "text-cyan-500")} />;
};

// ─── Post Pill ────────────────────────────────────────────────────────────────
const PostPill = ({
  post, onSelect, onDragStart
}: { post: ScheduledPost; onSelect: () => void; onDragStart: (e: React.DragEvent) => void }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onClick={e => { e.stopPropagation(); onSelect(); }}
    className={cn(
        "p-2 rounded-xl border cursor-grab active:cursor-grabbing hover:shadow-md transition-all group/pill relative overflow-hidden",
        PLATFORM_BG[post.platform],
        post.status === "published" ? "opacity-50" : "shadow-sm"
    )}
  >
    <div className="flex items-center gap-2 pointer-events-none">
      <PlatformIcon platform={post.platform} />
      <span className="text-[9px] font-black truncate uppercase tracking-tighter text-slate-900" style={{ maxWidth: "100px" }}>{post.caption}</span>
    </div>
    <div className="absolute right-1.5 top-1.5 opacity-0 group-hover/pill:opacity-100 transition-opacity">
      <GripVertical className="w-3 h-3 text-slate-300" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Calendar = () => {
  const navigate = useNavigate();
  const [month, setMonth] = useState(CUR_MONTH);
  const [year, setYear] = useState(CUR_YEAR);
  const [posts, setPosts] = useState<ScheduledPost[]>(() => {
    const saved = db.getAll<ScheduledPost>("cal_posts");
    return saved.length > 0 ? saved : SEED_POSTS;
  });
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [schedulingDay, setSchedulingDay] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOptimiseOpen, setIsOptimiseOpen] = useState(false);
  const [isOptimising, setIsOptimising] = useState(false);
  const [isAiSuggestingTime, setIsAiSuggestingTime] = useState(false);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");

  // Form state
  const [form, setForm] = useState({
    platform: "ig" as Platform,
    type: "reel" as PostType,
    caption: "",
    hashtags: "",
    time: "07:00 PM",
    status: "scheduled" as PostStatus,
  });

  const syncToDB = useCallback((updated: ScheduledPost[]) => {
    db.getAll<ScheduledPost>("cal_posts").forEach(p => db.delete("cal_posts", p.id));
    updated.forEach(p => db.insert("cal_posts", p));
  }, []);

  const firstDay = getFirstDayOfMonth(month, year);
  const daysInMonth = getDaysInMonth(month, year);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  const today = new Date();

  const openSchedule = (day: number) => {
    setSchedulingDay(day);
    setIsEditing(false);
    setForm({ platform: "ig", type: "reel", caption: "", hashtags: "", time: "07:00 PM", status: "scheduled" });
    setIsScheduleOpen(true);
  };

  const openEdit = (post: ScheduledPost) => {
    setSelectedPost(null);
    setSchedulingDay(post.day);
    setIsEditing(true);
    setForm({ platform: post.platform, type: post.type, caption: post.caption, hashtags: post.hashtags || "", time: post.time, status: post.status });
    setIsScheduleOpen(true);
  };

  const handleSavePost = () => {
    if (!form.caption.trim()) { toast.error("Caption is required"); return; }
    const day = schedulingDay!;
    if (isEditing && selectedPost) {
      const updated = posts.map(p => p.id === selectedPost.id ? { ...p, ...form, day, month, year } : p);
      setPosts(updated);
      syncToDB(updated);
      toast.success("Post updated!", { description: `Scheduled for ${MONTH_NAMES[month]} ${day} at ${form.time}` });
    } else {
      const newPost: ScheduledPost = {
        id: `cal_${Date.now()}`,
        ...form,
        day,
        month,
        year,
      };
      const updated = [...posts, newPost];
      setPosts(updated);
      syncToDB(updated);
      toast.success(`Post scheduled for ${MONTH_NAMES[month]} ${day} at ${form.time} ✓`);
    }
    setIsScheduleOpen(false);
    setSelectedPost(null);
  };

  const handleDelete = (id: string) => {
    const deleted = posts.find(p => p.id === id);
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    syncToDB(updated);
    setIsDeleting(null);
    setSelectedPost(null);
    toast.info("Post removed from schedule", {
      description: "Undo available in your activity center.",
    });
  };

  const handleAiSuggestTime = async () => {
    setIsAiSuggestingTime(true);
    await new Promise(r => setTimeout(r, 1200));
    const dayOfWeek = new Date(year, month, schedulingDay || today.getDate()).getDay();
    const suggestion = AI_TIME_SUGGESTIONS[dayOfWeek];
    setForm(prev => ({ ...prev, time: suggestion.time }));
    setIsAiSuggestingTime(false);
    toast.success(`Optimal window: ${suggestion.time}`, { description: suggestion.reason });
  };

  const handleDragStart = (e: React.DragEvent, postId: string) => {
    setDraggedPostId(postId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    if (!draggedPostId) return;
    const post = posts.find(p => p.id === draggedPostId);
    if (!post || post.day === day) { setDraggedPostId(null); setDragOverDay(null); return; }
    const updated = posts.map(p => p.id === draggedPostId ? { ...p, day, month, year } : p);
    setPosts(updated);
    syncToDB(updated);
    setDraggedPostId(null);
    setDragOverDay(null);
    toast.success(`Rescheduled to ${MONTH_NAMES[month]} ${day} ✓`);
  };

  const handleOptimise = async () => {
    setIsOptimising(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsOptimising(false);
    setIsOptimiseOpen(true);
  };

  const handleApplyPlan = () => {
    const newPosts: ScheduledPost[] = AI_OPTIMISE_PLAN.map((p, i) => ({
      id: `ai_opt_${Date.now()}_${i}`,
      platform: p.platform,
      type: p.type,
      caption: p.caption,
      time: p.time,
      day: p.day,
      month,
      year,
      status: "draft" as PostStatus,
    }));
    const updated = [...posts, ...newPosts];
    setPosts(updated);
    syncToDB(updated);
    setIsOptimiseOpen(false);
    toast.success("AI Strategy Applied! 5 drafts added.", { description: "Your calendar has been optimized for growth." });
  };

  const monthPosts = posts.filter(p => p.month === month && p.year === year);

  const renderMonthView = () => (
    <div className="border border-slate-200 rounded-[3rem] overflow-hidden bg-white shadow-sm ring-1 ring-slate-100">
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_NAMES.map(d => (
          <div key={d} className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center bg-slate-50/50">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - firstDay + 1;
          const isValidDay = day >= 1 && day <= daysInMonth;
          const dayPosts = monthPosts.filter(p => p.day === day);
          const isToday = isValidDay && day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
          const isDragTarget = dragOverDay === day && isValidDay;
          const isHighEngagement = day % 7 === 2 || day % 7 === 5;

          return (
            <div
              key={i}
              onClick={() => isValidDay && openSchedule(day)}
              onDragOver={e => { if (isValidDay) { e.preventDefault(); setDragOverDay(day); } }}
              onDragLeave={() => setDragOverDay(null)}
              onDrop={e => isValidDay && handleDrop(e, day)}
              className={cn(
                "min-h-[120px] md:min-h-[160px] p-3 border-r border-b border-slate-100 last:border-r-0 transition-all cursor-pointer relative group",
                !isValidDay ? "bg-slate-50/30 pointer-events-none" : "bg-white hover:bg-blue-50/20",
                isDragTarget && "bg-blue-50 border-blue-200",
                i % 7 === 6 && "border-r-0"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn(
                    "text-[13px] font-black w-8 h-8 flex items-center justify-center rounded-2xl transition-all shadow-sm",
                    isToday ? "bg-blue-600 text-white shadow-blue-500/20" : "text-slate-400 group-hover:text-slate-900 bg-slate-50"
                )}>
                  {isValidDay ? day : ""}
                </span>
                {isValidDay && isHighEngagement && dayPosts.length === 0 && (
                  <div title="Prime Engagement Window" className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                )}
              </div>
              <div className="space-y-2">
                {dayPosts.slice(0, 3).map(post => (
                  <PostPill key={post.id} post={post} onSelect={() => setSelectedPost(post)} onDragStart={e => handleDragStart(e, post.id)} />
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-[9px] font-black text-slate-400 pl-2 uppercase tracking-widest">+{dayPosts.length - 3} Queue</div>
                )}
              </div>
              {isValidDay && dayPosts.length === 0 && (
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderListView = () => {
    const sorted = [...monthPosts].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
    return (
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="h-64 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white flex flex-col items-center justify-center text-center p-8">
            <CalendarIcon className="w-12 h-12 text-slate-200 mb-4" />
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">No scheduled momentum for {MONTH_NAMES[month]}</p>
          </div>
        ) : (
          sorted.map(post => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex items-center gap-6 p-6 rounded-[2.5rem] border cursor-pointer hover:shadow-xl transition-all shadow-sm bg-white", PLATFORM_BG[post.platform])} onClick={() => setSelectedPost(post)}>
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-inner border border-slate-100">
                <PlatformIcon platform={post.platform} className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-lg text-slate-900 tracking-tight uppercase">{post.caption}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{MONTH_NAMES[month]} {post.day} · {post.time} · {post.type}</p>
              </div>
              <span className={cn("px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest shadow-sm", STATUS_COLOR[post.status])}>{post.status}</span>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  return (
    <PageTransition className="space-y-[var(--grid-gap)] pb-24 lg:pb-8">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
            <CalendarIcon className="w-3.5 h-3.5" /> Content Master-Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
            Visual <span className="text-blue-600">Roadmap</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOptimise}
            disabled={isOptimising}
            className="h-14 px-8 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 disabled:opacity-60 shadow-sm"
          >
            {isOptimising ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-blue-600" />}
            {isOptimising ? "Recalibrating..." : "AI Strategy"}
          </button>
          <button onClick={() => openSchedule(today.getDate())} className="h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-slate-500/10 flex items-center gap-3">
            <Plus className="w-5 h-5" /> Schedule
          </button>
        </div>
      </header>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between flex-wrap gap-5 border-y border-slate-100 py-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} className="w-12 h-12 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-all shadow-sm text-slate-400 hover:text-slate-900"><ChevronLeft className="w-6 h-6" /></button>
             <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 w-48 text-center">{MONTH_NAMES[month]} {year}</h3>
             <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} className="w-12 h-12 hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center transition-all shadow-sm text-slate-400 hover:text-slate-900"><ChevronRight className="w-6 h-6" /></button>
          </div>
          <button onClick={() => { setMonth(CUR_MONTH); setYear(CUR_YEAR); }} className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-600 transition-all shadow-sm text-slate-500 hover:text-blue-600">Synchronize</button>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden lg:flex items-center gap-6">
            {[{ label: "Vibrant Reels", color: "bg-pink-500 shadow-pink-500/20" }, { label: "Mainstream", color: "bg-red-500 shadow-red-500/20" }, { label: "Incubation", color: "bg-slate-400 shadow-slate-400/20" }].map(l => (
              <div key={l.label} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                <div className={cn("w-2.5 h-2.5 rounded-full shadow-lg", l.color)} />
                {l.label}
              </div>
            ))}
          </div>
          <div className="flex gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
            <button onClick={() => setViewMode("month")} className={cn("p-2.5 rounded-xl transition-all shadow-sm", viewMode === "month" ? "bg-white text-blue-600" : "text-slate-400 hover:bg-white/50")}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("list")} className={cn("p-2.5 rounded-xl transition-all shadow-sm", viewMode === "list" ? "bg-white text-blue-600" : "text-slate-400 hover:bg-white/50")}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={viewMode} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ type: "spring", damping: 25, stiffness: 300 }}>
          {viewMode === "month" ? renderMonthView() : renderListView()}
        </motion.div>
      </AnimatePresence>

      {/* AI Insight */}
      <div className="flex items-center gap-5 p-6 bg-blue-50 border border-blue-100 rounded-[2.5rem] shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
           <Zap className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-[13px] font-bold text-slate-600 leading-relaxed">
          <span className="text-blue-600 font-extrabold uppercase tracking-tight mr-2">Momentum Engine:</span> Tuesdays and Fridays are your peak visibility windows. Data suggests prioritizing <span className="text-slate-900 underline decoration-blue-500/30 decoration-2 underline-offset-4 font-black">Fitness Education</span> content for those slots.
        </p>
      </div>

      {/* ══════════ POST BOTTOM SHEET ══════════ */}
      <BottomSheet isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title={isEditing ? "Modify Campaign" : `Launch Node — ${MONTH_NAMES[month]} ${schedulingDay}`} height="90vh">
        <div className="space-y-8 pt-6 pb-safe text-slate-900">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Primary Platform</label>
            <div className="flex gap-3">
              {(["ig", "yt", "tt"] as Platform[]).map(p => (
                <button key={p} onClick={() => setForm(prev => ({ ...prev, platform: p }))} className={cn(
                    "flex-1 h-16 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-sm",
                    form.platform === p ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600"
                )}>
                  {p === "ig" ? <Instagram className="w-5 h-5" /> : p === "yt" ? <Youtube className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Content Dimension</label>
            <div className="flex gap-2 flex-wrap">
              {(["reel", "post", "video", "short", "story", "thread"] as PostType[]).map(t => (
                <button key={t} onClick={() => setForm(prev => ({ ...prev, type: t }))} className={cn(
                    "h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-sm",
                    form.type === t ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-white border-slate-100 text-slate-500 hover:border-slate-300"
                )}>{t}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Creative Narrative</label>
            <AutoResizeTextarea
              placeholder="Inject your aesthetic vision here..."
              value={form.caption}
              onChange={(e: any) => setForm(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full min-h-[120px] bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner resize-none placeholder:text-slate-300"
              maxLength={2200}
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Timeline Precision</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                    type="time"
                    value={form.time.replace(" AM", "").replace(" PM", "")}
                    onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white shadow-inner uppercase"
                />
              </div>
              <button onClick={handleAiSuggestTime} disabled={isAiSuggestingTime} className="h-14 px-8 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 disabled:opacity-60 shrink-0 shadow-sm">
                {isAiSuggestingTime ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                Optimized Window
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Campaign State</label>
            <div className="flex gap-3">
              {(["draft", "scheduled"] as PostStatus[]).map(s => (
                <button key={s} onClick={() => setForm(prev => ({ ...prev, status: s }))} className={cn(
                    "flex-1 h-12 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-sm",
                    form.status === s ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"
                )}>{s}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSavePost} className="w-full h-16 py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            {isEditing ? "Synchronize Updates" : "Deploy to Schedule"}
          </button>
        </div>
      </BottomSheet>

      {/* ══════════ POST DETAIL BOTTOM SHEET ══════════ */}
      <BottomSheet isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} height="90vh">
        {selectedPost && (
          <div className="space-y-8 pt-6 text-slate-900">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center border shadow-md", PLATFORM_BG[selectedPost.platform])}>
                  <PlatformIcon platform={selectedPost.platform} className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-2xl tracking-tighter uppercase text-slate-900">{selectedPost.caption}</h4>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">{selectedPost.type} · {MONTH_NAMES[selectedPost.month]} {selectedPost.day} · {selectedPost.time}</p>
                </div>
              </div>
              <span className={cn("px-5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm", STATUS_COLOR[selectedPost.status])}>{selectedPost.status}</span>
            </div>

            <div className="aspect-video bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-mesh-primary opacity-20 pointer-events-none" />
              <Video className="w-14 h-14 text-white opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-6 group-hover:text-blue-400 transition-colors">Visual Asset Enqueued</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-blue-50 border border-blue-100 space-y-4 shadow-sm">
              <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-3">
                <Sparkles className="w-4 h-4" /> Editorial Intelligence
              </p>
              <p className="text-base font-bold text-slate-600 leading-relaxed">
                "Start with a strong educational hook — your audience reacts 60% better to '3 common mistakes' vs 'how to' formats for this time slot."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => openEdit(selectedPost)} className="h-16 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 shadow-sm group">
                <Edit3 className="w-5 h-5 text-slate-300 group-hover:text-blue-500" /> Modify Plan
              </button>
              <button onClick={() => navigate("/studio")} className="h-16 rounded-[1.5rem] bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-500/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                <ArrowRight className="w-5 h-5" /> Architect Lab
              </button>
              <button onClick={() => setIsDeleting(selectedPost.id)} className="h-16 rounded-[1.5rem] bg-rose-50 text-rose-600 border border-rose-100 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3 col-span-2 shadow-sm">
                <Trash2 className="w-5 h-5" /> Terminate Node
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* ══════════ OPTIMISE PREVIEW MODAL ══════════ */}
      <AnimatePresence>
        {isOptimiseOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOptimiseOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[3.5rem] p-10 shadow-huge overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner border border-blue-100">
                  <Sparkles className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter text-slate-900">AI Momentum Matrix</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">High-Fidelity Content Strategy</p>
                </div>
                <button onClick={() => setIsOptimiseOpen(false)} className="ml-auto w-10 h-10 hover:bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 mb-10">
                {AI_OPTIMISE_PLAN.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className={cn("flex items-center gap-6 p-6 rounded-[2rem] border shadow-sm", PLATFORM_BG[p.platform])}>
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-inner border border-slate-50">
                      <PlatformIcon platform={p.platform} className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm text-slate-900 truncate uppercase">{p.caption}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{MONTH_NAMES[month]} {p.day} · {p.time} · {p.type}</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 shadow-md rounded-full" />
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsOptimiseOpen(false)} className="flex-1 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] hover:text-slate-900 hover:border-slate-300 transition-all">Archive Strategy</button>
                <button onClick={handleApplyPlan} className="flex-1 h-16 rounded-[1.5rem] bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-500/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-5 h-5" /> Execute Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={!!isDeleting}
        title="Terminate Content Node?"
        description="This will remove the post from your active schedule. Historical data remains unaffected."
        onConfirm={() => isDeleting && handleDelete(isDeleting)}
        onCancel={() => setIsDeleting(null)}
      />
    </PageTransition>
  );
};
