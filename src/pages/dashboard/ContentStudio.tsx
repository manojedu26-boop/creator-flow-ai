import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, Video, Lightbulb, Grid, Hash, 
  Music, Zap, Mail, Layout, UserCircle,
  Instagram, Youtube, Play, Check, Copy, RefreshCcw,
  Sparkles, Download, ExternalLink, ChevronRight, UploadCloud,
  ChevronDown, Eye, FileText, Share2
} from "lucide-react";
import { PageTransition, SkeletonCard } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";

type ToolType = 'caption' | 'script' | 'reel' | 'carousel' | 'hashtag' | 'audio' | 'hook' | 'pitch' | 'thumbnail' | 'bio';

const tools = [
  { id: 'caption', icon: PenTool, label: 'Caption Writer' },
  { id: 'script', icon: Video, label: 'Script Generator' },
  { id: 'reel', icon: Lightbulb, label: 'Reel & Short Ideas' },
  { id: 'carousel', icon: Grid, label: 'Carousel Builder' },
  { id: 'hashtag', icon: Hash, label: 'Hashtag Engine' },
  { id: 'audio', icon: Music, label: 'Trending Audio' },
  { id: 'hook', icon: Zap, label: 'Hook Generator' },
  { id: 'pitch', icon: Mail, label: 'Brand Pitch Writer' },
  { id: 'thumbnail', icon: Layout, label: 'Thumbnail Concept' },
  { id: 'bio', icon: UserCircle, label: 'Bio Optimizer' },
];

export const ContentStudio = () => {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolType>('caption');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [previewSocial, setPreviewSocial] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowOutput(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowOutput(true);
    }, 2500);
  };

  const renderToolContent = () => {
    switch(activeTool) {
      case 'caption': return renderCaptionWriter();
      case 'script': return renderScriptGenerator();
      case 'hook': return renderHookGenerator();
      default: return (
        <div className="flex flex-col items-center justify-center h-[500px] text-center border-2 border-dashed border-border/40 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-bold">{tools.find(t => t.id === activeTool)?.label}</h3>
          <p className="text-muted-foreground max-w-sm mt-1">This tool is being optimized by our AI. Full integration coming in Phase 3!</p>
        </div>
      );
    }
  };

  const renderCaptionWriter = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black tracking-tight">Caption Writer</h2>
           <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Powered by AI</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
           <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">What is this post about?</label>
           <textarea 
             placeholder={`e.g. My morning ${user?.niche || 'Daily'} routine with a focus on stretching...`}
             className="w-full h-32 bg-muted/10 border border-border/40 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform</label>
              <div className="flex gap-2">
                 {['IG', 'YT', 'TT'].map(p => <button key={p} className="flex-1 py-2.5 rounded-xl border border-border/40 text-[10px] font-black hover:bg-muted/30 transition-all">{p}</button>)}
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tone</label>
              <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-[10px] font-black focus:outline-none">
                 <option>Funny</option>
                 <option>Inspiring</option>
                 <option>Educational</option>
                 <option>Storytelling</option>
                 <option>Bold</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Length</label>
              <div className="flex gap-1 bg-muted/20 p-1 rounded-xl border border-border/40">
                 {['S', 'M', 'L'].map(l => <button key={l} className="flex-1 py-1 rounded-lg text-[9px] font-black hover:bg-background transition-all">{l}</button>)}
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Goal</label>
              <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-[10px] font-black focus:outline-none">
                 <option>Grow Followers</option>
                 <option>Drive Clicks</option>
                 <option>Boost Saves</option>
                 <option>Get Comments</option>
              </select>
           </div>
        </div>

        <div className="p-6 rounded-3xl border-2 border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center group hover:border-primary/40 cursor-pointer transition-colors relative overflow-hidden">
           <UploadCloud className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upload post for AI context</p>
           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_20px_-5px_hsl(var(--primary))] hover:shadow-[0_0_30px_-5px_hsl(var(--primary))] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden relative"
        >
          {isGenerating ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Captions
              <motion.div 
                className="absolute inset-x-0 h-full w-20 bg-white/20 -skew-x-12"
                animate={{ x: [-100, 1000] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
          >
             <SkeletonCard className="h-48" />
             <SkeletonCard className="h-48" />
             <SkeletonCard className="h-48" />
          </motion.div>
        )}

        {showOutput && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pt-8 border-t border-border/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Punchy & Short', text: `My ${user?.niche || 'Daily'} routine: Sweat, Stretch, Slay. 🚀` },
                  { label: 'Engaging & Medium', text: `Struggling with ${user?.niche || 'motivation'}? Here is my 10-minute ritual that changes everything. Try it tomorrow! ⬇️` },
                  { label: 'Story-Led & Long', text: `I used to skip ${user?.niche || 'basics'}. I paid the price for years. Then I discovered this flow for ${user?.name}. It is a mental reset.` },
                ].map((c, i) => (
                 <div key={i} className="premium-card bg-card border border-border/40 rounded-3xl p-6 flex flex-col justify-between group transition-all shadow-sm relative overflow-hidden">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{c.label}</span>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/40 border border-border/30 cursor-pointer hover:bg-muted transition-colors">
                              <span className="text-[9px] font-black uppercase">Tweak</span>
                              <ChevronDown className="w-3 h-3" />
                           </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium leading-relaxed mb-4">{c.text}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                         <span>Char Count: {c.text.length}</span>
                         <span className="text-emerald-500">Perfect Length</span>
                      </div>
                      <div className="flex justify-between items-center bg-muted/20 p-2 rounded-xl">
                         <div className="flex gap-1">
                            <button title="Copy" className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                            <button title="Regenerate" className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><RefreshCcw className="w-4 h-4" /></button>
                         </div>
                         <div className="h-6 w-px bg-border/40" />
                         <button 
                           onClick={() => setPreviewSocial(c.text)}
                           className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/30 text-[9px] font-black uppercase tracking-widest hover:border-primary transition-all"
                         >
                            <Eye className="w-3.5 h-3.5" /> Preview
                         </button>
                      </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="premium-card bg-card border border-border/40 rounded-3xl p-8">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black tracking-tight uppercase">Your Hashtags</h4>
                  <button className="px-4 py-2 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                     <Copy className="w-4 h-4" /> Copy All Hashtags
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: '🔴 Mega (1M+)', tags: ['#fitness', '#lifestyle', '#health', '#wellness', '#creator'] },
                    { label: '🟡 Mid (100K-1M)', tags: ['#fitnessmotivation', '#workouttips', '#dailyroutine', '#creatorforge'] },
                    { label: '🟢 Niche (<100K)', tags: ['#mumbaifit', '#deskworkout', '#morningstretch', '#fitfamindia'] },
                  ].map(h => (
                    <div key={h.label} className="space-y-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{h.label}</span>
                       <div className="flex flex-wrap gap-2">
                          {h.tags.map(t => <span key={t} className="px-3 py-1.5 bg-muted/30 border border-border/40 rounded-xl text-[10px] font-bold hover:border-primary/40 cursor-pointer transition-colors">{t}</span>)}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {previewSocial && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewSocial(null)} className="absolute inset-0 bg-background/90 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-card border border-border/40 rounded-[3rem] shadow-2xl overflow-hidden aspect-[9/19] flex flex-col">
                <div className="h-10 border-b border-border/20 flex items-center px-8 justify-between">
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-border/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-border/40" />
                   </div>
                   <div className="w-16 h-4 bg-muted/30 rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <div className="p-4 flex items-center gap-3">
                       {user?.photo ? (
                         <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-[8px]">{user?.firstName?.[0]}</div>
                       )}
                       <span className="text-xs font-black uppercase">{user?.handle}</span>
                    </div>
                   <div className="aspect-square bg-muted/30 border-y border-border/20" />
                   <div className="p-5 space-y-4">
                      <div className="flex items-center gap-4 text-muted-foreground">
                         <Play className="w-5 h-5" />
                         <RefreshCcw className="w-5 h-5" />
                         <Share2 className="w-5 h-5" />
                      </div>
                       <p className="text-[11px] leading-relaxed text-foreground font-medium">
                          <span className="font-black mr-2">{user?.handle}</span>
                          {previewSocial}
                       </p>
                   </div>
                </div>
                <button onClick={() => setPreviewSocial(null)} className="absolute top-4 right-4 p-2 bg-background/50 backdrop-blur-md rounded-full"><X className="w-4 h-4" /></button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderScriptGenerator = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-black tracking-tight">Script Generator</h2>
         <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Studio Mode</span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
         <div className="md:col-span-2 space-y-6 bg-card border border-border/40 p-8 rounded-3xl h-fit">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest">Topic or Description</label>
               <textarea placeholder="e.g. 5 steps to building a high-income skill in 2024..." className="w-full h-24 bg-muted/20 border border-border/40 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
            <div className="grid grid-cols-1 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Format</label>
                  <select className="w-full h-11 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold focus:outline-none">
                     <option>Hook Reel / Short</option>
                     <option>Long-form YT Video</option>
                     <option>TikTok Story</option>
                     <option>Educational Series</option>
                     <option>Product Review</option>
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest">Duration</label>
                     <select className="w-full h-11 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold focus:outline-none">
                        <option>30s</option>
                        <option>60s</option>
                        <option>3 min</option>
                        <option>8 min</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest">Audience</label>
                     <select className="w-full h-11 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold focus:outline-none">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                     </select>
                  </div>
               </div>
            </div>
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
            >
              {isGenerating ? "Generating..." : "Generate Script"}
            </button>
         </div>

         <div className="md:col-span-3 min-h-[500px]">
           <AnimatePresence mode="wait">
             {isGenerating && (
               <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <SkeletonCard className="h-full" />
               </motion.div>
             )}
             {showOutput ? (
               <motion.div key="output" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 h-full flex flex-col">
                  <div className="flex-1 bg-card border border-border/40 rounded-3xl p-8 relative scrollbar-thin overflow-y-auto max-h-[600px] border-l-[6px] border-l-primary/60 bg-gradient-to-br from-card to-muted/20 shadow-inner">
                     <div className="space-y-12">
                        {[
                          { act: '🎬 HOOK (0–3 sec)', text: '90% of creators fail because they focus on the wrong things. Here is what actually works.' },
                          { act: '📖 INTRO (3–15 sec)', text: 'I have spent 5 years analyzing the top 1% of earners. They all follow the same pattern.' },
                          { act: '📌 POINT 1: THE FOUNDATION', text: 'Stop looking for tricks. Master the psychology of attention first.' },
                          { act: '📌 POINT 2: SYSTEMIZATION', text: 'Build a repeatable workflow. Content is a game of consistency, not luck.' },
                          { act: '📌 POINT 3: THE COMPOUND EFFECT', text: 'Small wins lead to massive results over a 12-month horizon.' },
                          { act: '🎯 CTA', text: 'Save this post if you are ready to be in that 1%!' },
                        ].map((s, i) => (
                          <div key={i} className="group relative border-b border-border/10 pb-8 last:border-0 last:pb-0">
                             <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">{s.act}</span>
                                <button className="p-1 px-2 text-[9px] font-black uppercase text-muted-foreground hover:text-primary transition-colors border border-transparent hover:border-primary/30 rounded-lg">Rewrite Section</button>
                             </div>
                             <p className={`text-md font-medium leading-[1.8] ${s.act.includes('HOOK') ? 'text-2xl font-black leading-tight border-l-4 border-l-primary pl-6 py-2' : ''}`}>{s.text}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="py-4 bg-background border border-border/40 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all active:scale-95"><Copy className="w-4 h-4" /> Copy Full Script</button>
                     <button className="py-4 bg-background border border-border/40 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-muted transition-all active:scale-95"><FileText className="w-4 h-4" /> Export to Google Docs</button>
                  </div>
               </motion.div>
             ) : !isGenerating && (
               <div key="placeholder" className="h-full border-2 border-dashed border-border/40 rounded-3xl flex flex-col items-center justify-center text-center p-12 text-muted-foreground/50">
                  <Video className="w-12 h-12 mb-4 opacity-10" />
                  <p className="text-sm font-bold uppercase tracking-widest">Your script will appear here</p>
               </div>
             )}
           </AnimatePresence>
         </div>
      </div>
    </div>
  );

  const renderHookGenerator = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight">Hook Generator</h2>
      <div className="max-w-3xl mx-auto space-y-8">
         <div className="flex gap-4 bg-card border border-border/40 p-4 rounded-3xl shadow-xl">
            <input placeholder="Enter post topic (e.g. Productivity Hacks for ADHD)..." className="flex-1 h-14 bg-transparent border-none px-4 text-sm focus:outline-none" />
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="px-8 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
            >
              {isGenerating ? "Analyzing..." : "Generate 10 Hooks"}
            </button>
         </div>

         <AnimatePresence mode="wait">
         {isGenerating && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-4">
              <SkeletonCard className="h-24" />
              <SkeletonCard className="h-24" />
              <SkeletonCard className="h-24" />
           </motion.div>
         )}
         {showOutput && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4">
              {[
                { type: '🔥 Shocking Stat', text: '92% of creators fail because they skip this one morning ritual.' },
                { type: '🧐 Controversial Opinion', text: 'Coffee is actually killing your productivity. Here is why.' },
                { type: '😩 Relatable Problem', text: 'Ever feel like you are working all day but getting nothing done?' },
                { type: '📖 Story Opener', text: 'I lost $10,000 in one week. Here is what I learned.' },
                { type: '🚀 Bold Claim', text: 'You can build a $100K business with 0 followers. Let me show you.' },
                { type: '❓ Question', text: 'What if you could work half the time and earn double the income?' },
                { type: '🏆 Challenge', text: 'I bet you can not name 3 people who actually enjoy being busy.' },
              ].map((h, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="premium-card bg-card border border-border/40 p-6 rounded-3xl flex items-center justify-between group transition-colors cursor-pointer relative overflow-hidden"
                >
                   <div className="flex flex-col gap-1.5 flex-1 pr-8">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{h.type}</span>
                      <p className="text-md font-bold leading-tight">{h.text}</p>
                   </div>
                   <button className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-90"><Copy className="w-4 h-4" /></button>
                </motion.div>
              ))}
           </motion.div>
         )}
         </AnimatePresence>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="h-[calc(100vh-160px)] -mx-8 -my-6 flex overflow-hidden">
        {/* LEFT TOOL PANEL */}
        <div className="w-[280px] border-r border-border/30 bg-card/10 overflow-y-auto overflow-x-hidden pt-6 relative shadow-2xl z-[150]">
          <div className="px-6 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
             <Zap className="w-3 h-3 text-primary fill-primary" /> AI Content Suite
          </div>
          <div className="px-3 space-y-1">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id as ToolType);
                  setShowOutput(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${
                  activeTool === tool.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                }`}
              >
                <tool.icon className={`w-4 h-4 ${activeTool === tool.id ? 'text-primary' : 'group-hover:text-primary'}`} />
                <span className="text-[11px] font-black uppercase tracking-wide truncate">{tool.label}</span>
                {activeTool === tool.id && (
                  <motion.div 
                    layoutId="toolHighlight"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-border/40 to-transparent" />
        </div>

        {/* RIGHT WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-12 relative bg-background scroll-smooth no-scrollbar">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderToolContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Required missing X icon component
const X = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

