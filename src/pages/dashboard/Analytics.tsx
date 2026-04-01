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
  { name: "Reels / Shorts", value: 58, color: "#a855f7" },
  { name: "Carousels", value: 24, color: "#ec4899" },
  { name: "Static Posts", value: 9, color: "#06b6d4" },
  { name: "Stories", value: 9, color: "#f59e0b" },
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

const GrowthChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec4899" stopOpacity={0.5}/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5}/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5}/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '16px', 
          fontSize: '11px', 
          fontWeight: '900',
        }}
      />
      <Area type="monotone" dataKey="ig" stroke="#ec4899" strokeWidth={4} fill="url(#colorIg)" name="Instagram" filter="url(#glow)" />
      <Area type="monotone" dataKey="yt" stroke="#ef4444" strokeWidth={4} fill="url(#colorYt)" name="YouTube" filter="url(#glow)" />
      <Area type="monotone" dataKey="tt" stroke="#a855f7" strokeWidth={4} fill="url(#colorTt)" name="TikTok" filter="url(#glow)" />
    </AreaChart>
  </ResponsiveContainer>
));

const EngagementChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
      <Line type="monotone" dataKey="rate" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7' }} name="Engagement Rate (%)" />
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
      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
      <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
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
        const snaps = db.getAll<any>('analyticsSnapshots');
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
      <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-[var(--card-p)] shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase">30-Day Follower Growth</h3>
            <p className="text-sm text-muted-foreground mt-1">Cross-platform momentum for {user?.name || 'Naveen'}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                {[
                  { id: 'ig', color: '#ec4899', icon: Instagram },
                  { id: 'yt', color: '#ef4444', icon: Youtube },
                  { id: 'tt', color: '#a855f7', icon: Sparkles },
                ].map(p => (
                  <button 
                     key={p.id}
                     onClick={() => togglePlatform(p.id)}
                     className={`p-2 rounded-lg transition-all ${activePlatforms.includes(p.id) ? 'bg-white/10' : 'opacity-20 hover:opacity-50'}`}
                  >
                     <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                  </button>
                ))}
             </div>
             <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
               <TrendingUp className="w-4 h-4" /> +5,100 Total
             </div>
          </div>
        </div>
         <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={snapshots}>
                  <defs>
                    <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5}/>
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                     <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                     </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                  {activePlatforms.includes('ig') && <Area type="monotone" dataKey="ig" stroke="#ec4899" strokeWidth={4} fill="url(#colorIg)" filter="url(#glow)" />}
                  {activePlatforms.includes('yt') && <Area type="monotone" dataKey="yt" stroke="#ef4444" strokeWidth={4} fill="url(#colorYt)" filter="url(#glow)" />}
                  {activePlatforms.includes('tt') && <Area type="monotone" dataKey="tt" stroke="#a855f7" strokeWidth={4} fill="url(#colorTt)" filter="url(#glow)" />}
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-[var(--card-p)] shadow-xl">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Engagement Rate by Week</h3>
          <div className="h-[260px] w-full">
            <EngagementChart data={engagementBreakdown} />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-xl relative">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Content Format Performance</h3>
          <div className="h-[260px] w-full flex items-center justify-center">
             <ContentFormatChart data={contentFormatData} />
             <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black">58%</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black text-center">Reels /<br/>Shorts</span>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={staggerItem} className="premium-card bg-primary/10 border border-primary/20 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 text-primary opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-32 h-32 rotate-12" />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
             <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <div className="space-y-4">
             <h3 className="text-xl font-black tracking-tight uppercase flex items-center gap-3">
               AI Analytics Insight
               <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-black tracking-widest">PERSONALIZED</span>
             </h3>
             <p className="text-lg font-bold leading-relaxed max-w-4xl text-white/90 underline-offset-4 decoration-primary/30">
               {user?.firstName || 'Naveen'}, your Reels are outperforming all other formats by <span className="text-primary tracking-tight font-black underline decoration-primary decoration-4">3.2x</span>. Your audience is most active on Tuesday and Thursday evenings between 6PM–9PM IST. Your 4.8% engagement rate puts you in the top 12% of fitness creators in India. However, your posting frequency dropped 30% in the last 10 days — this directly caused a dip in reach on YouTube. Post 3 Reels this week across IG and TikTok to recover momentum. Your 'no-equipment' content consistently gets 40% more saves than gym-focused content — lean into this.
             </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAudience = () => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Age Range</h3>
             <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { age: "18-24", value: 34 }, { age: "25-34", value: 41 }, { age: "35-44", value: 18 }, { age: "45+", value: 7 }
                  ]} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="age" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#64748b' }} width={60} />
                    <Bar dataKey="value" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={30}>
                       {[1,2,3,4].map((_, i) => <Cell key={i} fill={i === 1 ? "#ec4899" : "#334155"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8 relative">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Gender Split</h3>
             <div className="h-[260px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "female", v: 38 }, { name: "male", v: 62 }]} innerRadius={60} outerRadius={90} dataKey="v" stroke="none">
                       <Cell fill="#ec4899" /> <Cell fill="#06b6d4" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex gap-8">
                   <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-[#06b6d4]">62%</span>
                    <span className="text-[8px] font-black text-muted-foreground tracking-widest">MALE</span>
                   </div>
                   <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-[#ec4899]">38%</span>
                    <span className="text-[8px] font-black text-muted-foreground tracking-widest">FEMALE</span>
                   </div>
                </div>
             </div>
          </motion.div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Top Countries</h3>
             <div className="space-y-6">
                {[
                  { country: "India", value: 78, color: "bg-orange-500" },
                  { country: "UAE", value: 8, color: "bg-emerald-500" },
                  { country: "UK", value: 5, color: "bg-blue-500" },
                  { country: "USA", value: 4, color: "bg-red-500" },
                ].map((c) => (
                  <div key={c.country} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span>{c.country}</span>
                       <span>{c.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${c.value}%` }} className={`h-full ${c.color}`} />
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Active Hours Peak</h3>
             <div className="space-y-4">
                {[
                  { day: "Tuesday", time: "7:00 PM IST", score: "High" },
                  { day: "Thursday", time: "6:30 PM IST", score: "High" },
                  { day: "Saturday", time: "8:00 AM IST", score: "Medium" },
                ].map((h) => (
                  <div key={h.day} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black">{h.day}</p>
                      <p className="text-xs font-bold text-muted-foreground">{h.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${h.score === 'High' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'}`}>
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Enter competitor handle (e.g. @fitnees_pro)..."
                value={newCompHandle}
                onChange={(e) => setNewCompHandle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCompetitor()}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
           </div>
           <button 
             onClick={handleAddCompetitor}
             className="h-14 px-8 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
           >
              <Plus className="w-4 h-4" /> Track Competitor
           </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {competitors.map((comp, i) => (
            <motion.div key={comp.id} variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
               <button 
                 onClick={() => handleRemoveCompetitor(comp.id)}
                 className="absolute top-6 right-6 p-2 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
               >
                  <Plus className="w-4 h-4 rotate-45" />
               </button>
               <div className="md:w-1/3 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-primary/20 overflow-hidden border border-white/10 shrink-0">
                        <img src={comp.photo} alt={comp.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black">{comp.handle}</h4>
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{comp.followers} Follows</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white/5 rounded-2xl">
                        <p className="text-xs font-black text-emerald-500">{comp.engagement}</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Engagement</p>
                     </div>
                     <div className="p-3 bg-white/5 rounded-2xl">
                        <p className="text-xs font-black">{comp.posts || '6x/week'}</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Post Freq</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">AI Opportunity Gap</h5>
                  <p className="text-md font-bold italic text-white/90 leading-relaxed md:line-clamp-2">
                     {comp.handle === '@fitbharat_ig' ? '"They never cover mental health + fitness crossover — this is a gap you can own"' : '"Their audience asks about home workouts repeatedly — no content on this yet"'}
                  </p>
                  <button 
                    onClick={() => {
                        setSelectedCompetitor(comp);
                        setIsGapModalOpen(true);
                    }}
                    className="mt-6 h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                     <Zap className="w-4 h-4" /> AI Intelligence Analysis
                  </button>
               </div>
            </motion.div>
          ))}
        </div>

        <BottomSheet isOpen={isGapModalOpen} onClose={() => setIsGapModalOpen(false)} title="AI Competitor Gap Analysis" height="auto">
           <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 p-6 bg-primary/5 border border-primary/20 rounded-[2rem]">
                 <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary">AI</div>
                 <div>
                    <h3 className="text-lg font-black uppercase italic">Deep Intelligence Report</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Comparing your profile with {selectedCompetitor?.handle}</p>
                 </div>
              </div>
              
              <div className="space-y-6">
                 {[
                    { label: "Content Void", text: "Competitor focuses strictly on supplement reviews. Your audience value education. Own the 'How to Read Labels' niche." },
                    { label: "Engagement Edge", text: "You reply to 40% more comments than them. This is building a tribal loyalty that they lack." },
                    { label: "Video Optimization", text: "Their YouTube Shorts are high quality, but lack clear CTAs. Your hook structure is the winning factor." }
                 ].map((insight, i) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">{insight.label}</span>
                       <p className="text-sm font-bold text-white/80 leading-relaxed">{insight.text}</p>
                    </div>
                 ))}
              </div>

              <button className="w-full py-5 bg-primary text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.02] transition-all">
                 Generate Content Strategy to Beat {selectedCompetitor?.handle}
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
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
              <BarChart3 className="w-3 h-3" />
              Intelligence Engine
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
               Impact <span className="text-primary italic">Intelligence</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleExport}
               className="px-5 py-3 h-12 bg-white text-black border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all w-fit shadow-xl"
             >
                <Share2 className="w-4 h-4" /> Export Report
             </button>
             {!isMobile ? (
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
                {['7D', '30D', '90D', 'ALL'].map((range) => (
                  <button 
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                      dateRange === range ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"
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
                   className="px-5 py-3 h-12 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all text-white w-fit"
                >
                   <Calendar className="w-4 h-4 text-primary" /> {dateRange === 'ALL' ? 'All Time' : `Last ${dateRange}`}
                </button>
                
                <BottomSheet isOpen={isDateSheetOpen} onClose={() => setIsDateSheetOpen(false)} height="auto" title="Select Date Range">
                   <div className="space-y-4 pt-4 pb-safe-offset">
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
                           className={`w-full p-5 rounded-[2rem] text-left font-black text-xs transition-all uppercase tracking-widest border ${dateRange === range.val ? 'bg-primary/10 border-primary shadow-xl shadow-primary/20 text-primary' : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'}`}
                         >
                            {range.label}
                         </button>
                      ))}
                      
                      <div className="flex items-center py-4">
                         <div className="flex-1 h-px bg-white/10" />
                         <span className="px-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Custom Range</span>
                         <div className="flex-1 h-px bg-white/10" />
                      </div>
                      
                      <button className="w-full p-5 rounded-[2rem] border-2 border-dashed border-white/10 text-muted-foreground flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-all">
                         <Calendar className="w-4 h-4" /> Pick Dates
                      </button>
                   </div>
                </BottomSheet>
              </>
            )}
        </div>
      </header>

      <div className="sticky-tabs h-scroll-fade flex items-center gap-6 border-b border-white/5 overflow-x-auto scrollbar-none pb-0 -mx-[var(--page-px)] px-[var(--page-px)]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest relative transition-all whitespace-nowrap ${
              activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,60,172,0.4)]" />
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
