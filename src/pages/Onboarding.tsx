import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, MapPin, 
  AtSign, CheckCircle2, XCircle, Loader2, Zap, Target, 
  TrendingUp, DollarSign, BarChart3, Clock, User, RefreshCcw as RefreshIcon 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";

// ——— Shared Constants ———
const niches = [
  { label: "Fitness", icon: Target },
  { label: "Lifestyle", icon: Sparkles },
  { label: "Beauty", icon: Target },
  { label: "Tech", icon: Zap },
  { label: "Food", icon: Target },
  { label: "Travel", icon: Target },
  { label: "Finance", icon: DollarSign },
  { label: "Gaming", icon: Zap },
  { label: "Fashion", icon: Target },
  { label: "Education", icon: Target },
  { label: "Comedy", icon: Target },
  { label: "Photo", icon: Target }
];

const goalsList = [
  { label: "Grow followers fast", icon: TrendingUp },
  { label: "Land brand deals", icon: Zap },
  { label: "Increase revenue", icon: DollarSign },
  { label: "Automate schedule", icon: Clock },
  { label: "Data intelligence", icon: BarChart3 },
  { label: "Personal brand", icon: Target },
];

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Ahmedabad", "Hyderabad", "Chennai", "Kolkata", "Pune", 
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", 
  "Visakhapatnam", "Pimpri-Chinchwad", "Patna", "Vadodara", "Ghaziabad", "Ludhiana", 
  "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", 
  "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Coimbatore"
];

type HandleStatus = "idle" | "checking" | "available" | "taken";

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // ——— State ———
  const [currentStep, setCurrentStep] = useState(0);
  const [creatorName, setCreatorName] = useState(user?.name || "");
  const [handle, setHandle] = useState((user?.handle || "").replace("@", ""));
  const [city, setCity] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("idle");
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, { followers: string; connecting: boolean; connected: boolean }>>({});
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!handle || handle.length < 3) { setHandleStatus("idle"); return; }
    setHandleStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const taken = ["admin", "creator", "user", "test", "naveen"].includes(handle.toLowerCase());
      setHandleStatus(taken ? "taken" : "available");
    }, 600);
  }, [handle]);

  const nextStep = () => {
    if (currentStep === 0) {
       if (!creatorName.trim() || !handle || handleStatus === "taken" || !city.trim()) {
          toast.error("Calibration required", { description: "Complete all identity fields." });
          return;
       }
    }
    if (currentStep === 1) {
       if (!Object.values(connectedPlatforms).some(p => p.connected)) {
          toast.error("Intelligence offline", { description: "Link at least one platform." });
          return;
       }
    }
    if (currentStep === 2) {
       if (selectedNiches.length === 0) {
          toast.error("Selection required", { description: "Choose a specialization." });
          return;
       }
    }
    if (currentStep === 3) {
       if (selectedGoals.length === 0) {
          toast.error("Objectives required", { description: "Map your command goals." });
          return;
       }
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else handleLaunch();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const connectPlatform = (platform: string) => {
    if (connectedPlatforms[platform]?.connected) return;
    setConnectedPlatforms(prev => ({ ...prev, [platform]: { followers: "", connecting: true, connected: false } }));
    setTimeout(() => {
      const defaultFollowers: Record<string, string> = { Instagram: "48.2K", YouTube: "12.8K", TikTok: "31.5K" };
      setConnectedPlatforms(prev => ({
        ...prev,
        [platform]: { followers: defaultFollowers[platform] || "5K", connecting: false, connected: true }
      }));
      toast.info(`${platform} Node Synced.`);
    }, 1200);
  };

  const handleLaunch = () => {
    setIsInitializing(true);
    setTimeout(() => {
      updateUser({ 
        name: creatorName, 
        handle: `@${handle}`, 
        onboarded: true,
        niche: selectedNiches[0]
      });
      navigate("/dashboard");
    }, 2000);
  };

  const toggleNiche = (label: string) => {
    setSelectedNiches(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label].slice(-3));
  };

  const toggleGoal = (label: string) => {
    setSelectedGoals(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]);
  };

  const steps = [
    { title: "Identity", sub: "Phase 01 // Identity Matrix" },
    { title: "Network", sub: "Phase 02 // Node Linkage" },
    { title: "Focus",   sub: "Phase 03 // Intelligence Core" },
    { title: "Vector",  sub: "Phase 04 // Objective Mapping" },
    { title: "Launch",  sub: "Phase 05 // System Activation" }
  ];

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden font-sans select-none relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_#f8fafc_0%,_#ffffff_100%)]" />
      
      <div className="w-full max-w-4xl h-full flex flex-col gap-10">
        {/* Progress System */}
        <header className="flex flex-col gap-6 shrink-0 relative z-20">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center shadow-2xl shadow-slate-200 ring-4 ring-white">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-950 leading-none">{steps[currentStep].title}</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mt-2">{steps[currentStep].sub}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 PHASE_{currentStep + 1} / 05
              </div>
           </div>
           
           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex p-0.5">
              <motion.div 
                initial={false}
                animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                className="h-full bg-blue-600 rounded-full shadow-[0_0_10px_#2563eb]"
              />
           </div>
        </header>

        {/* Dynamic Content Window */}
        <div className="flex-1 min-h-0 relative z-10">
           <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="h-full w-full flex flex-col items-center justify-center gap-10"
              >
                {/* STEP 0: IDENTITY */}
                {currentStep === 0 && (
                   <div className="w-full max-w-lg space-y-8">
                      <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Broadcast Identity</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Establish your digital presence core.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="group/field space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Account Owner</label>
                           <input
                              value={creatorName}
                              onChange={e => setCreatorName(e.target.value)}
                              placeholder="Full Name"
                              className="w-full h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 px-8 text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
                           />
                        </div>

                        <div className="group/field space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Global Proxy Handle</label>
                           <div className="relative">
                              <AtSign className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                 value={handle}
                                 onChange={e => setHandle(e.target.value.replace("@", "").toLowerCase())}
                                 placeholder="Handle_Key"
                                 className="w-full h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 pl-16 pr-16 text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
                              />
                              <div className="absolute right-8 top-1/2 -translate-y-1/2 transition-all">
                                {handleStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-slate-300" />}
                                {handleStatus === "available" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                {handleStatus === "taken" && <XCircle className="w-5 h-5 text-rose-500" />}
                              </div>
                           </div>
                        </div>

                        <div className="group/field space-y-2 relative">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Operational HQ</label>
                           <div className="relative">
                              <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                              <input
                                 value={city}
                                 onChange={e => { setCity(e.target.value); setShowCitySuggestions(true); }}
                                 onFocus={() => setShowCitySuggestions(true)}
                                 placeholder="City Base"
                                 className="w-full h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 pl-16 pr-8 text-sm font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
                              />
                           </div>
                           <AnimatePresence>
                              {showCitySuggestions && city.length > 0 && (
                                <motion.div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-40 overflow-y-auto py-2">
                                  {INDIAN_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase())).map(c => (
                                    <button key={c} onClick={() => { setCity(c); setShowCitySuggestions(false); }} className="w-full text-left px-5 py-3 text-[10px] font-black text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest">{c}</button>
                                  ))}
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      </div>
                   </div>
                )}

                {/* STEP 1: PLATFORMS */}
                {currentStep === 1 && (
                   <div className="w-full max-w-lg space-y-10">
                      <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Neural Linkage</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sync your existing platform intelligence nodes.</p>
                      </div>

                      <div className="space-y-3">
                         {[
                           { name: "Instagram", icon: Instagram, color: "text-pink-600" },
                           { name: "YouTube", icon: Youtube, color: "text-red-600" },
                           { name: "TikTok", icon: Zap, color: "text-slate-950" },
                         ].map(p => (
                           <div key={p.name} className={`p-6 rounded-[2rem] border flex items-center justify-between transition-all group ${connectedPlatforms[p.name]?.connected ? "bg-white border-blue-600/30 shadow-xl shadow-blue-500/10" : "bg-slate-50 border-slate-50 hover:border-blue-100"}`}>
                              <div className="flex items-center gap-6">
                                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${connectedPlatforms[p.name]?.connected ? "bg-blue-600 border-blue-600 text-white" : `bg-white border-slate-100 ${p.color}`}`}>
                                    <p.icon className="w-6 h-6" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-950 leading-none">{p.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{connectedPlatforms[p.name]?.connected ? `${connectedPlatforms[p.name].followers} DATA SYNCED` : "NETWORK OFFLINE"}</p>
                                 </div>
                              </div>
                              <button 
                                 onClick={() => connectPlatform(p.name)}
                                 disabled={connectedPlatforms[p.name]?.connecting || connectedPlatforms[p.name]?.connected}
                                 className={`h-11 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${connectedPlatforms[p.name]?.connected ? "bg-slate-950 text-white" : "bg-white border border-slate-200 text-slate-950 hover:border-blue-600 active:scale-95 shadow-sm"}`}
                              >
                                 {connectedPlatforms[p.name]?.connecting ? "SYNC..." : connectedPlatforms[p.name]?.connected ? "READY" : "CONNECT"}
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                )}

                {/* STEP 2: NICHES */}
                {currentStep === 2 && (
                   <div className="w-full h-full flex flex-col h-full overflow-hidden">
                      <div className="text-center space-y-2 mb-10 shrink-0">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Intelligence Scope</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Map your specialized creative domain (Select up to 3).</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1 overflow-y-auto no-scrollbar pb-10">
                         {niches.map(n => (
                           <button
                              key={n.label}
                              onClick={() => toggleNiche(n.label)}
                              className={`p-8 rounded-[2.5rem] border text-center transition-all duration-300 relative overflow-hidden group active:scale-95 ${selectedNiches.includes(n.label) ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-600" : "border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200"}`}
                           >
                              <div className={`w-14 h-14 rounded-[1.8rem] mx-auto flex items-center justify-center mb-5 transition-all ${selectedNiches.includes(n.label) ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-300"}`}>
                                 <n.icon className="w-7 h-7" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 leading-none">{n.label}</p>
                              {selectedNiches.includes(n.label) && <Check className="absolute top-6 right-6 w-4 h-4 text-blue-600" />}
                           </button>
                         ))}
                      </div>
                   </div>
                )}

                {/* STEP 3: GOALS */}
                {currentStep === 3 && (
                   <div className="w-full max-w-xl space-y-12">
                      <div className="text-center space-y-2">
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-950">Operational Objectives</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Define the core trajectory of your command hub.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {goalsList.map(g => (
                           <button 
                              key={g.label}
                              onClick={() => toggleGoal(g.label)}
                              className={`w-full p-6 rounded-[2rem] border flex items-center gap-6 transition-all text-left group active:scale-95 ${selectedGoals.includes(g.label) ? "bg-white border-blue-600 shadow-xl shadow-blue-500/10" : "bg-slate-50 border-slate-50 hover:border-blue-200"}`}
                           >
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${selectedGoals.includes(g.label) ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-100 text-slate-300 group-hover:text-blue-600"}`}>
                                 <g.icon className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-950 flex-1 leading-tight">{g.label}</span>
                              {selectedGoals.includes(g.label) && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                           </button>
                         ))}
                      </div>
                   </div>
                )}

                {/* STEP 4: INITIALIZE */}
                {currentStep === 4 && (
                   <div className="w-full max-w-lg space-y-12 text-center">
                      <div className="relative mx-auto w-40 h-40">
                         <div className="absolute inset-0 bg-blue-600/10 blur-[40px] rounded-full animate-pulse" />
                         <motion.div 
                           animate={{ rotate: 360 }}
                           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                           className="w-full h-full rounded-[2.5rem] bg-slate-950 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                         >
                            <RefreshIcon className="w-16 h-16 text-blue-600 animate-spin" />
                         </motion.div>
                         <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-full border-8 border-white flex items-center justify-center shadow-xl">
                            <Check className="w-6 h-6 text-white" />
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-950">System Activation</h2>
                         <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto leading-relaxed">
                            Neuro-mapping complete. Identity proxies calibrated. Command hub ready for primary deployment.
                         </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 px-10">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: i * 0.3, duration: 1 }}
                              />
                           </div>
                         ))}
                      </div>
                   </div>
                )}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Action Controls */}
        <footer className="flex items-center justify-between shrink-0 relative z-20 pb-4">
           <button
              onClick={prevStep}
              className={`h-16 px-10 rounded-[1.5rem] border border-slate-100 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 active:scale-95 ${currentStep === 0 || isInitializing ? "opacity-0 pointer-events-none" : "bg-white text-slate-400 hover:text-slate-950 hover:border-slate-300"}`}
           >
              <ArrowLeft className="w-5 h-5" /> Regression
           </button>

           <div className="hidden md:flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all border ${i === currentStep ? "bg-slate-950 border-slate-950 w-8" : "bg-slate-50 border-slate-100"}`} />
              ))}
           </div>

           <button
              onClick={nextStep}
              disabled={isInitializing}
              className={`h-16 px-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl ${isInitializing ? "bg-slate-900 border-slate-900 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1"}`}
           >
              {isInitializing ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" /> Finalizing
                 </>
              ) : currentStep === 4 ? (
                 "Execute Deployment"
              ) : (
                 <>
                   Continue Phase <ArrowRight className="w-5 h-5" />
                 </>
              )}
           </button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
