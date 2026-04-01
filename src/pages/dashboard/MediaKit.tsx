import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Layout, BarChart, Users, Star, 
  Mail, Download, Link2, Sparkles, Plus, 
  ChevronRight, Eye, RefreshCcw, Check, 
  Image as ImageIcon, MoreHorizontal,
  Instagram, Youtube, ToggleLeft, Trash2
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { PageTransition } from "../../components/shared/MotionComponents";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";
import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import { toast } from "../../components/ui/sonner";

type Template = 'bold-dark' | 'clean-light' | 'pastel' | 'neon' | 'luxury';

export const MediaKit = () => {
  const { user } = useAuth();
  const [activeTemplate, setActiveTemplate] = useState<Template>('clean-light');
  const [sections, setSections] = useState({
    about: true,
    stats: true,
    audience: true,
    brands: true,
    rates: true,
    contact: true
  });
  const [headline, setHeadline] = useState("Elevating Brand Stories Through Cinematic Visuals");
  const [bio, setBio] = useState("I'm a Mumbai-based storyteller focusing on high-end tech lifestyle and wellness travel. My mission is to bridge the gap between human experience and digital aesthetics.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [autoUpdateStats, setAutoUpdateStats] = useState(true);

  useEffect(() => {
    if (autoUpdateStats) {
      const interval = setInterval(() => {
        // toast.info("Stats Auto-Synced", { description: "Latest metrics pulled from Instagram/YouTube API." });
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [autoUpdateStats]);

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

  const handlePortfolioUpload = () => {
    if (isUploading) return;
    setIsUploading(true);
    let p = 0;
    const iv = setInterval(() => {
      p += 10;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        setIsUploading(false);
        setUploadProgress(0);
        const newImg = `https://picsum.photos/seed/${Math.random()}/400/400`;
        setPortfolioImages(prev => [...prev, newImg].slice(0, 6));
        toast.success("Image added to portfolio!");
      }
    }, 150);
  };

  const handleDownloadPDF = () => {
    toast.info("Generating your Media Kit PDF...");
    const doc = new jsPDF();
    
    // Header & Brand
    doc.setFontSize(26);
    doc.setTextColor(255, 60, 172); // Primary Pink
    doc.setFont("helvetica", "bold");
    doc.text("CREATORFORGE", 14, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("OFFICIAL MEDIA KIT", 196, 25, { align: "right" });
    
    // User Profile
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text((user?.name || "CREATOR").toUpperCase(), 14, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(255, 60, 172);
    doc.text((user?.niche || "Lifestyle") + " Creator", 14, 52);
    
    // Headline
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.setFont("helvetica", "bold");
    doc.text("The Vision", 14, 70);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(headline, 14, 78, { maxWidth: 180 });
    
    // Bio
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.setFont("helvetica", "bold");
    doc.text("About Me", 14, 95);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(bio, 14, 103, { maxWidth: 180 });
    
    // Statistics Header
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 130, 182, 40, "F");
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Key Social Statistics", 20, 145);
    
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("INSTAGRAM", 20, 155);
    doc.text("YOUTUBE", 80, 155);
    doc.text("ENGAGEMENT", 140, 155);
    
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(user?.followerCounts["Instagram"] || "124K", 20, 165);
    doc.text(user?.followerCounts["YouTube"] || "85K", 80, 165);
    doc.text("4.8%", 140, 165);
    
    // Brand Portfolio
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Previous Brand Partners", 14, 190);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Nike, Adobe, Samsung, GoPro, Myprotein", 14, 200);
    
    // Contact
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Get In Touch", 14, 220);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Email: ${user?.email}`, 14, 230);
    doc.text(`Website: ${user?.firstName?.toLowerCase()}.live`, 14, 237);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    const footerY = 280;
    doc.text("Verified by CreatorForge Engine • Official Creator Document", 14, footerY);
    doc.text("Mar 2026 Edition", 196, footerY, { align: "right" });
    
    doc.save(`${user?.firstName}_MediaKit_2026.pdf`);
    toast.success("Media Kit Exported ✓");
  };

  const templateStyles = {
    'bold-dark': {
      bg: 'bg-zinc-950',
      text: 'text-white',
      accent: 'text-primary',
      border: 'border-white/10',
      muted: 'text-zinc-500'
    },
    'clean-light': {
      bg: 'bg-white',
      text: 'text-zinc-900',
      accent: 'text-primary',
      border: 'border-zinc-200',
      muted: 'text-zinc-400'
    },
    'pastel': {
      bg: 'bg-[#FFF5F5]',
      text: 'text-[#4A2C2C]',
      accent: 'text-rose-500',
      border: 'border-rose-100',
      muted: 'text-rose-300'
    },
    'neon': {
      bg: 'bg-[#0A001F]',
      text: 'text-[#E0D7FF]',
      accent: 'text-indigo-400',
      border: 'border-indigo-500/20',
      muted: 'text-indigo-800'
    },
    'luxury': {
      bg: 'bg-black',
      text: 'text-white',
      accent: 'text-[#D4AF37]', // Gold
      border: 'border-[#D4AF37]/20',
      muted: 'text-zinc-800'
    }
  };

  const style = templateStyles[activeTemplate];

  return (
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="mb-10">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
          <Layout className="w-3.5 h-3.5" />
          Brand Positioning
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
           Media Kit<br/>
           <span className="text-blue-600 italic">Architect</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT — MEDIA KIT EDITOR */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-[3rem] p-8 lg:p-10 space-y-12 shadow-sm">
           <div className="space-y-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic flex items-center gap-4">
                 <Sparkles className="w-6 h-6 text-blue-600" /> Identity Logic
              </h2>
            <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Core Visual Preset</span>
               <div className="flex flex-wrap gap-2">
                  {templates.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setActiveTemplate(t.id as Template)}
                      className={cn(
                        "flex-1 py-4 px-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all",
                        activeTemplate === t.id ? "bg-slate-900 text-white border-slate-900 shadow-xl" : "bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"
                      )}
                    >
                       {t.label}
                    </button>
                  ))}
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center justify-between">
               <span>Data Stream Control</span>
               <button className="text-[10px] text-blue-600 hover:underline">Reset Factory</button>
            </h4>
            <div className="grid grid-cols-2 gap-4">
               {Object.entries(sections).map(([key, val]) => (
                 <button 
                  key={key} 
                  onClick={() => toggleSection(key as keyof typeof sections)}
                  className={cn(
                    "p-6 rounded-[2rem] border flex flex-col gap-4 transition-all shadow-inner",
                    val ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100 opacity-60 grayscale"
                  )}
                 >
                    <div className="flex justify-between items-center w-full">
                       <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", val ? "text-blue-600" : "text-slate-400")}>{key}</span>
                       <div className={cn("w-10 h-5 rounded-full relative transition-all", val ? "bg-blue-600" : "bg-slate-300")}>
                          <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm", val ? "right-1" : "left-1")} />
                       </div>
                    </div>
                 </button>
               ))}
            </div>
         </div>

         <div className="space-y-10">
            <div className="space-y-5">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Headline Hook</label>
                  <button 
                    onClick={() => {
                      toast.promise(new Promise(res => setTimeout(() => res("Viral Storytelling: Where Tech Meets Human Soul"), 1500)), {
                        loading: 'AI Writing Headline...',
                        success: (data: any) => { setHeadline(data); return "New headline generated!"; },
                        error: 'Generation failed.'
                      });
                    }}
                    className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase tracking-[0.2em] hover:underline"
                  >
                     <Sparkles className="w-3.5 h-3.5" /> AI Write
                  </button>
               </div>
               <input 
                 value={headline}
                 onChange={(e) => setHeadline(e.target.value)}
                 className="w-full h-16 bg-slate-50 border border-slate-100 rounded-2xl px-8 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
               />
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest">About Me Bio</label>
                  <button 
                    onClick={() => {
                      toast.promise(new Promise(res => setTimeout(() => res("As a dedicated creator in the " + (user?.niche || 'lifestyle') + " space, I specialize in high-fidelity visuals and authentic storytelling. My goal is to create content that doesn't just scroll by, but sticks with the audience."), 2000)), {
                        loading: 'AI Polishing Bio...',
                        success: (data: any) => { setBio(data); return "Bio optimized for brands!"; },
                        error: 'Generation failed.'
                      });
                    }}
                    className="text-[9px] font-black text-primary flex items-center gap-1.5 uppercase tracking-widest hover:underline"
                  >
                     <Sparkles className="w-3 h-3" /> AI Polish
                  </button>
               </div>
               <AutoResizeTextarea 
                 rows={4}
                 value={bio}
                 onChange={(e: any) => setBio(e.target.value)}
                 className="w-full bg-muted/20 border border-border/40 rounded-[1.5rem] p-6 text-sm font-medium leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                 maxLength={400}
               />
            </div>

          <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest">Portfolio Images</label>
                  <button className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{portfolioImages.length} / 6 Selected</button>
               </div>
               <div className="grid grid-cols-3 gap-2">
                  {portfolioImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/10 group relative">
                       <img src={img} className="w-full h-full object-cover" />
                       <button 
                        onClick={() => setPortfolioImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                       >
                          <Trash2 className="w-4 h-4 text-white" />
                       </button>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 5 - portfolioImages.length) }).map((_, i) => (
                    <div key={i} className="aspect-square bg-muted/10 border-2 border-dashed border-border/40 rounded-2xl flex items-center justify-center opacity-40">
                       <Plus className="w-4 h-4" />
                    </div>
                  ))}
                  {portfolioImages.length < 6 && (
                    <div 
                      onClick={() => handlePortfolioUpload()}
                      className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${
                        isUploading ? 'bg-primary/10 border-primary' : 'bg-primary/5 border-primary/30 hover:bg-primary/10'
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <RefreshCcw className="w-5 h-5 text-primary animate-spin mb-1" />
                          <span className="text-[8px] font-black text-primary">{uploadProgress}%</span>
                          <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-primary" />
                          <span className="text-[8px] font-black text-primary mt-1 uppercase">Add</span>
                        </>
                      )}
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="pt-10 space-y-6">
            <button className="w-full py-6 bg-slate-900 border border-slate-800 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]">
               <RefreshCcw className="w-4 h-4 text-blue-400" /> Finalize & Synchronize
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
             
             <div className="flex gap-4 mt-8 px-4 pb-8">
                <button 
                  onClick={() => {
                    const url = window.location.href + "/shared/" + user?.firstName?.toLowerCase();
                    navigator.clipboard.writeText(url);
                    toast.success("Share link copied to clipboard!", { description: "You can now send this to any brand." });
                  }}
                  className="flex-1 h-12 rounded-xl border border-zinc-700 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all"
                >
                   <Link2 className="w-4 h-4" /> Share
                </button>
                <button 
                  onClick={() => handleDownloadPDF()}
                  className="flex-1 h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                >
                   <Download className="w-4 h-4" /> Download
                </button>
             </div>
          </div>
        </BottomSheet>
      ) : (
        <div className="lg:col-span-8 bg-slate-50 rounded-[3rem] border border-slate-200 p-10 md:p-12 overflow-hidden hidden lg:block shadow-inner">
           <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex items-center justify-between px-8 bg-white py-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                     <Eye className="w-5 h-5 text-emerald-600" />
                     <span className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">Real-time rendering</span>
                  </div>
                   <div 
                    onClick={() => setAutoUpdateStats(!autoUpdateStats)}
                    className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 cursor-pointer hover:border-blue-200 transition-all shadow-inner"
                   >
                      <div className={cn("w-10 h-5 rounded-full relative transition-all", autoUpdateStats ? "bg-emerald-600" : "bg-slate-300")}>
                         <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm", autoUpdateStats ? "right-1" : "left-1")} />
                      </div>
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Auto-Sync</span>
                   </div>
               </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                        const url = window.location.origin + "/media-kit/" + (user?.firstName?.toLowerCase() || 'creator');
                        navigator.clipboard.writeText(url);
                        toast.success("Live Link Copied!", { description: url });
                    }}
                    className="h-12 px-6 rounded-2xl border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-slate-50 transition-all"
                  >
                     <Link2 className="w-4 h-4" /> Share Link
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF()}
                    className="h-12 px-8 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                     <Download className="w-4 h-4" /> Export PDF
                  </button>
               </div>
            </div>

            {/* THE A4 MOCKUP */}
            <div className={`aspect-[1/1.414] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden transition-all duration-700 ${style.bg} ${style.text}`}>
               <div className="h-full flex flex-col p-16 space-y-12">
                  {/* PREVIEW HEADER */}
                  <div className="flex justify-between items-start">
                     <div className="space-y-4">
                        {user?.photo ? (
                          <img src={user.photo} alt={user.name} className="w-20 h-20 rounded-3xl object-cover" />
                        ) : (
                          <div className={`w-20 h-20 ${style.border} bg-muted rounded-3xl`} />
                        )}
                        <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{user?.name || "Jack Dorsey"}</h1>
                        <p className={`text-xs font-black uppercase tracking-[0.3em] opacity-60 ${style.accent}`}>{user?.niche || "Tech & Wellness"} Creator</p>
                     </div>
                     <div className="flex gap-4">
                        <Instagram className={`w-5 h-5 ${style.muted}`} />
                        <Youtube className={`w-5 h-5 ${style.muted}`} />
                        <Link2 className={`w-5 h-5 ${style.muted}`} />
                     </div>
                  </div>

                  {/* PREVIEW BIO */}
                  {sections.about && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-4 border-l-2 ${style.border} pl-8`}>
                       <h2 className="text-2xl font-black uppercase tracking-tight">The Vision</h2>
                       <p className="text-md opacity-80 font-medium leading-[1.8] max-w-xl">
                          {headline} — {bio}
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
                            <p className={`text-[10px] font-black uppercase tracking-widest ${style.muted} opacity-40`}>{s.label}</p>
                            <h3 className="text-3xl font-black tracking-tight">{s.val}</h3>
                            <p className={`text-[10px] font-bold ${style.accent} uppercase`}>{s.pf}</p>
                         </div>
                       ))}
                    </div>
                  )}

                  {/* PREVIEW BRANDS */}
                  {sections.brands && (
                    <div className="space-y-4">
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${style.muted} opacity-40`}>Previous Partners</h4>
                       <div className={`flex gap-8 items-center ${style.muted} opacity-40 font-black grayscale`}>
                          <span className="text-xl">NIKE</span>
                          <span className="text-xl">ADOBE</span>
                          <span className="text-xl">SAMSUNG</span>
                          <span className="text-xl">GOPRO</span>
                       </div>
                    </div>
                  )}

                  {/* PREVIEW FOOTER */}
                  <div className={`mt-auto pt-10 border-t ${style.border} flex justify-between items-center opacity-40`}>
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
