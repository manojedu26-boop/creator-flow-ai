import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, Video, Lightbulb, Grid, Hash, 
  Music, Zap, Mail, Layout, UserCircle,
  Instagram, Youtube, Play, Check, Copy, RefreshCcw,
  Sparkles, Download, ExternalLink, ChevronRight, UploadCloud
} from "lucide-react";

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
  const [activeTool, setActiveTool] = useState<ToolType>('caption');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowOutput(true);
    }, 2000);
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
             placeholder="e.g. My morning workout routine with a focus on stretching and dynamic movements..."
             className="w-full h-32 bg-muted/10 border border-border/40 rounded-3xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
           />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform</label>
              <div className="flex gap-2">
                 {['IG', 'YT', 'TT'].map(p => <button key={p} className="flex-1 py-2.5 rounded-xl border border-border/40 text-xs font-bold hover:bg-muted/30 transition-all">{p}</button>)}
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tone</label>
              <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold focus:outline-none">
                 <option>Funny</option>
                 <option>Inspiring</option>
                 <option>Educational</option>
                 <option>Storytelling</option>
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Goal</label>
              <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold focus:outline-none">
                 <option>Grow Followers</option>
                 <option>Link Clicks</option>
                 <option>Boost Engagement</option>
              </select>
           </div>
        </div>

        <div className="p-6 rounded-3xl border-2 border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center group hover:border-primary/40 cursor-pointer transition-colors">
           <UploadCloud className="w-8 h-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
           <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upload post for AI context</p>
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

      <AnimatePresence>
        {showOutput && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pt-8 border-t border-border/30"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Punchy & Short', text: 'My morning routine: Sweat, Stretch, Slay. 🚀' },
                 { label: 'Engaging & Medium', text: 'Struggling to wake up? Here is my 10-minute movement ritual that changes everything. Try it tomorrow! ⬇️' },
                 { label: 'Story-Led & Long', text: 'I used to skip mobility. I paid the price with back pain for years. Then I discovered this flow. It is not just about physical health, it is a mental reset.' },
               ].map((c, i) => (
                 <div key={i} className="bg-card border border-border/40 rounded-3xl p-6 flex flex-col justify-between group hover:border-primary/40 transition-all shadow-sm">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-3 block">{c.label}</span>
                      <p className="text-sm font-medium leading-relaxed">{c.text}</p>
                    </div>
                    <div className="mt-8 flex justify-between items-center bg-muted/20 p-2 rounded-xl">
                       <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><Copy className="w-4 h-4" /></button>
                       <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors"><RefreshCcw className="w-4 h-4" /></button>
                       <div className="h-6 w-px bg-border/40" />
                       <span className="text-[9px] font-bold text-muted-foreground uppercase px-2">IG Preview</span>
                    </div>
                 </div>
               ))}
            </div>

            <div className="bg-card border border-border/40 rounded-3xl p-8">
               <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-black tracking-tight uppercase">Your Hashtags</h4>
                  <button className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <Copy className="w-4 h-4" /> Copy All
                  </button>
               </div>
               <div className="space-y-4">
                  {[
                    { label: 'Mega (1M+)', tags: ['#fitness', '#lifestyle', '#health'] },
                    { label: 'Mid (100K-1M)', tags: ['#fitnessmotivation', '#workouttips', '#dailyroutine'] },
                    { label: 'Niche (<100K)', tags: ['#mumbaifit', '#deskworkout', '#morningstretch'] },
                  ].map(h => (
                    <div key={h.label} className="flex gap-4 items-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-28 shrink-0">{h.label}</span>
                       <div className="flex flex-wrap gap-2">
                          {h.tags.map(t => <span key={t} className="px-3 py-1 bg-muted/30 border border-border/40 rounded-full text-[10px] font-bold">{t}</span>)}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderScriptGenerator = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight">Script Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-6 bg-card border border-border/40 p-8 rounded-3xl h-fit">
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest">Script Topic</label>
               <input placeholder="Enter video topic..." className="w-full h-12 bg-muted/20 border border-border/40 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Format</label>
                  <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold">
                     <option>Hook Reel</option>
                     <option>YT Long-form</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest">Duration</label>
                  <select className="w-full h-10 px-4 bg-muted/20 border border-border/40 rounded-xl text-xs font-bold">
                     <option>15s</option>
                     <option>30s</option>
                     <option>60s</option>
                  </select>
               </div>
            </div>
            <button onClick={handleGenerate} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest">Generate Script</button>
         </div>

         {showOutput && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="bg-card border border-border/40 rounded-3xl p-8 relative scrollbar-thin overflow-y-auto max-h-[600px] border-l-4 border-l-primary/40">
                 <div className="space-y-8">
                    {[
                      { act: '🎬 HOOK (0–3 sec)', text: 'Stop wasting your mornings. This 5-minute hack will 2X your focus.' },
                      { act: '📖 INTRO (3–15 sec)', text: 'We have all been there. Waking up feeling groggy, reaching for the phone. Today, we change that.' },
                      { act: '📌 POINT 1', text: 'Leave your phone in the other room. Use a physical alarm.' },
                      { act: '📌 POINT 2', text: 'Drink 500ml of water before coffee.' },
                      { act: '🎯 CTA', text: 'Share this with a friend who is always late!' },
                    ].map((s, i) => (
                      <div key={i} className="group relative">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2">{s.act}</span>
                         <p className={`text-sm font-medium leading-relaxed ${s.act.includes('HOOK') ? 'text-lg font-black' : ''}`}>{s.text}</p>
                         <button className="absolute -right-2 top-2 p-1.5 opacity-0 group-hover:opacity-100 bg-muted border border-border/40 rounded-lg transition-all"><RefreshCcw className="w-3 h-3" /></button>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="flex gap-3">
                 <button className="flex-1 py-3 border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Copy className="w-4 h-4" /> Copy Full</button>
                 <button className="flex-1 py-3 border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Export</button>
              </div>
           </motion.div>
         )}
      </div>
    </div>
  );

  const renderHookGenerator = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-black tracking-tight">Hook Generator</h2>
      <div className="max-w-3xl mx-auto space-y-6">
         <div className="flex gap-4">
            <input placeholder="Enter post topic for hooks..." className="flex-1 h-14 bg-muted/20 border border-border/40 rounded-3xl px-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
            <button onClick={handleGenerate} className="px-8 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-widest">Generate 10 Hooks</button>
         </div>

         {showOutput && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4">
              {[
                { type: 'Shocking Stat', text: 'Did you know 92% of creators fail in their first month?' },
                { type: 'Bold Claim', text: 'Everything you know about the algorithm is wrong.' },
                { type: 'Relatable Problem', text: 'Struggling to find time for content? You are not alone.' },
                { type: 'Question', text: 'What if you could post 7 times a week without burnout?' },
              ].map((h, i) => (
                <div key={i} className="bg-card border border-border/40 p-5 rounded-3xl flex items-center justify-between group hover:border-primary/40 transition-colors">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{h.type}</span>
                      <p className="text-sm font-black">{h.text}</p>
                   </div>
                   <button className="p-3 bg-muted/20 rounded-2xl opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all"><Copy className="w-4 h-4" /></button>
                </div>
              ))}
           </motion.div>
         )}
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] -mx-8 -my-6 flex overflow-hidden">
      {/* LEFT TOOL PANEL */}
      <div className="w-[280px] border-r border-border/30 bg-card/10 overflow-y-auto overflow-x-hidden pt-6">
        <div className="px-6 mb-8 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
           <Zap className="w-3 h-3" /> Creative Workshop
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
              <span className="text-xs font-black uppercase tracking-wide truncate">{tool.label}</span>
              {activeTool === tool.id && (
                <motion.div 
                  layoutId="toolHighlight"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 overflow-y-auto p-12 relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-95">
        <div className="max-w-4xl mx-auto">
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

        {/* PERSISTENT FEEDBACK BUTTON */}
        <button className="fixed bottom-12 right-12 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:scale-110 transition-all group z-50">
           <MessageSquare className="w-6 h-6" />
           <span className="absolute right-full mr-4 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Give AI Feedback</span>
        </button>
      </div>
    </div>
  );
};

// Required missing import from global
const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);
