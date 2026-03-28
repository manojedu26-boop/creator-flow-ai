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
import { PageTransition } from "../../components/shared/MotionComponents";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="mb-[var(--section-mb)]">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
          <Layout className="w-3 h-3" />
          Brand Identity
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
           Media Kit<br/>
           <span className="text-primary italic">Architect</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT — MEDIA KIT EDITOR */}
        <div className="lg:col-span-4 bg-black/20 border-r lg:border-border/30 rounded-[2.5rem] p-6 lg:p-10 space-y-12">
           <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                 <Sparkles className="w-5 h-5 text-primary" /> Visual Identity
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
               <AutoResizeTextarea 
                 rows={4}
                 defaultValue="I'm a Mumbai-based storyteller focusing on high-end tech lifestyle and wellness travel. My mission is to bridge the gap between human experience and digital aesthetics."
                 className="w-full bg-muted/20 border border-border/40 rounded-[1.5rem] p-6 text-sm font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                 maxLength={300}
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

      {/* FLOATING PREVIEW BUTTON (MOBILE) */}
      {isMobile && (
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 h-14 px-8 bg-primary text-white rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_20px_40px_-10px_rgba(255,60,172,0.5)] z-[100] hover:scale-105 active:scale-95 transition-all"
        >
           <Eye className="w-4 h-4" /> Preview Media Kit
        </button>
      )}

      {/* RIGHT — LIVE PREVIEW (DESKTOP) & BOTTOM SHEET (MOBILE) */}
      {isMobile ? (
        <BottomSheet isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} height="90vh" title="Live Preview">
          <div className="bg-muted/10 p-4 md:p-8 h-full overflow-y-auto no-scrollbar pb-safe-offset">
             {/* THE A4 MOCKUP */}
             <div className={`aspect-[1/1.414] w-full max-w-lg mx-auto shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-700 ${
               activeTemplate === 'bold-dark' ? 'bg-zinc-950 text-white' : 
               activeTemplate === 'clean-light' ? 'bg-white text-zinc-900' : 
               activeTemplate === 'pastel' ? 'bg-rose-50 text-rose-950' : 
               activeTemplate === 'neon' ? 'bg-indigo-950 text-indigo-100' : 
               'bg-black text-white'
             }`}>
                <div className="h-full flex flex-col p-8 md:p-12 space-y-8">
                   {/* PREVIEW HEADER */}
                   <div className="flex justify-between items-start">
                      <div className="space-y-3">
                         {user?.photo ? (
                           <img src={user.photo} alt={user.name} className="w-16 h-16 rounded-2xl object-cover" />
                         ) : (
                           <div className="w-16 h-16 bg-primary rounded-2xl" />
                         )}
                         <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">{user?.name || "Jack Dorsey"}</h1>
                         <p className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-60 ${activeTemplate.includes('neon') ? 'text-indigo-400' : 'text-primary'}`}>{user?.niche || "Tech & Wellness"} Creator</p>
                      </div>
                   </div>

                   {/* PREVIEW BIO */}
                   {sections.about && (
                     <div className="space-y-3 border-l-2 border-primary/40 pl-5">
                        <h2 className="text-lg font-black uppercase tracking-tight">The Vision</h2>
                        <p className="text-xs opacity-80 font-medium leading-[1.8]">
                           Building a bridge between human movement and high-fidelity technology. Focused on storytelling that resonates and builds high-quality community trust.
                        </p>
                     </div>
                   )}

                   {/* PREVIEW STATS */}
                   {sections.stats && (
                     <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Followers', val: user?.followerCounts["Instagram"] || '124K+', pf: 'Instagram' },
                          { label: 'Subscribers', val: user?.followerCounts["YouTube"] || '85K+', pf: 'YouTube' },
                          { label: 'Engagement', val: '4.8%', pf: 'Combined' },
                        ].map(s => (
                          <div key={s.label} className="space-y-1">
                             <p className="text-[8px] font-black uppercase tracking-widest opacity-40">{s.label}</p>
                             <h3 className="text-xl md:text-2xl font-black tracking-tight">{s.val}</h3>
                             <p className="text-[8px] font-bold text-primary uppercase">{s.pf}</p>
                          </div>
                        ))}
                     </div>
                   )}

                   {/* PREVIEW BRANDS */}
                   {sections.brands && (
                     <div className="space-y-3">
                        <h4 className="text-[8px] font-black uppercase tracking-widest opacity-40">Previous Partners</h4>
                        <div className="flex flex-wrap gap-4 items-center opacity-40 font-black">
                           <span>NIKE</span><span>ADOBE</span><span>SAMSUNG</span>
                        </div>
                     </div>
                   )}

                   {/* PREVIEW FOOTER */}
                   <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2 opacity-50">
                      <p className="text-[8px] font-black uppercase tracking-widest">CreatorForge AI Kit</p>
                   </div>
                </div>
             </div>
             
             <div className="flex gap-4 mt-8 px-4">
                <button className="flex-1 h-12 rounded-xl border border-border/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all">
                   <Link2 className="w-4 h-4" /> Share
                </button>
                <button className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all">
                   <Download className="w-4 h-4" /> Download
                </button>
             </div>
          </div>
        </BottomSheet>
      ) : (
        <div className="lg:col-span-8 bg-muted/10 rounded-[2.5rem] border border-white/5 p-6 md:p-12 overflow-hidden hidden lg:block">
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
      )}
      </div>
    </PageTransition>
  );
};
