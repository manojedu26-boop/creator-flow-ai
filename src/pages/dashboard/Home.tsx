import { motion } from "framer-motion";
import { 
  ChevronRight, Zap, Network,
  TrendingUp, Search, 
  ArrowRight, Users, MousePointer2, MessageSquare, Wallet, Briefcase, 
  Check, Play, Clock, Plus, RefreshCcw as RefreshIcon
} from "lucide-react";
import { PageTransition, CountUp } from "../../components/shared/MotionComponents";
import { 
  SkeletonCard, SkeletonHeader 
} from "../../components/shared/Skeleton";
import { useState, useEffect } from "react";
import { toast } from "../../components/ui/sonner";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import { cn } from "../../lib/utils";

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
        { label: 'Total Reach', value: 384200, delta: '+14.3%', up: true, icon: Users, color: 'text-blue-600' },
        { label: 'Follower Growth', value: 892, delta: '+6.1%', up: true, icon: MousePointer2, color: 'text-indigo-600' },
        { label: 'Engagement Rate', value: 4.8, delta: '+0.4%', up: true, icon: MessageSquare, color: 'text-blue-600' },
        { label: 'Est. Revenue', value: totalRevenue, delta: '₹', up: true, icon: Wallet, color: 'text-emerald-600' },
        { label: 'Active Brand Deals', value: dbDeals.length, delta: 'View Hub', up: true, icon: Briefcase, color: 'text-amber-600' },
      ]);

      setIsLoading(false);
    }, 800);
  };

  const platformHealth = [
    { platform: 'Instagram', followers: '48,200', growth: '+312 this week', engagement: '4.8%', status: 'Healthy', color: 'bg-gradient-to-tr from-purple-500 to-pink-500' },
    { platform: 'YouTube', followers: '12,800', growth: '+88 this week', engagement: '3.2%', status: 'Growing', color: 'bg-red-600' },
    { platform: 'TikTok', followers: '31,500', growth: '+492 this week', engagement: '5.1%', status: 'Healthy', color: 'bg-slate-900' },
  ];

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
    if (!task?.completed) {
      toast.success("Task completed! Keep it up. 🚀");
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <SkeletonHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
    <PageTransition className="space-y-10 pb-20 lg:pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600"
          >
            <Zap className="w-3 h-3 fill-current" />
            Command Centre Overview
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.8] text-slate-900"
          >
            Good morning, <br />
            <span className="text-blue-600 italic">
               {user?.firstName || 'Naveen'}
            </span> 👋
          </motion.h1>
          <p className="text-slate-500 font-bold text-sm md:text-lg max-w-xl mt-6">
            Your engagement is up <span className="text-emerald-600">11%</span> this week. Best time to post today is <span className="text-blue-600 font-black">7:00 PM</span>.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchData}
            disabled={isLoading}
            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-50 shadow-sm"
          >
            <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] text-slate-900 shadow-sm group">
            <Plus className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" /> New Campaign
          </button>
          <button className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-blue-500/10">
            <Search className="w-4 h-4" /> Trend Radar
          </button>
        </div>
      </header>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-white p-8 border border-slate-200 hover:border-blue-400 transition-all shadow-sm"
          >
            <div className={cn("p-4 rounded-2xl w-fit mb-6 shadow-inner bg-slate-50", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-black tracking-tight text-slate-900">
                  <CountUp value={stat.value} prefix={stat.label === 'Est. Revenue' ? '₹ ' : ''} />
                </h3>
              </div>
              <div className={cn("text-[10px] font-black flex items-center gap-1 mt-2", stat.up ? 'text-emerald-600' : 'text-blue-600')}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {stat.delta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          {/* AI Action Plan */}
          <div className="rounded-[3rem] bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-slate-900 uppercase">
                  <Zap className="w-6 h-6 text-blue-600 fill-blue-600" />
                  AI Action Plan
                </h3>
                <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-wide uppercase">
                   Synchronized with niche trends at 08:00 AM
                </p>
              </div>
              <div className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-2xl uppercase tracking-widest shadow-sm">
                Progress: {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="p-6 md:p-10 space-y-5">
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  className={cn(
                    "group flex items-center gap-5 p-6 rounded-3xl transition-all shadow-sm",
                    task.completed ? "bg-slate-50 border-transparent opacity-60" : "bg-white border border-slate-100 hover:border-blue-300"
                  )}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all",
                      task.completed ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20" : "border-slate-200 hover:border-blue-600 bg-white"
                    )}
                  >
                    {task.completed && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-md font-bold truncate tracking-tight text-slate-900",
                      task.completed && "line-through text-slate-400"
                    )}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] uppercase font-black tracking-[0.15em] text-blue-600/60">{task.category}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" /> {task.time}
                      </span>
                    </div>
                  </div>
                  <button className="hidden group-hover:flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest p-2 hover:underline">
                    View Task <ArrowRight className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Content Performance */}
          <div className="rounded-[3rem] bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 text-slate-900 uppercase">
                <Play className="w-6 h-6 text-blue-600 fill-blue-600" />
                Performance Stream
              </h3>
              <button className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors tracking-widest flex items-center gap-2">
                Launch Creator Studio <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 md:p-10">
              <div className="space-y-5">
                {recentPosts.length > 0 ? recentPosts.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 group hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-all">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 z-10">{post.platform}</span>
                        <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-md font-black text-slate-900 truncate max-w-[150px] md:max-w-none">{post.text}</h4>
                        <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                           <span className="text-blue-600 font-black">{post.type}</span>
                           <span className="opacity-30">•</span>
                           <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <button className="p-3 rounded-2xl bg-white border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                    Waiting for content stream connection
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Creator Profile Summary Widget */}
          <div className="rounded-[3rem] bg-blue-50 border border-blue-100 p-10 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
               <Stars className="w-16 h-16 text-blue-600 blur-sm" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-[2.5rem] bg-white border-2 border-blue-200 p-1.5 shadow-sm">
                  <img 
                    src={user?.photo || "https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen"} 
                    alt="Profile" 
                    className="w-full h-full rounded-[2.1rem] object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-black tracking-tight leading-none text-slate-900">{user?.name || 'Naveen Kumar'}</h4>
                  <p className="text-[10px] font-black text-blue-600 mt-2 uppercase tracking-[0.2em]">{user?.handle || '@naveenfitlife'}</p>
                </div>
              </div>
              
              <div className="space-y-5 py-6 border-y border-blue-100">
                <div className="flex justify-between items-center text-slate-900">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Elite Creator Score</span>
                   <span className="text-2xl font-black">74<span className="text-xs opacity-30">/100</span></span>
                </div>
                <div className="h-2.5 rounded-full bg-blue-100 overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '74%' }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center py-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                   <p className="text-sm font-black text-slate-900">48.2k</p>
                   <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">Followers</p>
                </div>
                <div className="text-center py-4 bg-white rounded-2xl border border-blue-100 shadow-sm">
                   <p className="text-sm font-black text-slate-900">4.8%</p>
                   <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">Engagement</p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Health Section */}
          <div className="rounded-[3rem] bg-white border border-slate-200 p-10 shadow-sm">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 mb-10 text-slate-900 uppercase">
              <Network className="w-6 h-6 text-blue-600" />
              Platform Pulse
            </h3>
            <div className="space-y-6">
              {platformHealth.map((plat) => (
                <div key={plat.platform} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2.5 h-2.5 rounded-full border border-white", plat.color)} />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">{plat.platform}</span>
                    </div>
                    <span className={cn(
                      "text-[9px] font-black px-3 py-1.5 rounded-2xl uppercase tracking-widest",
                      plat.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {plat.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-black leading-none text-slate-900">{plat.followers}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">{plat.growth}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{plat.engagement}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right opacity-60">Reach Index</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Funnel Widget */}
          <div className="rounded-[3rem] bg-white border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-10">
               <div className="w-16 h-16 bg-blue-100 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
             </div>
             <h3 className="text-2xl font-black tracking-tight flex items-center gap-4 mb-3 text-slate-900 uppercase">
               <Briefcase className="w-6 h-6 text-blue-600" />
               Revenue Funnel
             </h3>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">Projected Value: <span className="text-slate-900">₹ 3,20,000</span></p>
             
             <div className="space-y-8">
                {[
                  { label: 'Outreach', count: 3, percent: 60, color: 'bg-slate-200' },
                  { label: 'Negotiating', count: 1, percent: 20, color: 'bg-blue-300' },
                  { label: 'Live Deals', count: 3, percent: 85, color: 'bg-blue-600' },
                ].map((stage) => (
                  <div key={stage.label} className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-900">
                       <span className="opacity-40">{stage.label}</span>
                       <span className="text-blue-600">{stage.count} Active</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-50 overflow-hidden shadow-inner">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.percent}%` }}
                        className={cn("h-full rounded-full", stage.color)}
                       />
                    </div>
                  </div>
                ))}
             </div>
             
             <button className="w-full mt-10 h-14 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-500/10 active:scale-95">
                Manage PipeLine
             </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

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
