import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PenTool, Clapperboard, Lightbulb, Grid, Hash, 
  Music, Zap, Mail, Image, UserCircle, Copy, Sparkles 
} from "lucide-react";

const tools = [
  { id: "caption", icon: PenTool, label: "Caption Writer" },
  { id: "script", icon: Clapperboard, label: "Script Generator" },
  { id: "ideas", icon: Lightbulb, label: "Reel & Short Ideas" },
  { id: "carousel", icon: Grid, label: "Carousel Builder" },
  { id: "hashtags", icon: Hash, label: "Hashtag Engine" },
  { id: "audio", icon: Music, label: "Trending Audio Finder" },
  { id: "hook", icon: Zap, label: "Hook Generator" },
  { id: "pitch", icon: Mail, label: "Brand Pitch Writer" },
  { id: "thumbnail", icon: Image, label: "Thumbnail Concept AI" },
  { id: "bio", icon: UserCircle, label: "Bio Optimiser" },
];

export const ContentStudio = () => {
  const [activeTool, setActiveTool] = useState("caption");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowResults(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] border border-border/40 rounded-2xl overflow-hidden bg-card/50">
      
      {/* LEFT TOOL PANEL */}
      <div className="w-[260px] border-r border-border/40 bg-card/80 overflow-y-auto hidden md:block">
        <div className="p-4 border-b border-border/30">
          <h3 className="font-bold tracking-tight">AI Tools</h3>
          <p className="text-xs text-muted-foreground mt-1">Select a workspace</p>
        </div>
        <div className="p-3 space-y-1">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group ${
                activeTool === tool.id 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {activeTool === tool.id && (
                <motion.div 
                  layoutId="activeToolGlow"
                  className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-md"
                />
              )}
              <tool.icon className={`w-4 h-4 ${activeTool === tool.id ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="truncate">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 overflow-y-auto bg-background/30 p-6 md:p-8">
        
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Caption Writer</h2>
            <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-primary/20">
              <Sparkles className="w-3 h-3" /> Powered by AI
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-6 shadow-sm">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">What is this post about?</label>
              <textarea 
                className="w-full h-32 bg-muted/20 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-muted-foreground/60"
                placeholder="E.g. I hit a new deadlift PR today! It's been 6 months of training and recovering from my knee injury..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Platform</label>
                <select className="w-full bg-muted/30 border border-border/50 rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Instagram</option>
                  <option>TikTok</option>
                  <option>YouTube Shorts</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tone</label>
                <select className="w-full bg-muted/30 border border-border/50 rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Inspiring</option>
                  <option>Funny</option>
                  <option>Educational</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Call to Action</label>
                <select className="w-full bg-muted/30 border border-border/50 rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>Drive Link Clicks</option>
                  <option>Get Comments</option>
                  <option>Grow Followers</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              className="w-full relative overflow-hidden group rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-all active:scale-[0.98] shadow-[0_0_20px_-5px_hsl(var(--primary))]"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
              <div className="flex items-center justify-center gap-2 relative z-10">
                {isGenerating ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isGenerating ? "Generating Magic..." : "Generate Captions"}
              </div>
            </button>
          </div>

          <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-bold border-b border-border/30 pb-2">AI Variations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Punchy & Short", copy: "6 months of rehab. 1 new PR. The comeback is always stronger than the setback. 😤🔥 Link in bio for my recovery routine." },
                    { title: "Engaging & Story", copy: "They told me I might not lift heavy again. Half a year ago, my knee gave out. Today, I hit a PR I didn't think was possible. The lesson? Trust the rehab process. Drop a 🔥 if you're on a comeback journey too!" },
                  ].map((cap, i) => (
                    <div key={i} className="bg-card border border-border/40 rounded-xl p-5 relative group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-muted-foreground uppercase">{cap.title}</span>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm leading-relaxed">{cap.copy}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border/40 rounded-xl p-6">
                  <h3 className="text-sm font-bold mb-4">Optimised Hashtags</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-rose-500 font-semibold mb-2 block">MEGA (1M+)</span>
                      <div className="flex flex-wrap gap-2">
                        {["#fitness", "#gymmotivation", "#workout"].map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-md bg-muted/50 border border-border/50 text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-amber-500 font-semibold mb-2 block">MID (100K-1M)</span>
                      <div className="flex flex-wrap gap-2">
                        {["#deadliftpr", "#injuryrecovery", "#comebackseason"].map(tag => (
                          <span key={tag} className="px-2 py-1 text-xs rounded-md bg-muted/50 border border-border/50 text-muted-foreground">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
};
