import { motion } from "framer-motion";
import { 
  ChevronRight, ExternalLink, Zap, Network, Calendar,
  MessageCircle, Heart, Share2, DollarSign as RevenueIcon,
  CheckCircle2, TrendingUp, Search, Bell, Copy,
  ArrowRight, Users, MousePointer2, MessageSquare, Wallet, Briefcase, 
  Download, Instagram, Youtube, Star, MoreHorizontal, Check, Play,
  Settings, Clock
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from "recharts";
import { PageTransition, CountUp } from "../../components/shared/MotionComponents";
import { 
  SkeletonCard, SkeletonHeader, SkeletonText 
} from "../../components/shared/Skeleton";
import { useState, useEffect } from "react";
import { EmptyState } from "../../components/shared/EmptyState";
import { Plus } from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { useAuth } from "../../contexts/AuthContext";

const sparklineData = [
  { value: 400 }, { value: 600 }, { value: 550 }, { value: 700 }, 
  { value: 800 }, { value: 750 }, { value: 900 }
];

export const Home = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Post your Tuesday Reel by 7:00 PM — "3 exercises for desk workers"', time: '10 min', completed: false, category: 'Content' },
    { id: 2, text: 'Reply to 12 unanswered comments on last post', time: '5 min', completed: true, category: 'Community' },
    { id: 3, text: 'Follow up with Nike Brand Partnership — no reply in 5 days', time: '3 min', completed: false, category: 'Deals' },
    { id: 4, text: 'Generate captions for Thursday\'s carousel post', time: '2 min', completed: false, category: 'Content' },
    { id: 5, text: 'Check Trend Radar — "no-equipment workout" is trending in your niche', time: '1 min', completed: false, category: 'Strategy' },
  ]);

  const stats = [
    { label: 'Total Reach', value: 384200, delta: '+14.3%', up: true, icon: Users, color: 'text-blue-500' },
    { label: 'Follower Growth', value: 892, delta: '+6.1%', up: true, icon: MousePointer2, color: 'text-indigo-500' },
    { label: 'Engagement Rate', value: 4.8, delta: '+0.4%', up: true, icon: MessageSquare, color: 'text-primary' },
    { label: 'Est. Revenue', value: 68000, delta: '₹', up: true, icon: Wallet, color: 'text-emerald-500' },
    { label: 'Active Brand Deals', value: 3, delta: 'View Hub', up: true, icon: Briefcase, color: 'text-amber-500' },
  ];

  const recentPosts = [
    { id: 1, type: 'Reel', title: '5 min morning stretch', platform: 'IG', reach: '42,800', eng: '6.2%', saves: '1,840' },
    { id: 2, type: 'Carousel', title: 'What I eat in a day', platform: 'IG', reach: '28,300', eng: '4.1%', saves: '920' },
    { id: 3, type: 'Video', title: 'My gym bag essentials', platform: 'YT', reach: '8,200 views', eng: '3.2%', saves: '67 comments' },
    { id: 4, type: 'Reel', title: '3 mistakes beginners make', platform: 'TikTok', reach: '61,400', eng: '7.8%', saves: '4.2k likes' },
    { id: 5, type: 'Story', title: 'Protein shake recipe', platform: 'IG', reach: '9,800', eng: '3.4%', saves: '340 taps' },
  ];

  const platformHealth = [
    { platform: 'Instagram', followers: '48,200', growth: '+312 this week', engagement: '4.8%', status: 'Healthy', color: 'bg-primary' },
    { platform: 'YouTube', followers: '12,800', growth: '+88 this week', engagement: '3.2%', status: 'Growing', color: 'bg-red-500' },
    { platform: 'TikTok', followers: '31,500', growth: '+492 this week', engagement: '5.1%', status: 'Healthy', color: 'bg-zinc-800' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const task = tasks.find(t => t.id === id);
    if (!task?.completed) {
      toast.success("Task completed! Keep it up. 🚀");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <SkeletonHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SkeletonCard className="lg:col-span-2 h-[400px]" />
          <SkeletonCard className="h-[400px]" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary"
          >
            <Zap className="w-3 h-3 fill-current" />
            Command Centre Overview
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]"
          >
            Good morning, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-purple-500 italic">
              {user?.firstName || 'Naveen'}
            </span> 👋
          </motion.h1>
          <p className="text-muted-foreground font-bold text-sm md:text-base max-w-xl leading-relaxed mt-4">
            Your engagement is up <span className="text-emerald-500">11%</span> this week. Best time to post today is <span className="text-primary tracking-widest uppercase">7:00 PM</span>. Nike has not replied to your pitch — send a follow-up now.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
          <button className="h-12 px-6 rounded-2xl bg-primary text-white hover:scale-105 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
            <Search className="w-4 h-4" /> Trend Radar
          </button>
        </div>
      </header>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-[2rem] bg-black/40 backdrop-blur-3xl p-6 border border-white/5 hover:border-primary/30 transition-all shadow-xl"
          >
            <div className={`p-3 rounded-2xl w-fit ${stat.color} bg-current/10 mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black tracking-tight">
                  <CountUp end={stat.value} prefix={stat.label === 'Est. Revenue' ? '₹ ' : ''} />
                </h3>
              </div>
              <div className={`text-[10px] font-black ${stat.up ? 'text-emerald-500' : 'text-primary'} flex items-center gap-1 mt-1`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {stat.delta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* AI Action Plan */}
          <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary fill-primary" />
                  Today's AI Action Plan
                </h3>
                <p className="text-xs font-bold text-muted-foreground mt-1">
                  Generated at 8:00 AM based on your niche trends
                </p>
              </div>
              <div className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                {completedCount}/{tasks.length} Complete
              </div>
            </div>
            <div className="p-4 md:p-8 space-y-4">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className={`group flex items-center gap-4 p-4 rounded-2xl transition-all ${task.completed ? 'bg-white/[0.02] opacity-50' : 'bg-white/5 border border-white/5 hover:border-primary/30'}`}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary' : 'border-white/20 hover:border-primary'}`}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] uppercase font-black tracking-widest opacity-40">{task.category}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                        <Clock className="w-3 h-3" /> {task.time}
                      </span>
                    </div>
                  </div>
                  <button className="hidden group-hover:flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest p-2">
                    Action <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Content Performance */}
          <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                <Play className="w-5 h-5 text-primary fill-primary" />
                Recent Content Stream
              </h3>
              <button className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">
                Full Studio <ChevronRight className="w-4 h-4 inline" />
              </button>
            </div>
            <div className="p-4 md:p-8">
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-50 z-10">{post.platform}</span>
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black truncate max-w-[150px] md:max-w-none">{post.title}</h4>
                        <div className="flex gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                           <span>{post.type}</span>
                           <span className="text-primary/60">•</span>
                           <span>{post.reach} Reach</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden md:block text-right">
                         <p className="text-xs font-black text-white">{post.eng}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Engagement</p>
                      </div>
                      <div className="hidden md:block text-right">
                         <p className="text-xs font-black text-white">{post.saves}</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50 text-right">Saves/Clicks</p>
                      </div>
                      <button className="p-2.5 rounded-xl bg-white/5 hover:bg-primary hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Creator Profile Summary Widget */}
          <div className="rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-purple-500/10 border border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity">
               <Stars className="w-12 h-12 text-white blur-xl animate-pulse" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/20 p-1">
                  <img 
                    src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"} 
                    alt="Profile" 
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-black tracking-tight leading-none">{user?.name || 'Naveen Kumar'}</h4>
                  <p className="text-xs font-bold text-white/60 mt-1 uppercase tracking-widest">{user?.handle || '@naveenfitlife'}</p>
                </div>
              </div>
              
              <div className="space-y-4 py-4 border-y border-white/5">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Creator Score</span>
                   <span className="text-xl font-black text-white">74<span className="text-xs opacity-40">/100</span></span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '74%' }}
                    className="h-full bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 text-center py-3 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs font-black">48.2k</p>
                   <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Followers</p>
                </div>
                <div className="flex-1 text-center py-3 bg-white/5 rounded-2xl border border-white/5">
                   <p className="text-xs font-black">4.8%</p>
                   <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mt-1">Engagement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Health Section */}
          <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 p-8 shadow-2xl">
            <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-6">
              <Network className="w-5 h-5 text-primary fill-primary" />
              Platform Health
            </h3>
            <div className="space-y-4">
              {platformHealth.map((plat) => (
                <div key={plat.platform} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${plat.color} animate-pulse`} />
                      <span className="text-xs font-black uppercase tracking-widest">{plat.platform}</span>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${plat.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'}`}>
                      {plat.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-lg font-black leading-none">{plat.followers}</p>
                      <p className="text-[9px] font-bold text-muted-foreground mt-1">{plat.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black">{plat.engagement}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-40 text-right">Avg ENG</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Snapshot Widget */}
          <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6">
               <div className="w-12 h-12 bg-primary/20 rounded-full blur-2xl animate-pulse" />
             </div>
             <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-2">
               <Briefcase className="w-5 h-5 text-primary fill-primary" />
               Deal Pipeline
             </h3>
             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6">Current Value: ₹ 3,20,000</p>
             
             <div className="space-y-4">
                {[
                  { label: 'Outreach', count: 3, percent: 60 },
                  { label: 'Negotiating', count: 1, percent: 20 },
                  { label: 'Signed/Live', count: 3, percent: 75 },
                ].map((stage) => (
                  <div key={stage.label} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-muted-foreground">{stage.label}</span>
                       <span>{stage.count} Deals</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        className="h-full bg-primary"
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-6 h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest">
                Go to Deal Hub
             </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Missing Lucide Icons that were used but not imported
const Stars = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);
