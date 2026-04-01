import { useState, memo, useEffect } from "react";
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
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { PageTransition, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "../../components/ui/sonner";
import { db } from "../../lib/db";
import { EmailComposer } from "../../components/dashboard/EmailComposer";

const growthData = [
  { day: 'Day 1', current: 48200, ai: 48200 },
  { day: 'Day 15', current: 48500, ai: 49100 },
  { day: 'Day 30', current: 48800, ai: 50400 },
  { day: 'Day 45', current: 49100, ai: 52000 },
  { day: 'Day 60', current: 49400, ai: 54500 },
];

const GrowthProjectionChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF3CAC" stopOpacity={0.6}/>
          <stop offset="100%" stopColor="#FF3CAC" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
      <YAxis hide />
      <Tooltip 
        contentStyle={{ 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.1)', 
            backgroundColor: '#0f172a',
            fontWeight: 900 
        }}
      />
      <Area type="monotone" dataKey="current" stroke="#64748b" strokeWidth={2} strokeDasharray="8 8" fill="transparent" />
      <Area type="monotone" dataKey="ai" stroke="#FF3CAC" strokeWidth={5} fillOpacity={1} fill="url(#colorAi)" />
    </AreaChart>
  </ResponsiveContainer>
));

export const Growth = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedCollab, setSelectedCollab] = useState<any>(null);
  const [showPitcher, setShowPitcher] = useState(false);

  useEffect(() => {
    const data = db.getAll<any>('growthTasks');
    setTasks(data);
  }, []);

  const toggleAction = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    
    const task = updatedTasks.find(t => t.id === id);
    if (task) {
      db.update('growthTasks', id, { completed: task.completed } as any);
      if (task.completed) {
        toast.success("Task completed!", { description: "Your growth score just leveled up. 🚀" });
      }
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <TrendingUp className="w-3 h-3" />
          Growth War-Room
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
           Operation <span className="text-primary italic">50K</span>
        </h1>
      </header>

      <motion.div variants={staggerItem} className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
         <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="flex-1 space-y-8">
               <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                     <Flame className="w-3 h-3" /> Current Milestone: 48,200 / 50,000
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Mission: Reels Mastery</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
                     {user?.firstName || 'Naveen'}, your <span className="text-white">{user?.niche || 'Fitness & Lifestyle'}</span> niche is currently peaking for 'No-Equipment' content. Fixing your 3-second hook drop-off is the priority this week.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.map((a) => (
                    <div 
                      key={a.id} 
                      onClick={() => toggleAction(a.id)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        a.completed 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-white/5 border-white/5 hover:border-primary/40'
                      }`}
                    >
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                         a.completed ? 'bg-primary border-primary' : 'border-white/20'
                       }`}>
                          {a.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-black uppercase text-muted-foreground block tracking-widest">{a.day} Task</span>
                          <span className={`text-sm font-bold truncate block ${a.completed ? 'line-through opacity-50' : ''}`}>{a.task}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full lg:w-[300px] flex flex-col items-center justify-center space-y-6">
               <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="96" cy="96" r="80" fill="none" stroke="#fff" strokeWidth="12" strokeOpacity="0.05" />
                     <motion.circle 
                       cx="96" cy="96" r="80" fill="none" stroke="#FF3CAC" strokeWidth="12" 
                       strokeDasharray={2 * Math.PI * 80}
                       initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                       animate={{ strokeDashoffset: 2 * Math.PI * 80 * (1 - (tasks.length ? completedCount / tasks.length : 0)) }}
                       transition={{ duration: 1, delay: 0.5 }}
                     />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span className="text-4xl font-black">{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</span>
                     <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Done</span>
                  </div>
               </div>
               <div className="bg-white/5 p-4 rounded-2xl border border-white/5 w-full text-center">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total Network Reach</p>
                  <p className="text-lg font-black text-emerald-500">3,84,200</p>
               </div>
            </div>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <motion.div variants={staggerItem} className="space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
               <Zap className="w-5 h-5 text-primary" /> Collab Finder
            </h3>
            <div className="space-y-4">
               {[
                 { name: 'Ananya Sharma', niche: 'Yoga & Mindfulness', match: 92, avatar: 'AS' },
                 { name: 'Rahul Fit', niche: 'Powerlifting', match: 88, avatar: 'RF' },
                 { name: 'Megha Vlogs', niche: 'Healthy Cooking', match: 81, avatar: 'MV' },
               ].map((c) => (
                 <div key={c.name} className="bg-black/40 border border-white/5 p-5 rounded-[2rem] hover:border-primary/40 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center font-black text-primary border border-primary/20">
                          {c.avatar}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm">{c.name}</h4>
                          <span className="text-[9px] font-black text-muted-foreground uppercase">{c.niche}</span>
                       </div>
                       <div className="text-[10px] font-black text-emerald-500">{c.match}% Match</div>
                    </div>
                    <button 
                        onClick={() => {
                           setSelectedCollab(c);
                           setShowPitcher(true);
                        }}
                        className="w-full py-2.5 bg-white/5 hover:bg-primary hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                     >
                        Draft AI Pitch
                     </button>
                 </div>
               ))}
            </div>
         </motion.div>

         <motion.div variants={staggerItem} className="space-y-6 lg:col-span-2">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
               <Target className="w-5 h-5 text-primary" /> 90-Day Projection
            </h3>
            <div className="bg-black/40 border border-white/5 rounded-[2rem] p-8 h-[400px]">
               <GrowthProjectionChart data={growthData} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               {[
                 { label: '50K Target', val: '22 Days', color: 'text-emerald-500' },
                 { label: 'Ads Eligibility', val: 'Projected', color: 'text-indigo-500' },
                 { label: 'Avg Growth', val: '+12%/mo', color: 'text-primary' },
                 { label: 'Creator Tier', val: 'Rising Star', color: 'text-amber-500' },
               ].map(stat => (
                 <div key={stat.label} className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">{stat.label}</p>
                    <p className={`text-sm font-black ${stat.color}`}>{stat.val}</p>
                 </div>
               ))}
            </div>
         </motion.div>
      </div>

      <section className="space-y-6 mt-12">
         <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-500" /> Trend Radar
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
               { trend: "#75Hard Challenge", platform: "TikTok", potential: "High", surge: "+120%" },
               { trend: "POV: Morning Routine", platform: "Instagram", potential: "Medium", surge: "+45%" },
               { trend: "No-Equipment HIIT", platform: "YouTube", potential: "High", surge: "+88%" },
               { trend: "Wellness Travel", platform: "TikTok", potential: "Viral", surge: "+240%" },
            ].map((t) => (
               <div key={t.trend} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] hover:border-primary/40 transition-all relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-4">
                     <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${t.platform === 'TikTok' ? 'bg-zinc-800 text-white' : 'bg-pink-500/10 text-pink-500'}`}>
                        {t.platform}
                     </span>
                     <span className="text-emerald-500 text-[10px] font-black italic">{t.surge} Surge</span>
                  </div>
                  <h4 className="font-black text-lg mb-2">{t.trend}</h4>
                  <p className="text-[10px] font-black text-muted-foreground mb-6 uppercase">Matching your {user?.niche} niche</p>
                  <button className="w-full py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all">Jump on This Trend</button>
               </div>
            ))}
         </div>
      </section>

      {selectedCollab && (
        <EmailComposer 
          isOpen={showPitcher}
          onClose={() => setShowPitcher(false)}
          initialTo={`${selectedCollab.name.toLowerCase().replace(/\s+/g, '')}@example.com`}
          initialSubject={`Collab Idea: ${user?.firstName} x ${selectedCollab.name}`}
          initialBody={`Hi ${selectedCollab.name.split(' ')[0]},\n\nI've been following your ${selectedCollab.niche} content and I love your style! I noticed a ~${selectedCollab.match}% overlap in our audience interests.\n\nI'd love to chat about a potential collaboration — maybe a shared Instagram Reel or a YouTube guest spot? Let me know if you're open to it!\n\nBest,\n${user?.firstName}`}
          templates={[
            { name: "Casual Hey", subject: "Collab?", body: "Hey! Love your work..." },
            { name: "Strategic Pitch", subject: "Audience Growth Collab", body: "Hi, I noticed our audiences overlap..." }
          ]}
        />
      )}
    </PageTransition>
  );
};
