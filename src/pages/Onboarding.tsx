import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, Check, Instagram, Youtube, MapPin, 
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

  const connectPlatform = (platform: string) => {
    if (connectedPlatforms[platform]?.connected) return;
    setConnectedPlatforms(prev => ({ ...prev, [platform]: { followers: "", connecting: true, connected: false } }));
    setTimeout(() => {
      const defaultFollowers: Record<string, string> = { Instagram: "48.2K", YouTube: "12.8K", TikTok: "31.5K" };
      setConnectedPlatforms(prev => ({
        ...prev,
        [platform]: { followers: defaultFollowers[platform] || "5K", connecting: false, connected: true }
      }));
      toast.info(`Engine mapping for ${platform} complete.`, {
        className: "bg-slate-950 text-white border-slate-800"
      });
    }, 1500);
  };

  const handleLaunch = () => {
    const errs: Record<string, string> = {};
    if (!creatorName.trim()) errs.name = "Required";
    if (!handle || handleStatus === "taken") errs.handle = "Invalid handle";
    if (!city.trim()) errs.city = "Required";
    if (!Object.values(connectedPlatforms).some(p => p.connected)) errs.sync = "Sync at least one platform";
    if (selectedNiches.length === 0) errs.niche = "Select specialization";
    if (selectedGoals.length === 0) errs.goal = "Define objective";

    if (Object.keys(errs).length) {
      setErrors(errs);
      toast.error("Initialization Failed", { description: "Verify all intelligence modules." });
      return;
    }

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
    setErrors(p => { const n = { ...p }; delete n.niche; return n; });
  };

  const toggleGoal = (label: string) => {
    setSelectedGoals(prev => prev.includes(label) ? prev.filter(x => x !== label) : [...prev, label]);
    setErrors(p => { const n = { ...p }; delete n.goal; return n; });
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden font-sans select-none relative">
      {/* High-Fidelity Ambient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,_#f8fafc_0%,_#ffffff_100%)]" />
      
      <div className="w-full max-w-[1400px] h-full flex flex-col gap-6 md:gap-8 overflow-hidden">
        {/* Header Section */}
        <header className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.2rem] bg-slate-950 flex items-center justify-center shadow-xl shadow-slate-200">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-slate-950">Command Centre Initialization</h1>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Phase 01 // Neuro-Mapping & Intel Alignment</p>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             <span>Protocol: <span className="text-emerald-500">v3.11</span></span>
             <span>Identity Proxy: <span className="text-slate-950">Encrypted</span></span>
          </div>
        </header>

        {/* The Bento Grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 md:gap-6 min-h-0 overflow-hidden">
          
          {/* Column 1: Identity & Sync */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 md:gap-6 overflow-y-auto no-scrollbar pr-1 pb-4">
             {/* 1.1 Identity Module */}
             <section className="bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-slate-400" />
                   </div>
                   <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">Creator Identity</h2>
                </div>

                <div className="space-y-4">
                   <div className="relative">
                      <input
                        type="text"
                        value={creatorName}
                        onChange={e => { setCreatorName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                        placeholder="Legal Identity Name"
                        className={`w-full h-12 md:h-14 rounded-2xl bg-white border px-6 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-100 focus:ring-blue-600/10"}`}
                      />
                      {errors.name && <p className="text-[8px] font-black uppercase tracking-widest text-rose-500 mt-2 ml-1">Calibration Required</p>}
                   </div>

                   <div className="relative">
                      <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={handle}
                        onChange={e => { setHandle(e.target.value.replace("@", "").toLowerCase()); setErrors(p => ({ ...p, handle: "" })); }}
                        placeholder="Visual Handle"
                        className={`w-full h-12 md:h-14 rounded-2xl bg-white border pl-12 pr-12 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.handle ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-100 focus:ring-blue-600/10"}`}
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2">
                        {handleStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-slate-300" />}
                        {handleStatus === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {handleStatus === "taken" && <XCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                   </div>

                   <div className="relative">
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="text"
                          value={city}
                          onChange={e => { setCity(e.target.value); setShowCitySuggestions(true); setErrors(p => ({ ...p, city: "" })); }}
                          onFocus={() => setShowCitySuggestions(true)}
                          placeholder="HQ Location (e.g. Mumbai)"
                          className={`w-full h-12 md:h-14 rounded-2xl bg-white border pl-12 pr-6 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.city ? "border-rose-300 focus:ring-rose-500/20" : "border-slate-100 focus:ring-blue-600/10"}`}
                        />
                      </div>
                      <AnimatePresence>
                        {showCitySuggestions && city.length > 0 && (
                          <motion.div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 max-h-40 overflow-y-auto py-2 border-t-0 rounded-t-none">
                            {INDIAN_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase())).map(c => (
                              <button key={c} onClick={() => { setCity(c); setShowCitySuggestions(false); }} className="w-full text-left px-5 py-3 text-[9px] font-black text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest">{c}</button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
             </section>

             {/* 1.2 Platform Sync */}
             <section className="bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 space-y-6 flex-1">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                         <RefreshIcon className="w-4 h-4 text-slate-400" />
                      </div>
                      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">Intelligence Sync</h2>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {[
                     { name: "Instagram", icon: Instagram, color: "text-pink-600" },
                     { name: "YouTube", icon: Youtube, color: "text-red-600" },
                     { name: "TikTok", icon: Zap, color: "text-slate-950" },
                   ].map(p => (
                     <div key={p.name} className={`p-4 rounded-3xl border flex items-center justify-between transition-all group ${connectedPlatforms[p.name]?.connected ? "bg-white border-blue-600/20 shadow-lg shadow-blue-500/5" : "bg-white/50 border-slate-100"}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${connectedPlatforms[p.name]?.connected ? "bg-blue-600 border-blue-600 text-white" : `bg-white border-slate-100 ${p.color}`}`}>
                              <p.icon className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-950 leading-none">{p.name}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{connectedPlatforms[p.name]?.connected ? `${connectedPlatforms[p.name].followers} Synced` : "Offline"}</p>
                           </div>
                        </div>
                        <button 
                           onClick={() => connectPlatform(p.name)}
                           disabled={connectedPlatforms[p.name]?.connecting || connectedPlatforms[p.name]?.connected}
                           className={`h-9 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${connectedPlatforms[p.name]?.connected ? "bg-slate-950 text-white" : "bg-white border border-slate-200 text-slate-950 hover:border-blue-600 active:scale-95"}`}
                        >
                           {connectedPlatforms[p.name]?.connecting ? "SYNC..." : connectedPlatforms[p.name]?.connected ? "READY" : "DEPLOY"}
                        </button>
                     </div>
                   ))}
                </div>
                {errors.sync && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest text-center mt-4">Node Linkage Required</p>}
             </section>
          </div>

          {/* Column 2: Module Focus */}
          <div className="col-span-12 lg:col-span-4 flex flex-col h-full overflow-hidden">
             <section className="h-full bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                         <Target className="w-4 h-4 text-slate-400" />
                      </div>
                      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">Module Specialization</h2>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar pb-6 flex-1">
                   {niches.map(n => (
                     <button
                        key={n.label}
                        onClick={() => toggleNiche(n.label)}
                        className={`p-5 md:p-6 rounded-[2rem] border text-center transition-all duration-300 relative overflow-hidden group active:scale-95 ${selectedNiches.includes(n.label) ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-1 ring-blue-600" : "border-slate-100 bg-white/40 hover:bg-white hover:border-blue-200"}`}
                     >
                        <div className={`w-10 h-10 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-all ${selectedNiches.includes(n.label) ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-400"}`}>
                           <n.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-950 leading-none">{n.label}</p>
                        {selectedNiches.includes(n.label) && <Check className="absolute top-4 right-4 w-3.5 h-3.5 text-blue-600" />}
                     </button>
                   ))}
                </div>
                {errors.niche && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest text-center mt-4">Select Focus Area</p>}
             </section>
          </div>

          {/* Column 3: Objectives */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 md:gap-6 overflow-hidden h-full">
             <section className="flex-1 bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8 shrink-0">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                         <Zap className="w-4 h-4 text-slate-400" />
                      </div>
                      <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">Command Objectives</h2>
                   </div>
                </div>

                <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pb-4">
                   {goalsList.map(g => (
                     <button 
                        key={g.label}
                        onClick={() => toggleGoal(g.label)}
                        className={`w-full p-5 md:p-6 rounded-3xl border flex items-center gap-5 transition-all text-left group active:scale-95 ${selectedGoals.includes(g.label) ? "bg-white border-blue-600 shadow-xl shadow-blue-500/10" : "bg-white/40 border-slate-100 hover:border-blue-200"}`}
                     >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${selectedGoals.includes(g.label) ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-50 text-slate-400 group-hover:text-blue-600"}`}>
                           <g.icon className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 flex-1">{g.label}</span>
                        {selectedGoals.includes(g.label) && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                     </button>
                   ))}
                </div>
                {errors.goal && <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest text-center mt-4">Vector Mapping Required</p>}
             </section>

             {/* Deployment Action */}
             <section className="bg-slate-950 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 shadow-2xl shadow-slate-300 shrink-0">
                <button 
                   onClick={handleLaunch}
                   disabled={isInitializing}
                   className="w-full h-14 md:h-16 rounded-[1.2rem] md:rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center gap-4 transition-all hover:bg-blue-700 active:scale-[0.98] group disabled:bg-slate-800"
                >
                   {isInitializing ? (
                     <Loader2 className="w-5 h-5 animate-spin" />
                   ) : (
                     <>
                        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Initialize Command Hub</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                     </>
                   )}
                </button>
                <p className="mt-4 text-center text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                   Executing Protocol Sequence v3.11.02
                </p>
             </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Onboarding;
