import { motion } from "framer-motion";
import { 
  ArrowUpRight, TrendingUp, Users, Eye, DollarSign, Briefcase, 
  CheckCircle2, Clock, Instagram, Youtube, Twitter, Play,
  ChevronRight, ExternalLink, Zap, Network
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from "recharts";

const sparklineData = [
  { value: 40 }, { value: 45 }, { value: 42 }, { value: 50 }, { value: 48 }, { value: 55 }, { value: 60 }
];

const kpiStats = [
  { label: "Total Reach", value: "1.2M", delta: "+12.4%", icon: Eye, up: true, data: sparklineData },
  { label: "Follower Growth", value: "+8,241", delta: "+3.1%", icon: Users, up: true, data: sparklineData },
  { label: "Engagement Rate", value: "4.8%", delta: "-0.2%", icon: TrendingUp, up: false, data: sparklineData },
  { label: "Est. Revenue", value: "₹2.4L", delta: "+18.9%", icon: DollarSign, up: true, data: sparklineData },
  { label: "Active Brand Deals", value: "4", delta: "2 waiting", icon: Briefcase, up: true, data: sparklineData }
];

const dashboardPosts = [
  { id: 1, thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop", type: "Reel", platform: "IG", reach: "42.5K", engagement: "4.2%", saves: "1.2K", status: "Trending" },
  { id: 2, thumb: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop", type: "Video", platform: "YT", reach: "128K", engagement: "8.1%", saves: "4.5K", status: "Stable" },
  { id: 3, thumb: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop", type: "Post", platform: "TT", reach: "12.1K", engagement: "3.2%", saves: "400", status: "Draft" },
];

export const Home = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* ROW 1 — PERSONALISED AI GREETING BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[140px] rounded-3xl relative overflow-hidden bg-card border border-border/40 p-8 flex items-center justify-between shadow-2xl group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5 animate-shimmer pointer-events-none" 
             style={{ backgroundSize: '200% 100%' }} />
        
        <div className="relative z-10 flex flex-col justify-center gap-1.5">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-black tracking-tight"
          >
            Good morning, Alex 👋
          </motion.h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl leading-relaxed">
            Your engagement is up 14% this week. Your best window to post today is <span className="text-primary font-bold">6:30 PM</span>. 
            You have <span className="border-b border-primary/50 text-foreground font-medium">2 brand deals</span> waiting for a reply.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex flex-col items-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/20" />
              <motion.circle 
                cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="4" 
                className="text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" 
                strokeDasharray="226" 
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * 0.82) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-black">82</span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Engage ↑</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Content ↓</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Deals →</span>
          </div>
        </div>
      </motion.div>

      {/* ROW 2 — LIVE KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpiStats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border/40 hover:border-primary/30 transition-all flex flex-col relative overflow-hidden group hover:-translate-y-1 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors`} />
            </div>
            
            <div className="flex flex-col mb-1">
              <span className="text-3xl font-black tracking-tight">{stat.value}</span>
              <div className={`text-xs font-bold flex items-center mt-1 ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.up ? "↑" : "↓"} {stat.delta}
                <span className="text-[10px] text-muted-foreground font-normal ml-1">vs last period</span>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 w-24 h-12 opacity-50 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stat.data}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={stat.up ? "#10b981" : "#f43f5e"} 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROW 3 — TWO COLUMN LAYOUT (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN (60%) */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2 uppercase">
                  <Zap className="w-5 h-5 text-primary fill-primary" />
                  Today's AI Action Plan
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Your AI Coach has 5 tasks for you today</p>
              </div>
              <div className="h-10 w-10 rounded-full border border-border/40 flex items-center justify-center text-sm font-bold">
                2/5
              </div>
            </div>

            <div className="space-y-4">
              {[
                { task: "Post your Tuesday Reel by 6:30 PM", time: "12 min", done: true, plat: <Instagram className="w-3.5 h-3.5" /> },
                { task: "Reply to 8 unanswered comments on your posts", time: "8 min", done: true, plat: <Instagram className="w-3.5 h-3.5" /> },
                { task: "Follow up with Nike on your pending deal", time: "3 min", done: false, plat: <Briefcase className="w-3.5 h-3.5" /> },
                { task: "Generate 3 caption options for Thursday", time: "2 min", done: false, plat: <Youtube className="w-3.5 h-3.5" /> },
                { task: "Check your Trend Radar — 2 new matches", time: "5 min", done: false, plat: <Zap className="w-3.5 h-3.5" /> },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.done ? 'bg-muted/5 border-transparent opacity-60' : 'bg-muted/10 border-border/30 hover:border-primary/40 hover:bg-muted/20 group cursor-pointer'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.done ? 'bg-primary border-primary' : 'border-border/60 group-hover:border-primary'}`}>
                      {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className={`text-sm ${item.done ? 'line-through text-muted-foreground font-medium' : 'font-bold'}`}>{item.task}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">{item.plat} {item.time}</span>
                      </div>
                    </div>
                  </div>
                  {!item.done && <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />}
                </div>
              ))}
            </div>
            
            <div className="mt-8 overflow-hidden h-2 bg-muted/30 rounded-full relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "40%" }}
                className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"
              />
            </div>
          </motion.div>

          {/* RECENT POST PERFORMANCE */}
          <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black tracking-tight mb-6 uppercase">Recent Post Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Post</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Platform</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Reach</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Engagement</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Saves</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {dashboardPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-muted/10 cursor-pointer transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={post.thumb} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-xs font-bold">{post.type}</span>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-medium">{post.platform}</td>
                      <td className="py-4 text-xs font-black">{post.reach}</td>
                      <td className="py-4 text-xs font-bold text-emerald-500">{post.engagement}</td>
                      <td className="py-4 text-xs font-medium text-muted-foreground">{post.saves}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          post.status === 'Trending' ? 'bg-emerald-500/10 text-emerald-500' :
                          post.status === 'Stable' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (40%) */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm"
          >
            <h3 className="text-xl font-black tracking-tight mb-6 uppercase">Platform Health</h3>
            <div className="space-y-6">
              {[
                { name: "Instagram", followers: "142K", growth: "+1.2%", er: "4.2%", health: "bg-emerald-500", icon: <Instagram className="w-5 h-5 text-pink-500" /> },
                { name: "YouTube", followers: "89K", growth: "+4.5%", er: "8.1%", health: "bg-emerald-500", icon: <Youtube className="w-5 h-5 text-red-500" /> },
                { name: "TikTok", followers: "410K", growth: "-0.8%", er: "3.2%", health: "bg-amber-500", icon: <Play className="w-5 h-5 fill-foreground" /> }
              ].map(platform => (
                <div key={platform.name} className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all border border-transparent hover:border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                      {platform.icon}
                    </div>
                    <div>
                      <div className="font-black text-sm">{platform.name}</div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{platform.followers} followers</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-black ${platform.growth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{platform.growth}</span>
                       <span className={`w-2 h-2 rounded-full ${platform.health} shadow-[0_0_8px_currentColor]`} />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">ER: {platform.er}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm overflow-hidden relative">
            <h3 className="text-xl font-black tracking-tight mb-6 uppercase">Deal Pipeline Snapshot</h3>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
              {[
                { label: "Pros", count: 3 },
                { label: "Outr", count: 2 },
                { label: "Nego", count: 1 },
                { label: "Sign", count: 2 },
                { label: "Live", count: 1 },
              ].map(p => (
                <div key={p.label} className="min-w-[60px] h-12 rounded-xl bg-muted/20 border border-border/30 flex flex-col items-center justify-center relative">
                  <span className="text-[10px] font-bold text-muted-foreground">{p.label}</span>
                  <span className="font-black text-sm">{p.count}</span>
                  {p.count > 0 && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total Pipeline Value</span>
              <span className="text-2xl font-black text-primary">₹ 2,40,000</span>
            </div>
            <button className="mt-6 w-full flex items-center justify-between text-xs font-black uppercase tracking-widest group">
              View All Deals 
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 4 — THREE COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* UPCOMING SCHEDULED POSTS */}
        <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm h-full">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black tracking-tight uppercase">Upcoming Posts</h3>
             <button className="text-[10px] font-bold text-primary uppercase tracking-widest">Calendar →</button>
           </div>
           <div className="space-y-4">
             {[
               { plat: "IG", time: "Today, 6:30 PM", title: "Recovery Habits", thumb: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop" },
               { plat: "YT", time: "Thu, 11:00 AM", title: "The 10K Journey", thumb: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=80&h=80&fit=crop" },
             ].map((post, i) => (
               <div key={i} className="flex gap-4 p-3 rounded-2xl bg-muted/10 border border-border/10">
                 <img src={post.thumb} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                 <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs font-black truncate">{post.title}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{post.time}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* TREND RADAR — LIVE */}
        <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm h-full relative overflow-hidden">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <h3 className="text-lg font-black tracking-tight uppercase">Trend Radar</h3>
                 <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
           </div>
           <div className="space-y-4">
             {[
               { name: "Desk Setups 2024", velocity: "92%", color: "bg-emerald-500" },
               { name: "AI Productivity", velocity: "78%", color: "bg-emerald-500" },
               { name: "Quiet Luxury Decor", velocity: "45%", color: "bg-amber-500" },
             ].map((trend, i) => (
               <div key={i} className="space-y-1.5 p-3 rounded-2xl hover:bg-muted/10 transition-colors">
                 <div className="flex justify-between items-center min-w-0">
                   <span className="text-xs font-bold truncate">{trend.name}</span>
                   <span className="text-[10px] text-muted-foreground">{trend.velocity}</span>
                 </div>
                 <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: trend.velocity }}
                      className={`h-full ${trend.color}`} 
                    />
                 </div>
                 <button className="text-[9px] font-black uppercase tracking-widest text-primary pt-1">Create Content</button>
               </div>
             ))}
           </div>
        </div>

        {/* CREATOR NETWORK — ACTIVITY */}
        <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-sm h-full">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-black tracking-tight uppercase">Network Activity</h3>
             <Network className="w-5 h-5 text-muted-foreground/30" />
           </div>
           <div className="space-y-4">
              {[
                { user: "@stylebypriya", text: "just posted a collab opportunity", icon: "✨" },
                { user: "@brandXYZ", text: "is looking for fitness creators", icon: "🔍" },
                { user: "@raj_vlogs", text: "reached 100K milestone!", icon: "🚀" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start p-2 hover:bg-muted/10 rounded-xl transition-colors cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-black group-hover:text-primary transition-colors">{item.user}</span>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="mt-6 w-full py-2.5 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-muted/10 transition-colors">
             Go to Network
           </button>
        </div>
      </div>

    </div>
  );
};
