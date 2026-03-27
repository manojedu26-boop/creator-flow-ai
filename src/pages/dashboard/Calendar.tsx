import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, 
  Filter, Instagram, Youtube, Play, MoreVertical, 
  Sparkles, Clock, Layout, FileText, Hash, Check,
  X, Image as ImageIcon, Video, Send, Settings,
  Zap, TrendingUp, AlertCircle
} from "lucide-react";
import { EmptyState } from "../../components/shared/EmptyState";
import { useEffect } from "react";

type ViewMode = 'month' | 'week' | 'day' | 'list';
type ContentPillar = 'educational' | 'entertainment' | 'promotional' | 'personal' | 'bts';

interface ScheduledPost {
  id: string;
  platform: 'ig' | 'yt' | 'tt';
  type: 'reel' | 'video' | 'post' | 'short';
  caption: string;
  time: string;
  day: number;
  pillar: ContentPillar;
  status: 'draft' | 'scheduled' | 'published';
}

const posts: ScheduledPost[] = [
  { id: '1', platform: 'ig', type: 'reel', caption: 'Morning workout routine...', time: '7:00 PM', day: 12, pillar: 'educational', status: 'scheduled' },
  { id: '2', platform: 'yt', type: 'video', caption: 'The 10K Journey Episode 4', time: '11:00 AM', day: 14, pillar: 'entertainment', status: 'draft' },
  { id: '3', platform: 'tt', type: 'short', caption: 'Quick productivity hack', time: '6:30 PM', day: 12, pillar: 'educational', status: 'published' },
  { id: '4', platform: 'ig', type: 'post', caption: 'Life lately...', time: '8:45 PM', day: 18, pillar: 'personal', status: 'scheduled' },
];

const pillarColors: Record<ContentPillar, string> = {
  educational: 'bg-blue-500',
  entertainment: 'bg-pink-500',
  promotional: 'bg-amber-500',
  personal: 'bg-emerald-500',
  bts: 'bg-purple-500',
};

export const Calendar = () => {
  const [view, setView] = useState<ViewMode>('month');
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const days = Array.from({ length: 35 }, (_, i) => i - 3); // Mocking a month starting mid-week

  const renderMonthView = () => (
    <div className="grid grid-cols-7 border border-border/40 rounded-3xl overflow-hidden bg-card shadow-xl h-full min-h-[700px]">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <div key={d} className="p-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-r border-border/20 last:border-r-0 bg-muted/5">
          {d}
        </div>
      ))}
      {posts.length === 0 && !isLoading ? (
        <div className="col-span-7 row-span-5 p-20 flex items-center justify-center">
          <EmptyState 
            icon={CalendarIcon} 
            title="No scheduled posts" 
            description="Start planning your content to see it here on the smart calendar." 
          />
        </div>
      ) : (
        days.map((day, i) => {
          const isCurrentMonth = day > 0 && day <= 30;
          const dayPosts = posts.filter(p => p.day === day);
          const hasPrimeTime = day % 3 === 0; // Mocking AI logic
          const hasOpportunity = day === 15 || day === 22;

          return (
            <div 
              key={i} 
              className={`min-h-[120px] p-2 border-r border-b border-border/20 last:border-r-0 relative group transition-colors ${
                isCurrentMonth ? 'bg-card' : 'bg-muted/5 opacity-40'
              } hover:bg-muted/10`}
            >
              <div className="flex justify-between items-start mb-2 px-1">
                <span className={`text-xs font-black ${day === 22 ? 'text-primary' : ''}`}>
                  {isCurrentMonth ? day : ''}
                </span>
                {isCurrentMonth && hasPrimeTime && (
                  <div title="Prime Time" className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                )}
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[80px] no-scrollbar">
                {isLoading ? (
                  Array(Math.floor(Math.random() * 2)).fill(0).map((_, idx) => <div key={idx} className="h-4 w-full rounded bg-muted/10 animate-pulse" />)
                ) : (
                  dayPosts.map(post => (
                    <div 
                      key={post.id} 
                      onClick={() => setSelectedPost(post)}
                      className="p-1.5 rounded-lg border border-border/30 bg-muted/20 flex items-center gap-2 cursor-pointer hover:border-primary/50 transition-all overflow-hidden"
                    >
                      <div className={`w-1 h-4 rounded-full ${pillarColors[post.pillar]} shrink-0`} />
                      {post.platform === 'ig' ? <Instagram className="w-3 h-3" /> : post.platform === 'yt' ? <Youtube className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span className="text-[9px] font-black truncate leading-none uppercase">{post.caption}</span>
                    </div>
                  ))
                )}
              </div>

              {isCurrentMonth && hasOpportunity && (
                 <motion.div 
                   animate={{ opacity: [0.5, 1, 0.5] }} 
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-tighter cursor-pointer hover:bg-emerald-500 hover:text-white transition-all"
                 >
                   <Zap className="w-2.5 h-2.5" /> Post Today
                 </motion.div>
              )}

              {isCurrentMonth && (
                 <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-background/40 backdrop-blur-[2px] pointer-events-none group-active:pointer-events-auto">
                    <div onClick={() => setIsDrawerOpen(true)} className="p-2 rounded-full bg-primary text-primary-foreground shadow-xl pointer-events-auto">
                      <Plus className="w-4 h-4" />
                    </div>
                 </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderDrawer = () => (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed right-0 top-0 bottom-0 w-[480px] bg-card border-l border-border/40 shadow-2xl z-[100] flex flex-col"
    >
      <div className="p-8 border-b border-border/30 flex items-center justify-between">
         <h3 className="text-xl font-black uppercase tracking-tight">Schedule New Post</h3>
         <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
         <div className="flex gap-2 mb-12">
            {[1,2,3,4,5,6].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= currentStep ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]' : 'bg-muted'}`} />
            ))}
         </div>

         {currentStep === 1 && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest">Step 1: Choose Platform</h4>
              <div className="grid grid-cols-3 gap-4">
                 {[
                   { id: 'ig', icon: Instagram, label: 'Instagram' },
                   { id: 'yt', icon: Youtube, label: 'YouTube' },
                   { id: 'tt', icon: Play, label: 'TikTok' },
                 ].map(p => (
                   <div key={p.id} className="p-6 rounded-3xl border border-border/40 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                      <p.icon className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase">{p.label}</span>
                   </div>
                 ))}
              </div>
           </motion.div>
         )}

         {currentStep === 2 && (
            <div className="space-y-8">
               <h4 className="text-sm font-black uppercase tracking-widest">Step 2: Upload or Generate Media</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-10 border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-primary/40 cursor-pointer transition-all">
                     <ImageIcon className="w-8 h-8 text-muted-foreground" />
                     <span className="text-[10px] font-black uppercase text-muted-foreground">Upload Media</span>
                  </div>
                  <div className="p-10 border-2 border-dashed border-primary/40 bg-primary/5 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-primary/10 cursor-pointer transition-all group">
                     <Sparkles className="w-8 h-8 text-primary" />
                     <span className="text-[10px] font-black uppercase text-primary group-hover:drop-shadow-[0_0_5px_hsl(var(--primary))]">Generate with AI</span>
                  </div>
               </div>
            </div>
         )}
      </div>

      <div className="p-8 border-t border-border/30 bg-muted/10 flex gap-4">
         <button 
           disabled={currentStep === 1}
           onClick={() => setCurrentStep(s => s - 1)}
           className="h-12 flex-1 rounded-2xl border border-border/40 text-xs font-black uppercase tracking-widest hover:bg-muted transition-all disabled:opacity-30"
         >
           Back
         </button>
         <button 
           onClick={() => currentStep < 6 ? setCurrentStep(s => s + 1) : setIsDrawerOpen(false)}
           className="h-12 flex-1 rounded-2xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all"
         >
           {currentStep === 6 ? 'Schedule Post' : 'Next Step'}
         </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-3xl font-black tracking-tight">Smart Calendar</h2>
           <p className="text-muted-foreground text-sm mt-1">AI-optimized schedule for maximum engagement</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex bg-card border border-border/40 rounded-2xl p-1 shadow-sm">
              {['Month', 'Week', 'Day', 'List'].map(m => (
                <button 
                  key={m} 
                  onClick={() => setView(m.toLowerCase() as ViewMode)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    view === m.toLowerCase() ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  {m}
                </button>
              ))}
           </div>
           <button 
             onClick={() => setIsDrawerOpen(true)}
             className="h-11 px-6 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all active:scale-95"
           >
             <Plus className="w-5 h-5" /> Schedule Post
           </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-border/30 py-4">
        <div className="flex items-center gap-4">
           <button className="p-2 hover:bg-muted rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
           <h3 className="text-xl font-black uppercase tracking-tight">March 2026</h3>
           <button className="p-2 hover:bg-muted rounded-xl transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="flex items-center gap-2">
           {['IG', 'YT', 'TT'].map(p => (
             <button key={p} className="px-3 py-1.5 rounded-lg border border-border/40 text-[10px] font-black uppercase tracking-widest hover:border-primary/50 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {p}
             </button>
           ))}
           <div className="w-px h-6 bg-border/40 mx-2" />
           <button className="p-2 hover:bg-muted rounded-xl text-muted-foreground"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1">
         {view === 'month' && renderMonthView()}
         {view !== 'month' && (
           <div className="h-[600px] border-2 border-dashed border-border/40 rounded-[3rem] flex flex-col items-center justify-center text-center opacity-40">
              <CalendarIcon className="w-16 h-16 mb-4" />
              <p className="text-lg font-black uppercase tracking-widest">{view} View Coming Soon</p>
           </div>
         )}
      </div>

      {/* AI SCHEDULE OPTIMIZER BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[100px] left-12 h-14 pl-5 pr-8 bg-black text-white hover:bg-primary transition-all rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10 flex items-center gap-3 group z-[50]"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-white/20">
           <Sparkles className="w-4 h-4 text-primary group-hover:text-white" />
        </div>
        <span className="text-xs font-black uppercase tracking-widest">Optimise My Week</span>
      </motion.button>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90]" />
            {renderDrawer()}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPost(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-card border border-border/40 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                         {selectedPost.platform === 'ig' ? <Instagram className="w-6 h-6" /> : selectedPost.platform === 'yt' ? <Youtube className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </div>
                      <div>
                         <h4 className="font-black text-xl uppercase tracking-tight">{selectedPost.type}</h4>
                         <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{selectedPost.status} • Scheduled for {selectedPost.time}</span>
                      </div>
                   </div>
                   <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-muted rounded-full">
                      <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-8">
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-2">Pillar</span>
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${pillarColors[selectedPost.pillar]}`} />
                         <span className="text-xs font-black uppercase">{selectedPost.pillar}</span>
                      </div>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-2">Deal</span>
                      <span className="text-xs font-black uppercase">Nike Summer</span>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-2">Platform</span>
                      <span className="text-xs font-black uppercase">{selectedPost.platform}</span>
                   </div>
                </div>

                <div className="aspect-video w-full bg-muted/30 rounded-3xl border border-border/20 flex items-center justify-center mb-8 relative group overflow-hidden">
                   <Video className="w-12 h-12 text-muted-foreground/20 group-hover:scale-110 transition-transform" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="space-y-4">
                   <div className="p-5 rounded-2xl bg-muted/10 border border-border/30">
                      <p className="text-sm font-medium leading-relaxed italic">"{selectedPost.caption}"</p>
                   </div>
                   <div className="flex gap-2">
                       {['#fitness', '#routine', '#morning'].map(t => <span key={t} className="text-[10px] font-black text-primary">#{t}</span>)}
                   </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border/30 grid grid-cols-2 gap-4">
                   <button className="h-12 rounded-2xl border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Edit Post</button>
                   <button className="h-12 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">Publish Now</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
