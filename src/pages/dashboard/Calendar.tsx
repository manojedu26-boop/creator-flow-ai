import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus,
  Instagram, Youtube, Sparkles, Clock, Video, X, Check,
  Trash2, Loader2, Zap, Edit3, Music, Hash, Wand2, GripVertical,
  Bell, CheckCircle2, LayoutGrid, List, ArrowRight
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { useNavigate } from "react-router-dom";

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
  ig: "text-pink-500",
  yt: "text-red-500",
  tt: "text-cyan-400",
};
const PLATFORM_BG: Record<Platform, string> = {
  ig: "bg-pink-500/10 border-pink-500/20",
  yt: "bg-red-500/10 border-red-500/20",
  tt: "bg-cyan-500/10 border-cyan-500/20",
};
const STATUS_COLOR: Record<PostStatus, string> = {
  draft: "bg-zinc-500/20 text-zinc-400 border-zinc-500/20",
  scheduled: "bg-primary/10 text-primary border-primary/20",
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
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
  if (platform === "ig") return <Instagram className={`${className} text-pink-400`} />;
  if (platform === "yt") return <Youtube className={`${className} text-red-400`} />;
  return <Music className={`${className} text-cyan-400`} />;
};

// ─── Post Pill ────────────────────────────────────────────────────────────────
const PostPill = ({
  post, onSelect, onDragStart
}: { post: ScheduledPost; onSelect: () => void; onDragStart: (e: React.DragEvent) => void }) => (
  <div
    draggable
    onDragStart={onDragStart}
    onClick={e => { e.stopPropagation(); onSelect(); }}
    className={`p-1.5 rounded-xl border cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-all group/pill relative overflow-hidden ${PLATFORM_BG[post.platform]} ${post.status === "published" ? "opacity-60" : ""}`}
  >
    <div className="flex items-center gap-1.5 pointer-events-none">
      <PlatformIcon platform={post.platform} />
      <span className="text-[8px] font-black truncate uppercase tracking-tighter" style={{ maxWidth: "90px" }}>{post.caption}</span>
    </div>
    <div className="absolute right-1 top-1 opacity-0 group-hover/pill:opacity-100 transition-opacity">
      <GripVertical className="w-3 h-3 text-white/30" />
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
      const updated = posts.map(p => p.id === selectedPost.id ? { ...p, ...form, day } : p);
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
    let undone = false;
    toast.info("Post deleted", {
      description: "Undo within 4 seconds.",
      action: {
        label: "Undo",
        onClick: () => {
          undone = true;
          if (deleted) {
            const restored = [...updated, deleted];
            setPosts(restored);
            syncToDB(restored);
            toast.success("Post restored!");
          }
        }
      }
    });
  };

  const handleAiSuggestTime = async () => {
    setIsAiSuggestingTime(true);
    await new Promise(r => setTimeout(r, 1200));
    const dayOfWeek = new Date(year, month, schedulingDay || today.getDate()).getDay();
    const suggestion = AI_TIME_SUGGESTIONS[dayOfWeek];
    setForm(prev => ({ ...prev, time: suggestion.time }));
    setIsAiSuggestingTime(false);
    toast.success(`AI suggests ${suggestion.time}`, { description: suggestion.reason });
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
    toast.success(`Post rescheduled to ${MONTH_NAMES[month]} ${day} ✓`);
  };

  const handleOptimise = async () => {
    setIsOptimising(true);
    await new Promise(r => setTimeout(r, 2500));
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
    toast.success("AI plan applied! 5 drafts added.", { description: "Review and schedule each post from the calendar." });
  };

  const monthPosts = posts.filter(p => p.month === month && p.year === year);

  // ── Month Grid ───────────────────────────────────────────────────────────
  const renderMonthView = () => (
    <div className="border border-white/5 rounded-[2rem] overflow-hidden bg-black/40 backdrop-blur-3xl shadow-2xl">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-white/5">
        {DAY_NAMES.map(d => (
          <div key={d} className="p-3 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-center bg-white/[0.02]">{d}</div>
        ))}
      </div>
      {/* Calendar grid */}
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
              className={`min-h-[100px] md:min-h-[130px] p-2 border-r border-b border-white/[0.04] last:border-r-0 transition-all cursor-pointer relative group
                ${!isValidDay ? "opacity-20 pointer-events-none bg-transparent" : "hover:bg-white/[0.02]"}
                ${isDragTarget ? "bg-primary/5 border-primary/30" : ""}
                ${i % 7 === 6 ? "border-r-0" : ""}
              `}
            >
              {/* Day number */}
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-all ${isToday ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-zinc-500 group-hover:text-white"}`}>
                  {isValidDay ? day : ""}
                </span>
                {isValidDay && isHighEngagement && dayPosts.length === 0 && (
                  <div title="High engagement window" className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_#FF3CAC] animate-pulse" />
                )}
              </div>
              {/* Posts */}
              <div className="space-y-1">
                {dayPosts.slice(0, 3).map(post => (
                  <PostPill key={post.id} post={post} onSelect={() => setSelectedPost(post)} onDragStart={e => handleDragStart(e, post.id)} />
                ))}
                {dayPosts.length > 3 && (
                  <div className="text-[8px] font-black text-zinc-600 pl-1">+{dayPosts.length - 3} more</div>
                )}
              </div>
              {/* Add hint on empty days */}
              {isValidDay && dayPosts.length === 0 && (
                <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="w-3 h-3 text-zinc-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── List View ────────────────────────────────────────────────────────────
  const renderListView = () => {
    const sorted = [...monthPosts].sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
    return (
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="h-48 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No posts scheduled this month</p>
          </div>
        ) : (
          sorted.map(post => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`flex items-center gap-4 p-4 rounded-3xl border cursor-pointer hover:border-primary/30 transition-all ${PLATFORM_BG[post.platform]}`} onClick={() => setSelectedPost(post)}>
              <div className="w-10 h-10 rounded-2xl bg-black/40 flex items-center justify-center shrink-0">
                <PlatformIcon platform={post.platform} className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-[13px] truncate">{post.caption}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase">{MONTH_NAMES[month]} {post.day} · {post.time} · {post.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase shrink-0 ${STATUS_COLOR[post.status]}`}>{post.status}</span>
            </motion.div>
          ))
        )}
      </div>
    );
  };

  return (
    <PageTransition className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto pb-24 lg:pb-8">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-1">
            <CalendarIcon className="w-3 h-3" /> Content Master-Plan
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">
            Live <span className="text-primary italic">Schedule</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleOptimise}
            disabled={isOptimising}
            className="h-11 px-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 disabled:opacity-60"
          >
            {isOptimising ? <><Loader2 className="w-4 h-4 animate-spin" /> Optimising...</> : <><Sparkles className="w-4 h-4 text-primary" /> Optimise My Week</>}
          </button>
          <button onClick={() => openSchedule(today.getDate())} className="h-11 px-5 rounded-2xl bg-primary text-white hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Schedule Post
          </button>
        </div>
      </header>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-y border-white/5 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <h3 className="text-lg font-black uppercase tracking-tight">{MONTH_NAMES[month]} {year}</h3>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
          <button onClick={() => { setMonth(CUR_MONTH); setYear(CUR_YEAR); }} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">Today</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            {[{ label: "IG Reels", color: "bg-pink-500" }, { label: "YT / TT", color: "bg-red-500" }, { label: "Draft", color: "bg-zinc-500" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={() => setViewMode("month")} className={`p-1.5 rounded-lg transition-all ${viewMode === "month" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-primary text-white" : "text-zinc-500 hover:text-white"}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* ── Calendar / List ── */}
      <AnimatePresence mode="wait">
        <motion.div key={viewMode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          {viewMode === "month" ? renderMonthView() : renderListView()}
        </motion.div>
      </AnimatePresence>

      {/* AI tip */}
      <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
        <Zap className="w-4 h-4 text-primary shrink-0" />
        <p className="text-[11px] font-bold text-zinc-400">
          <span className="text-primary font-black">AI Prime Time:</span> Tuesdays and Fridays show 40% higher engagement for your niche. Pink dots mark recommended posting windows.
        </p>
      </div>

      {/* ══════════ POST BOTTOM SHEET ══════════ */}
      <BottomSheet isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} title={isEditing ? "Edit Post" : `Schedule for ${MONTH_NAMES[month]} ${schedulingDay}`} height="90vh">
        <div className="space-y-5 pt-4 pb-safe">
          {/* Platform */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Platform</label>
            <div className="flex gap-2">
              {(["ig", "yt", "tt"] as Platform[]).map(p => (
                <button key={p} onClick={() => setForm(prev => ({ ...prev, platform: p }))} className={`flex-1 h-11 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${form.platform === p ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"}`}>
                  {p === "ig" ? <Instagram className="w-4 h-4" /> : p === "yt" ? <Youtube className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Post Type</label>
            <div className="flex gap-2 flex-wrap">
              {(["reel", "post", "video", "short", "story", "thread"] as PostType[]).map(t => (
                <button key={t} onClick={() => setForm(prev => ({ ...prev, type: t }))} className={`h-9 px-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${form.type === t ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Caption</label>
            <AutoResizeTextarea
              placeholder="Write or paste your caption here..."
              value={form.caption}
              onChange={(e: any) => setForm(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
              maxLength={2200}
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Hashtags</label>
            <input
              placeholder="#fitness #creator #reels..."
              value={form.hashtags}
              onChange={e => setForm(prev => ({ ...prev, hashtags: e.target.value }))}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          {/* Time + AI */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Post Time</label>
            <div className="flex gap-2">
              <input
                type="time"
                value={form.time.replace(" AM", "").replace(" PM", "")}
                onChange={e => setForm(prev => ({ ...prev, time: e.target.value }))}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white"
              />
              <button onClick={handleAiSuggestTime} disabled={isAiSuggestingTime} className="h-12 px-5 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 disabled:opacity-60 shrink-0">
                {isAiSuggestingTime ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isAiSuggestingTime ? "..." : "AI Best Time"}
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Status</label>
            <div className="flex gap-2">
              {(["draft", "scheduled"] as PostStatus[]).map(s => (
                <button key={s} onClick={() => setForm(prev => ({ ...prev, status: s }))} className={`flex-1 h-10 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${form.status === s ? "bg-primary text-white border-primary" : "bg-white/5 border-white/10 text-zinc-500 hover:text-white"}`}>{s}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSavePost} className="w-full h-13 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.99] flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            {isEditing ? "Save Changes" : `Schedule Post for ${MONTH_NAMES[month]} ${schedulingDay}`}
          </button>
        </div>
      </BottomSheet>

      {/* ══════════ POST DETAIL BOTTOM SHEET ══════════ */}
      <BottomSheet isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} height="90vh">
        {selectedPost && (
          <div className="space-y-6 pt-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${PLATFORM_BG[selectedPost.platform]}`}>
                  <PlatformIcon platform={selectedPost.platform} className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-lg">{selectedPost.caption}</h4>
                  <p className="text-[10px] font-black text-zinc-500 uppercase">{selectedPost.type} · {MONTH_NAMES[selectedPost.month]} {selectedPost.day} · {selectedPost.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl border text-[9px] font-black uppercase ${STATUS_COLOR[selectedPost.status]}`}>{selectedPost.status}</span>
            </div>

            {/* Media preview */}
            <div className="aspect-video bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
              <Video className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* AI Optimization */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Caption Optimization
              </p>
              <p className="text-sm font-bold text-zinc-300 leading-relaxed italic">
                "Try starting with 'I used to hate HIIT until I found these 3 moves...' — it matches your top-performing reel hook format."
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => openEdit(selectedPost)} className="h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Post
              </button>
              <button onClick={() => navigate("/studio")} className="h-12 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" /> AI Studio
              </button>
              <button onClick={() => setIsDeleting(selectedPost.id)} className="h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2 col-span-2">
                <Trash2 className="w-4 h-4" /> Delete Post
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* ══════════ OPTIMISE PREVIEW MODAL ══════════ */}
      <AnimatePresence>
        {isOptimiseOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOptimiseOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight">AI Optimised Week</h3>
                  <p className="text-[10px] text-zinc-500 font-bold">5 posts · Best times for your niche · High-engagement formats</p>
                </div>
                <button onClick={() => setIsOptimiseOpen(false)} className="ml-auto p-2 hover:bg-white/5 rounded-xl transition-all"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 mb-6">
                {AI_OPTIMISE_PLAN.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className={`flex items-center gap-4 p-4 rounded-2xl border ${PLATFORM_BG[p.platform]}`}>
                    <div className="w-9 h-9 rounded-2xl bg-black/40 flex items-center justify-center shrink-0">
                      <PlatformIcon platform={p.platform} className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[12px] truncate">{p.caption}</p>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">{MONTH_NAMES[month]} {p.day} · {p.time} · {p.type}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setIsOptimiseOpen(false)} className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Dismiss</button>
                <button onClick={handleApplyPlan} className="flex-1 h-12 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" /> Apply Plan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <ConfirmationModal
        isOpen={!!isDeleting}
        title="Delete this scheduled post?"
        description="This cannot be undone. You'll have a 4-second window to undo after deletion."
        onConfirm={() => isDeleting && handleDelete(isDeleting)}
        onCancel={() => setIsDeleting(null)}
      />
    </PageTransition>
  );
};
