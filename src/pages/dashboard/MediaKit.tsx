import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Layout, BarChart, Users, Star, 
  Mail, Download, Link2, Sparkles, Plus, 
  ChevronRight, Eye, RefreshCcw, Check, 
  Image as ImageIcon, MoreHorizontal,
  Instagram, Youtube, ToggleLeft
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type Template = 'bold-dark' | 'clean-light' | 'pastel' | 'neon' | 'luxury';

export const MediaKit = () => {
  const { user } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState<Template>('bold-dark');
  const [sections, setSections] = useState({
    about: true,
    stats: true,
    audience: true,
    brands: true,
    rates: true,
    contact: true
  });

  const templates = [
    { id: 'bold-dark', label: 'Bold Dark', color: 'bg-zinc-900 border-zinc-800' },
    { id: 'clean-light', label: 'Clean Light', color: 'bg-white border-zinc-200' },
    { id: 'pastel', label: 'Pastel Minimal', color: 'bg-rose-50 border-rose-100' },
    { id: 'neon', label: 'Neon Creator', color: 'bg-indigo-950 border-indigo-900' },
    { id: 'luxury', label: 'Luxury Black', color: 'bg-black border-zinc-900' },
  ];

  const toggleSection = (id: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -mx-8 -my-6 overflow-hidden">
      {/* LEFT — MEDIA KIT EDITOR */}
      <div className="w-[450px] border-r border-border/30 bg-card/10 overflow-y-auto p-10 space-y-12 no-scrollbar">
         <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
               <Layout className="w-6 h-6 text-primary" /> Media Kit Editor
            </h2>
            <div className="p-6 bg-muted/10 border border-border/40 rounded-[2rem] space-y-4">
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Template</span>
               <div className="flex flex-wrap gap-2">
                  {templates.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setActiveTemplate(t.id as Template)}
                      className={`flex-1 py-3 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        activeTemplate === t.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-background border-border/40 hover:border-primary/40'
                      }`}
                    >
                       {t.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
               <span>Sections Control</span>
               <button className="text-[10px] text-primary hover:underline">Reset All</button>
            </h4>
            <div className="grid grid-cols-2 gap-3">
               {Object.entries(sections).map(([key, val]) => (
                 <button 
                  key={key} 
                  onClick={() => toggleSection(key as keyof typeof sections)}
                  className={`p-4 rounded-3xl border flex flex-col gap-3 transition-all ${
                    val ? 'bg-primary/5 border-primary/30' : 'bg-muted/10 border-border/40 opacity-50 grayscale'
                  }`}
                 >
                    <div className="flex justify-between items-center w-full">
                       <span className="text-[10px] font-black uppercase tracking-widest">{key}</span>
                       <div className={`w-8 h-4 rounded-full relative transition-all ${val ? 'bg-primary' : 'bg-muted'}`}>
                          <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${val ? 'right-1' : 'left-1'}`} />
                       </div>
                    </div>
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest">Headline / Hook</label>
                  <button className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-widest hover:underline">
                     <Sparkles className="w-3 h-3" /> AI Write
                  </button>
               </div>
               <input 
                 defaultValue="Elevating Brand Stories Through Cinematic Visuals" 
                 className="w-full h-14 bg-muted/20 border border-border/40 rounded-2xl px-6 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary"
               />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest">About Me Bio</label>
                  <button className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-widest hover:underline">
                     <Sparkles className="w-3 h-3" /> AI Polish
                  </button>
               </div>
               <textarea 
                 rows={4}
                 defaultValue="I'm a Mumbai-based storyteller focusing on high-end tech lifestyle and wellness travel. My mission is to bridge the gap between human experience and digital aesthetics."
                 className="w-full bg-muted/20 border border-border/40 rounded-[1.5rem] p-6 text-sm font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
               />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest">Portfolio Images</label>
                  <button className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Select 6 Photos</button>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="aspect-square bg-muted/10 border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center hover:bg-muted/20 transition-all cursor-pointer">
                       <Plus className="w-4 h-4 opacity-40" />
                    </div>
                  ))}
                  <div className="aspect-square bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                  </div>
               </div>
            </div>
         </div>

         <div className="pt-10 space-y-4">
            <button className="w-full py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
               <RefreshCcw className="w-4 h-4" /> Save & Sync All Data
            </button>
         </div>
      </div>

      {/* RIGHT — LIVE PREVIEW */}
      <div className="flex-1 overflow-y-auto bg-muted/10 p-12 no-scrollbar scroll-smooth">
         <div className="max-w-4xl mx-auto space-y-10">
            <div className="flex items-center justify-between px-4">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Eye className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-black uppercase text-emerald-500">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted/20 px-3 py-1.5 rounded-full border border-border/40">
                     <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                     <span className="text-[9px] font-black uppercase text-muted-foreground">Auto-Update Stats</span>
                  </div>
               </div>
               <div className="flex gap-4">
                  <button className="h-11 px-6 rounded-xl border border-border/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-muted transition-all">
                     <Link2 className="w-4 h-4" /> Share Link
                  </button>
                  <button className="h-11 px-8 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-95">
                     <Download className="w-4 h-4" /> Download PDF
                  </button>
               </div>
            </div>

            {/* THE A4 MOCKUP */}
            <div className={`aspect-[1/1.414] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden transition-all duration-700 ${
              activeTemplate === 'bold-dark' ? 'bg-zinc-950 text-white' : 
              activeTemplate === 'clean-light' ? 'bg-white text-zinc-900' : 
              activeTemplate === 'pastel' ? 'bg-rose-50 text-rose-950' : 
              activeTemplate === 'neon' ? 'bg-indigo-950 text-indigo-100' : 
              'bg-black text-white'
            }`}>
               <div className="h-full flex flex-col p-16 space-y-12">
                  {/* PREVIEW HEADER */}
                  <div className="flex justify-between items-start">
                     <div className="space-y-4">
                        {user?.photo ? (
                          <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-3xl object-cover" />
                        ) : (
                          <div className="w-20 h-20 bg-primary rounded-3xl" />
                        )}
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{user?.name || "Jack Dorsey"}</h1>
                        <p className={`text-xs font-black uppercase tracking-[0.3em] opacity-60 ${activeTemplate.includes('neon') ? 'text-indigo-400' : 'text-primary'}`}>{user?.niche || "Tech & Wellness"} Creator</p>
                     </div>
                     <div className="flex gap-4">
                        <Instagram className="w-5 h-5 opacity-40" />
                        <Youtube className="w-5 h-5 opacity-40" />
                        <Link2 className="w-5 h-5 opacity-40" />
                     </div>
                  </div>

                  {/* PREVIEW BIO */}
                  {sections.about && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 border-l-2 border-primary/40 pl-8">
                       <h2 className="text-2xl font-black uppercase tracking-tight">The Vision</h2>
                       <p className="text-md opacity-80 font-medium leading-[1.8] max-w-xl">
                          Building a bridge between human movement and high-fidelity technology. Focused on storytelling that resonates and builds high-quality community trust.
                       </p>
                    </motion.div>
                  )}

                  {/* PREVIEW STATS */}
                  {sections.stats && (
                    <div className="grid grid-cols-3 gap-8">
                       {[
                         { label: 'Followers', val: user?.followerCounts["Instagram"] || '124K+', pf: 'Instagram' },
                         { label: 'Subscribers', val: user?.followerCounts["YouTube"] || '85K+', pf: 'YouTube' },
                         { label: 'Engagement', val: '4.8%', pf: 'Combined' },
                       ].map(s => (
                         <div key={s.label} className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{s.label}</p>
                            <h3 className="text-3xl font-black tracking-tight">{s.val}</h3>
                            <p className="text-[10px] font-bold text-primary uppercase">{s.pf}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* PREVIEW BRANDS */}
                  {sections.brands && (
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Previous Partners</h4>
                       <div className="flex gap-8 items-center opacity-40 font-black">
                          <span className="text-xl">NIKE</span>
                          <span className="text-xl">ADOBE</span>
                          <span className="text-xl">SAMSUNG</span>
                          <span className="text-xl">GOPRO</span>
                       </div>
                    </div>
                  )}

                  {/* PREVIEW FOOTER */}
                  <div className="mt-auto pt-10 border-t border-white/10 flex justify-between items-center opacity-40">
                     <p className="text-[10px] font-black uppercase tracking-widest">Generated via CreatorForge AI</p>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase">Verified Stats: Mar 2026</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
