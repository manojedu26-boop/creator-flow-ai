import { useState, memo } from "react";
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
import { PageTransition, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";

const growthData = [
  { day: 'Day 1', current: 1200, ai: 1200 },
  { day: 'Day 15', current: 1350, ai: 1450 },
  { day: 'Day 30', current: 1500, ai: 1800 },
  { day: 'Day 45', current: 1700, ai: 2400 },
  { day: 'Day 60', current: 1950, ai: 3200 },
  { day: 'Day 75', current: 2200, ai: 4500 },
  { day: 'Day 90', current: 2500, ai: 6000 },
];

const GrowthProjectionChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <filter id="areaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }} />
      <YAxis hide />
      <Tooltip 
        contentStyle={{ 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
            fontWeight: 900 
        }}
      />
      <Area type="monotone" dataKey="current" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="8 8" fill="transparent" isAnimationActive={true} animationDuration={1500} />
      <Area type="monotone" dataKey="ai" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#colorAi)" isAnimationActive={true} animationDuration={2000} filter="url(#areaGlow)" />
    </AreaChart>
  </ResponsiveContainer>
));

export const Growth = () => {
  const [completedActions, setCompletedActions] = useState<number[]>([1, 3]);

  const toggleAction = (id: number) => {
    setCompletedActions(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
           <div>
              <h1 className="text-7xl font-bebas tracking-[4px] text-white leading-none uppercase">Audience Velocity</h1>
              <p className="font-mono text-[10px] font-bold text-primary uppercase tracking-[0.5em] mt-4">Growth Intelligence • Live Feed</p>
           </div>
           <div className="flex gap-4">
              <div className="flex glass-elevated p-1 rounded-xl border border-white/5">
                 <button className="px-6 py-2 rounded-lg text-[9px] font-mono font-bold uppercase bg-primary text-white shadow-xl">Overview</button>
                 <button className="px-6 py-2 rounded-lg text-[9px] font-mono font-bold uppercase text-muted-foreground hover:text-white transition-all">Competitors</button>
              </div>
           </div>
        </div>

        {/* TACTICAL BRIEFING ROW */}
        <motion.div variants={staggerItem} className="glass-card p-12 relative overflow-hidden group border-primary/20 bg-primary/[0.02]">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
           <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           
           <div className="flex flex-col lg:flex-row gap-16 relative z-10">
              <div className="flex-1 space-y-10">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl glass-elevated border border-primary/20 text-primary font-mono text-[9px] font-bold uppercase tracking-widest">
                       <Flame className="w-4 h-4 animate-pulse" /> Mission Brief • WEEK 12
                    </div>
                    <h2 className="text-5xl font-bebas tracking-[2px] text-white">Optimize Retention Corridor</h2>
                    <p className="font-syne text-sm font-bold text-muted-foreground max-w-2xl leading-relaxed uppercase tracking-wide opacity-80">
                       Analysis indicates a 14% drop-off at the [0:03] timestamp. Tactical objective: Tighten video hooks and implement pattern interrupts.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 1, day: 'MON', action: 'Audit Top 5 Performing Hooks' },
                      { id: 2, day: 'TUE', action: 'Draft 3 Hook Pattern Interrupts' },
                      { id: 3, day: 'WED', action: 'Direct Engagement (Last 3 Posts)' },
                      { id: 4, day: 'THU', action: 'Interactive Polling Protocol' },
                      { id: 5, day: 'FRI', action: 'AI-Matched Collab Outreach' },
                    ].map((a) => (
                      <div 
                        key={a.id} 
                        onClick={() => toggleAction(a.id)}
                        className={`p-6 rounded-2xl glass-elevated border transition-all cursor-pointer flex items-center gap-5 ${
                          completedActions.includes(a.id) 
                          ? 'border-primary/40 bg-primary/5' 
                          : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                         <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                           completedActions.includes(a.id) ? 'bg-primary border-primary' : 'border-white/10'
                         }`}>
                            {completedActions.includes(a.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div className="flex-1">
                            <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase mb-1 block">{a.day}</span>
                            <span className={`font-syne text-[11px] font-bold uppercase tracking-wider ${completedActions.includes(a.id) ? 'line-through opacity-40' : 'text-white/80'}`}>{a.action}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="w-full lg:w-[400px] flex flex-col items-center justify-center space-y-10">
                 <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                       <circle cx="128" cy="128" r="110" fill="none" stroke="currentColor" strokeWidth="16" className="text-white/5" />
                       <motion.circle 
                         cx="128" cy="128" r="110" fill="none" stroke="currentColor" strokeWidth="16" 
                         strokeDasharray={2 * Math.PI * 110}
                         initial={{ strokeDashoffset: 2 * Math.PI * 110 }}
                         animate={{ strokeDashoffset: 2 * Math.PI * 110 * (1 - completedActions.length / 5) }}
                         transition={{ duration: 1.5, ease: "circOut" }}
                         className="text-primary"
                         strokeLinecap="round"
                       />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                       <span className="text-6xl font-bebas text-white">{Math.round((completedActions.length / 5) * 100)}%</span>
                       <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-2">Protocol Ready</span>
                    </div>
                 </div>
                 <div className="glass-elevated py-6 px-10 rounded-2xl border border-white/5 w-full text-center">
                    <p className="font-mono text-[10px] font-bold text-success uppercase tracking-widest">
                       Velocity Index: <span className="text-white">1.4x</span>
                    </p>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* THREE COLUMN BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* COLLAB FINDER */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-bebas tracking-[1px] text-white">Partner Scan</h3>
                 <div className="w-8 h-8 glass-elevated rounded-lg flex items-center justify-center border border-white/5"><Search className="w-4 h-4 text-muted-foreground" /></div>
              </div>
              <div className="space-y-4">
                 {[
                   { name: 'SARAH CHEN', niche: 'DIGITAL ARCHITECT', followers: '45K', score: 94, avatar: 'SC' },
                   { name: 'ALEX RIVERA', niche: 'MOTION SYSTEMS', followers: '120K', score: 87, avatar: 'AR' },
                   { name: 'JASMINE K.', niche: 'STORYTELLER', followers: '22K', score: 82, avatar: 'JK' },
                 ].map((c) => (
                   <div key={c.name} className="glass-card p-6 group hover:border-primary/40 transition-all">
                      <div className="flex items-center gap-5 mb-6">
                         <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bebas text-xl">
                            {c.avatar}
                         </div>
                         <div className="flex-1">
                            <h4 className="font-syne font-bold text-white tracking-tight uppercase">{c.name}</h4>
                            <span className="font-mono text-[8px] font-bold text-muted-foreground uppercase mt-1 block">{c.niche} • {c.followers}</span>
                         </div>
                         <div className="px-3 py-1.5 rounded-xl glass-elevated border border-success/20 text-success font-mono text-[9px] font-bold">
                            {c.score}%
                         </div>
                      </div>
                      <div className="flex gap-3">
                         <button className="flex-1 h-11 glass-elevated border border-white/5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-widest text-white hover:bg-white/5 transition-all">Profile</button>
                         <button className="flex-1 h-11 bg-primary text-white rounded-xl font-mono text-[9px] font-bold uppercase tracking-widest shadow-xl hover:shadow-primary/40 transition-all">Protocol DM</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* NICHE GAPS */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-bebas tracking-[1px] text-white">Niche Anomaly</h3>
                 <div className="w-8 h-8 glass-elevated rounded-lg flex items-center justify-center border border-white/5"><Target className="w-4 h-4 text-muted-foreground" /></div>
              </div>
              <div className="space-y-4">
                 {[
                   { topic: 'Budget Tech (India)', score: 92, searches: '890K', pieces: '12' },
                   { topic: 'Minimalist Travel', score: 78, searches: '450K', pieces: '45' },
                   { topic: 'Focus Protocols', score: 65, searches: '1.2M', pieces: '800' },
                 ].map((g) => (
                   <div key={g.topic} className="glass-card p-8 group hover:border-rose-500/40 transition-all bg-rose-500/[0.01]">
                      <div className="flex justify-between items-start mb-6">
                         <h4 className="font-bebas text-xl text-white tracking-[0.5px] max-w-[70%]">{g.topic}</h4>
                         <span className="font-mono text-[9px] font-bold text-rose-500 uppercase">Gap Level: High</span>
                      </div>
                      <div className="space-y-5">
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${g.score}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-rose-500 rounded-full" />
                         </div>
                         <div className="flex justify-between items-center font-mono text-[8px] font-bold text-muted-foreground uppercase">
                            <span>{g.searches} Demand</span>
                            <span>{g.pieces} Supply</span>
                         </div>
                         <button className="w-full h-11 border border-white/10 rounded-xl font-mono text-[9px] font-bold uppercase tracking-widest text-white hover:border-rose-500/40 hover:bg-rose-500/5 transition-all flex items-center justify-center gap-2">
                            <Zap className="w-3.5 h-3.5" /> Execute Strategy
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* TREND RADAR */}
           <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-bebas tracking-[1px] text-white">Viral Signals</h3>
                 <div className="w-8 h-8 glass-elevated rounded-lg flex items-center justify-center border border-white/5"><Flame className="w-4 h-4 text-primary animate-pulse" /></div>
              </div>
              <div className="space-y-4">
                 {[
                   { name: 'AI AUTOMATIONS', velocity: '🔥🔥🔥', platform: 'TIKTOK', peak: '18H' },
                   { name: 'SENSORY ASMR', velocity: '🔥🔥', platform: 'INSTAGRAM', peak: '2D' },
                   { name: 'DEEP WORK VLOGS', velocity: '🔥', platform: 'YOUTUBE', peak: '4D' },
                 ].map((t) => (
                   <div key={t.name} className="glass-card p-6 flex items-center justify-between group hover:border-primary/40 transition-all">
                      <div>
                          <div className="flex items-center gap-3 mb-1">
                             <span className="font-mono text-[8px] font-bold text-primary tracking-tighter">{t.velocity}</span>
                             <h4 className="font-syne font-bold text-[13px] text-white uppercase">{t.name}</h4>
                          </div>
                          <p className="font-mono text-[8px] font-bold text-muted-foreground uppercase mt-1">{t.platform} • PEAK IN {t.peak}</p>
                      </div>
                      <button className="w-10 h-10 glass-elevated rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/5">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                 ))}
              </div>
              <div className="p-8 rounded-[2rem] glass-elevated border border-dashed border-white/10 text-center space-y-4">
                 <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Neural Engine Scanning...</p>
                 <div className="flex justify-center gap-2">
                    {[1,2,3].map(i => <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-primary" />)}
                 </div>
              </div>
           </div>
        </div>

        {/* GROWTH PROJECTION CHART */}
        <motion.div variants={staggerItem} className="glass-card p-12 shadow-22 overflow-hidden relative group">
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 relative z-10">
              <div>
                 <h3 className="text-3xl font-bebas tracking-[2px] text-white">Growth Trajectory</h3>
                 <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">90-Day Predictive Analysis</p>
              </div>
              <div className="flex gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full border border-white/20" />
                    <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest pt-0.5">Control Pace</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest pt-0.5">Augmented Plan</span>
                 </div>
              </div>
           </div>

           <div className="h-[450px] w-full mt-4 scale-[1.02] transform transition-transform group-hover:scale-100 duration-1000">
              <GrowthProjectionChart data={growthData} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 relative z-10">
              {[
                { label: 'MILESTONE', val: '10K UNITS', time: 'ETA 22D', glow: 'shadow-[0_0_20px_-10px_#10b981]' },
                { label: 'SETTLEMENT', val: 'QUALIFIED', time: 'ETA 35D', glow: 'shadow-[0_0_20px_-10px_#6366f1]' },
                { label: 'COLLABORATION', val: 'FEATURED', time: 'ETA 10D', glow: 'shadow-[0_0_20px_-10px_#f43f5e]' },
                { label: 'BONUS EQUITY', val: '$500+', time: 'PROJECTED', glow: 'shadow-[0_0_20px_-10px_#f59e0b]' },
              ].map(m => (
                <div key={m.label} className={`glass-elevated py-6 px-8 rounded-2xl border border-white/5 flex items-center justify-between transition-all hover:border-white/20 ${m.glow}`}>
                   <div>
                      <span className="font-mono text-[8px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{m.label}</span>
                      <span className="font-bebas text-xl text-white tracking-wider">{m.val}</span>
                   </div>
                   <div className="font-mono text-[9px] font-bold text-primary uppercase tracking-widest">
                      {m.time}
                   </div>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};
