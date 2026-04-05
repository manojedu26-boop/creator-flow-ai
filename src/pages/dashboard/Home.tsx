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
import { PulseStrip } from "../../components/pulse/PulseStrip";

const SystemStatus = () => (
  <div className="flex items-center gap-3 px-5 py-2.5 bg-emerald-50/30 border border-emerald-100/50 rounded-full shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
    <div className="relative w-2.5 h-2.5">
      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
      <div className="relative w-full h-full bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/80">Engine Synchronised</span>
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

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTask = (id: string | number) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === id) {
        const newStatus = !t.completed;
        db.update('tasks', id.toString(), { completed: newStatus } as any);
        return { ...t, completed: newStatus };
      }
      return t;
    });
    setTasks(updatedTasks);

    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success("Intelligence Node Cleared 🚀");
      
      const newCompletedCount = updatedTasks.filter(t => t.completed).length;
      if (newCompletedCount === tasks.length && tasks.length > 0) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc']
        });
        toast.success("Strategic Sequence Complete 🔥", {
          description: "Your engine is operating at maximum efficiency."
        });
      }
    }
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
                         <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-950">Mission Brief</h2>
                      </div>
                      <button onClick={() => setIsBriefOpen(false)} className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-950 transition-colors">Abort</button>
                   </div>
                   <div className="space-y-8">
                      <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-6">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Initialising Campaign Node</p>
                         <h3 className="text-2xl font-black text-slate-950 uppercase leading-none">Creator Warroom v2.4</h3>
                         <div className="flex flex-col sm:flex-row gap-5">
                            <button className="flex-1 h-14 rounded-2xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-950 hover:border-indigo-600 transition-all">Archive Data</button>
                            <button className="flex-1 h-14 rounded-2xl bg-slate-950 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Launch Sequence</button>
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
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-slate-950">Global Intelligence</h2>
                      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Accessing neural creator nodes across the planet</p>
                   </div>
                   <div className="relative">
                      <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-300" />
                      <input 
                        type="text" 
                        placeholder="Search for trends, creators, or metrics..." 
                        className="w-full h-24 rounded-[3rem] bg-slate-50 border border-slate-100 pl-24 pr-12 text-xl font-black text-slate-950 placeholder:text-slate-200 focus:outline-none focus:ring-8 focus:ring-indigo-600/5 transition-all"
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section — System Readiness */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 px-2 mt-8">
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="px-4 py-2 bg-indigo-50 border border-indigo-100/50 rounded-full">
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600">Command Centre v4.0</span>
            </div>
            <SystemStatus />
          </motion.div>
          
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black tracking-tighter text-slate-950 uppercase leading-[0.8] mb-4"
            >
              Intelligence <br />
              <span className="text-indigo-600 inline-flex items-center gap-6">
                Operational <Sparkles className="w-12 h-12 md:w-20 md:h-20 text-slate-200 fill-slate-200 animate-pulse" />
              </span>
            </motion.h1>
            <p className="text-slate-400 font-bold max-w-3xl text-sm md:text-lg uppercase tracking-[0.15em] leading-relaxed">
              Welcome back, <span className="text-slate-900">{user?.firstName || 'Commander'}</span>. All neural nodes are active. <br />
              <span className="text-indigo-600">Projected impact score +14% for the upcoming cycle.</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <MagneticPulse color="bg-indigo-600">
            <button 
              onClick={() => setIsBriefOpen(true)}
              className="h-20 px-12 bg-indigo-600 text-white rounded-3xl flex items-center gap-6 shadow-floating hover:shadow-indigo-500/20 transition-all group active:scale-95"
            >
              <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                <Plus className="w-5 h-5 text-white stroke-[4]" />
              </div>
              <span className="text-[12px] font-black uppercase tracking-[0.3em]">Initialise Mission</span>
            </button>
          </MagneticPulse>
        </div>
      </div>

      {/* Global Actions Bar — Depth Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        <Magnetic strength={0.1}>
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="w-full h-20 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-4 text-slate-400 hover:text-indigo-600 shadow-premium active:scale-98 group"
          >
            <RefreshIcon className={cn("w-6 h-6", isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700")} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Re-sync Intelligence</span>
          </button>
        </Magnetic>

        <Magnetic strength={0.1}>
          <button 
            onClick={() => setIsDiscoveryOpen(true)}
            className="w-full h-20 rounded-[2.5rem] bg-white border border-slate-100 hover:border-indigo-600 transition-all flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] text-slate-900 shadow-premium group"
          >
            <Search className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" /> 
            Data Discovery Hub
          </button>
        </Magnetic>

        <Magnetic strength={0.1}>
          <button 
            className="w-full h-20 rounded-[2.5rem] bg-slate-950 text-white hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-[0.3em] shadow-floating-blue active:scale-98 group"
          >
            <Zap className="w-6 h-6 text-emerald-400 fill-emerald-400 group-hover:animate-bounce" /> 
            Universal Dashboard
          </button>
        </Magnetic>
      </div>

      <PulseStrip className="px-2" sticky />

      {/* KPI Stats — Ambient Layering */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10 items-stretch px-2">
        {stats.map((stat, i) => (
          <Magnetic key={stat.label} strength={0.2}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, type: "spring", damping: 15 }}
              className="group relative overflow-hidden rounded-[4rem] bg-white p-8 md:p-10 border border-slate-100 transition-all shadow-premium hover:shadow-floating premium-card flex flex-col justify-between h-full min-h-[180px] md:min-h-[280px]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <stat.icon className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className={cn("p-5 rounded-[2rem] w-fit mb-8 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-lg", stat.bg, stat.color)}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-600 transition-colors">{stat.label}</p>
                  <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-950 leading-none">
                    <CountUp value={stat.value} prefix={stat.label === 'Revenue' ? '₹ ' : ''} />
                  </h3>
                </div>
              </div>
              <div className={cn("relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black mt-6 w-fit shrink-0 border", stat.up ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100')}>
                {stat.up ? <TrendingUp className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                {stat.delta}
              </div>
            </motion.div>
          </Magnetic>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* AI Strategic Intelligence Deck */}
          <div className="rounded-[4rem] bg-white border border-slate-100 overflow-hidden shadow-premium premium-card">
            <div className="p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                      <Zap className="w-6 h-6 text-white fill-white" />
                   </div>
                   <h3 className="text-3xl font-black tracking-tight text-slate-950 uppercase leading-none">
                    Strategic Intelligence
                   </h3>
                </div>
                <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase pl-16">
                   Neural Feed • Synchronised {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="bg-slate-950 text-white text-[11px] font-black px-8 py-4 rounded-[1.5rem] uppercase tracking-[0.2em] shadow-floating shrink-0">
                Sequence: {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="p-12 space-y-6">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "group flex items-center gap-10 p-10 rounded-[3rem] transition-all relative overflow-hidden",
                    task.completed 
                      ? "bg-slate-50/50 border-transparent opacity-60" 
                      : "bg-white border border-slate-100 hover:border-indigo-600 hover:shadow-premium hover:-translate-y-1"
                  )}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "shrink-0 w-12 h-12 rounded-[1.25rem] border-2 flex items-center justify-center transition-all",
                      task.completed 
                        ? "bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30" 
                        : "border-slate-200 hover:border-indigo-600 bg-white"
                    )}
                  >
                    {task.completed && <Check className="w-6 h-6 text-white stroke-[4]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-2xl font-black tracking-tight text-slate-950",
                      task.completed && "line-through text-slate-400"
                    )}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-8 mt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">{task.category}</span>
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                        <Clock className="w-3.5 h-3.5" /> {task.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Performance Stream */}
          <div className="rounded-[4rem] bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50">
            <div className="p-12 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-3xl font-black tracking-tight flex items-center gap-5 text-slate-950 uppercase">
                <Play className="w-8 h-8 text-blue-600 fill-blue-600" />
                Live Performance
              </h3>
              <button className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all tracking-[0.2em] shadow-sm">
                Control Hub
              </button>
            </div>
            <div className="p-12">
              <div className="space-y-6">
                {recentPosts.map((post, i) => (
                  <div key={post.id} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-white border border-slate-100 group hover:border-slate-950 hover:shadow-2xl transition-all h-32">
                    <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-slate-950 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all shadow-xl">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white z-10">{post.platform}</span>
                        <div className="absolute inset-0 bg-blue-600 opacity-20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-black text-slate-950 truncate max-w-[200px] md:max-w-md">{post.text}</h4>
                        <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-3">
                           <span className="text-blue-600 font-black">{post.type}</span>
                           <span>•</span>
                           <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-950 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                       Analyze
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-12">
          {/* Creator Profile Summary Widget */}
          <div className="rounded-[4rem] bg-slate-950 p-12 relative overflow-hidden group shadow-2xl shadow-slate-900/30">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-20 animate-float" />
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-white p-1.5 shadow-2xl shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <img 
                    src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"} 
                    alt="Profile" 
                    className="w-full h-full rounded-[2.1rem] object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black tracking-[0.02em] leading-none text-white uppercase">{user?.name || 'Naveen'}</h4>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">{user?.handle || '@naveenfitlife'}</p>
                </div>
              </div>
              
              <div className="space-y-6 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center text-white">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Authority Score</span>
                   <span className="text-3xl font-black text-white">74<span className="text-sm opacity-20">/100</span></span>
                </div>
                <div className="h-4 rounded-full bg-white/5 overflow-hidden shadow-inner p-1">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '74%' }}
                    className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all">
                   <p className="text-lg font-black text-white">48.2k</p>
                   <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mt-2">Scale</p>
                </div>
                <div className="text-center p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all">
                   <p className="text-lg font-black text-white">4.8%</p>
                   <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mt-2">Impact</p>
                </div>
              </div>
            </div>
          </div>

          <PulseWidget />

          {/* Platform Health Section */}
          <div className="rounded-[4rem] bg-white border border-slate-100 p-12 shadow-2xl shadow-slate-100/50">
            <h3 className="text-3xl font-black tracking-tight flex items-center gap-5 mb-10 text-slate-950 uppercase">
              <Network className="w-8 h-8 text-blue-600" />
              Impact Analytics
            </h3>
            <div className="space-y-8">
              {platformHealth.map((plat) => (
                <div key={plat.platform} className="p-8 rounded-[2.5rem] bg-slate-50/50 border border-slate-50 space-y-6 hover:bg-white hover:shadow-xl transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]", plat.color)} />
                      <span className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-950">{plat.platform}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm",
                      plat.status === 'Healthy' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'
                    )}>
                      {plat.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-3xl font-black leading-none text-slate-950">{plat.followers}</p>
                      <p className="text-[10px] font-black text-slate-400 mt-3 uppercase tracking-widest">{plat.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-950">{plat.engagement}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 text-right mt-1">Retention</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Funnel Widget */}
          <div className="rounded-[4rem] bg-white border border-slate-100 p-12 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600 rounded-full blur-[100px] opacity-10" />
             <h3 className="text-3xl font-black tracking-tight flex items-center gap-5 mb-4 text-slate-950 uppercase">
               <Briefcase className="w-8 h-8 text-blue-600" />
               Capital Hub
             </h3>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Projected Liquidity: <span className="text-slate-950">₹ 3.2M</span></p>
             
             <div className="space-y-10">
                {[
                  { label: 'Pipeline', count: 3, percent: 60, color: 'bg-slate-200' },
                  { label: 'Negotiation', count: 1, percent: 35, color: 'bg-blue-300' },
                  { label: 'Live Deals', count: 3, percent: 85, color: 'bg-blue-600' },
                ].map((stage) => (
                  <div key={stage.label} className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">
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
               className="w-full mt-12 h-16 rounded-[2rem] bg-slate-950 text-white hover:bg-blue-600 hover:scale-[1.02] transition-all font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/20 active:scale-95"
             >
                Manage Economy
             </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
