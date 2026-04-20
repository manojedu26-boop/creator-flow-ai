import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, Zap, 
  MapPin, Loader2, Stars, BarChart3, Target, LayoutDashboard, 
  Smartphone, Monitor, Globe, Music, Camera, Palette, GraduationCap, 
  Briefcase, Heart, Plane, Trophy, Cpu, Video, CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "@/lib/utils";

// ——— Shared Constants ———
const NICHE_OPTIONS = [
  { id: "tech", label: "Tech", icon: Cpu },
  { id: "lifestyle", label: "Lifestyle", icon: Heart },
  { id: "finance", label: "Finance", icon: BarChart3 },
  { id: "gaming", label: "Gaming", icon: Zap },
  { id: "fitness", label: "Fitness", icon: Trophy },
  { id: "fashion", label: "Fashion", icon: Camera },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "travel", label: "Travel", icon: Plane },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "beauty", label: "Beauty", icon: Sparkles },
  { id: "art", label: "Art", icon: Palette },
  { id: "music", label: "Music", icon: Music },
];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-500" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-500" },
  { id: "tiktok", label: "TikTok", icon: Smartphone, color: "text-cyan-400" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // ——— State ———
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | { type: string; reason: string }>(null);

  useEffect(() => {
    if (currentStep === 3 && !isAnalyzing && !analysisResult) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setAnalysisResult({
          type: "Horizontal Narrative Threads",
          reason: "Your retention spikes by 42% when you introduce high-contrast visual cues in the first 3 seconds."
        });
        setIsAnalyzing(false);
      }, 500); // Super-accelerated to 0.5s
      return () => clearTimeout(timer);
    }
    
    // Auto-advance from result to action brief
    if (currentStep === 3 && analysisResult && !isAnalyzing) {
      const autoTimer = setTimeout(() => {
        nextStep();
      }, 400); // 0.4s
      return () => clearTimeout(autoTimer);
    }

    // Auto-finalize from action brief to dashboard
    if (currentStep === 4) {
      const finalizeTimer = setTimeout(() => {
        handleFinalize();
      }, 800); // Fast-tracked final sweep at 0.8s
      return () => clearTimeout(finalizeTimer);
    }
  }, [currentStep, isAnalyzing, analysisResult]);

  // ——— Finalize Protocol ———
  const handleFinalize = () => {
    updateUser({ 
      onboarded: true,
      niche: selectedNiche,
      platforms: selectedPlatforms
    });
    toast.success("Protocol Initialized", { description: "You are now linked to the global hive." });
    navigate("/dashboard");
  };

  const nextStep = () => {
    if (currentStep === 0 && selectedPlatforms.length === 0) {
      toast.error("Network Required", { description: "Select at least one intelligence node." });
      return;
    }
    if (currentStep === 1 && !selectedNiche) {
      toast.error("Calibration Required", { description: "Specify your deployment sector." });
      return;
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // ——— Step Components ———
  const renderPlatformStep = () => (
    <div className="w-full max-w-3xl space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Select Your Nodes</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Where do you broadcast your primary intelligence?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPlatforms(prev => 
              prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
            )}
            className={cn(
              "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group active:scale-95 shimmer-border",
              selectedPlatforms.includes(p.id) 
                ? "bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-500/20" 
                : "bg-slate-900 border-white/5 hover:border-white/10"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-6 transition-all duration-500",
              selectedPlatforms.includes(p.id) ? "bg-blue-600 text-white shadow-xl scale-110" : "bg-white/5 border border-white/10 text-slate-500 group-hover:scale-110"
            )}>
              <p.icon className="w-8 h-8" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white">{p.label}</p>
            {selectedPlatforms.includes(p.id) && (
              <div className="absolute top-6 right-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderNicheStep = () => (
    <div className="w-full max-w-4xl space-y-10">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Deployment Sector</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Calibrate your domain for precise AI targeting.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {NICHE_OPTIONS.map((n) => (
          <button
            key={n.id}
            onClick={() => setSelectedNiche(n.label)}
            className={cn(
              "p-6 rounded-[2rem] border transition-all text-center relative overflow-hidden group active:scale-95 shimmer-border",
              selectedNiche === n.label 
                ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/20" 
                : "bg-slate-900/40 backdrop-blur-3xl border-white/5 hover:border-white/10"
            )}
          >
            <n.icon className={cn("w-6 h-6 mx-auto mb-3 transition-colors", selectedNiche === n.label ? "text-white" : "text-slate-500 group-hover:text-blue-500")} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{n.label}</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSyncStep = () => {
    const handleSync = () => {
      setIsSyncing(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10; // Rapid Sync: Finish in 400ms
        setSyncProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
             setIsSyncing(false);
             nextStep();
          }, 200); // 0.2s
        }
      }, 40);
    };

    return (
      <div className="w-full max-w-lg space-y-12 text-center">
        <div className="space-y-6">
           <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Full Protocol Sync</h2>
           <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
             Connect your primary cloud node to enable real-time intelligence mapping.
           </p>
        </div>

        {!isSyncing ? (
          <div className="space-y-4">
                        {selectedPlatforms
                          .filter(p => p === 'youtube' || p === 'instagram')
                          .map(platformId => {
                            const platform = PLATFORMS.find(p => p.id === platformId);
                            const Icon = platform?.icon || Zap;
                            return (
                              <button
                                key={platformId}
                                onClick={handleSync}
                                className="w-full h-16 rounded-[1.5rem] bg-obsidian border border-blue-600/30 text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-4 hover:border-blue-500 transition-all active:scale-95 shimmer-border overflow-hidden group"
                              >
                                <Icon className="w-5 h-5 text-blue-500" />
                                Link {platform?.label || platformId} intelligence
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            );
                          })}
          </div>
        ) : (
          <div className="space-y-8 py-10">
             <div className="relative w-24 h-24 mx-auto">
                <Loader2 className="w-full h-full text-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{syncProgress}%</div>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Establishing Secure Neural Handshake...</p>
          </div>
        )}
      </div>
    );
  };

  const renderAnalysisStep = () => {
    return (
      <div className="w-full max-w-2xl space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white">AI Pulse Scan</h2>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Analyzing your last 10 behavioral iterations.</p>
        </div>

        <div className="relative rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl p-10 border border-white/5 overflow-hidden shimmer-border border-blue-600/20">
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center gap-8"
              >
                 <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      className="absolute inset-0 bg-blue-600 shadow-[0_0_15px_#2563eb]"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
                 <div className="space-y-2 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Scanning metadata...</p>
                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Cross-referencing {selectedNiche} benchmarks</p>
                 </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
                      <Target className="w-8 h-8 text-white" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Primary Performance Vector</p>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{analysisResult?.type}</h3>
                   </div>
                </div>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                   <p className="text-sm font-bold text-slate-400 leading-relaxed">
                     <span className="text-blue-500 font-extrabold mr-2 uppercase tracking-widest">Neural Insight:</span>
                     {analysisResult?.reason}
                   </p>
                </div>

                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue-600/10 border border-blue-600/20 w-fit">
                   <CheckCircle2 className="w-4 h-4 text-blue-500" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-white">Top 5% Engagement Strategy Loaded</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderActionStep = () => (
    <div className="w-full max-w-2xl space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Deployment Brief</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">System operational. Your initial trajectory is mapped.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { icon: Zap, title: "Optimize First 3s Node", desc: "Inject high-fidelity visual anchors to maximize retention." },
          { icon: Stars, title: "Initialize High-Octane Hooks", desc: "Our AI generated 5 hooks based on your scan. Review in Studio." },
          { icon: BarChart3, title: "Scale Domain Authority", desc: "You're trending in 'Tech'. Double down on predictive themes." }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-[2.5rem] bg-obsidian border border-white/5 hover:border-blue-500/30 transition-all flex items-center gap-6 shimmer-border"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-all">
              <item.icon className="w-6 h-6 text-blue-500 group-hover:text-white" />
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">{item.title}</h4>
              <p className="text-xs font-bold text-slate-500">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative text-white">
      {/* Neural Glow Field */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl h-full flex flex-col gap-10">
        {/* Architecture Progress Header */}
        <header className="flex flex-col gap-6 shrink-0 relative z-20">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                    <Stars className="w-7 h-7 text-white" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">Creator Induction</h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mt-2">Node Initialization Protocol</p>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                   {[0, 1, 2, 3, 4].map(i => (
                     <div key={i} className={cn("h-1 w-8 rounded-full transition-all duration-500", i <= currentStep ? "bg-blue-600 shadow-[0_0_10px_#2563eb]" : "bg-white/5")} />
                   ))}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Phase {currentStep + 1} / 05
                </div>
              </div>
           </div>
        </header>

        {/* Dynamic Content Core */}
        <div className="flex-1 min-h-0 relative z-10 flex items-center justify-center">
           <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -40, filter: "blur(12px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar"
              >
                {/* PHASE 1: PLATFORMS */}
                {currentStep === 0 && (
                  <div className="w-full max-w-3xl space-y-12">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Select Your Nodes</h2>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Where do you broadcast your primary intelligence?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPlatforms(prev => 
                            prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                          )}
                          className={cn(
                            "p-8 rounded-[2.5rem] border transition-all relative overflow-hidden group active:scale-95 shimmer-border",
                            selectedPlatforms.includes(p.id) 
                              ? "bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-500/20" 
                              : "bg-slate-900 border-white/5 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-6 transition-all duration-500",
                            selectedPlatforms.includes(p.id) ? "bg-blue-600 text-white shadow-xl scale-110" : "bg-white/5 border border-white/10 text-slate-500 group-hover:scale-110"
                          )}>
                            <p.icon className="w-8 h-8" />
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest text-white">{p.label}</p>
                          {selectedPlatforms.includes(p.id) && (
                            <div className="absolute top-6 right-6 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PHASE 2: NICHE */}
                {currentStep === 1 && (
                  <div className="w-full max-w-4xl space-y-10">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Deployment Sector</h2>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Calibrate your domain for precise AI targeting.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {NICHE_OPTIONS.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => setSelectedNiche(n.label)}
                          className={cn(
                            "p-6 rounded-[2rem] border transition-all text-center relative overflow-hidden group active:scale-95 shimmer-border",
                            selectedNiche === n.label 
                              ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-500/20" 
                              : "bg-slate-900/40 backdrop-blur-3xl border-white/5 hover:border-white/10"
                          )}
                        >
                          <n.icon className={cn("w-6 h-6 mx-auto mb-3 transition-colors", selectedNiche === n.label ? "text-white" : "text-slate-500 group-hover:text-blue-500")} />
                          <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{n.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PHASE 3: SYNC */}
                {currentStep === 2 && (
                  <div className="w-full max-w-lg space-y-12 text-center">
                    <div className="space-y-6">
                       <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Full Protocol Sync</h2>
                       <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-relaxed uppercase tracking-widest">
                         Connect your primary cloud node to enable real-time intelligence mapping.
                       </p>
                    </div>
                    {!isSyncing ? (
                      <div className="space-y-4">
                        {selectedPlatforms
                          .filter(p => p === 'youtube' || p === 'instagram')
                          .map(platformId => {
                            const platform = PLATFORMS.find(p => p.id === platformId);
                            const Icon = platform?.icon || Zap;
                            return (
                              <button
                                key={platformId}
                                onClick={() => {
                                  setIsSyncing(true);
                                  let progress = 0;
                                  const interval = setInterval(() => {
                                    progress += 5; // Finish in 800ms
                                    setSyncProgress(progress);
                                    if (progress >= 100) {
                                      clearInterval(interval);
                                      setTimeout(() => {
                                         setIsSyncing(false);
                                         nextStep();
                                      }, 300); // Fast transition
                                    }
                                  }, 40);
                                }}
                                className="w-full h-16 rounded-[1.5rem] bg-obsidian border border-blue-600/30 text-[11px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-center gap-4 hover:border-blue-500 transition-all active:scale-95 shimmer-border overflow-hidden group"
                              >
                                <Icon className="w-5 h-5 text-blue-500" />
                                Link {platform?.label || platformId} intelligence
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="space-y-8 py-10">
                         <div className="relative w-24 h-24 mx-auto">
                            <Loader2 className="w-full h-full text-blue-600 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{syncProgress}%</div>
                         </div>
                         <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Establishing Secure Neural Handshake...</p>
                      </div>
                    )}
                  </div>
                )}

                {/* PHASE 4: ANALYSIS */}
                {currentStep === 3 && (
                  <div className="w-full max-w-2xl space-y-12">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">AI Pulse Scan</h2>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Analyzing your last 10 behavioral iterations.</p>
                    </div>
                    <div className="relative rounded-[3rem] bg-slate-900/50 backdrop-blur-3xl p-10 border border-white/5 overflow-hidden shimmer-border border-blue-600/20">
                      <AnimatePresence mode="wait">
                        {isAnalyzing ? (
                          <motion.div 
                            key="scanning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-12 flex flex-col items-center gap-8"
                          >
                             <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div 
                                  className="absolute inset-0 bg-blue-600 shadow-[0_0_15px_#2563eb]"
                                  animate={{ x: ["-100%", "100%"] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                             </div>
                             <div className="space-y-2 text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Scanning metadata...</p>
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Cross-referencing {selectedNiche} benchmarks</p>
                             </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10"
                          >
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-1 ring-white/20 shrink-0">
                                  <Target className="w-8 h-8 text-white" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Primary Performance Vector</p>
                                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{analysisResult?.type}</h3>
                               </div>
                            </div>
                            <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                               <p className="text-sm font-bold text-slate-400 leading-relaxed">
                                 <span className="text-blue-500 font-extrabold mr-2 uppercase tracking-widest">Neural Insight:</span>
                                 {analysisResult?.reason}
                               </p>
                            </div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue-600/10 border border-blue-600/20 w-fit">
                               <CheckCircle2 className="w-4 h-4 text-blue-500" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-white">Top 5% Engagement Strategy Loaded</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* PHASE 5: ACTION ITEMS */}
                {currentStep === 4 && (
                  <div className="w-full max-w-2xl space-y-12">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Deployment Brief</h2>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest leading-relaxed">System operational. Your initial trajectory is mapped.</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-10">
                      <div className="flex flex-col items-center gap-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 animate-pulse">Initializing Dashboard Workspace...</p>
                        <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative">
                           <motion.div 
                             className="absolute inset-0 bg-blue-600 shadow-[0_0_15px_#2563eb]"
                             initial={{ width: "0%" }}
                             animate={{ width: "100%" }}
                             transition={{ duration: 3, ease: "easeInOut" }}
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 w-full opacity-40 grayscale scale-95 pointer-events-none">
                        {[
                          { icon: Zap, title: "Optimize First 3s Node", desc: "Inject high-fidelity visual anchors to maximize retention." },
                          { icon: Stars, title: "Initialize High-Octane Hooks", desc: "Our AI generated 5 hooks based on your scan. Review in Studio." },
                          { icon: BarChart3, title: "Scale Domain Authority", desc: "You're trending in 'Tech'. Double down on predictive themes." }
                        ].map((item, i) => (
                          <div key={item.title} className="p-8 rounded-[2.5rem] bg-obsidian border border-white/5 flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                              <item.icon className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-2">{item.title}</h4>
                              <p className="text-xs font-bold text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Tactical Footer */}
        <footer className={cn("flex items-center justify-between shrink-0 relative z-20 pb-6 pt-10", currentStep === 2 && isSyncing ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <button
               onClick={prevStep}
               className={cn(
                 "h-16 px-10 rounded-[1.5rem] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 active:scale-95 group",
                 currentStep === 0 || currentStep === 3 ? "opacity-0 pointer-events-none" : "bg-white/5 text-slate-500 hover:text-white"
               )}
            >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back Pulse
            </button>

            <button
               onClick={currentStep === 4 ? handleFinalize : nextStep}
               disabled={currentStep === 3 && isAnalyzing}
               className={cn(
                 "h-16 px-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl",
                 currentStep === 3 && isAnalyzing ? "bg-blue-600/30 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1"
               )}
            >
               {currentStep === 4 ? (
                  <>Execute Deployment <LayoutDashboard className="w-5 h-5" /></>
               ) : currentStep === 3 && isAnalyzing ? (
                  <>Running Scan <Loader2 className="w-5 h-5 animate-spin" /></>
               ) : (
                  <>Next Phase <ArrowRight className="w-5 h-5" /></>
               )}
            </button>
         </footer>
      </div>
    </div>
  );
};

export default Onboarding;
