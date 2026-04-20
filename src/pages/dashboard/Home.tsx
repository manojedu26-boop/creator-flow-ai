import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Zap, Network,
  TrendingUp, Search, 
  ArrowRight, Users, MousePointer2, MessageSquare, Wallet, Briefcase, 
  Check, Play, Clock, Plus, RefreshCcw as RefreshIcon, Stars, Sparkles, ChevronDown, Calculator, Scale
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
import { PulseWidget } from "../../components/pulse/PulseWidget";
import { PulseScoreRing } from "../../components/pulse/PulseScoreRing";
import { WhatsHappeningWidget } from "../../components/pulse/WhatsHappeningWidget";
import { NotificationSimulator } from "../../components/pulse/NotificationSimulator";
import { StoryCreationSheet } from "../../components/stories/StoryCreationSheet";
import { StoryViewer } from "../../components/stories/StoryViewer";
import { Creator } from "../../types/stories";
import { MOCK_CREATORS } from "../../data/mockStories";
import { supabase } from "../../lib/supabase";

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

  // Revenue Predictive Engine State
  const [roiParams, setRoiParams] = useState({ fee: 50000, reach: 100000 });
  const [isCalculating, setIsCalculating] = useState(false);
  const [roiForecast, setRoiForecast] = useState<any>(null);

  const calculateROI = async () => {
    setIsCalculating(true);
    setRoiForecast(null);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: {
          action: "ROI_FORECAST",
          niche: (user as any)?.niche || "Fitness",
          inputData: String(roiParams.fee),
          format: String(roiParams.reach),
          duration: "4.5%",
        },
      });
      if (error) throw error;
      if (data?.output) {
        setRoiForecast(data.output);
        toast.success("Revenue Forecast Ready!", { description: data.output.recommendation });
      }
    } catch (e: any) {
      if (String(e).includes("429")) toast.error("API Quota Exceeded");
      else toast.error("Forecast failed");
      // Fallback to instant math
      setRoiForecast(null);
    } finally {
      setIsCalculating(false);
    }
  };

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
    <PageTransition className="space-y-10 pb-24 h-screen overflow-y-auto no-scrollbar px-1 relative">
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


      {/* High-Velocity Header: System Readiness */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="px-3 py-1 bg-indigo-50 border border-indigo-100/50 rounded-full">
              <span className="pro-label text-indigo-600/80 font-bold">HQ Command v4.2</span>
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
            <p className="text-slate-400 font-medium max-w-2xl text-[10px] md:text-xs uppercase tracking-[0.1em] leading-relaxed">
              Commander <span className="text-slate-900 font-bold">{user?.firstName}</span> • Impact Flow <span className="text-indigo-600 font-bold">+14% Velocity</span>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsBriefOpen(true)}
            className="h-12 px-6 bg-indigo-600 text-white rounded-xl flex items-center gap-3 hover:bg-slate-950 transition-all active:scale-95 shadow-lg shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4 text-white stroke-[3]" />
            <span className="pro-label text-white font-bold">New Mission</span>
          </button>
        </div>
      </div>

      {/* Global Actions: Balanced Strategy Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <button 
            onClick={fetchData}
            disabled={isLoading}
            className="h-20 rounded-2xl bg-white border border-slate-100 hover:border-indigo-600 transition-all flex items-center px-8 gap-5 text-slate-400 hover:text-indigo-600 shadow-sm active:scale-98 group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <RefreshIcon className={cn("w-5 h-5", isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700")} />
            </div>
            <div className="text-left">
              <p className="pro-label font-bold text-slate-950 group-hover:text-indigo-600">Sync Pipeline</p>
              <p className="text-[9px] font-medium text-slate-400 group-hover:text-indigo-400">Updates nodes every 15m</p>
            </div>
          </button>

          <button 
            onClick={() => setIsDiscoveryOpen(true)}
            className="h-20 rounded-2xl bg-white border border-slate-100 hover:border-blue-600 transition-all flex items-center px-8 gap-5 text-slate-900 shadow-sm group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <Search className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-left">
              <p className="pro-label text-slate-900 font-bold group-hover:text-blue-600">Neural Search</p>
              <p className="text-[9px] font-medium text-slate-400 group-hover:text-blue-400">Deep creator intelligence</p>
            </div>
          </button>

          <button 
            className="h-20 rounded-2xl bg-slate-950 text-white hover:bg-indigo-600 transition-all flex items-center px-8 gap-5 shadow-sm active:scale-98 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 group-hover:animate-pulse" />
            </div>
            <div className="text-left">
              <p className="pro-label text-white font-bold">Pulse Engine</p>
              <p className="text-[9px] font-medium text-slate-500 group-hover:text-indigo-200">System-wide performance</p>
            </div>
          </button>
      </div>

      {/* KPI Stats: High-Density Expansion */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-100 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className={cn("p-2 rounded-xl w-fit mb-4", stat.bg, stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="pro-label text-[9px] text-slate-400">{stat.label}</p>
                <h3 className="text-xl font-bold tracking-tighter text-slate-950 leading-none data-value">
                  <CountUp value={stat.value} prefix={stat.label === 'Revenue' ? '₹ ' : ''} />
                </h3>
              </div>
            </div>
            <div className={cn("pro-tag mt-4 w-fit shrink-0", stat.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100')}>
              {stat.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* REBALANCED GRID: ONE BESIDE ONE Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left/Center Column: Primary Intelligence */}
        <div className="space-y-10">
          {/* AI Strategic Intelligence Deck */}
          <div className="rounded-[2.5rem] bg-white border border-slate-100 overflow-hidden shadow-premium premium-card">
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Zap className="w-4 h-4 text-white fill-white" />
                   </div>
                   <h3 className="text-xl font-semibold tracking-tight text-slate-950 uppercase leading-none">
                    Mission Log
                   </h3>
                </div>
                <p className="pro-label pl-11">
                   Neural Feed • Synchronised
                </p>
              </div>
              <div className="bg-slate-950 text-white pro-label px-4 py-2 rounded-lg font-bold shadow-sm shrink-0 tracking-widest text-[9px]">
                {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="p-4 md:p-6 space-y-2.5">
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
                        <span className="pro-label text-indigo-600/80 font-bold text-[8px]">{task.category}</span>
                        <span className="flex items-center gap-1.5 pro-label text-[8px]">
                          <Clock className="w-2.5 h-2.5" /> {task.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Side-by-Side Horizontal Row 1: Pulse & Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <PulseWidget />
             </div>
             
             <div className="rounded-[2rem] bg-slate-950 p-8 relative overflow-hidden group shadow-xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 animate-float" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white p-0.5">
                      <img 
                        src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"} 
                        alt="Profile" 
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-semibold tracking-tight text-white uppercase">{user?.name || 'Naveen'}</h4>
                      <p className="pro-label text-indigo-500 font-bold text-[10px]">{user?.handle || '@naveenfitlife'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center p-6 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                    <PulseScoreRing size="sm" className="scale-110" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-base font-bold text-white font-mono">48.2k</p>
                       <p className="pro-label text-white/30 mt-1 text-[8px]">Scale</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                       <p className="text-base font-bold text-white font-mono">4.8%</p>
                       <p className="pro-label text-white/30 mt-1 text-[8px]">Impact</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right/Secondary Column: High-Density Analytics & Capital */}
        <div className="space-y-10">
          
          {/* Side-by-Side Strategy Row 2: Impact Analytics */}
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-2xl shadow-slate-100/50">
            <h3 className="pro-label text-slate-950 font-bold mb-8 flex items-center gap-4 opacity-100 text-[10px]">
              <Network className="w-5 h-5 text-indigo-600" />
              IMPACT ANALYTICS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformHealth.map((plat) => (
                <div key={plat.platform} className="p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 space-y-5 hover:bg-white hover:shadow-xl transition-all h-full flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]", plat.color)} />
                      <span className="pro-label text-slate-950 font-bold text-[10px]">{plat.platform}</span>
                    </div>
                    <span className={cn(
                      "pro-tag text-[7px]",
                      plat.status === 'Healthy' ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-blue-600 text-white border-blue-700'
                    )}>
                      {plat.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold font-mono tracking-tighter text-slate-950">{plat.followers}</p>
                      <p className="pro-label mt-1 text-[9px] text-slate-400">{plat.growth}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Performance Data Summary Placeholder */}
              <div className="p-6 rounded-[2.5rem] bg-slate-950 flex flex-col justify-center items-center text-center space-y-3 cursor-pointer hover:bg-indigo-600 transition-all">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                   <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="pro-label text-white/50 text-[9px]">Deep Audit</p>
                <p className="text-white font-bold text-xs">Unlock Q4 Strategy</p>
              </div>
            </div>
          </div>

          {/* Revenue Funnel: Full Width Strategy Block */}
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-10 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full blur-[100px] opacity-10" />
             <div className="flex justify-between items-start mb-10">
               <div className="space-y-1">
                 <h3 className="text-2xl font-semibold tracking-tight text-slate-950 uppercase flex items-center gap-4">
                   <Briefcase className="w-6 h-6 text-blue-600" />
                   Capital Hub
                 </h3>
                 <p className="pro-label mb-8">Projected Liquidity: <span className="text-slate-950 font-bold">₹ 3.2M</span></p>
               </div>
               <div className="pro-tag bg-blue-50 text-blue-600 border-blue-100">Live Forecast</div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {[
                   { label: 'Pipeline', count: 3, percent: 60, color: 'bg-slate-200' },
                   { label: 'Negotiation', count: 1, percent: 35, color: 'bg-blue-300' },
                   { label: 'Live Deals', count: 3, percent: 85, color: 'bg-blue-600' },
                ].map((stage) => (
                  <div key={stage.label} className="space-y-4">
                    <div className="flex justify-between items-center pro-label text-slate-950 font-bold text-[9px]">
                       <span className="opacity-40">{stage.label}</span>
                       <span className="text-blue-600">{stage.count} Nodes</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-50 overflow-hidden shadow-inner flex p-0">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        className={cn("h-full rounded-full transition-all", stage.color)}
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <button 
               onClick={() => toast.success("Opening Management Console...")}
               className="w-full h-14 rounded-2xl bg-slate-950 text-white hover:bg-blue-600 hover:scale-[1.01] transition-all pro-label font-bold text-white shadow-2xl shadow-blue-900/10 active:scale-95 text-[10px]"
             >
                Manage Economy Core
             </button>
          </div>

          {/* REVENUE PREDICTIVE ENGINE: Strategic Financial Node */}
          <div className="rounded-[2.5rem] bg-indigo-600 p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />
             
             <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                         <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold uppercase tracking-tight">Revenue Predictor</h3>
                         <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Brand Deal ROI Forecaster</p>
                      </div>
                   </div>
                   <div className="px-3 py-1 bg-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                      Strategic AI
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <p className="pro-label text-indigo-200 text-[8px]">Base Fee (₹)</p>
                         <input 
                            type="number" 
                            value={roiParams.fee}
                            onChange={(e) => setRoiParams({...roiParams, fee: parseInt(e.target.value) || 0})}
                            className="w-full h-12 bg-white/10 border border-white/10 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-mono" 
                         />
                      </div>
                      <div className="space-y-2">
                         <p className="pro-label text-indigo-200 text-[8px]">Target Reach</p>
                         <input 
                            type="number" 
                            value={roiParams.reach}
                            onChange={(e) => setRoiParams({...roiParams, reach: parseInt(e.target.value) || 0})}
                            className="w-full h-12 bg-white/10 border border-white/10 rounded-xl px-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-mono" 
                         />
                      </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-white/10 border border-white/10 space-y-4">
                       {roiForecast ? (
                         <>
                           <div className="flex justify-between items-center">
                             <p className="pro-label text-indigo-100 text-[9px]">Fair Market Value</p>
                             <p className="text-sm font-black font-mono">{roiForecast.fairMarketValue}</p>
                           </div>
                           <div className="flex justify-between items-center">
                             <p className="pro-label text-indigo-100 text-[9px]">ROI Multiple</p>
                             <p className="text-sm font-black font-mono text-emerald-400">{roiForecast.roiMultiple}</p>
                           </div>
                           <div className="flex justify-between items-center">
                             <p className="pro-label text-indigo-100 text-[9px]">Negotiation Floor</p>
                             <p className="text-sm font-black font-mono text-amber-400">{roiForecast.negotiationFloor}</p>
                           </div>
                           <div className="h-px bg-white/10" />
                           <div className="p-3 bg-white/5 rounded-2xl">
                             <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">AI Verdict</p>
                             <p className="text-sm font-black text-emerald-400">{roiForecast.recommendation} — {roiForecast.recommendationReason}</p>
                           </div>
                         </>
                       ) : (
                         <>
                           <div className="flex justify-between items-center">
                             <p className="pro-label text-indigo-100 text-[9px]">Fair Market Value</p>
                             <p className="text-lg font-black font-mono">₹ {(roiParams.reach * 0.85).toLocaleString()}</p>
                           </div>
                           <div className="flex justify-between items-center">
                             <p className="pro-label text-indigo-100 text-[9px]">Potential ROI</p>
                             <p className="text-lg font-black font-mono text-emerald-400">
                               {((roiParams.reach * 0.85) / roiParams.fee).toFixed(1)}x
                             </p>
                           </div>
                         </>
                       )}
                    </div>              </div>
                </div>

                <button 
                  onClick={calculateROI}
                  className="w-full h-14 bg-white text-indigo-600 rounded-2xl pro-label font-bold text-[10px] hover:bg-indigo-50 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                   {isCalculating ? (
                      <>Analyzing Market Vectors <RefreshIcon className="w-4 h-4 animate-spin" /></>
                   ) : (
                      <>Sync Prediction Engine <Scale className="w-4 h-4" /></>
                   )}
                </button>
             </div>
          </div>

          <WhatsHappeningWidget />
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
