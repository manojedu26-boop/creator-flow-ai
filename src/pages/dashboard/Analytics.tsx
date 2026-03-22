import { useState } from "react";
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

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState("Overview");

  const renderOverview = () => (
    <div className="space-y-6">
      {/* ROW 1 — MASTER GROWTH CHART */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black tracking-tight uppercase">Master Growth Chart</h3>
            <p className="text-sm text-muted-foreground mt-1">Cross-platform follower growth trends</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/40 bg-muted/20 text-xs font-bold uppercase transition-colors hover:border-primary/50 cursor-pointer">
                <Calendar className="w-4 h-4" /> Custom Range
             </div>
             <div className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center hover:bg-muted/30 transition-colors cursor-pointer">
                <Maximize2 className="w-4 h-4" />
             </div>
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ padding: '0 2px' }}
              />
              <Area type="monotone" dataKey="ig" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorIg)" name="Instagram" />
              <Area type="monotone" dataKey="yt" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorYt)" name="YouTube" />
              <Area type="monotone" dataKey="tt" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorTt)" name="TikTok" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/20">
          {[
            { label: "Total Impressions", value: "2.4M", delta: "+18%" },
            { label: "Total Reach", value: "1.1M", delta: "+24.2%" },
            { label: "Avg Engagement", value: "4.8%", delta: "-0.5%" },
            { label: "Best Day", value: "Friday", info: "8:00 PM" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none">{stat.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{stat.value}</span>
                {stat.delta && <span className={`text-[10px] font-bold ${stat.delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.delta}</span>}
                {stat.info && <span className="text-[10px] text-muted-foreground font-medium">{stat.info}</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ROW 2 — TWO CHARTS SIDE BY SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Engagement Breakdown</h3>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }} />
                <Bar dataKey="likes" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={32} name="Likes" />
                <Bar dataKey="comments" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={32} name="Comments" />
                <Bar dataKey="shares" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={32} name="Shares" />
                <Bar dataKey="saves" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} name="Saves" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Content Format Performance</h3>
          <div className="h-[260px] w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={contentFormatData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={90}
                   paddingAngle={4}
                   dataKey="value"
                   stroke="none"
                 >
                   {contentFormatData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                 <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 'bold' }} />
               </PieChart>
             </ResponsiveContainer>
             <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black">55%</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">Reels</span>
             </div>
          </div>
        </div>
      </div>

      {/* ROW 3 — AI ANALYTICS INSIGHT */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="bg-primary/10 border border-primary/20 rounded-3xl p-8 shadow-xl relative overflow-hidden group"
      >
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
               <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-black tracking-widest">LIVE</span>
             </h3>
             <p className="text-md font-medium leading-relaxed max-w-4xl">
               Your <span className="text-primary font-bold">Reels are outperforming</span> all other formats by <span className="underline decoration-primary decoration-2 underline-offset-4">3.8x</span>. Your audience is most active Tuesday and Thursday evenings between 6PM–9PM. Your engagement rate of 4.2% puts you in the top 18% of creators in your niche. However, your posting frequency dropped 40% in the last 10 days — this is directly causing a reach decline.
             </p>
             <div className="flex flex-wrap gap-3 pt-2">
               <button className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_-5px_hsl(var(--primary))] transition-all active:scale-95">Generate Content Plan</button>
               <button className="px-5 py-2.5 rounded-xl bg-background border border-border/40 text-xs font-black uppercase tracking-widest hover:bg-muted/30 transition-all transition-all active:scale-95">Schedule Posts</button>
               <button className="px-5 py-2.5 rounded-xl bg-background border border-border/40 text-xs font-black uppercase tracking-widest hover:bg-muted/30 transition-all transition-all active:scale-95">View Trend Radar</button>
             </div>
          </div>
        </div>
      </motion.div>

      {/* ROW 4 — BEST PERFORMING POSTS */}
      <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black tracking-tight uppercase">Best Performing Posts</h3>
           <div className="flex items-center gap-2">
             {["Most Reach", "Most Engagement", "Most Saves"].map((f, i) => (
               <button key={f} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${i === 0 ? 'bg-primary border-primary text-primary-foreground' : 'border-border/40 hover:border-primary/50'}`}>
                 {f}
               </button>
             ))}
           </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          {[
            { id: 1, type: "Reel", val: "128K Reach", er: "8.4% ER", thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=400&fit=crop" },
            { id: 2, type: "Carousel", val: "94K Reach", er: "7.2% ER", thumb: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=300&h=400&fit=crop" },
            { id: 3, type: "Video", val: "220K Reach", er: "5.1% ER", thumb: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=400&fit=crop" },
            { id: 4, type: "Shot", val: "45K Reach", er: "6.8% ER", thumb: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=400&fit=crop" },
            { id: 5, type: "Post", val: "32K Reach", er: "4.5% ER", thumb: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=300&h=400&fit=crop" },
          ].map((post) => (
            <div key={post.id} className="min-w-[220px] rounded-2xl overflow-hidden bg-muted/20 border border-border/10 group cursor-pointer hover:border-primary/40 transition-all hover:-translate-y-2">
               <div className="aspect-[4/5] relative">
                  <img src={post.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-md border border-white/20">{post.type}</span>
                     </div>
                     <p className="text-sm font-black">{post.val}</p>
                     <p className="text-[10px] text-white/70 font-bold uppercase">{post.er}</p>
                  </div>
               </div>
               <div className="p-3">
                  <button className="w-full py-2 rounded-xl bg-muted/40 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all">Use This as Template</button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAudience = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border/40 rounded-3xl p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Age Range</h3>
             <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { age: "13-17", value: 12 }, { age: "18-24", value: 45 }, { age: "25-34", value: 30 }, { age: "35-44", value: 8 }, { age: "45+", value: 5 }
                  ]} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="age" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} width={60} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                    <Bar dataKey="value" fill="#primary" radius={[0, 4, 4, 0]}>
                       { [1,2,3,4,5].map((_, i) => <Cell key={i} fill={i === 1 ? "#a855f7" : "#334155"} />) }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          <div className="bg-card border border-border/40 rounded-3xl p-8">
             <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Gender Split</h3>
             <div className="h-[260px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "female", v: 62 }, { name: "male", v: 38 }]} innerRadius={60} outerRadius={90} dataKey="v" stroke="none">
                       <Cell fill="#ec4899" /> <Cell fill="#06b6d4" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex gap-8">
                   <div className="flex flex-col items-center"><span className="text-xl font-black text-[#ec4899]">62%</span><span className="text-[10px] font-black text-muted-foreground">FEMALE</span></div>
                   <div className="flex flex-col items-center"><span className="text-xl font-black text-[#06b6d4]">38%</span><span className="text-[10px] font-black text-muted-foreground">MALE</span></div>
                </div>
             </div>
          </div>
       </div>

       {/* ACTIVE HOURS HEATMAP */}
       <div className="bg-card border border-border/40 rounded-3xl p-8">
          <h3 className="text-lg font-black tracking-tight mb-8 uppercase">Active Hours Heatmap</h3>
          <div className="h-[240px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis dataKey="hour" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                  <YAxis dataKey="day" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={heatmapData}>
                    {heatmapData.map((entry, index) => (
                      <Cell key={index} fill={`rgba(168, 85, 247, ${entry.value / 120})`} />
                    ))}
                  </Scatter>
                </ScatterChart>
             </ResponsiveContainer>
          </div>
       </div>
    </div>
  );

  const renderCompetitor = () => (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
             <input type="text" placeholder="Enter a competitor's handle..." className="w-full h-12 bg-muted/20 border border-border/40 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <button className="h-12 px-8 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest flex items-center gap-2">
             <Plus className="w-4 h-4" /> Add
          </button>
       </div>

       <div className="grid grid-cols-1 gap-4">
          {[
            { handle: "@creator_x", er: "5.2%", followers: "1.2M", posts: "42", format: "Reels" },
            { handle: "@daily_vlogs", er: "3.1%", followers: "850K", posts: "124", format: "Videos" },
          ].map((comp, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/40 transition-colors">
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
                    <span className="text-lg font-black text-emerald-500">{comp.er}</span>
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
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* TOP — PLATFORM TAB BAR */}
      <div className="sticky top-[60px] z-30 bg-background/80 backdrop-blur-md -mx-8 px-8 py-2 border-b border-border/30">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-black uppercase tracking-widest relative transition-all whitespace-nowrap ${
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
              <p className="text-muted-foreground max-w-sm">Deep diving into {activeTab} analytics patterns... This will include specific {tab} metrics and growth forecasts.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
