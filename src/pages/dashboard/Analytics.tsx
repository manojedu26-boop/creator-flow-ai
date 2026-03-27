import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Eye, ArrowUp, ArrowDown, 
  Sparkles, Calendar, Maximize2, Share2, Info, ChevronRight,
  TrendingDown, Search, Plus, Filter, Globe
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts";
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";

const performanceData = [
  { name: "Mon", ig: 4000, yt: 2400, tt: 2400 },
  { name: "Tue", ig: 3000, yt: 1398, tt: 2210 },
  { name: "Wed", ig: 2000, yt: 9800, tt: 2290 },
  { name: "Thu", ig: 2780, yt: 3908, tt: 2000 },
  { name: "Fri", ig: 1890, yt: 4800, tt: 2181 },
  { name: "Sat", ig: 2390, yt: 3800, tt: 2500 },
  { name: "Sun", ig: 3490, yt: 4300, tt: 2100 },
];

const engagementBreakdown = [
  { name: "Week 1", likes: 400, comments: 240, shares: 200, saves: 100 },
  { name: "Week 2", likes: 300, comments: 139, shares: 121, saves: 110 },
  { name: "Week 3", likes: 200, comments: 980, shares: 229, saves: 200 },
  { name: "Week 4", likes: 278, comments: 390, shares: 200, saves: 150 },
];

const contentFormatData = [
  { name: "Reels", value: 55, color: "#a855f7" },
  { name: "Carousels", value: 25, color: "#ec4899" },
  { name: "Posts", value: 15, color: "#06b6d4" },
  { name: "Stories", value: 5, color: "#f59e0b" },
];

const heatmapData = [
  { day: "Mon", hour: "12AM", value: 10 }, { day: "Mon", hour: "4AM", value: 5 }, { day: "Mon", hour: "8AM", value: 30 }, { day: "Mon", hour: "12PM", value: 70 }, { day: "Mon", hour: "4PM", value: 90 }, { day: "Mon", hour: "8PM", value: 100 },
  { day: "Tue", hour: "12AM", value: 15 }, { day: "Tue", hour: "4AM", value: 5 }, { day: "Tue", hour: "8AM", value: 25 }, { day: "Tue", hour: "12PM", value: 60 }, { day: "Tue", hour: "4PM", value: 85 }, { day: "Tue", hour: "8PM", value: 95 },
  { day: "Wed", hour: "12AM", value: 12 }, { day: "Wed", hour: "4AM", value: 8 }, { day: "Wed", hour: "8AM", value: 40 }, { day: "Wed", hour: "12PM", value: 75 }, { day: "Wed", hour: "4PM", value: 95 }, { day: "Wed", hour: "8PM", value: 110 },
  { day: "Thu", hour: "12AM", value: 8 }, { day: "Thu", hour: "4AM", value: 3 }, { day: "Thu", hour: "8AM", value: 20 }, { day: "Thu", hour: "12PM", value: 55 }, { day: "Thu", hour: "4PM", value: 80 }, { day: "Thu", hour: "8PM", value: 90 },
  { day: "Fri", hour: "12AM", value: 20 }, { day: "Fri", hour: "4AM", value: 10 }, { day: "Fri", hour: "8AM", value: 35 }, { day: "Fri", hour: "12PM", value: 80 }, { day: "Fri", hour: "4PM", value: 100 }, { day: "Fri", hour: "8PM", value: 120 },
];

const tabs = ["Overview", "Instagram", "YouTube", "TikTok", "Audience", "Content Performance", "Competitor Intel"];

const GrowthChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec4899" stopOpacity={0.4}/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4}/>
          <stop offset="100%" stopColor="#ef4444" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4}/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold', fontFamily: 'DM Mono' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold', fontFamily: 'DM Mono' }} />
      <Tooltip 
        contentStyle={{ 
          backgroundColor: 'rgba(7, 7, 26, 0.95)', 
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '12px', 
          fontSize: '10px', 
          fontFamily: 'DM Mono',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.5)'
        }}
      />
      <Area type="monotone" dataKey="ig" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorIg)" name="Instagram" isAnimationActive={true} animationDuration={1500} filter="url(#glow)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }} />
      <Area type="monotone" dataKey="yt" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorYt)" name="YouTube" isAnimationActive={true} animationDuration={1500} filter="url(#glow)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }} />
      <Area type="monotone" dataKey="tt" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTt)" name="TikTok" isAnimationActive={true} animationDuration={1500} filter="url(#glow)" dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#fff' }} />
    </AreaChart>
  </ResponsiveContainer>
));

const EngagementChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'DM Mono' }} dy={10} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'DM Mono' }} />
      <Tooltip 
        cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
        contentStyle={{ 
          backgroundColor: '#07071A', 
          border: '1px solid rgba(255,255,255,0.05)', 
          borderRadius: '8px',
          fontSize: '10px',
          fontFamily: 'DM Mono'
        }} 
      />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'DM Mono', letterSpacing: '2px' }} />
      <Bar dataKey="likes" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={24} name="Likes" isAnimationActive={true} animationDuration={800} />
      <Bar dataKey="comments" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={24} name="Comments" isAnimationActive={true} animationDuration={800} />
      <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={24} name="Shares" isAnimationActive={true} animationDuration={800} />
      <Bar dataKey="saves" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} name="Saves" isAnimationActive={true} animationDuration={800} />
    </BarChart>
  </ResponsiveContainer>
));

const ContentFormatChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={2} dataKey="value" stroke="none" isAnimationActive={true} animationDuration={800}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: '#07071A', border: 'none', borderRadius: '8px', fontSize: '10px', fontFamily: 'DM Mono' }} />
      <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', fontFamily: 'DM Mono', letterSpacing: '1px' }} />
    </PieChart>
  </ResponsiveContainer>
));

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderOverview = () => (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ROW 1 — MASTER GROWTH (Span 12) */}
      <motion.div variants={staggerItem} className="glass-card p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
           <BarChart3 className="w-48 h-48 text-primary" />
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 relative z-10">
          <div>
            <h1 className="text-3xl font-bebas tracking-[3px] text-white uppercase">Analytics Masterview</h1>
            <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Real-time Cross-Platform Growth Metrics</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="glass-elevated flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-mono font-bold uppercase tracking-widest transition-all hover:border-primary/50 cursor-pointer">
                <Calendar className="w-4 h-4 text-primary" /> 30D Window
             </div>
             <div className="h-10 w-10 rounded-xl glass-elevated border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group/icon">
                <Maximize2 className="w-4 h-4 text-muted-foreground group-hover/icon:text-white transition-colors" />
             </div>
          </div>
        </div>

        <div className="h-[360px] w-full relative z-10 font-mono">
          <GrowthChart data={performanceData} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-white/5 relative z-10">
          {[
            { label: "Total Reach", value: 2400000, suffix: "M", divisor: 1000000, decimals: 1, delta: "+18%" },
            { label: "Engagement", value: 1100000, suffix: "M", divisor: 1000000, decimals: 1, delta: "+24.2%" },
            { label: "Growth Rate", value: 4.8, suffix: "%", decimals: 1, delta: "-0.5%" },
            { label: "Peak Activity", value: "Fri", info: "20:00", isStatic: true }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <span className="text-[9px] text-muted-foreground font-mono font-bold uppercase tracking-[2px]">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold tracking-tighter text-white">
                  {stat.isStatic ? (stat.value as string) : <CountUp value={stat.divisor ? (stat.value as number) / stat.divisor : (stat.value as number)} decimals={stat.decimals} suffix={stat.suffix} />}
                </span>
                {stat.delta && <span className={`text-[10px] font-mono font-bold ${stat.delta.startsWith('+') ? 'text-success' : 'text-rose-500'}`}>{stat.delta}</span>}
                {stat.info && <span className="text-[10px] font-mono text-muted-foreground font-bold tracking-widest">{stat.info}</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ROW 2 — BENTO CHARTS (Span 8 / Span 4) */}
      <div className="bento-grid">
        <motion.div variants={staggerItem} className="bento-span-8 glass-card p-8 border border-white/5 shadow-2xl">
          <h1 className="text-2xl font-bebas tracking-[2px] text-white mb-8 uppercase">Engagement Breakdown</h1>
          <div className="h-[280px] w-full font-mono">
            <EngagementChart data={engagementBreakdown} />
          </div>
        </motion.div>

        <motion.div variants={staggerItem} className="bento-span-4 glass-card p-8 border border-white/5 relative shadow-2xl">
          <h1 className="text-2xl font-bebas tracking-[2px] text-white mb-8 uppercase">Content Mix</h1>
          <div className="h-[280px] w-full flex items-center justify-center font-mono">
             <ContentFormatChart data={contentFormatData} />
             <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-mono font-bold text-white">
                  <CountUp value={55} suffix="%" />
                </span>
                <span className="text-[8px] text-muted-foreground uppercase tracking-[3px] font-bold mt-1">Reels Dominance</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* ROW 3 — AI PREDICTIVE INSIGHTS (Glass Elevated) */}
      <motion.div variants={staggerItem} className="glass-elevated border border-primary/20 rounded-[2rem] p-10 relative overflow-hidden group shadow-[0_0_50px_-12px_rgba(255,107,171,0.15)]">
        <div className="absolute top-0 right-0 p-10 text-primary opacity-5 group-hover:opacity-10 transition-opacity">
          <Sparkles className="w-48 h-48 rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
             <Sparkles className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(255,107,171,0.5)]" />
          </div>
          <div className="space-y-6 flex-1">
             <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bebas tracking-[3px] text-white uppercase">AI predictive insight</h1>
                <span className="font-mono text-[9px] font-bold text-success border border-success/30 px-2 py-0.5 rounded-full tracking-widest bg-success/5 uppercase">Real-time processing</span>
             </div>
             <p className="font-syne text-lg font-medium leading-[1.6] text-white/90 max-w-5xl">
                Analysis confirmed: <span className="text-primary font-bold">Video ROI is peaking</span>. Your audience retention on <span className="text-white border-b border-primary/40">15-30s Reels</span> is currently <span className="font-mono text-xl text-secondary">82%</span>, significantly higher than industry benchmarks. Recommendation: Increase frequency by <span className="font-mono text-xl text-primary">+20%</span> over the next 7 days to capitalize on the current algorithm velocity.
             </p>
             <div className="flex flex-wrap gap-4 pt-2">
               <button className="h-12 px-8 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-mono font-bold uppercase tracking-[2px] shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Apply Content Plan</button>
               <button className="h-12 px-8 rounded-xl glass-elevated border border-white/5 text-white text-[10px] font-mono font-bold uppercase tracking-[2px] hover:bg-white/5 transition-all">Export Report</button>
             </div>
          </div>
        </div>
      </motion.div>

      {/* ROW 4 — PERFORMANCE GALLERY */}
      <motion.div variants={staggerItem} className="glass-card p-10 border border-white/5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
           <h1 className="text-2xl font-bebas tracking-[3px] text-white uppercase">Best Performing Content</h1>
           <div className="flex items-center gap-3">
             {["High Reach", "Best ER", "Viral Potential"].map((f, i) => (
                <button key={f} className={`px-6 py-2.5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-widest border transition-all ${i === 0 ? 'bg-primary border-primary text-white shadow-lg' : 'border-white/10 text-muted-foreground hover:border-white/20 hover:text-white'}`}>
                  {f}
                </button>
             ))}
           </div>
        </div>
        <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
          {[
            { id: 1, type: "REEL", val: "128K REACH", er: "8.4% ER", thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop" },
            { id: 2, type: "CAROUSEL", val: "94K REACH", er: "7.2% ER", thumb: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=300&h=400&fit=crop" },
            { id: 3, type: "VIDEO", val: "220K REACH", er: "5.1% ER", thumb: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=400&fit=crop" },
            { id: 4, type: "SHORT", val: "45K REACH", er: "6.8% ER", thumb: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop" },
            { id: 5, type: "POST", val: "32K REACH", er: "4.5% ER", thumb: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=300&h=400&fit=crop" },
          ].map((post) => (
            <div key={post.id} className="min-w-[260px] rounded-[2rem] overflow-hidden bg-white/[0.02] border border-white/5 group cursor-pointer hover:border-primary/40 transition-all hover:-translate-y-3">
               <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={post.thumb} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                     <span className="font-mono text-[8px] font-bold uppercase tracking-[3px] px-3 py-1 rounded-full glass-elevated border border-white/10">{post.type}</span>
                     <div>
                        <p className="text-xl font-bebas tracking-wider">{post.val}</p>
                        <p className="font-mono text-[9px] text-success font-bold tracking-widest">{post.er}</p>
                     </div>
                  </div>
               </div>
               <div className="p-4 bg-background/40">
                  <button className="w-full h-11 rounded-xl glass-elevated text-[9px] font-mono font-bold uppercase tracking-[2px] text-white hover:bg-primary transition-all">Analyze Patterns</button>
               </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  const renderAudience = () => (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-3xl p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Age Range</h3>
             <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { age: "13-17", value: 12 }, { age: "18-24", value: 45 }, { age: "25-34", value: 30 }, { age: "35-44", value: 8 }, { age: "45+", value: 5 }
                  ]} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="age" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} width={60} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} isAnimationActive={true} animationDuration={800}>
                       { [1,2,3,4,5].map((_, i) => <Cell key={i} fill={i === 1 ? "#a855f7" : "#334155"} />) }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>
          <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-3xl p-8 relative">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Gender Split</h3>
             <div className="h-[260px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "female", v: 62 }, { name: "male", v: 38 }]} innerRadius={60} outerRadius={90} dataKey="v" stroke="none" isAnimationActive={true} animationDuration={800}>
                       <Cell fill="#ec4899" /> <Cell fill="#06b6d4" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex gap-8">
                   <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-[#ec4899]">
                      <CountUp value={62} suffix="%" />
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground">FEMALE</span>
                   </div>
                   <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-[#06b6d4]">
                      <CountUp value={38} suffix="%" />
                    </span>
                    <span className="text-[10px] font-black text-muted-foreground">MALE</span>
                   </div>
                </div>
             </div>
          </motion.div>
       </div>

       {/* ACTIVE HOURS HEATMAP */}
       <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-3xl p-8">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Active Hours Heatmap</h3>
          <div className="h-[240px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis dataKey="hour" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                  <YAxis dataKey="day" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={heatmapData} isAnimationActive={true} animationDuration={800}>
                    {heatmapData.map((entry, index) => (
                      <Cell key={index} fill={`rgba(168, 85, 247, ${entry.value / 120})`} />
                    ))}
                  </Scatter>
                </ScatterChart>
             </ResponsiveContainer>
          </div>
       </motion.div>
    </motion.div>
  );

  const renderCompetitor = () => (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
       <motion.div variants={staggerItem} className="flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input type="text" placeholder="Enter a competitor's handle..." className="w-full h-12 bg-muted/20 border border-border/40 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button className="h-12 px-8 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center gap-2">
             <Plus className="w-4 h-4" /> Add
          </button>
       </motion.div>

       <div className="grid grid-cols-1 gap-4">
          {[
            { handle: "@creator_x", er: 5.2, followers: "1.2M", posts: "42", format: "Reels" },
            { handle: "@daily_vlogs", er: 3.1, followers: "850K", posts: "124", format: "Videos" },
          ].map((comp, i) => (
            <motion.div key={i} variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 group transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-muted to-muted-foreground shrink-0" />
                  <div>
                    <span className="text-lg font-black">{comp.handle}</span>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                       <span>{comp.followers} Follows</span>
                       <span>•</span>
                       <span>Instagram</span>
                    </div>
                  </div>
               </div>
               <div className="flex gap-12 items-center">
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-black text-emerald-500">
                      <CountUp value={comp.er} suffix="%" decimals={1} />
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Engagement</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-black">{comp.format}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Top Format</span>
                  </div>
               </div>
               <button className="px-6 py-3 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
                  <Sparkles className="w-4 h-4" /> AI Gap Analysis
               </button>
            </motion.div>
          ))}
       </div>
    </motion.div>
  );

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* TOP — PLATFORM TAB BAR */}
        <div className="sticky top-[60px] lg:top-[60px] z-30 bg-background/80 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 py-3 border-b border-border/30">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest relative transition-all whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeAnalyticsTab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "Overview" && renderOverview()}
            {activeTab === "Audience" && renderAudience()}
            {activeTab === "Competitor Intel" && renderCompetitor()}
            {(activeTab !== "Overview" && activeTab !== "Audience" && activeTab !== "Competitor Intel") && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <BarChart3 className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-bold">{activeTab} Details</h3>
                <p className="text-muted-foreground max-w-sm">Deep diving into {activeTab} analytics patterns... This will include specific {activeTab} metrics and growth forecasts.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
