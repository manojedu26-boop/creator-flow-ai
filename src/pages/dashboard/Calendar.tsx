import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Filter, Instagram, Youtube, Play, MoreVertical, 
  Sparkles, Clock, Layout, FileText, Hash, Check,
  X, Image as ImageIcon, Video, Send, Settings,
  Zap, TrendingUp, AlertCircle
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { useLongPress } from "../../components/shared/MobileInteractions";
import { BottomSheet } from "../../components/ui/BottomSheet";

type ViewMode = 'month' | 'week' | 'day' | 'list';

interface ScheduledPost {
  id: string;
  platform: 'ig' | 'yt' | 'tt';
  type: 'reel' | 'video' | 'post' | 'short' | 'meeting';
  caption: string;
  time: string;
  day: number;
  status: 'draft' | 'scheduled' | 'published';
}

const posts: ScheduledPost[] = [
  { id: '1', platform: 'ig', type: 'reel', caption: '3 exercises for desk workers', time: '7:00 PM', day: 25, status: 'scheduled' },
  { id: '2', platform: 'ig', type: 'post', caption: 'What I eat in a day (Clean)', time: '6:30 PM', day: 27, status: 'draft' },
  { id: '3', platform: 'yt', type: 'video', caption: 'My gym bag essentials 2025', time: '8:00 AM', day: 29, status: 'scheduled' },
  { id: '4', platform: 'ig', type: 'meeting', caption: 'Decathlon Campaign Kickoff', time: '10:00 AM', day: 24, status: 'scheduled' },
];

const CalendarPost = ({ post, onSelect }: { post: ScheduledPost; onSelect: () => void }) => {
  const pressProps = useLongPress(
    () => onSelect(), 
    () => onSelect(),
    { delay: 400, shouldPreventDefault: false }
  );

  return (
    <div {...pressProps} className="p-2 rounded-xl bg-white/5 border border-white/5 hover:border-primary/40 cursor-pointer transition-all overflow-hidden group/item">
      <div className="flex items-center gap-2 pointer-events-none">
        {post.platform === 'ig' ? <Instagram className="w-3 h-3 text-primary" /> : post.platform === 'yt' ? <Youtube className="w-3 h-3 text-red-500" /> : <CalendarIcon className="w-3 h-3 text-blue-500" />}
        <span className="text-[9px] font-black truncate uppercase tracking-tighter text-white/80">{post.caption}</span>
      </div>
    </div>
  );
};

export const Calendar = () => {
  const [view, setView] = useState<ViewMode>('month');
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  const days = Array.from({ length: 35 }, (_, i) => i - 3);

  const renderMonthView = () => (
    <div className="grid grid-cols-7 border border-white/5 rounded-[2.5rem] overflow-hidden bg-black/40 backdrop-blur-3xl shadow-2xl h-full min-h-[700px]">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <div key={d} className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-r border-white/5 last:border-r-0 bg-white/[0.02]">
          {d}
        </div>
      ))}
      {days.map((day, i) => {
        const isCurrentMonth = day > 0 && day <= 31;
        const dayPosts = posts.filter(p => p.day === day);
        const isPrimeTime = day === 25 || day === 27;

        return (
          <div key={i} className={`min-h-[140px] p-3 border-r border-b border-white/5 last:border-r-0 relative group transition-colors ${isCurrentMonth ? 'bg-transparent' : 'opacity-20'} hover:bg-white/[0.02]`}>
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs font-black ${day === 25 ? 'text-primary' : 'text-white/60'}`}>{isCurrentMonth ? day : ''}</span>
              {isCurrentMonth && isPrimeTime && (
                <div title="AI Prime Time" className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#FF3CAC]" />
              )}
            </div>

            <div className="space-y-2">
              {dayPosts.map(post => (
                <CalendarPost key={post.id} post={post} onSelect={() => setSelectedPost(post)} />
              ))}
            </div>

            {isCurrentMonth && day === 25 && (
              <div className="absolute bottom-3 left-3 right-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[8px] font-black text-primary uppercase text-center flex items-center justify-center gap-1">
                <Zap className="w-2.5 h-2.5" /> High Engagement Window
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <CalendarIcon className="w-3 h-3" />
            Content Master-Plan
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
             Live <span className="text-primary italic">Schedule</span>
          </h1>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Optimize
           </button>
           <button className="h-12 px-6 rounded-2xl bg-primary text-white hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
              <Plus className="w-4 h-4" /> Schedule Post
           </button>
        </div>
      </header>

      <div className="flex items-center justify-between border-y border-white/5 py-4">
        <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
           <h3 className="text-xl font-black uppercase tracking-tight">March 2025</h3>
           <button className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="hidden md:flex items-center gap-6">
           {['IG Reels', 'YT Shorts', 'Meetings'].map(p => (
             <div key={p} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${p === 'IG Reels' ? 'bg-primary' : p === 'YT Shorts' ? 'bg-red-500' : 'bg-blue-500'}`} />
                {p}
             </div>
           ))}
        </div>
      </div>

      <div className="flex-1">
         {renderMonthView()}
      </div>

      <BottomSheet isOpen={!!selectedPost} onClose={() => setSelectedPost(null)} height="90vh">
        {selectedPost && (
          <div className="flex flex-col h-full pt-4">
             <div className="flex justify-between items-start mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                     {selectedPost.platform === 'ig' ? <Instagram className="w-6 h-6 text-primary" /> : <Youtube className="w-6 h-6 text-red-500" />}
                  </div>
                  <div>
                     <h4 className="font-black text-xl uppercase tracking-tight pr-8">{selectedPost.caption}</h4>
                     <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{selectedPost.type} • {selectedPost.time}</span>
                  </div>
               </div>
             </div>
             
             <div className="aspect-video bg-black/40 rounded-3xl border border-white/5 mb-6 flex items-center justify-center relative overflow-hidden group shrink-0">
                <Video className="w-12 h-12 text-white/10 group-hover:text-primary transition-colors duration-500" />
             </div>

             <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-3 shrink-0">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> AI Caption Optimization
                </p>
                <p className="text-sm font-bold text-white/90 leading-relaxed italic">
                  "Try starting with 'I used to hate HIIT until I found these 3 moves...' – it matches your top-performing reel hook."
                </p>
             </div>

             <div className="mt-8 grid grid-cols-2 gap-4 pb-safe-offset mt-auto shrink-0 pt-4">
                <button className="h-12 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Edit Layout</button>
                <button className="h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Go to Studio</button>
             </div>
          </div>
        )}
      </BottomSheet>
    </PageTransition>
  );
};
