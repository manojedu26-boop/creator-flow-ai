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
import { EmptyState } from "../../components/shared/EmptyState";
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderOverview = () => (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-[var(--grid-gap)]">
      <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-[var(--card-p)] shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase">30-Day Follower Growth</h3>
            <p className="text-sm text-muted-foreground mt-1">Cross-platform momentum for {user?.name || 'Naveen'}</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> +5,100 Total
          </div>
        </div>
         <div className="h-[320px] w-full">
            <GrowthChart data={performanceData} />
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
       <div className="grid grid-cols-1 gap-6">
          {[
            { handle: "@fitbharat_ig", followers: "92K", eng: "3.1%", posts: "6x/week", content: "Mostly Reels", gap: "They never cover mental health + fitness crossover — this is a gap you can own" },
            { handle: "@mumbaifit", followers: "28K", eng: "5.8%", posts: "4x/week", content: "Carousels", gap: "Their audience asks about home workouts repeatedly — no content on this yet" },
          ].map((comp, i) => (
            <motion.div key={i} variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
               <div className="md:w-1/3 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-purple-500 shrink-0" />
                     <div>
                        <h4 className="text-xl font-black">{comp.handle}</h4>
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">{comp.followers} Follows</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-3 bg-white/5 rounded-2xl">
                        <p className="text-xs font-black text-emerald-500">{comp.eng}</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Engagement</p>
                     </div>
                     <div className="p-3 bg-white/5 rounded-2xl">
                        <p className="text-xs font-black">{comp.posts}</p>
                        <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mt-0.5">Post Freq</p>
                     </div>
                  </div>
               </div>
               <div className="flex-1 bg-primary/5 rounded-[2rem] p-8 border border-primary/10">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">AI Opportunity Gap</h5>
                  <p className="text-md font-bold italic text-white/90 leading-relaxed">"{comp.gap}"</p>
                  <button className="mt-6 h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                     <Zap className="w-4 h-4" /> Capitalize This Gap
                  </button>
               </div>
            </motion.div>
          ))}
       </div>
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
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            {['7D', '30D', '90D', 'ALL'].map((range) => (
              <button 
                key={range}
                className={cn(
                  "px-4 py-2 rounded-xl text-[10px] font-black transition-all",
                  range === '30D' ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex items-center gap-6 border-b border-white/5 overflow-x-auto scrollbar-none pb-0">
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
