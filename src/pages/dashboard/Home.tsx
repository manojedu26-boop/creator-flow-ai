import { motion } from "framer-motion";
import { 
  ArrowUpRight, TrendingUp, Users, Eye, DollarSign, Briefcase, 
  CheckCircle2, Clock, Instagram, Youtube, Twitter, Play,
  ChevronRight, ExternalLink, Zap, Network
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from "recharts";
import { PageTransition, CountUp } from "../../components/shared/MotionComponents";

const sparklineData = [
  { value: 40 }, { value: 45 }, { value: 42 }, { value: 50 }, { value: 48 }, { value: 55 }, { value: 60 }
];

const kpiStats = [
  { label: "Total Reach", value: 1200000, delta: "+12.4%", icon: Eye, up: true, data: sparklineData, suffix: "M", divisor: 1000000, decimals: 1 },
  { label: "Follower Growth", value: 8241, delta: "+3.1%", icon: Users, up: true, data: sparklineData, prefix: "+" },
  { label: "Engagement Rate", value: 4.8, delta: "-0.2%", icon: TrendingUp, up: false, data: sparklineData, suffix: "%", decimals: 1 },
  { label: "Est. Revenue", value: 2.4, delta: "+18.9%", icon: DollarSign, up: true, data: sparklineData, prefix: "₹", suffix: "L", decimals: 1 },
  { label: "Active Brand Deals", value: 4, delta: "2 waiting", icon: Briefcase, up: true, data: sparklineData }
];

const dashboardPosts = [
  { id: 1, thumb: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop", type: "Reel", platform: "IG", reach: "42.5K", engagement: "4.2%", saves: "1.2K", status: "Trending" },
  { id: 2, thumb: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=100&h=100&fit=crop", type: "Video", platform: "YT", reach: "128K", engagement: "8.1%", saves: "4.5K", status: "Stable" },
  { id: 3, thumb: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop", type: "Post", platform: "TT", reach: "12.1K", engagement: "3.2%", saves: "400", status: "Draft" },
];

export const Home = () => {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* ROW 1 — PERSONALISED AI GREETING BANNER */}
        <div className="glass-elevated w-full h-[180px] md:h-[140px] rounded-3xl relative overflow-hidden p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl group border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/5 animate-shimmer pointer-events-none" 
               style={{ backgroundSize: '200% 100%' }} />
          
          <div className="relative z-10 flex flex-col justify-center gap-1.5 text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="font-bebas text-4xl md:text-5xl tracking-[4px] text-white"
            >
              Good morning, Alex
            </motion.h2>
            <p className="text-muted-foreground text-sm font-syne font-medium max-w-2xl leading-relaxed">
              Your engagement is up <span className="text-success font-bold">14%</span> this week. Best post time: <span className="text-secondary font-bold font-mono">18:30</span>. 
              You have <span className="border-b border-primary/50 text-foreground font-bold">2 deals</span> pending.
            </p>
          </div>

          <div className="relative z-10 hidden md:flex flex-col items-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <motion.circle 
                  cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" 
                  className="text-primary drop-shadow-[0_0_12px_hsla(325,100%,62%,0.6)]" 
                  strokeDasharray="264" 
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * 0.82) }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-bebas tracking-tighter text-white">
                  <CountUp value={82} />
                </span>
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-widest -mt-1">Rank</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 — BENTO KPI STRIP */}
        <div className="bento-grid">
          {kpiStats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`${i === 0 ? 'bento-span-4' : 'bento-span-2'} glass-card p-6 flex flex-col relative overflow-hidden group`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-muted-foreground font-mono font-bold uppercase tracking-[2px]">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              
              <div className="flex flex-col mb-1 z-10">
                <span className="text-3xl font-mono font-bold tracking-tighter text-white">
                  <CountUp 
                    value={stat.divisor ? stat.value / stat.divisor : stat.value} 
                    prefix={stat.prefix} 
                    suffix={stat.suffix} 
                    decimals={stat.decimals} 
                  />
                </span>
                <div className={`text-[10px] font-mono font-bold flex items-center mt-1.5 ${stat.up ? 'text-success' : 'text-rose-500'}`}>
                  {stat.up ? "↑" : "↓"} {stat.delta}
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-full h-12 opacity-30 group-hover:opacity-60 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stat.data}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={stat.up ? "#00E5A0" : "#ff4d4d"} 
                      strokeWidth={2} 
                      dot={false} 
                      isAnimationActive={true}
                      animationDuration={800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROW 3 — ASYMMETRIC BENTO GRID */}
        <div className="bento-grid">
          
          {/* AI ACTION PLAN (Span 8) */}
          <div className="bento-span-8 glass-card p-8 border border-white/5 relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <Zap className="w-32 h-32 text-primary" />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h1 className="text-2xl font-bebas tracking-[3px] text-white flex items-center gap-3">
                  AI Action Plan
                </h1>
                <p className="font-mono text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">High Priority Tasks: 05</p>
              </div>
              <div className="h-12 w-12 rounded-xl glass-elevated flex items-center justify-center font-mono font-bold text-primary">
                2/5
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {[
                { task: "Post Tuesday Reel", time: "18:30", done: true, plat: <Instagram className="w-4 h-4" /> },
                { task: "Reply to Comments", time: "08m", done: true, plat: <Instagram className="w-4 h-4" /> },
                { task: "Nike Follow-up", time: "03m", done: false, plat: <Briefcase className="w-4 h-4" /> },
                { task: "Thursday Captions", time: "02m", done: false, plat: <Youtube className="w-4 h-4" /> },
                { task: "Trend Radar Check", time: "05m", done: false, plat: <Zap className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border border-white/5 transition-all ${item.done ? 'bg-white/[0.02] opacity-40' : 'bg-white/[0.04] hover:bg-white/[0.08] group/item cursor-pointer shadow-inner'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${item.done ? 'bg-primary border-primary' : 'border-white/20 group-hover/item:border-primary'}`}>
                      {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : 'font-syne font-bold text-foreground'}`}>{item.task}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PLATFORM HEALTH (Span 4) */}
          <div className="bento-span-4 glass-card p-8 border border-white/5">
            <h1 className="text-2xl font-bebas tracking-[3px] text-white mb-6 uppercase">Platform Health</h1>
            <div className="space-y-4">
              {[
                { name: "Instagram", val: "142K", icon: <Instagram className="w-4 h-4" />, status: "bg-success" },
                { name: "YouTube", val: "89K", icon: <Youtube className="w-4 h-4" />, status: "bg-success" },
                { name: "TikTok", val: "410K", icon: <Twitter className="w-4 h-4" />, status: "bg-warning" }
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between p-4 rounded-xl glass-elevated group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">{p.icon}</div>
                    <div>
                      <div className="font-syne font-bold text-sm">{p.name}</div>
                      <div className="font-mono text-[9px] uppercase font-bold text-muted-foreground tracking-widest">{p.val} Foll</div>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${p.status} shadow-[0_0_10px_currentColor]`} />
                </div>
              ))}
            </div>
          </div>

          {/* RECENT PERFORMANCE (Span 8) */}
          <div className="bento-span-8 glass-card p-8 border border-white/5">
            <h1 className="text-2xl font-bebas tracking-[3px] text-white mb-6 uppercase text-center md:text-left">Recent Performance</h1>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left font-syne">
                <thead>
                  <tr className="border-b border-white/5 font-mono text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground">
                    <th className="pb-4">Content</th>
                    <th className="pb-4">Reach</th>
                    <th className="pb-4">Eng.</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {dashboardPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-white/[0.02] cursor-pointer transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <img src={post.thumb} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-xs font-bold font-mono tracking-widest">{post.type}</span>
                      </td>
                      <td className="py-4 text-xs font-mono font-bold">{post.reach}</td>
                      <td className="py-4 text-xs font-mono font-bold text-success">{post.engagement}</td>
                      <td className="py-4">
                        <span className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          post.status === 'Trending' ? 'text-success bg-success/10' : 'text-muted-foreground'
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

          {/* DEAL PIPELINE snapshot (Span 4) */}
          <div className="bento-span-4 glass-card p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bebas tracking-[3px] text-white mb-6 uppercase">Active Pipeline</h1>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { l: "Neg", c: "01" },
                  { l: "Sign", c: "02" },
                  { l: "Live", c: "01" },
                  { l: "Opp", c: "04" },
                ].map(p => (
                  <div key={p.l} className="p-3 rounded-xl glass-elevated flex flex-col items-center">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{p.l}</span>
                    <span className="font-mono text-xl font-bold text-white">{p.c}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 flex flex-col gap-1 items-center">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[2px] text-muted-foreground">Est. Value</span>
              <span className="font-mono text-2xl font-bold text-white">₹ 2,40,000</span>
            </div>
          </div>

        </div>

        {/* ROW 4 — LIVE INSIGHTS BENTO */}
        <div className="bento-grid">
          
          {/* UPCOMING CONTENT (Span 4) */}
          <div className="bento-span-4 glass-card p-8 border border-white/5">
             <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bebas tracking-[2px] text-white uppercase">Upcoming</h1>
                <button className="font-mono text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Calendar →</button>
             </div>
             <div className="space-y-4">
               {[
                 { plat: "IG", time: "Today, 18:30", title: "Recovery Habits", thumb: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=80&h=80&fit=crop" },
                 { plat: "YT", time: "Thu, 11:00", title: "The 10K Journey", thumb: "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?w=80&h=80&fit=crop" },
               ].map((post, i) => (
                 <div key={i} className="flex gap-4 p-3 rounded-xl glass-elevated border border-white/5 group cursor-pointer">
                   <img src={post.thumb} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                   <div className="flex flex-col justify-center min-w-0">
                      <span className="text-xs font-bold font-syne truncate group-hover:text-primary transition-colors">{post.title}</span>
                      <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{post.time}</span>
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* TREND RADAR (Span 4) */}
          <div className="bento-span-4 glass-card p-8 border border-white/5 relative overflow-hidden">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                   <h1 className="text-xl font-bebas tracking-[2px] text-white uppercase">Trend Radar</h1>
                   <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
                </div>
                <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase">Live</span>
             </div>
             <div className="space-y-5">
               {[
                 { name: "Desk Setups 2024", v: "92%", c: "bg-success" },
                 { name: "AI Productivity", v: "78%", c: "bg-success" },
                 { name: "Quiet Luxury", v: "45%", c: "bg-warning" },
               ].map((t, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center">
                     <span className="text-xs font-bold font-syne">{t.name}</span>
                     <span className="font-mono text-[9px] text-muted-foreground">{t.v}</span>
                   </div>
                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: t.v }} className={`h-full ${t.c} shadow-[0_0_8px_currentColor]`} />
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {/* NETWORK (Span 4) */}
          <div className="bento-span-4 glass-card p-8 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bebas tracking-[2px] text-white uppercase">Network</h1>
                <Network className="w-5 h-5 text-muted-foreground/30" />
              </div>
              <div className="space-y-4">
                 {[
                   { u: "@stylebypriya", t: "Collab opportunity", i: "✨" },
                   { u: "@brandXYZ", t: "Looking for fitness", i: "🔍" },
                   { u: "@raj_vlogs", t: "100K milestone!", i: "🚀" },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-3 items-center p-3 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer group">
                     <div className="w-8 h-8 rounded-lg glass-elevated flex items-center justify-center text-sm shrink-0">
                       {item.i}
                     </div>
                     <div className="min-w-0">
                       <span className="text-xs font-bold font-syne group-hover:text-primary transition-colors">{item.u}</span>
                       <p className="font-mono text-[9px] text-muted-foreground uppercase truncate mt-0.5">{item.t}</p>
                     </div>
                   </div>
                 ))}
              </div>
          </div>

        </div>

      </div>
    </PageTransition>
  );
};
