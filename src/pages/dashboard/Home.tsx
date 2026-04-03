import { motion } from "framer-motion";
import { 
  ChevronRight, Zap, Network,
  TrendingUp, Search, 
  ArrowRight, Users, MousePointer2, MessageSquare, Wallet, Briefcase, 
  Check, Play, Clock, Plus, RefreshCcw as RefreshIcon, Stars
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
        { label: 'Total Reach', value: 384200, delta: '+14.3%', up: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Follower Growth', value: 892, delta: '+6.1%', up: true, icon: MousePointer2, color: 'text-slate-900', bg: 'bg-slate-100' },
        { label: 'Engagement Rate', value: 4.8, delta: '+0.4%', up: true, icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Est. Revenue', value: totalRevenue, delta: '₹', up: true, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Brand Deals', value: dbDeals.length, delta: 'View Hub', up: true, icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
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
    <PageTransition className="space-y-8 pb-24 lg:pb-12 h-screen overflow-y-auto no-scrollbar px-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-0">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 bg-blue-50 w-fit px-4 py-2 rounded-full border border-blue-100 shadow-sm"
          >
            <Zap className="w-3 h-3 fill-current shadow-blue-500" />
            System Operational
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-2xl md:text-6xl font-black tracking-[0.02em] leading-none text-slate-950 uppercase"
          >
            Good morning, <br />
            <span className="text-blue-600 flex items-center gap-4">
               {user?.firstName || 'Naveen'} <Stars className="w-8 h-8 md:w-20 md:h-20 animate-pulse text-slate-950" />
            </span>
          </motion.h1>
          <p className="text-slate-500 font-bold text-sm md:text-xl max-w-2xl mt-2 leading-relaxed">
            Your influence score generated a <span className="text-slate-950 font-black underline decoration-blue-600 decoration-2 md:decoration-4">11% spike</span>. <br className="hidden md:block" />
            Prime transmission window: <span className="text-blue-600 font-black">19:00 IST</span>.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 relative z-20">
          <div className="flex gap-4">
            <button 
              onClick={fetchData}
              disabled={isLoading}
              className="flex-1 md:w-16 h-14 md:h-16 rounded-2xl md:rounded-[2rem] bg-white border border-slate-200 hover:border-blue-600 hover:scale-105 transition-all flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-xl shadow-slate-100 active:scale-95"
            >
              <RefreshIcon className={`w-5 h-5 md:w-6 md:h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button className="flex-[3] md:flex-none h-14 md:h-16 md:px-10 rounded-2xl md:rounded-[2rem] bg-white border border-slate-200 hover:border-blue-600 hover:scale-105 transition-all flex items-center justify-center gap-3 md:gap-4 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-slate-950 shadow-xl shadow-slate-100 group">
              <Plus className="w-4 h-4 md:w-5 md:h-5 text-blue-600 transition-transform group-hover:rotate-90" /> Launch Brief
            </button>
          </div>
          <button className="h-14 md:h-16 md:px-10 rounded-2xl md:rounded-[2rem] bg-slate-950 text-white hover:bg-blue-600 hover:scale-105 transition-all flex items-center justify-center gap-3 md:gap-4 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 active:scale-95">
            <Search className="w-4 h-4 md:w-5 md:h-5" /> Data Discovery
          </button>
        </div>
      </header>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: "spring" }}
            className="group relative overflow-hidden rounded-3xl md:rounded-[3rem] bg-white p-5 md:p-8 border border-slate-200 transition-all shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 premium-card"
          >
            <div className={cn("p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] w-fit mb-4 md:mb-8 shadow-inner transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="space-y-1 md:space-y-2">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] text-slate-400">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-950 leading-none">
                  <CountUp value={stat.value} prefix={stat.label === 'Est. Revenue' ? '₹ ' : ''} />
                </h3>
              </div>
              <div className={cn("inline-flex items-center gap-2 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black mt-2 md:mt-4", stat.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100')}>
                {stat.up ? <TrendingUp className="w-2.5 h-2.5 md:w-3 h-3" /> : <ChevronRight className="w-2.5 h-2.5 md:w-3 h-3" />}
                {stat.delta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
          {/* AI Action Plan */}
          <div className="rounded-[2.5rem] md:rounded-[4rem] bg-white border border-slate-100 overflow-hidden shadow-2xl shadow-slate-100/50 group premium-card">
            <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-2 md:space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-float">
                      <Zap className="w-4 h-4 md:w-5 md:h-5 text-white fill-white" />
                   </div>
                   <h3 className="text-xl md:text-3xl font-black tracking-tight text-slate-950 uppercase">
                    AI Strategic Plan
                   </h3>
                </div>
                <p className="text-[9px] md:text-[11px] font-black text-slate-400 tracking-[0.15em] md:tracking-[0.2em] uppercase pl-1">
                   Live Feed • Updated 2 mins ago
                </p>
              </div>
              <div className="bg-slate-950 text-white text-[9px] md:text-[10px] font-black px-4 md:px-6 py-2 md:py-3 rounded-full uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-xl shrink-0">
                {completedCount}/{tasks.length}
              </div>
            </div>
            <div className="p-6 md:p-12 space-y-4 md:space-y-6">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "group flex items-center gap-4 md:gap-8 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] transition-all",
                    task.completed ? "bg-slate-50 border-transparent opacity-50" : "bg-white border border-slate-100 hover:border-blue-400 hover:shadow-xl hover:scale-[1.01]"
                  )}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-[1.2rem] border-2 flex items-center justify-center transition-all",
                      task.completed ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/40" : "border-slate-200 hover:border-blue-600 bg-white"
                    )}
                  >
                    {task.completed && <Check className="w-4 h-4 md:w-6 md:h-6 text-white stroke-[3]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-base md:text-xl font-black tracking-tight text-slate-950",
                      task.completed && "line-through text-slate-400 opacity-60"
                    )}>
                      {task.text}
                    </p>
                    <div className="flex items-center gap-4 md:gap-6 mt-1 md:mt-3">
                      <span className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] text-blue-600">{task.category}</span>
                      <span className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest text-ellipsis overflow-hidden">
                        <Clock className="w-3 md:w-3.5 h-3 md:h-3.5" /> {task.time}
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
             
             <button className="w-full mt-12 h-16 rounded-[2rem] bg-slate-950 text-white hover:bg-blue-600 hover:scale-[1.02] transition-all font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/20 active:scale-95">
                Manage Economy
             </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
