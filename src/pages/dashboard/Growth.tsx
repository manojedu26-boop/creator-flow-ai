import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Target, Users, Zap, 
  ChevronRight, ArrowUpRight, CheckCircle2,
  Calendar, MessageSquare, Flame, Lightbulb,
  Search, Link, MousePointer2, Award, 
  Layout, BarChart3, PieChart
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const growthData = [
  { day: 'Day 1', current: 1200, ai: 1200 },
  { day: 'Day 15', current: 1350, ai: 1450 },
  { day: 'Day 30', current: 1500, ai: 1800 },
  { day: 'Day 45', current: 1700, ai: 2400 },
  { day: 'Day 60', current: 1950, ai: 3200 },
  { day: 'Day 75', current: 2200, ai: 4500 },
  { day: 'Day 90', current: 2500, ai: 6000 },
];

export const Growth = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([1, 3]);

  const toggleAction = (id: number) => {
    setCompletedActions(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* WEEKLY AI GROWTH BRIEF */}
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="flex-1 space-y-8">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                     <Flame className="w-3 h-3" /> Growth Mission: Week 12
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Focus on Audience Retention</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                     This week, your mission is to convert casual viewers into loyal fans. Your data shows a 14% drop at the 3-second mark. We need to fix your hooks.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 1, day: 'Mon', action: 'Audit top 5 performing hooks this month' },
                    { id: 2, day: 'Tue', action: 'Draft 3 new hook variations for Reels' },
                    { id: 3, day: 'Wed', action: 'Reply to all comments on your last 3 posts' },
                    { id: 4, day: 'Thu', action: 'Host an interactive Q&A story' },
                    { id: 5, day: 'Fri', action: 'Collaborate with a micro-influencer (AI Matched)' },
                  ].map((a) => (
                    <div 
                      key={a.id} 
                      onClick={() => toggleAction(a.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        completedActions.includes(a.id) 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-muted/10 border-border/30 hover:border-primary/40'
                      }`}
                    >
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                         completedActions.includes(a.id) ? 'bg-primary border-primary' : 'border-border'
                       }`}>
                          {completedActions.includes(a.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                       </div>
                       <div className="flex-1">
                          <span className="text-[10px] font-black uppercase text-muted-foreground block">{a.day}</span>
                          <span className={`text-sm font-bold ${completedActions.includes(a.id) ? 'line-through opacity-50' : ''}`}>{a.action}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full lg:w-[320px] flex flex-col items-center justify-center space-y-6 pt-10 lg:pt-0">
               <div className="relative w-52 h-52 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="104" cy="104" r="90" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/10" />
                     <motion.circle 
                       cx="104" cy="104" r="90" fill="none" stroke="currentColor" strokeWidth="12" 
                       strokeDasharray={2 * Math.PI * 90}
                       strokeDashoffset={2 * Math.PI * 90 * (1 - completedActions.length / 5)}
                       className="text-primary"
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span className="text-5xl font-black">{Math.round((completedActions.length / 5) * 100)}%</span>
                     <span className="text-[10px] font-black uppercase text-muted-foreground">Mission Progress</span>
                  </div>
               </div>
               <div className="bg-muted/10 p-5 rounded-2xl border border-border/40 w-full text-center">
                  <p className="text-xs font-bold leading-relaxed">
                     Last week: <span className="text-emerald-500">+312 followers</span><br/>
                     <span className="text-muted-foreground font-medium">28% better than previous week</span>
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* THREE COLUMN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* COLUMN 1 — COLLAB FINDER */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight">Collab Finder</h3>
               <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Sarah Chen', niche: 'Tech Lifestyle', followers: '45K', score: 94, avatar: 'SC' },
                 { name: 'Alex Rivera', niche: 'Fitness', followers: '120K', score: 87, avatar: 'AR' },
                 { name: 'Jasmine K.', niche: 'Vlog/Travel', followers: '22K', score: 82, avatar: 'JK' },
               ].map((c) => (
                 <div key={c.name} className="bg-card border border-border/40 p-5 rounded-3xl group hover:border-primary/40 transition-all shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg">
                          {c.avatar}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-black text-base">{c.name}</h4>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">{c.niche} • {c.followers}</span>
                       </div>
                       <div className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                          {c.score}% Match
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="flex-1 py-2 bg-muted/10 rounded-xl text-[10px] font-black uppercase hover:bg-muted/30 transition-all">View</button>
                       <button className="flex-1 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all">Draft DM</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* COLUMN 2 — NICHE GAP RADAR */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight">Niche Gaps</h3>
               <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-4">
               {[
                 { topic: 'Budget Desk Setups (India)', score: 92, searches: '890K', pieces: '12' },
                 { topic: 'Solo Travel for Introverts', score: 78, searches: '450K', pieces: '45' },
                 { topic: 'Daily Productivity Habits', score: 65, searches: '1.2M', pieces: '800' },
               ].map((g) => (
                 <div key={g.topic} className="bg-card border border-border/40 p-6 rounded-3xl group hover:border-rose-500/40 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <h4 className="font-black text-md leading-tight max-w-[70%]">{g.topic}</h4>
                       <span className="text-[10px] font-black text-rose-500">{g.score} Gap Score</span>
                    </div>
                    <div className="space-y-4">
                       <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${g.score}%` }} />
                       </div>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">
                          {g.searches} Searches vs {g.pieces} Pieces
                       </p>
                       <button className="w-full py-3 border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-rose-500 hover:text-rose-500 transition-all flex items-center justify-center gap-2">
                          <Zap className="w-3.5 h-3.5" /> Create for This
                       </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* COLUMN 3 — TREND RADAR */}
         <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black uppercase tracking-tight">Live Trends</h3>
               <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div className="space-y-4">
               {[
                 { name: 'AI Workflows', velocity: '🔥🔥🔥', platform: 'TikTok', peak: '18h' },
                 { name: 'Low-Fi Vlogs', velocity: '🔥🔥', platform: 'Instagram', peak: '2d' },
                 { name: 'Minimalist Life', velocity: '🔥', platform: 'YouTube', peak: '4d' },
               ].map((t) => (
                 <div key={t.name} className="bg-card border border-border/40 p-5 rounded-3xl group hover:border-orange-500/40 transition-all shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-black text-orange-500 tracking-tighter">{t.velocity}</span>
                           <h4 className="font-black text-base">{t.name}</h4>
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.platform} • Peaks in {t.peak}</p>
                    </div>
                    <button className="p-3 bg-muted/10 rounded-2xl hover:bg-orange-500 hover:text-white transition-all">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                 </div>
               ))}
            </div>
            <div className="p-6 rounded-3xl bg-muted/5 border border-dashed border-border/40 text-center space-y-2">
               <p className="text-[10px] font-black uppercase text-muted-foreground">More trends scanning...</p>
               <div className="flex justify-center gap-1.5">
                  {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse" />)}
               </div>
            </div>
         </div>
      </div>

      {/* GROWTH TIMELINE */}
      <div className="bg-card border border-border/40 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
               <h3 className="text-2xl font-black uppercase tracking-tight">Growth Projection</h3>
               <span className="text-sm font-bold text-muted-foreground uppercase">Estimated Trajectory: Next 90 Days</span>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted/40" />
                  <span className="text-[10px] font-black uppercase">Current Pace</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase">With AI Plan</span>
               </div>
            </div>
         </div>

         <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={growthData}>
                  <defs>
                     <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', fontWeight: 900 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="current" 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    fill="transparent" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ai" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAi)" 
                  />
               </AreaChart>
            </ResponsiveContainer>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Milestone', val: '10K', time: '~22 days', color: 'bg-emerald-500' },
              { label: 'Monetisation', val: 'Eligible', time: '~35 days', color: 'bg-indigo-500' },
              { label: 'Collab Opp', val: 'Featured', time: '~10 days', color: 'bg-rose-500' },
              { label: 'Brand Bonus', val: '$500+', time: 'Projected', color: 'bg-amber-500' },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-2xl bg-muted/10 border border-border/40 flex items-center justify-between">
                 <div>
                    <span className="text-[10px] font-black uppercase text-muted-foreground block">{m.label}</span>
                    <span className="text-base font-black uppercase text-foreground">{m.val}</span>
                 </div>
                 <div className={`px-2 py-1 rounded-lg text-white text-[9px] font-black uppercase ${m.color}`}>
                    {m.time}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
