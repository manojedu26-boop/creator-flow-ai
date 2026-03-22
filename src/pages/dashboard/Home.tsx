import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, Users, Eye, DollarSign, Briefcase } from "lucide-react";

export const Home = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ROW 1 — PERSONALISED AI GREETING BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-[120px] rounded-2xl relative overflow-hidden bg-card border border-border/40 p-6 flex items-center justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent animate-pulse" />
        <div className="relative z-10 flex flex-col justify-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Good morning, Alex 👋</h2>
          <p className="text-muted-foreground text-sm max-w-xl">
            Your engagement is up 14% this week. Your best window to post today is 6:30 PM. 
            You have <strong className="text-foreground">2 brand deals</strong> waiting for a reply.
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center overflow-hidden">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" strokeDasharray="175" strokeDashoffset="40" />
            </svg>
            <span className="text-xl font-black">82</span>
          </div>
          <span className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-semibold">Creator Score</span>
        </div>
      </motion.div>

      {/* ROW 2 — LIVE KPI STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Reach", value: "1.2M", delta: "+12.4%", icon: Eye, up: true },
          { label: "Follower Growth", value: "+8,241", delta: "+3.1%", icon: Users, up: true },
          { label: "Engagement Rate", value: "4.8%", delta: "-0.2%", icon: TrendingUp, up: false },
          { label: "Est. Revenue", value: "₹2.4L", delta: "+18.9%", icon: DollarSign, up: true },
          { label: "Active Deals", value: "4", delta: "2 waiting", icon: Briefcase, up: true, highlight: true }
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-2xl bg-card border border-border/40 hover:border-border/80 transition-all flex flex-col relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.highlight ? 'text-primary' : 'text-muted-foreground/50'}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <div className={`text-xs flex items-center mt-2 ${stat.up ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stat.up ? "↑" : "↓"} {stat.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ROW 3 — TWO COLUMN LAYOUT (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border/40 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              TODAY'S AI ACTION PLAN
            </h3>
            <div className="space-y-3">
              {[
                { task: "Post your Tuesday Reel by 6:30 PM", time: "12 min", done: true },
                { task: "Reply to 8 unanswered comments on your last 3 posts", time: "8 min", done: true },
                { task: "Follow up with Nike on your pending deal", time: "3 min", done: false },
                { task: "Generate 3 caption options for Thursday's post", time: "2 min", done: false },
                { task: "Check your Trend Radar — 2 trends match your niche", time: "5 min", done: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${item.done ? 'bg-muted/10 border-transparent opacity-60' : 'bg-muted/20 border-border/30 hover:border-primary/30'}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={item.done} readOnly className="w-4 h-4 rounded text-primary bg-background border-border/50" />
                    <span className={`text-sm ${item.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>{item.task}</span>
                  </div>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-background rounded-md">{item.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/20 text-xs text-muted-foreground font-medium">
              2 of 5 done today — Keep it up!
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border/40 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">PLATFORM HEALTH</h3>
            <div className="space-y-4">
              {[
                { name: "Instagram", followers: "142K", growth: "+1.2%", health: "bg-emerald-500" },
                { name: "YouTube", followers: "89K", growth: "+4.5%", health: "bg-emerald-500" },
                { name: "TikTok", followers: "410K", growth: "-0.8%", health: "bg-amber-500" }
              ].map(platform => (
                <div key={platform.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                  <div>
                    <div className="font-semibold text-sm">{platform.name}</div>
                    <div className="text-xs text-muted-foreground">{platform.followers} followers</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-emerald-500">{platform.growth}</span>
                    <span className={`w-2 h-2 rounded-full ${platform.health}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
