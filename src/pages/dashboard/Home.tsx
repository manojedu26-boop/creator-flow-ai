import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Zap, Network,
  TrendingUp, Search, 
  ArrowRight, Users, MousePointer2, MessageSquare, Wallet, Briefcase, 
  Check, Play, Clock, Plus, RefreshCcw as RefreshIcon, Stars, Sparkles, ChevronDown
} from "lucide-react";
import { PageTransition, CountUp, Magnetic, MagneticPulse } from "../../components/shared/MotionComponents";
import { 
  SkeletonCard, SkeletonHeader 
} from "../../components/shared/Skeleton";
import { useState, useEffect } from "react";
import { toast } from "../../components/ui/sonner";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import { cn } from "../../lib/utils";
import confetti from "canvas-confetti";
import { PulseWidget } from "../../components/pulse/PulseWidget";
import { PulseScoreRing } from "../../components/pulse/PulseScoreRing";
import { WhatsHappeningWidget } from "../../components/pulse/WhatsHappeningWidget";
import { NotificationSimulator } from "../../components/pulse/NotificationSimulator";
import { StoryBar } from "../../components/stories/StoryBar";
import { StoryViewer } from "../../components/stories/StoryViewer";
import { StoryCreationSheet } from "../../components/stories/StoryCreationSheet";
import { Creator } from "../../types/stories";
import { MOCK_CREATORS } from "../../data/mockStories";

const SystemStatus = () => (
  <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50/30 border border-emerald-100/50 rounded-full shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
    <div className="relative w-2.5 h-2.5">
      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
      <div className="relative w-full h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
    </div>
    <span className="pro-label text-emerald-600/80 font-bold">Engine Synchronised</span>
  </div>
);

export const Home = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const dbTasks = db.getAll('tasks');
      const dbContent = db.getAll('content');
      const dbDeals = db.getAll('deals');
      const dbInvoices = db.getAll('invoices');

      setTasks(dbTasks);
      setRecentPosts(dbContent.slice(0, 5));

      const totalRevenue = dbInvoices.reduce((sum: number, inv: any) => {
        const amountStr = String(inv.amount || '0');
        return sum + parseInt(amountStr.replace(/\D/g, '') || '0');
      }, 0);

      setStats([
        { label: 'Total Reach', value: 384200, delta: '+14.3%', up: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Growth Hub', value: 892, delta: '+6.1%', up: true, icon: TrendingUp, color: 'text-slate-900', bg: 'bg-slate-100' },
        { label: 'Engagement', value: 4.8, delta: '+0.4%', up: true, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Revenue', value: totalRevenue, delta: '₹', up: true, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Pipeline', value: dbDeals.length, delta: '3 New', up: true, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
      ]);

      setIsLoading(false);
    }, 800);
  };

  const platformHealth = [
    { platform: 'Instagram', followers: '48,200', growth: '+312 this week', engagement: '4.8%', status: 'Healthy', color: 'bg-gradient-to-tr from-purple-500 to-pink-500' },
    { platform: 'YouTube', followers: '12,800', growth: '+88 this week', engagement: '3.2%', status: 'Growing', color: 'bg-red-600' },
    { platform: 'TikTok', followers: '31,500', growth: '+492 this week', engagement: '5.1%', status: 'Healthy', color: 'bg-slate-900' },
  ];

  const [isBriefOpen, setIsBriefOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [activeStoryCreator, setActiveStoryCreator] = useState<Creator | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);
  const [creators, setCreators] = useState<Creator[]>(MOCK_CREATORS);

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTask = (id: string | number) => {
    // ... same as before
  };

  const handleStoryClick = (creator: Creator) => {
    if (creator.id === 'me' && !creator.stories.length) {
      setIsCreatingStory(true);
    } else {
      setActiveStoryCreator(creator);
    }
  };

  const handlePostStory = (type: any, content: string) => {
    const updatedCreators = creators.map(c => {
      if (c.id === 'me') {
        const newStory = {
          id: `s_user_${Date.now()}`,
          type,
          content,
          timestamp: "Just now",
          expiresAt: ""
        };
        return { ...c, stories: [...c.stories, newStory] };
      }
      return c;
    });
    setCreators(updatedCreators);
  };

  const navigateCreatorStories = (direction: 'next' | 'prev') => {
    const currentIndex = creators.findIndex(c => c.id === activeStoryCreator?.id);
    let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Simple wrap or skip if no stories
    while (nextIndex >= 0 && nextIndex < creators.length) {
      if (creators[nextIndex].stories.length > 0) {
        setActiveStoryCreator(creators[nextIndex]);
        return;
      }
      nextIndex = direction === 'next' ? nextIndex + 1 : nextIndex - 1;
    }
    setActiveStoryCreator(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (isLoading) {
    return (
      <div className="p-8 space-y-12">
        <SkeletonHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {[1,2,3,4,5].map(i => <SkeletonCard key={i} className="h-64 rounded-[3rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 pb-24 lg:pb-12 h-screen overflow-y-auto no-scrollbar px-2 relative">
      <AnimatePresence>
        {isBriefOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsBriefOpen(false)}
               className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }}
               className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-floating overflow-hidden border border-slate-100"
             >
                <div className="p-12 md:p-16 space-y-10">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
                            <Plus className="w-7 h-7 text-white stroke-[3]" />
                         </div>
                         <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-tight text-slate-950">Mission Brief</h2>
                      </div>
                      <button onClick={() => setIsBriefOpen(false)} className="pro-label text-slate-300 hover:text-slate-950 transition-colors">Abort</button>
                   </div>
                   <div className="space-y-8">
                      <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-6">
                         <p className="pro-label text-indigo-600">Initialising Campaign Node</p>
                         <h3 className="text-2xl font-semibold text-slate-950 uppercase leading-none">Creator Warroom v2.4</h3>
                         <div className="flex flex-col sm:flex-row gap-5">
                            <button className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 pro-label text-slate-950 hover:border-indigo-600 transition-all font-bold">Archive Data</button>
                            <button className="flex-1 h-14 rounded-2xl bg-slate-950 text-white pro-label hover:bg-indigo-600 transition-all font-bold">Launch Sequence</button>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}

        {isDiscoveryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsDiscoveryOpen(false)}
               className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl" 
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-4xl bg-white rounded-[5rem] shadow-floating overflow-hidden"
             >
                <div className="p-16 md:p-24 space-y-16">
                   <div className="space-y-6 text-center">
                      <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-float">
                        <Search className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight text-slate-950">Global Intelligence</h2>
                      <p className="pro-label text-xs">Accessing neural creator nodes across the planet</p>
                   </div>
                   <div className="relative">
                      <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Search for trends, creators, or metrics..." 
                        className="w-full h-24 rounded-[3rem] bg-slate-50 border border-slate-100 pl-24 pr-12 text-xl font-semibold text-slate-950 placeholder:text-slate-200 focus:outline-none focus:ring-8 focus:ring-indigo-600/5 transition-all"
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Hero Section — System Readiness */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 mt-4">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full">
              <span className="pro-label text-indigo-600/80 font-bold">Command Centre v4.0</span>
            </div>
            <SystemStatus />
          </motion.div>
          
          <div className="space-y-1">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-semibold tracking-tighter text-slate-950 uppercase leading-none italic"
            >
              CREATOR <span className="text-indigo-600/80">COMMAND</span> CENTER
            </motion.h1>
            <p className="text-slate-400 font-medium max-w-2xl text-xs md:text-sm uppercase tracking-[0.1em] leading-relaxed">
              Commander <span className="text-slate-900 font-bold">{user?.firstName}</span>. Impact projected <span className="text-indigo-600 font-bold">+14%</span>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBriefOpen(true)}
            className="h-14 px-8 bg-indigo-600 text-white rounded-2xl flex items-center gap-4 hover:bg-slate-950 transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span className="pro-label text-white font-bold">Mission</span>
          </button>
        </div>
      </div>

      {/* Global Actions Bar — Depth Layer */}
      <div className="grid grid-cols-3 gap-3 px-2">
           <button 
            onClick={fetchData}
            disabled={isLoading}
            className="h-16 rounded-2xl bg-white border border-slate-100 hover:border-indigo-600 transition-all flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-600 shadow-sm active:scale-98 group"
          >
            <RefreshIcon className={cn("w-4 h-4", isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500")} />
            <span className="pro-label font-bold">Sync</span>
          </button>

          <button 
            onClick={() => setIsDiscoveryOpen(true)}
            className="h-16 rounded-2xl bg-white border border-slate-100 hover:border-indigo-600 transition-all flex items-center justify-center gap-3 text-slate-900 shadow-sm group"
          >
            <Search className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" /> 
            <span className="pro-label text-slate-900 font-bold">Discovery</span>
          </button>

          <button 
            className="h-16 rounded-2xl bg-slate-950 text-white hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-98 group"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:animate-bounce" /> 
            <span className="pro-label text-white font-bold">Universal</span>
          </button>
      </div>


      {/* KPI Stats — Ambient Layering */}
      <div className="grid grid-cols-5 gap-3 items-stretch px-2 overflow-x-auto no-scrollbar pb-2">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-slate-100 transition-all shadow-sm flex flex-col justify-between min-w-[120px]"
          >
            <div className="relative z-10">
              <div className={cn("p-1.5 rounded-lg w-fit mb-3", stat.bg, stat.color)}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="pro-label">{stat.label}</p>
                <h3 className="text-base font-bold tracking-tight text-slate-950 leading-none data-value">
                  <CountUp value={stat.value} prefix={stat.label === 'Revenue' ? '₹ ' : ''} />
                </h3>
              </div>
            </div>
            <div className={cn("pro-tag mt-3 w-fit shrink-0", stat.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100')}>
              {stat.delta}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* AI Strategic Intelligence Deck */}
          <div className="rounded-[4rem] bg-white border border-slate-100 overflow-hidden shadow-premium premium-card">
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Zap className="w-4 h-4 text-white fill-white" />
                   </div>
                   <h3 className="text-xl font-semibold tracking-tight text-slate-950 uppercase leading-none">
                    Intelligence
                   </h3>
                </div>
                <p className="pro-label pl-11">
                   Neural Feed • Synchronised
                </p>
              </div>
              <div className="bg-slate-950 text-white pro-label px-4 py-2 rounded-lg font-bold shadow-sm shrink-0 tracking-widest">
                {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-2">
              {tasks.map((task, i) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl transition-all relative overflow-hidden",
                      task.completed 
                        ? "bg-slate-50/50 border-transparent opacity-60" 
                        : "bg-white border border-slate-100 hover:border-indigo-600/50"
                    )}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        task.completed 
                          ? "bg-emerald-500 border-emerald-500" 
                          : "border-slate-200 hover:border-indigo-600 bg-white"
                      )}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 text-white stroke-[4]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-semibold tracking-tight text-slate-950",
                        task.completed && "line-through text-slate-400"
                      )}>
                        {task.text}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="pro-label text-indigo-600/80 font-bold">{task.category}</span>
                        <span className="flex items-center gap-1.5 pro-label">
                          <Clock className="w-2.5 h-2.5" /> {task.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Stream */}
          <div className="rounded-[3rem] bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50">
            <div className="p-4 md:p-6 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-slate-950 uppercase opacity-40">
                Performance Data Strip
              </h3>
              <button className="pro-label text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-md font-bold">
                Nodes
              </button>
            </div>
            <div className="p-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-4 min-w-max pb-2">
                {recentPosts.map((post, i) => (
                  <div key={post.id} className="w-[180px] p-4 rounded-xl bg-white border border-slate-100 group hover:border-slate-950 transition-all flex flex-col justify-between h-[120px]">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                        <span className="pro-label text-white z-10 font-bold">{post.platform}</span>
                      </div>
                      <div className="pro-label italic">{post.date}</div>
                    </div>
                    <div className="space-y-1 mt-2">
                        <h4 className="text-[11px] font-semibold text-slate-950 truncate">{post.text}</h4>
                        <div className="pro-label text-indigo-600 font-bold">{post.type}</div>
                    </div>
                    <button className="w-full mt-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100 pro-label text-slate-950 font-bold hover:bg-slate-950 hover:text-white transition-all">
                       Audit Node
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-12">
          {/* Creator Profile Summary Widget */}
          <div className="rounded-2xl bg-slate-950 p-6 relative overflow-hidden group shadow-md">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 animate-float" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-0.5">
                  <img 
                    src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"} 
                    alt="Profile" 
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-lg font-semibold tracking-tight text-white uppercase">{user?.name || 'Naveen'}</h4>
                  <p className="pro-label text-indigo-500 font-bold">{user?.handle || '@naveenfitlife'}</p>
                </div>
              </div>
              
              <div className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/5 cursor-pointer">
                <PulseScoreRing size="sm" className="scale-75" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/5">
                   <p className="text-sm font-bold text-white font-mono">48.2k</p>
                   <p className="pro-label text-white/30 mt-1">Scale</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg border border-white/5">
                   <p className="text-sm font-bold text-white font-mono">4.8%</p>
                   <p className="pro-label text-white/30 mt-1">Impact</p>
                </div>
              </div>
            </div>
          </div>

          <WhatsHappeningWidget />
          <PulseWidget />

          {/* Platform Health Section */}
          <div className="rounded-[3rem] bg-white border border-slate-100 p-10 shadow-2xl shadow-slate-100/50">
            <h3 className="text-xl font-semibold tracking-tight flex items-center gap-4 mb-6 text-slate-950 uppercase opacity-40">
              <Network className="w-5 h-5" />
              Impact Analytics
            </h3>
            <div className="space-y-6">
              {platformHealth.map((plat) => (
                <div key={plat.platform} className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-4 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]", plat.color)} />
                      <span className="pro-label text-slate-950 font-bold">{plat.platform}</span>
                    </div>
                    <span className={cn(
                      "pro-tag",
                      plat.status === 'Healthy' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-blue-600 text-white border-blue-700'
                    )}>
                      {plat.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-slate-950">{plat.followers}</p>
                      <p className="pro-label mt-1">{plat.growth}</p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-base font-semibold text-slate-900 uppercase">Growth Oracle</h4>
                      <p className="pro-label mt-1">Predictive Analytics</p>
                      <p className="pro-label text-[8px] opacity-30 mt-1">Retention</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Funnel Widget */}
          <div className="rounded-[4rem] bg-white border border-slate-100 p-12 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full blur-[100px] opacity-10" />
             <h3 className="text-2xl font-semibold tracking-tight flex items-center gap-4 mb-2 text-slate-950 uppercase">
               <Briefcase className="w-6 h-6 text-blue-600" />
               Capital Hub
             </h3>
             <p className="pro-label mb-8">Projected Liquidity: <span className="text-slate-950 font-bold">₹ 3.2M</span></p>
             
             <div className="space-y-10">
                {[
                   { label: 'Pipeline', count: 3, percent: 60, color: 'bg-slate-200' },
                   { label: 'Negotiation', count: 1, percent: 35, color: 'bg-blue-300' },
                   { label: 'Live Deals', count: 3, percent: 85, color: 'bg-blue-600' },
                ].map((stage) => (
                  <div key={stage.label} className="space-y-4">
                    <div className="flex justify-between items-center pro-label text-slate-950 font-bold">
                       <span className="opacity-40">{stage.label}</span>
                       <span className="text-blue-600">{stage.count} Active</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-50 overflow-hidden shadow-inner p-0.5">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        className={cn("h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]", stage.color)}
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <button 
               onClick={() => {
                 toast.success("Opening Management Console...", {
                    description: "Calibrating financial intelligence for Q4..."
                 });
               }}
               className="w-full mt-12 h-16 rounded-[2rem] bg-slate-950 text-white hover:bg-blue-600 hover:scale-[1.02] transition-all pro-label font-bold text-white shadow-2xl shadow-blue-900/20 active:scale-95"
             >
                Manage Economy
             </button>
          </div>
        </div>
      </div>
      <NotificationSimulator />
      
      <AnimatePresence>
        {activeStoryCreator && (
          <StoryViewer 
            creator={activeStoryCreator}
            onClose={() => setActiveStoryCreator(null)}
            onNextCreator={() => navigateCreatorStories('next')}
            onPrevCreator={() => navigateCreatorStories('prev')}
          />
        )}
      </AnimatePresence>

      <StoryCreationSheet 
        isOpen={isCreatingStory}
        onClose={() => setIsCreatingStory(false)}
        onPost={handlePostStory}
      />
    </PageTransition>
  );
};
