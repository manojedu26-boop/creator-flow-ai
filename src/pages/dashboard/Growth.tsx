import { useState, memo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Target, Users, Zap, 
  ChevronRight, ArrowUpRight, CheckCircle2,
  Calendar, MessageSquare, Flame, Lightbulb,
  Search, Link, MousePointer2, Award, 
  Layout, BarChart3, PieChart, RefreshCcw
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
import { cn } from "../../lib/utils";
import { generateViralHooks } from "../../services/viralBrain";

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
          <stop offset="0%" stopColor="#2563eb" stopOpacity={0.15}/>
          <stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
      <YAxis hide />
      <Tooltip 
        contentStyle={{ 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0', 
            backgroundColor: '#ffffff',
            fontWeight: 700,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}
      />
      <Area type="monotone" dataKey="current" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" fill="transparent" />
      <Area type="monotone" dataKey="ai" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorAi)" />
    </AreaChart>
  </ResponsiveContainer>
));

export const Growth = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedCollab, setSelectedCollab] = useState<any>(null);
  const [showPitcher, setShowPitcher] = useState(false);
  const [isBrainLoading, setIsBrainLoading] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<string[]>([]);

  const handleViralBrain = async (videoUrl: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : videoUrl;

    if (videoId.length !== 11) {
      toast.error("Invalid Target", { description: "Please provide a valid YouTube Video ID or URL." });
      return;
    }

    setIsBrainLoading(true);
    try {
      const result = await generateViralHooks(videoId);
      if (result.error) {
        toast.error("Synthesis Interrupt", { description: result.error });
      } else {
        setGeneratedHooks(result.hooks);
        
        // Persist to Growth Tasks DB as high-impact actions
        result.hooks.forEach(hook => {
          db.insert('growthTasks', {
            id: `task_${Math.random().toString(36).substr(2, 9)}`,
            task: hook,
            day: 'AI Generated',
            completed: false
          } as any);
        });

        // Update local state to reflect new mission nodes
        const updatedData = db.getAll<any>('growthTasks');
        setTasks(updatedData);
        
        toast.success("Intelligence Synthesized", { description: `Processed: ${result.metadata?.originalTitle || 'Video Node'}. Hooks added to mission pipeline.` });
      }
    } catch (err) {
      toast.error("Protocol Failure", { description: "The Viral Brain encountered an unexpected error." });
    } finally {
      setIsBrainLoading(false);
    }
  };

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
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
          <TrendingUp className="w-3.5 h-3.5" />
          Growth Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
           Operation <span className="text-blue-600">Scale</span>
        </h1>
      </header>

      <motion.div variants={staggerItem} className="bg-white border border-slate-200 rounded-[3rem] shadow-sm relative overflow-hidden group">
         <div className="absolute inset-0 bg-slate-50/50 opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />
         
         <div className="relative z-10 p-10 lg:p-14 flex flex-col lg:flex-row gap-16 text-slate-900">
            <div className="flex-1 space-y-12">
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="px-5 py-2 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Flame className="w-4 h-4" /> Velocity Unlocked
                     </div>
                     <div className="px-5 py-2 rounded-2xl bg-slate-50 text-slate-500 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner">
                        Network Reach: 48.2K / 50K
                     </div>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
                    Mission: <span className="text-blue-600">Market Capture</span>
                  </h2>
                  <p className="text-slate-500 text-lg max-w-3xl leading-relaxed font-medium">
                     {user?.firstName || 'Naveen'}, your <span className="text-slate-900 font-bold underline decoration-blue-500/30 decoration-4 underline-offset-4">{user?.niche || 'Fitness & Lifestyle'}</span> ecosystem is approaching critical mass. Data models suggest immediate scaling via automated outreach.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {tasks.map((a) => (
                    <div 
                      key={a.id} 
                      onClick={() => toggleAction(a.id)}
                      className={cn(
                        "p-8 rounded-[2.5rem] border transition-all duration-500 cursor-pointer flex items-center gap-6 group/task shadow-sm",
                        a.completed 
                        ? 'bg-blue-50 border-blue-100' 
                        : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                      )}
                    >
                       <div className={cn(
                         "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-sm",
                         a.completed ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover/task:border-blue-300'
                       )}>
                          {a.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                       </div>
                       <div className="flex-1 min-w-0 text-slate-900">
                          <span className={cn(
                            "text-[10px] font-black uppercase block tracking-[0.2em] mb-1.5",
                            a.completed ? "text-blue-600 opacity-60" : "text-slate-400"
                          )}>{a.day} High-Impact Action</span>
                          <span className={cn(
                            "text-[15px] font-black transition-all duration-500 tracking-tight",
                            a.completed ? 'text-slate-300 line-through' : 'text-slate-900'
                          )}>{a.task}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="w-full lg:w-[350px] flex flex-col items-center justify-center space-y-12">
               <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="128" cy="128" r="100" fill="none" stroke="#f8fafc" strokeWidth="18" />
                     <motion.circle 
                       cx="128" cy="128" r="100" fill="none" stroke="url(#progressGradient)" strokeWidth="18" strokeLinecap="round"
                       strokeDasharray={2 * Math.PI * 100}
                       initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                       animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - (tasks.length ? completedCount / tasks.length : 0)) }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                     />
                     <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                           <stop offset="0%" stopColor="#2563eb" />
                           <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                     </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <span className="text-6xl font-black text-slate-900 tracking-tighter">{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}<span className="text-xl opacity-30 text-slate-400">%</span></span>
                     <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mt-2">Impact Score</span>
                  </div>
               </div>
               <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100 w-full text-center shadow-inner">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-3">Live Network Potency</p>
                  <p className="text-4xl font-black text-blue-600 tracking-tighter">384.2K</p>
               </div>
            </div>
         </div>
       </motion.div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <motion.div variants={staggerItem} className="space-y-8">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-slate-900">
                  <Zap className="w-5 h-5 text-blue-600" /> Strategic Partners
               </h3>
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-center shadow-sm">AI Selection</span>
            </div>
            <div className="space-y-4">
               {[
                 { name: 'Ananya Sharma', niche: 'Yoga & Mindfulness', match: 92, avatar: 'AS', color: 'bg-orange-50 text-orange-600 border-orange-100' },
                 { name: 'Rahul Fit', niche: 'Powerlifting', match: 88, avatar: 'RF', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                 { name: 'Megha Vlogs', niche: 'Healthy Cooking', match: 81, avatar: 'MV', color: 'bg-purple-50 text-purple-600 border-purple-100' },
               ].map((c) => (
                 <div key={c.name} className="bg-white border border-slate-200 p-6 rounded-[2.5rem] hover:border-blue-300 hover:shadow-md transition-all group overflow-hidden relative shadow-sm">
                    <div className="flex items-center gap-5 mb-5 relative z-10">
                       <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg border shadow-sm", c.color)}>
                          {c.avatar}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-md tracking-tight text-slate-900 uppercase">{c.name}</h4>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.niche}</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-blue-600">{c.match}%</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Match</span>
                       </div>
                    </div>
                    <button 
                        onClick={() => {
                           setSelectedCollab(c);
                           setShowPitcher(true);
                        }}
                        className="w-full py-4 bg-slate-50 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative z-10 text-slate-900 shadow-sm"
                     >
                        Initiate AI Outreach
                     </button>
                 </div>
               ))}
            </div>
         </motion.div>

         <motion.div variants={staggerItem} className="space-y-8 lg:col-span-2">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3 text-slate-900">
               <Target className="w-5 h-5 text-blue-600" /> 90-Day Scaling Projection
            </h3>
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 h-[280px] shadow-sm">
               <GrowthProjectionChart data={growthData} />
            </div>
            
            {/* Viral Brain Section */}
            <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden group shadow-2xl shimmer-border">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-24 h-24 text-blue-600" />
               </div>
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/10 shrink-0">
                     <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Viral Brain v1.0</h3>
                     <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mt-1">Short-Form Hook Protocol</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4">
                     <div className="flex-1 relative">
                        <Link className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                           type="text" 
                           placeholder="Enter YouTube Video ID or URL" 
                           className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                           id="video-target"
                        />
                     </div>
                     <button 
                        onClick={() => {
                           const el = document.getElementById('video-target') as HTMLInputElement;
                           if (el && el.value) handleViralBrain(el.value);
                        }}
                        disabled={isBrainLoading}
                        className="h-16 px-10 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shrink-0"
                     >
                        {isBrainLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isBrainLoading ? "Synthesizing..." : "Forge Hooks"}
                     </button>
                  </div>

                  {generatedHooks.length > 0 && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
                     >
                        {generatedHooks.map((hook, i) => (
                           <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 group/hook relative">
                              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-4">{hook}</p>
                              <button 
                                 onClick={() => {
                                    navigator.clipboard.writeText(hook);
                                    toast.success("Hook Copied", { description: "Node response duplicated to clipboard." });
                                 }}
                                 className="text-[9px] font-black uppercase tracking-widest text-blue-500 flex items-center gap-2 hover:text-white transition-colors"
                              >
                                 <MousePointer2 className="w-3 h-3" /> Duplicate
                              </button>
                           </div>
                        ))}
                     </motion.div>
                  )}
               </div>
            </div>
         </motion.div>
      </div>

      <section className="space-y-12 mt-20 pb-12">
          <div className="flex items-center justify-between">
             <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-5 text-slate-900">
                <Flame className="w-10 h-10 text-orange-600" /> Trend Intelligence
             </h3>
             <button className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3 hover:underline">
                Explore Full Data Lake <ChevronRight className="w-4 h-4" />
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
               { trend: "#75Hard Challenge", platform: "TikTok", platformColor: "bg-slate-900 text-white border-slate-900", surge: "+120%" },
               { trend: "POV: Morning Routine", platform: "Instagram", platformColor: "bg-pink-50 text-pink-600 border-pink-100", surge: "+45%" },
               { trend: "No-Equipment HIIT", platform: "YouTube", platformColor: "bg-red-50 text-red-600 border-red-100", surge: "+88%" },
               { trend: "Wellness Travel", platform: "TikTok", platformColor: "bg-emerald-50 text-emerald-600 border-emerald-100", surge: "+240%" },
            ].map((t) => (
               <div key={t.trend} className="bg-white border border-slate-200 p-10 rounded-[3rem] hover:border-blue-400 transition-all relative overflow-hidden group shadow-sm">
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <span className={cn("px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm", t.platformColor)}>
                        {t.platform}
                     </span>
                     <div className="flex flex-col items-end">
                        <span className="text-[12px] font-black text-emerald-600">{t.surge} Surge</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Velocity</span>
                     </div>
                  </div>
                  <h4 className="font-black text-2xl mb-4 tracking-tighter leading-tight relative z-10 text-slate-900 uppercase">{t.trend}</h4>
                  <p className="text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.2em] relative z-10">Niche Fit: <span className="text-slate-900">{user?.niche}</span></p>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-500/10 active:scale-[0.98]">
                    Capitalize Now
                  </button>
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
