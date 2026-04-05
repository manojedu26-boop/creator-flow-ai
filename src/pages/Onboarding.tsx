import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, MapPin, 
  AtSign, CheckCircle2, XCircle, Loader2, Zap, Target, 
  TrendingUp, DollarSign, BarChart3, Clock, User, ShieldCheck, RefreshCcw as RefreshIcon 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";

// ——— Shared Constants ———
const niches = [
  { label: "Engineering", icon: Zap },
  { label: "Lifestyle", icon: Sparkles },
  { label: "Aesthetics", icon: Sparkles },
  { label: "Tech", icon: Zap },
  { label: "Synthetics", icon: RefreshIcon },
  { label: "Finance", icon: DollarSign },
  { label: "Cybersecurity", icon: ShieldCheck },
  { label: "Gaming", icon: Zap },
  { label: "Strategy", icon: Target },
  { label: "Network", icon: AtSign }
];

const goalsList = [
  { label: "Exponential Scale", icon: TrendingUp },
  { label: "Node Monetization", icon: DollarSign },
  { label: "Neural Automation", icon: Clock },
  { label: "Predictive Intelligence", icon: BarChart3 },
  { label: "Identity Fortification", icon: ShieldCheck },
  { label: "Protocol Dominance", icon: Target },
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
          toast.error("Intelligence offline", { description: "Link at least one hub." });
          return;
       }
    }
    if (currentStep === 2) {
       if (selectedNiches.length === 0) {
          toast.error("Sector selection required", { description: "Choose at least one domain." });
          return;
       }
    }
    if (currentStep === 3) {
       if (selectedGoals.length === 0) {
          toast.error("Objectives required", { description: "Map your execution trajectory." });
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
    }, 3000);
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
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden font-sans select-none relative text-white">
      {/* High-Fidelity Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>
      
      <div className="w-full max-w-4xl h-full flex flex-col gap-10">
        {/* Progress System */}
        <header className="flex flex-col gap-6 shrink-0 relative z-20">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/10">
                    <Sparkles className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">{steps[currentStep].title}</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mt-2">{steps[currentStep].sub}</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 PHASE_{currentStep + 1} / 05
              </div>
           </div>
           
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 flex p-0.5">
              <motion.div 
                initial={false}
                animate={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                className="h-full bg-blue-600 rounded-full shadow-[0_0_15px_#2563eb]"
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
                className="h-full w-full flex flex-col items-center justify-start md:justify-center gap-6 md:gap-10 pt-4 md:pt-0 overflow-y-auto no-scrollbar"
              >
                {/* STEP 0: IDENTITY */}
                {currentStep === 0 && (
                    <div className="w-full max-w-lg space-y-8">
                       <div className="text-center space-y-2">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Neural Signature</h2>
                         <p className="text-xs font-black uppercase tracking-widest text-slate-500">Configure your primary agent identity parameters.</p>
                       </div>

                       <div className="space-y-4">
                         <div className="group/field space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Account Prime Operator</label>
                            <input
                               value={creatorName}
                               onChange={e => setCreatorName(e.target.value)}
                               placeholder="Full Name"
                               className="w-full h-16 rounded-[1.5rem] bg-white/5 border border-white/10 px-8 text-sm font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white/10 transition-all shadow-inner"
                            />
                         </div>

                         <div className="group/field space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Global Identity Proxy</label>
                            <div className="relative">
                               <AtSign className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                               <input
                                  value={handle}
                                  onChange={e => setHandle(e.target.value.replace("@", "").toLowerCase())}
                                  placeholder="Handle_Key"
                                  className="w-full h-16 rounded-[1.5rem] bg-white/5 border border-white/10 pl-16 pr-16 text-sm font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white/10 transition-all shadow-inner"
                               />
                               <div className="absolute right-8 top-1/2 -translate-y-1/2 transition-all">
                                 {handleStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-slate-600" />}
                                 {handleStatus === "available" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                 {handleStatus === "taken" && <XCircle className="w-5 h-5 text-rose-500" />}
                               </div>
                            </div>
                         </div>

                         <div className="group/field space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2">Deployment Sector</label>
                            <div className="relative">
                               <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                               <input
                                  value={city}
                                  onChange={e => { setCity(e.target.value); setShowCitySuggestions(true); }}
                                  onFocus={() => setShowCitySuggestions(true)}
                                  placeholder="Sector HQ"
                                  className="w-full h-16 rounded-[1.5rem] bg-white/5 border border-white/10 pl-16 pr-8 text-sm font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white/10 transition-all shadow-inner"
                               />
                            </div>
                            <AnimatePresence>
                               {showCitySuggestions && city.length > 0 && (
                                 <motion.div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-40 overflow-y-auto py-2">
                                   {INDIAN_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase())).map(c => (
                                     <button key={c} onClick={() => { setCity(c); setShowCitySuggestions(false); }} className="w-full text-left px-5 py-3 text-[10px] font-black text-slate-300 hover:bg-white/5 transition-all uppercase tracking-widest">{c}</button>
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
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Neural Linkage</h2>
                         <p className="text-xs font-black uppercase tracking-widest text-slate-500">Synchronize your existing intelligence nodes for cross-protocol data flow.</p>
                       </div>

                       <div className="space-y-3">
                          {[
                            { name: "Instagram", icon: Instagram, color: "text-pink-500" },
                            { name: "YouTube", icon: Youtube, color: "text-red-500" },
                            { name: "TikTok", icon: Zap, color: "text-slate-200" },
                          ].map(p => (
                            <div key={p.name} className={`p-6 rounded-[2rem] border flex items-center justify-between transition-all group ${connectedPlatforms[p.name]?.connected ? "bg-white/5 border-blue-600/50 shadow-xl shadow-blue-500/10" : "bg-white/5 border-white/5 hover:border-white/10"}`}>
                               <div className="flex items-center gap-6">
                                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${connectedPlatforms[p.name]?.connected ? "bg-blue-600 border-blue-600 text-white" : `bg-black/20 border-white/10 ${p.color}`}`}>
                                     <p.icon className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <p className="text-xs font-black uppercase tracking-widest text-white leading-none">{p.name}</p>
                                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2">{connectedPlatforms[p.name]?.connected ? `${connectedPlatforms[p.name].followers} DATA SYNCED` : "NETWORK OFFLINE"}</p>
                                  </div>
                               </div>
                               <button 
                                  onClick={() => connectPlatform(p.name)}
                                  disabled={connectedPlatforms[p.name]?.connecting || connectedPlatforms[p.name]?.connected}
                                  className={`h-11 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${connectedPlatforms[p.name]?.connected ? "bg-white text-slate-950" : "bg-white/10 border border-white/10 text-white hover:border-blue-600 active:scale-95 shadow-sm"}`}
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
                    <div className="w-full max-w-4xl flex flex-col items-center">
                       <div className="text-center space-y-2 mb-6 shrink-0">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Sector Specialization</h2>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Calibrate your domain expertise (Select up to 3 nodes).</p>
                       </div>

                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                          {niches.map(n => (
                            <button
                               key={n.label}
                               onClick={() => toggleNiche(n.label)}
                               className={`p-6 md:p-7 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden group active:scale-95 ${selectedNiches.includes(n.label) ? "border-blue-600 bg-white/10 shadow-2xl shadow-blue-500/20 ring-1 ring-blue-600" : "border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20"}`}
                            >
                               <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 transition-all duration-500 ${selectedNiches.includes(n.label) ? "bg-blue-600 text-white shadow-xl scale-110" : "bg-white/5 border border-white/10 text-slate-500 group-hover:scale-105"}`}>
                                  <n.icon className="w-7 h-7" />
                               </div>
                               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white leading-none">{n.label}</p>
                               {selectedNiches.includes(n.label) && (
                                 <div className="absolute top-6 right-6 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                    <Check className="w-3 h-3" />
                                 </div>
                               )}
                            </button>
                          ))}
                       </div>
                    </div>
                )}

                {/* STEP 3: GOALS */}
                {currentStep === 3 && (
                    <div className="w-full max-w-xl space-y-12">
                       <div className="text-center space-y-2">
                         <h2 className="text-4xl font-black uppercase tracking-tighter text-white">Objective Mapping</h2>
                         <p className="text-xs font-black uppercase tracking-widest text-slate-500">Define the core execution trajectory for your hub.</p>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {goalsList.map(g => (
                            <button 
                               key={g.label}
                               onClick={() => toggleGoal(g.label)}
                               className={`w-full p-6 rounded-[2rem] border flex items-center gap-6 transition-all text-left group active:scale-95 ${selectedGoals.includes(g.label) ? "bg-white/10 border-blue-600 shadow-xl shadow-blue-500/20" : "bg-white/5 border-white/5 hover:border-white/10"}`}
                            >
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${selectedGoals.includes(g.label) ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white/5 border-white/10 text-slate-600 group-hover:text-blue-500"}`}>
                                  <g.icon className="w-6 h-6" />
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white flex-1 leading-tight">{g.label}</span>
                               {selectedGoals.includes(g.label) && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                            </button>
                          ))}
                       </div>
                    </div>
                )}

                {/* STEP 4: INITIALIZE */}
                {currentStep === 4 && (
                    <div className="w-full max-w-lg space-y-12 text-center">
                       <div className="relative mx-auto w-48 h-48">
                          <div className="absolute inset-0 bg-blue-600/20 blur-[60px] rounded-full animate-pulse" />
                          <motion.div 
                            initial={{ scale: 0.8, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: "backOut" }}
                            className="w-full h-full rounded-[3.5rem] bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative z-10 overflow-hidden"
                          >
                             <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
                             <RefreshIcon className="w-20 h-20 text-blue-500 animate-spin" style={{ animationDuration: '4s' }} />
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-600 rounded-[1.5rem] border-4 border-slate-950 flex items-center justify-center shadow-2xl z-20"
                          >
                             <Check className="w-8 h-8 text-white" />
                          </motion.div>
                       </div>

                       <div className="space-y-4">
                          <h2 className="text-5xl font-black uppercase tracking-tighter text-white">System Activation</h2>
                          <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-relaxed">
                             Neural mapping synchronized. Deployment protocols online. Identity proxies established in the global cluster.
                          </p>
                       </div>

                       <div className="grid grid-cols-4 gap-2 px-10">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 className="h-full bg-blue-600 shadow-[0_0_8px_#2563eb]"
                                 initial={{ width: 0 }}
                                 animate={{ width: "100%" }}
                                 transition={{ delay: i * 0.25, duration: 0.8 }}
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
               className={`h-16 px-10 rounded-[1.5rem] border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 active:scale-95 ${currentStep === 0 || isInitializing ? "opacity-0 pointer-events-none" : "bg-white/5 text-slate-500 hover:text-white hover:border-white/20"}`}
            >
               <ArrowLeft className="w-5 h-5" /> Regression
            </button>

            <div className="hidden md:flex gap-2">
               {steps.map((_, i) => (
                 <div key={i} className={`w-3 h-3 rounded-full transition-all border ${i === currentStep ? "bg-blue-600 border-blue-600 w-8" : "bg-white/5 border-white/10"}`} />
               ))}
            </div>

            <button
               onClick={nextStep}
               disabled={isInitializing}
               className={`h-16 px-12 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center gap-4 active:scale-95 shadow-2xl ${isInitializing ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1"}`}
            >
               {isInitializing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Finalizing Node
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
