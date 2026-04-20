import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, Zap, 
  MapPin, Loader2, Stars, BarChart3, Target, LayoutDashboard, 
  Smartphone, Monitor, Globe, Music, Camera, Palette, GraduationCap, 
  Briefcase, Heart, Plane, Trophy, Cpu, Video, CheckCircle2, Building2, UserCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth, User } from "../contexts/AuthContext";
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
  const [selectedRole, setSelectedRole] = useState<'Creator' | 'Brand' | null>(null);
  const [brandName, setBrandName] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<null | { type: string; reason: string }>(null);

  // If role is already assigned (returning user who didn't finish onboarding), skip role step
  useEffect(() => {
    if (user?.type && currentStep === 0) {
      setSelectedRole(user.type);
      setCurrentStep(1);
    }
  }, [user]);

  useEffect(() => {
    // Creator-specific analysis step
    if (selectedRole === 'Creator' && currentStep === 4 && !analysisResult) {
       setAnalysisResult({
          type: "Horizontal Narrative Threads",
          reason: "Your retention spikes by 42% when you introduce high-contrast visual cues in the first 3 seconds."
       });
       setTimeout(() => nextStep(), 1500);
    }
  }, [currentStep, analysisResult, selectedRole]);

  // ——— Finalize Protocol ———
  const handleFinalize = () => {
    if (selectedRole === 'Brand') {
      if (!brandName) {
        toast.error("Identity Required", { description: "Please enter your brand name." });
        return;
      }
      updateUser({ 
        type: 'Brand',
        brandName: brandName,
        onboarded: true,
        role_assigned: true
      });
      toast.success("Corporate Node Active", { description: `Welcome, ${brandName}. Accessing Brand Hub...` });
      navigate("/brand");
    } else {
      updateUser({ 
        onboarded: true,
        niche: selectedNiche,
        platforms: selectedPlatforms,
        type: 'Creator',
        role_assigned: true
      });
      toast.success("Protocol Initialized", { description: "You are now linked to the global creator hive." });
      navigate("/dashboard");
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && !selectedRole) {
      toast.error("Role Required", { description: "Please select your operative designation." });
      return;
    }
    
    // Brand Skip Logic
    if (currentStep === 0 && selectedRole === 'Brand') {
      setCurrentStep(5); // Skip to Brand Name step
      return;
    }

    if (currentStep === 1 && selectedPlatforms.length === 0) {
      toast.error("Network Required", { description: "Select at least one intelligence node." });
      return;
    }
    if (currentStep === 2 && !selectedNiche) {
      toast.error("Calibration Required", { description: "Specify your deployment sector." });
      return;
    }
    
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      if (currentStep === 5 && selectedRole === 'Brand') {
        setCurrentStep(0);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // ——— Step Components ———
  const renderRoleStep = () => (
    <div className="w-full max-w-3xl space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Identify Your Node</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select your operative designation in the marketplace.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button
          onClick={() => setSelectedRole('Creator')}
          className={cn(
            "p-10 rounded-[3rem] border transition-all relative overflow-hidden group active:scale-95 shimmer-border",
            selectedRole === 'Creator' 
              ? "bg-blue-600/10 border-blue-600 shadow-2xl shadow-blue-500/20" 
              : "bg-slate-900 border-white/5 hover:border-white/10"
          )}
        >
          <div className={cn(
             "w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-8 transition-all duration-500",
             selectedRole === 'Creator' ? "bg-blue-600 text-white shadow-xl scale-110" : "bg-white/5 border border-white/10 text-slate-500 group-hover:scale-110"
          )}>
            <UserCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Content Creator</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">I build audience & influence</p>
          {selectedRole === 'Creator' && <div className="absolute top-8 right-8 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>}
        </button>

        <button
          onClick={() => setSelectedRole('Brand')}
          className={cn(
            "p-10 rounded-[3rem] border transition-all relative overflow-hidden group active:scale-95 shimmer-border",
            selectedRole === 'Brand' 
              ? "bg-indigo-600/10 border-indigo-600 shadow-2xl shadow-indigo-500/20" 
              : "bg-slate-900 border-white/5 hover:border-white/10"
          )}
        >
          <div className={cn(
             "w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center mb-8 transition-all duration-500",
             selectedRole === 'Brand' ? "bg-indigo-600 text-white shadow-xl scale-110" : "bg-white/5 border border-white/10 text-slate-500 group-hover:scale-110"
          )}>
            <Building2 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Corporate Brand</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">I scout talent & run campaigns</p>
          {selectedRole === 'Brand' && <div className="absolute top-8 right-8 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>}
        </button>
      </div>
    </div>
  );

  const renderBrandNameStep = () => (
    <div className="w-full max-w-xl space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter text-white">Identity established</h2>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">What is the designation of your corporate entity?</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-indigo-500" />
          <input 
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter Brand Name"
            className="w-full h-20 bg-slate-900 border border-white/10 rounded-3xl pl-16 pr-8 text-lg font-bold text-white placeholder:text-slate-600 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all outline-none"
          />
        </div>
        <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-600/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Corporate Access Protocol: ACTIVE</p>
        </div>
      </div>
    </div>
  );

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

  const renderSyncStep = () => (
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
                      progress += 20; 
                      setSyncProgress(progress);
                      if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                           setIsSyncing(false);
                           nextStep();
                        }, 50); 
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
  );

  const renderAnalysisStep = () => (
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

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden relative text-white">
      {/* Neural Glow Field */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl h-full flex flex-col gap-10">
        <header className="flex flex-col gap-6 shrink-0 relative z-20">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                    <Stars className="w-7 h-7 text-white" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">Intelligence Induction</h1>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mt-2">Node Initialization Protocol</p>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                   {[0, 1, 2, 3, 4, 5].map(i => (
                     <div key={i} className={cn("h-1 w-6 rounded-full transition-all duration-500", i <= currentStep ? "bg-blue-600 shadow-[0_0_10px_#2563eb]" : "bg-white/5")} />
                   ))}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Phase {currentStep + 1} / 06
                </div>
              </div>
           </div>
        </header>

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
                {currentStep === 0 && renderRoleStep()}
                {currentStep === 1 && renderPlatformStep()}
                {currentStep === 2 && renderNicheStep()}
                {currentStep === 3 && renderSyncStep()}
                {currentStep === 4 && renderAnalysisStep()}
                {currentStep === 5 && renderBrandNameStep()}
              </motion.div>
           </AnimatePresence>
        </div>

        <footer className={cn("flex items-center justify-between shrink-0 relative z-20 pb-6 pt-10", currentStep === 3 && isSyncing ? "opacity-0 pointer-events-none" : "opacity-100")}>
            <button
               onClick={prevStep}
               className={cn(
                 "h-16 px-10 rounded-[2rem] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 active:scale-95 group",
                 currentStep === 0 ? "opacity-0 pointer-events-none" : "bg-white/5 text-slate-500 hover:text-white"
               )}
            >
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back Pulse
            </button>

            <button
               onClick={(currentStep === 5 || (currentStep === 4 && selectedRole === 'Creator')) ? handleFinalize : nextStep}
               disabled={currentStep === 4 && isAnalyzing}
               className={cn(
                 "h-16 px-12 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl shadow-blue-500/20",
                 selectedRole === 'Brand' ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700",
                 "text-white shadow-blue-500/20 hover:-translate-y-1"
               )}
            >
               {((currentStep === 5 && selectedRole === 'Brand') || (currentStep === 4 && selectedRole === 'Creator')) ? (
                  <>Execute Deployment <LayoutDashboard className="w-5 h-5" /></>
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
