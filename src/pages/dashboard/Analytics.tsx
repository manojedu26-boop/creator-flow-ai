import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Eye, ArrowUp, ArrowDown, 
  Sparkles, Calendar, Maximize2, Share2, Info, ChevronRight,
  TrendingDown, Search, Plus, Filter, Globe, MessageSquare,
  Zap, Clock, Instagram, Youtube
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { EmptyState } from "../../components/shared/EmptyState";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { 
  KpiSkeleton, ChartSkeleton, TextSkeleton 
} from "../../components/shared/Skeleton";
import { cn } from "@/lib/utils";

const performanceData = [
  { name: "Week 1", ig: 46100, yt: 12200, tt: 29100 },
  { name: "Week 2", ig: 46800, yt: 12400, tt: 30000 },
  { name: "Week 3", ig: 47500, yt: 12600, tt: 30800 },
  { name: "Week 4", ig: 48200, yt: 12800, tt: 31500 },
];

const engagementBreakdown = [
  { name: "Week 1", rate: 3.9 },
  { name: "Week 2", rate: 4.2 },
  { name: "Week 3", rate: 5.1 },
  { name: "Week 4", rate: 4.8 },
];

const contentFormatData = [
  { name: "Reels / Shorts", value: 58, color: "#2563eb" },
  { name: "Carousels", value: 24, color: "#4f46e5" },
  { name: "Static Posts", value: 9, color: "#6366f1" },
  { name: "Stories", value: 9, color: "#94a3b8" },
];

const heatmapData = [
  { day: "Mon", hour: "12PM", value: 40 }, { day: "Mon", hour: "7PM", value: 85 },
  { day: "Tue", hour: "12PM", value: 50 }, { day: "Tue", hour: "7PM", value: 100 },
  { day: "Wed", hour: "12PM", value: 45 }, { day: "Wed", hour: "7PM", value: 90 },
  { day: "Thu", hour: "12PM", value: 55 }, { day: "Thu", hour: "6:30PM", value: 110 },
  { day: "Fri", hour: "12PM", value: 60 }, { day: "Fri", hour: "8PM", value: 95 },
  { day: "Sat", hour: "8AM", value: 120 }, { day: "Sat", hour: "7PM", value: 80 },
  { day: "Sun", hour: "12PM", value: 30 }, { day: "Sun", hour: "6PM", value: 70 },
];

const tabs = ["Overview", "Audience", "Content Performance", "Competitor Intel"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/60 backdrop-blur-2xl border border-white/40 p-5 rounded-[2rem] shadow-premium min-w-[180px] animate-in fade-in zoom-in duration-300 ring-1 ring-slate-950/5">
        <div className="flex items-center justify-between mb-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
           <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600/20" />
        </div>
        <div className="space-y-3">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.name}</span>
              </div>
              <span className="text-[12px] font-black text-slate-950 tabular-nums">
                {item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100/50">
           <p className="text-[8px] font-black uppercase tracking-[0.3em] text-indigo-600/60">Neural Analytics v4.0</p>
        </div>
      </div>
    );
  }
  return null;
};

const GrowthChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec4899" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.2}/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '800' }} dy={12} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '800' }} domain={['auto', 'auto']} dx={-10} />
      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
      <Area 
        type="monotone" 
        dataKey="ig" 
        stroke="#ec4899" 
        strokeWidth={3} 
        fill="url(#colorIg)" 
        name="Instagram" 
        activeDot={{ r: 6, strokeWidth: 0, fill: '#ec4899' }}
      />
      <Area 
        type="monotone" 
        dataKey="yt" 
        stroke="#ef4444" 
        strokeWidth={3} 
        fill="url(#colorYt)" 
        name="YouTube" 
        activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
      />
      <Area 
        type="monotone" 
        dataKey="tt" 
        stroke="#a855f7" 
        strokeWidth={3} 
        fill="url(#colorTt)" 
        name="TikTok" 
        activeDot={{ r: 6, strokeWidth: 0, fill: '#a855f7' }}
      />
    </AreaChart>
  </ResponsiveContainer>
));

const EngagementChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '800' }} dy={12} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '800' }} />
      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4' }} />
      <Line 
        type="monotone" 
        dataKey="rate" 
        stroke="#2563eb" 
        strokeWidth={3} 
        dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#2563eb' }} 
        activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
        name="Engagement Rate (%)" 
      />
    </LineChart>
  </ResponsiveContainer>
));

const ContentFormatChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }} />
      <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }} />
    </PieChart>
  </ResponsiveContainer>
));

export const Analytics = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);
  const [dateRange, setDateRange] = useState("30D");
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [activePlatforms, setActivePlatforms] = useState(['ig', 'yt', 'tt']);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<any>(null);
  const [newCompHandle, setNewCompHandle] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        let snaps = db.getAll<any>('analyticsSnapshots');
        if (snaps.length < 5) {
          snaps = [
            { name: "Day 1", ig: 45000, yt: 12000, tt: 29000 },
            { name: "Day 5", ig: 45800, yt: 12200, tt: 29500 },
            { name: "Day 10", ig: 46200, yt: 12350, tt: 30100 },
            { name: "Day 15", ig: 47100, yt: 12500, tt: 31000 },
            { name: "Day 20", ig: 47900, yt: 12650, tt: 31400 },
            { name: "Day 25", ig: 48500, yt: 12800, tt: 32000 },
            { name: "Day 30", ig: 49200, yt: 12900, tt: 32500 }
          ];
        }
        setSnapshots(snaps.slice(-30));
        setCompetitors(db.getAll<any>('competitors'));
        setIsLoading(false);
      }, 600);
    };
    fetchData();
  }, [dateRange]);

  const togglePlatform = (p: string) => {
    setActivePlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const handleAddCompetitor = () => {
    if (!newCompHandle) return;
    const newComp = { 
       id: `comp_${Math.random()}`, 
       handle: newCompHandle.startsWith('@') ? newCompHandle : `@${newCompHandle}`,
       name: newCompHandle.replace('@', ''),
       followers: '12K',
       engagement: '4.2%',
       platform: 'Instagram',
       photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop'
    };
    db.insert('competitors', newComp);
    setCompetitors(prev => [...prev, newComp]);
    setNewCompHandle("");
    toast.success(`Competitor Added!`, { description: `Analyzing ${newComp.handle}...` });
  };

  const handleRemoveCompetitor = (id: string) => {
    db.delete('competitors', id);
    setCompetitors(prev => prev.filter(c => c.id !== id));
    toast.info("Competitor Removed");
  };

  const handleExport = () => {
    toast.promise(new Promise(res => setTimeout(res, 2000)), {
      loading: 'Generating Branded Graphics...',
      success: 'Report Exported (PDF)! Check your downloads.',
      error: 'Export failed.'
    });
  };

  const renderOverview = () => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-[var(--grid-gap)]">
      <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute inset-0 bg-mesh-primary opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 p-[var(--card-p)] space-y-4 md:space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600/70">Growth Momentum</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold tracking-tight uppercase leading-none text-slate-900">30-Day Follower <span className="text-blue-600/80">Intelligence</span></h3>
            </div>
            
            <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1 bg-slate-50/50 p-1 rounded-xl border border-slate-100/50">
                  {[{ id: 'ig', color: '#ec4899', icon: Instagram }, { id: 'yt', color: '#ef4444', icon: Youtube }, { id: 'tt', color: '#2563eb', icon: Sparkles }].map(p => (
                    <button 
                       key={p.id}
                       onClick={() => togglePlatform(p.id)}
                       className={cn(
                        "p-1.5 rounded-lg transition-all duration-300",
                        activePlatforms.includes(p.id) ? "bg-white shadow-sm ring-1 ring-slate-200" : "opacity-30 hover:opacity-60"
                       )}
                    >
                       <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                    </button>
                  ))}
               </div>
               
               <div className="bg-emerald-50/50 border border-emerald-100/50 text-emerald-700 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                 <TrendingUp className="w-3.5 h-3.5" />
                 <div className="flex flex-col">
                   <span className="text-sm font-bold leading-none data-value tracking-tighter transition-all">+5.1K</span>
                   <span className="text-[7px] font-black uppercase tracking-widest opacity-60 leading-none">Surge</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="h-[200px] md:h-[240px] w-full rounded-2xl bg-slate-50/50 border border-slate-50 overflow-hidden relative group/chart">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white to-transparent opacity-50" />
              <GrowthChart data={snapshots} />
          </div>
          
          <div className="grid grid-cols-4 gap-2 md:gap-4 pb-2 -mx-2 md:mx-0 overflow-x-auto no-scrollbar">
            {[
              { label: 'Avg Daily', val: '+170', change: '+12%', color: 'text-blue-600' },
              { label: 'Peak Hour', val: '7:30 PM', change: 'Stable', color: 'text-slate-900' },
              { label: 'Top Platform', val: 'Insta', change: '42%', color: 'text-blue-600' },
              { label: 'Engagement', val: '4.8%', change: '+0.4%', color: 'text-emerald-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50/30 border border-slate-100/50 p-3 md:p-4 rounded-2xl transition-all shadow-sm min-w-[100px] flex-1">
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">{stat.label}</p>
                <div className="flex flex-col">
                  <span className={cn("text-sm md:text-lg font-bold data-value tracking-tight uppercase leading-none", stat.color)}>{stat.val}</span>
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-[var(--card-p)] shadow-sm">
          <h3 className="text-sm font-black tracking-widest mb-8 uppercase text-slate-500">Engagement Rate by Week</h3>
          <div className="h-[260px] w-full">
            <EngagementChart data={engagementBreakdown} />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative">
          <h3 className="text-sm font-black tracking-widest mb-8 uppercase text-slate-500">Content Format Performance</h3>
          <div className="h-[260px] w-full flex items-center justify-center">
             <ContentFormatChart data={contentFormatData} />
             <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">58%</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black text-center">Reels /<br/>Shorts</span>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={staggerItem} className="premium-card bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 md:p-6 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 text-blue-600 opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-20 h-20 rotate-12" />
        </div>
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-blue-100/50 shadow-sm">
             <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
             <h3 className="text-xs font-bold tracking-tight uppercase flex items-center justify-between text-slate-900">
               AI Strategy Insight
               <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[7px] font-black tracking-widest">ELITE</span>
             </h3>
             <p className="text-[13px] font-medium leading-snug text-slate-700">
                {user?.firstName || 'Naveen'}, Reels are outperforming other formats by <span className="text-blue-600 font-bold">3.2x</span>. Peak activity detected <span className="text-blue-600 font-bold">Tue/Thu 6-9PM</span>. You are in the top <span className="text-blue-600 font-bold">12%</span> of fitness creators. <span className="underline decoration-blue-200 underline-offset-2">Action:</span> Post 3 Reels this week for 15% reach recovery.
             </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAudience = () => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black tracking-widest uppercase text-slate-500">Age Distribution</h3>
                <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[8px] font-black uppercase text-blue-600">Core Audience</div>
             </div>
             <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { age: "18-24", value: 34 }, { age: "25-34", value: 41 }, { age: "35-44", value: 18 }, { age: "45+", value: 7 }
                   ]} layout="vertical" margin={{ left: 0, right: 20 }}>
                     <XAxis type="number" hide />
                     <YAxis dataKey="age" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: '700', fill: '#64748b' }} width={60} />
                     <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={24}>
                        {[1,2,3,4].map((_, i) => <Cell key={i} fill={i === 1 ? "#2563eb" : "#f1f5f9"} />)}
                     </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative flex flex-col items-center">
             <h3 className="text-sm font-black tracking-widest uppercase text-slate-500 self-start mb-8">Identity Breakdown</h3>
             <div className="h-[200px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie data={[{ name: "female", v: 38 }, { name: "male", v: 62 }]} innerRadius={65} outerRadius={85} dataKey="v" stroke="#fff" strokeWidth={4} paddingAngle={8}>
                        <Cell fill="#3b82f6" /> <Cell fill="#06b6d4" />
                     </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-black text-slate-900">62<span className="text-xs text-slate-400">%</span></span>
                    <span className="text-[8px] font-black text-blue-600 tracking-widest uppercase">Male Dominant</span>
                </div>
             </div>
             <div className="flex gap-12 mt-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500" />
                   <span className="text-[10px] font-bold text-slate-500">38% Female</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-500" />
                   <span className="text-[10px] font-bold text-slate-500">62% Male</span>
                </div>
             </div>
          </motion.div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="text-sm font-black tracking-widest mb-8 uppercase text-slate-500">Top Countries</h3>
             <div className="space-y-6">
                {[
                  { country: "India", value: 78, color: "bg-orange-500" },
                  { country: "UAE", value: 8, color: "bg-emerald-500" },
                  { country: "UK", value: 5, color: "bg-blue-500" },
                  { country: "USA", value: 4, color: "bg-red-500" },
                ].map((c) => (
                  <div key={c.country} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                       <span>{c.country}</span>
                       <span>{c.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${c.value}%` }} className={`h-full ${c.color}`} />
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
          <motion.div variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="text-sm font-black tracking-widest mb-8 uppercase text-slate-500">Active Hours Peak</h3>
             <div className="space-y-3">
                {[
                  { day: "Tuesday", time: "7:00 PM IST", score: "High" },
                  { day: "Thursday", time: "6:30 PM IST", score: "High" },
                  { day: "Saturday", time: "8:00 AM IST", score: "Medium" },
                ].map((h) => (
                  <div key={h.day} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <p className="text-sm font-black text-slate-900">{h.day}</p>
                      <p className="text-xs font-bold text-slate-500">{h.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${h.score === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                       {h.score} Impact
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
       </div>
    </motion.div>
  );

  const renderCompetitor = () => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
           <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Analyze competitor handle (e.g. @fitness_pro)..."
                value={newCompHandle}
                onChange={(e) => setNewCompHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCompetitor()}
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {competitors.map((comp, i) => (
            <motion.div key={comp.id} variants={staggerItem} className="premium-card bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-10 relative overflow-hidden group">
               <div className="absolute inset-0 bg-mesh-primary opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none" />
               
               <button 
                 onClick={() => handleRemoveCompetitor(comp.id)}
                 className="absolute top-8 right-8 p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
               >
                  <Plus className="w-5 h-5 rotate-45" />
               </button>

               <div className="md:w-[35%] space-y-6 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <div className="w-20 h-20 rounded-3xl bg-slate-100 p-1">
                           <div className="w-full h-full rounded-[1.4rem] overflow-hidden border-2 border-white shadow-md">
                              <img src={comp.photo} alt={comp.name} className="w-full h-full object-cover" />
                           </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                           <Instagram className="w-3.5 h-3.5 text-pink-500" />
                        </div>
                     </div>
                     <div>
                        <h4 className="text-xl font-black tracking-tight text-slate-900">{comp.handle}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                           <Users className="w-3 h-3 text-slate-400" />
                           <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">{comp.followers} Growth</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xl font-black text-emerald-600">{comp.engagement}</p>
                        <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mt-1">Engagement</p>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xl font-black text-slate-900">{comp.posts || 'High'}</p>
                        <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest mt-1">Consistency</p>
                     </div>
                  </div>
               </div>

               <div className="flex-1 bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100 relative group/insight">
                  <div className="absolute top-0 right-0 p-8 text-blue-600/5 group-hover/insight:text-blue-600/10 transition-colors">
                     <Sparkles className="w-24 h-24" />
                  </div>
                  <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Strategic Insight
                  </h5>
                  <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed relative z-10 pr-10">
                     {comp.handle === '@fitbharat_ig' ? '“They never cover mental health + fitness crossover — own this segment immediately.”' : '“A major gap identified: Their audience craves bite-sized home routines. Post 3 next week.”'}
                  </p>
                  <button 
                    onClick={() => {
                        setSelectedCompetitor(comp);
                        setIsGapModalOpen(true);
                    }}
                    className="mt-8 h-12 px-8 rounded-xl bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 active:scale-95 transition-all shadow-sm flex items-center gap-2 relative z-10"
                  >
                     <Zap className="w-3.5 h-3.5" /> Full Analysis Report
                  </button>
               </div>
            </motion.div>
          ))}
        </div>

        <BottomSheet isOpen={isGapModalOpen} onClose={() => setIsGapModalOpen(false)} title="AI Competitor Gap Analysis" height="auto">
           <div className="p-10 space-y-10">
              <div className="flex items-center gap-6 p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem]">
                 <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white shadow-xl shadow-blue-500/20">AI</div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Deep <span className="text-blue-600">Intelligence</span></h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Cross-Platform Competitor Delta: {selectedCompetitor?.handle}</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 {[
                    { label: "Content Void", text: "Competitor focuses strictly on supplement reviews. Your audience value education. Own the 'How to Read Labels' niche." },
                    { label: "Engagement Edge", text: "You reply to 40% more comments than them. This is building a tribal loyalty that they lack." },
                    { label: "Video Optimization", text: "Their YouTube Shorts are high quality, but lack clear CTAs. Your hook structure is the winning factor." }
                 ].map((insight, i) => (
                    <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] space-y-3">
                       <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{insight.label}</span>
                       <p className="text-[15px] font-bold text-slate-700 leading-relaxed">{insight.text}</p>
                    </div>
                 ))}
              </div>

              <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]">
                 Synthesize Offensive Strategy
              </button>
           </div>
        </BottomSheet>
    </motion.div>
  );

  return (
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="flex flex-col gap-6 mb-[var(--section-mb)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Intelligence Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-slate-900 text-kinetic">
               Impact <span className="text-blue-600">Analysis</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExport}
               className="px-5 py-3 h-12 bg-white text-slate-900 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all w-fit shadow-sm hover:border-blue-600"
             >
                <Share2 className="w-4 h-4" /> Export Report
             </button>
             {!isMobile ? (
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100 w-fit">
                {['7D', '30D', '90D', 'ALL'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black transition-all",
                      dateRange === range ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <button 
                   onClick={() => setIsDateSheetOpen(true)}
                   className="px-5 py-3 h-12 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all text-slate-900 w-fit"
                >
                   <Calendar className="w-4 h-4 text-blue-600" /> {dateRange === 'ALL' ? 'All Time' : `Last ${dateRange}`}
                </button>
                
                <BottomSheet isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height="auto" title="Select Date Range">
                   <div className="space-y-3 pt-4 pb-safe-offset">
                      {[
                        { label: 'Last 7 Days', val: '7D' }, 
                        { label: 'Last 30 Days', val: '30D' }, 
                        { label: 'Last 90 Days', val: '90D' }, 
                        { label: 'All Time', val: 'ALL' }
                      ].map((range, i) => (
                         <button 
                           key={i} 
                           onClick={() => {
                             setDateRange(range.val);
                             setIsDateSheetOpen(false);
                           }}
                           className={`w-full p-5 rounded-2xl text-left font-black text-xs transition-all uppercase tracking-widest border ${dateRange === range.val ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 hover:bg-white border-slate-100 text-slate-500'}`}
                         >
                            {range.label}
                         </button>
                      ))}
                      
                      <div className="flex items-center py-4">
                         <div className="flex-1 h-px bg-slate-100" />
                         <span className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Custom Range</span>
                         <div className="flex-1 h-px bg-slate-100" />
                      </div>
                      
                      <button className="w-full p-5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest hover:border-blue-300 hover:text-blue-600 transition-all">
                         <Calendar className="w-4 h-4" /> Pick Dates
                      </button>
                   </div>
                </BottomSheet>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="sticky-tabs h-scroll-fade flex items-center gap-5 border-b border-slate-100 overflow-x-auto scrollbar-none pb-0 -mx-[var(--page-px)] px-[var(--page-px)] bg-white/80 backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[9px] font-black uppercase tracking-widest relative transition-all whitespace-nowrap ${
              activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_-2px_10px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
          {activeTab === "Overview" && renderOverview()}
          {activeTab === "Audience" && renderAudience()}
          {activeTab === "Competitor Intel" && renderCompetitor()}
          {activeTab === "Content Performance" && (
            <EmptyState 
              icon={Sparkles} 
              title="Content Deep-Dive" 
              description="Connect your business accounts to access per-post heatmaps and visual retention analysis."
              className="h-[50vh]"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  );
};
