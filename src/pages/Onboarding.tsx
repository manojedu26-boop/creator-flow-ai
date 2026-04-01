import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, MapPin, AtSign, CheckCircle2, XCircle, Loader2, Zap, Target, TrendingUp, DollarSign, BarChart3, Clock, Stars, Shield, Plane, BookOpen, Music2, Camera, Palette, Laptop, UtensilsCrossed, Dumbbell, Globe, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/db";

// ─── Confetti ──────────────────────────────────────────────────────────────
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#2563eb", "#3b82f6", "#6366f1", "#1e40af", "#4f46e5", "#818cf8"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const startX = Math.random() * 100;
  const size = Math.random() * 8 + 4;
  return (
    <motion.div
      className="absolute rounded-sm pointer-events-none"
      style={{ left: `${startX}vw`, top: "-20px", width: size, height: size, backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
      animate={{
        y: "110vh",
        opacity: [1, 1, 0],
        rotate: Math.random() * 720 - 360,
        x: (Math.random() - 0.5) * 200,
      }}
      transition={{ duration: Math.random() * 2 + 2, delay, ease: "linear" }}
    />
  );
};

const Confetti = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-50">
    {Array.from({ length: 80 }).map((_, i) => (
      <ConfettiParticle key={i} delay={i * 0.04} />
    ))}
  </div>
);

// ─── Niches & Goals ─────────────────────────────────────────────────────────
const niches = [
  { label: "Fitness", icon: Dumbbell, color: "text-orange-500", bg: "bg-orange-50", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop" },
  { label: "Lifestyle", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-50", image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=400&auto=format&fit=crop" },
  { label: "Beauty", icon: Heart, color: "text-pink-500", bg: "bg-pink-50", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&auto=format&fit=crop" },
  { label: "Tech", icon: Laptop, color: "text-slate-900", bg: "bg-slate-50", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop" },
  { label: "Food", icon: UtensilsCrossed, color: "text-amber-600", bg: "bg-amber-50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop" },
  { label: "Travel", icon: Plane, color: "text-emerald-600", bg: "bg-emerald-50", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop" },
  { label: "Finance", icon: DollarSign, color: "text-slate-900", bg: "bg-slate-50", image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=400&auto=format&fit=crop" },
  { label: "Gaming", icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop" },
  { label: "Fashion", icon: Palette, color: "text-purple-600", bg: "bg-purple-50", image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=400&auto=format&fit=crop" },
  { label: "Education", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400&auto=format&fit=crop" },
  { label: "Comedy", icon: Music2, color: "text-rose-500", bg: "bg-rose-50", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=400&auto=format&fit=crop" },
  { label: "Photo", icon: Camera, color: "text-slate-900", bg: "bg-slate-50", image: "https://images.unsplash.com/photo-1452784444945-3f4227083ea2?q=80&w=400&auto=format&fit=crop" }
];

const goalsList = [
  { label: "Grow my followers fast", icon: TrendingUp },
  { label: "Land premium brand deals", icon: Zap },
  { label: "Increase affiliate income", icon: DollarSign },
  { label: "Automate posting schedule", icon: Clock },
  { label: "Visualise data analytics", icon: BarChart3 },
  { label: "Establish personal brand", icon: Target },
];

type HandleStatus = "idle" | "checking" | "available" | "taken";
const TAKEN_HANDLES = ["naveen", "naveenfitlife", "admin", "creator", "user", "test"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1 — Creator Details
  const [creatorName, setCreatorName] = useState(user?.name || "");
  const [handle, setHandle] = useState((user?.handle || "").replace("@", ""));
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [handleStatus, setHandleStatus] = useState<HandleStatus>("idle");
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});

  // Step 2 — Platform Connection
  const [connectedPlatforms, setConnectedPlatforms] = useState<Record<string, { followers: string; connecting: boolean; connected: boolean }>>({});

  // Step 3 — Niche
  const [selectedNiches, setSelectedNiches] = useState<string[]>(user?.niche ? [user.niche] : []);
  const [nicheError, setNicheError] = useState("");

  // Step 4 — Goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalError, setGoalError] = useState("");

  // Step 5 — Welcome
  const [showConfetti, setShowConfetti] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!handle || handle.length < 3) { setHandleStatus("idle"); return; }
    setHandleStatus("checking");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const taken = TAKEN_HANDLES.includes(handle.toLowerCase());
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
      toast.success(`${platform} Synced! ✅`, { description: `Analytics for ${defaultFollowers[platform] || "5K"} followers loaded.` });
    }, 1800);
  };

  const toggleNiche = (n: string) => {
    setNicheError("");
    setSelectedNiches(prev => {
      if (prev.includes(n)) return prev.filter(x => x !== n);
      if (prev.length >= 3) { toast.error("Max 3 niches allowed"); return prev; }
      return [...prev, n];
    });
  };

  const toggleGoal = (g: string) => {
    setGoalError("");
    setSelectedGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const generateAiMessage = (name: string, niches: string[], goals: string[]) => {
    const firstName = name.split(" ")[0];
    const nicheStr = niches.join(" & ") || "content";
    const goalStr = goals[0]?.toLowerCase() || "grow";
    return `Hey ${firstName}! 🚀 Your AI Warroom is fully deployed. Based on your focus in ${nicheStr} and the objective to ${goalStr}, we've initialised a personalised growth trajectory. Your first intelligence drop is scheduled for 08:00 AM. Let's dominate.`;
  };

  const next = () => {
    if (step === 1) {
      const errs: Record<string, string> = {};
      if (!creatorName.trim()) errs.name = "Identity required";
      if (!handle) errs.handle = "Handle required";
      else if (handle.length < 3) errs.handle = "Handle too short";
      else if (handleStatus === "taken") errs.handle = "Handle taken";
      if (!city.trim()) errs.city = "Location required";
      if (Object.keys(errs).length) { setStep1Errors(errs); return; }
      updateUser({ name: creatorName, handle: `@${handle}` });
      db.update("users", user?.id || "u1", { name: creatorName, handle: `@${handle}` } as any);
    }
    if (step === 2) {
      const anyConnected = Object.values(connectedPlatforms).some(p => p.connected);
      if (!anyConnected) { toast.error("Sync at least one platform"); return; }
      const platforms = Object.keys(connectedPlatforms).filter(p => connectedPlatforms[p].connected);
      const followerCounts = Object.fromEntries(platforms.map(p => [p, connectedPlatforms[p].followers]));
      updateUser({ platforms, followerCounts });
    }
    if (step === 3) {
      if (selectedNiches.length === 0) { setNicheError("Select at least one specialty"); return; }
      updateUser({ niche: selectedNiches[0] });
      db.update("users", user?.id || "u1", { niche: selectedNiches[0] } as any);
    }
    if (step === 4) {
      if (selectedGoals.length === 0) { setGoalError("Define your objective"); return; }
      const msg = generateAiMessage(creatorName, selectedNiches, selectedGoals);
      setAiMessage(msg);
      setStep(5);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      return;
    }
    if (step === 5) {
      updateUser({ onboarded: true });
      navigate("/dashboard");
      return;
    }
    setStep(s => s + 1);
  };

  const back = () => {
    if (step > 1) setStep(s => s - 1);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20 relative overflow-hidden font-sans">
      {showConfetti && <Confetti />}
      
      {/* High-Fidelity Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[100px] opacity-50" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[580px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Progress System */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shadow-lg shadow-slate-200">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-950">CreatorForge Intelligence</span>
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Phase {step} // 5</span>
          </div>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map(s => (
              <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-slate-50 border border-slate-100">
                <motion.div
                  className={`h-full ${s === step ? "bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)]" : "bg-slate-200"}`}
                  initial={{ width: 0 }}
                  animate={{ width: s <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[3rem] bg-white border border-slate-100 p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Stars className="w-24 h-24 text-blue-600" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* STEP 1 — Creator Details */}
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-3 text-slate-950">Creator Identity</h2>
                    <p className="text-slate-500 font-bold text-lg">Initialize your profile to calibrate AI recommendations.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Legal Identity</label>
                      <input
                        type="text"
                        value={creatorName}
                        onChange={e => { setCreatorName(e.target.value); if (step1Errors.name) setStep1Errors(p => { const n = { ...p }; delete n.name; return n; }); }}
                        placeholder="Naveen Kumar"
                        className={`w-full h-16 rounded-2xl bg-slate-50 border px-6 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${step1Errors.name ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                      />
                      {step1Errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{step1Errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Visual Handle</label>
                      <div className="relative">
                        <AtSign className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={handle}
                          onChange={e => { setHandle(e.target.value.replace("@", "").toLowerCase()); if (step1Errors.handle) setStep1Errors(p => { const n = { ...p }; delete n.handle; return n; }); }}
                          placeholder="naveen.creates"
                          className={`w-full h-16 rounded-2xl bg-slate-50 border pl-14 pr-14 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${step1Errors.handle ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                          {handleStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-slate-300" />}
                          {handleStatus === "available" && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {handleStatus === "taken" && <XCircle className="w-5 h-5 text-rose-500" />}
                        </div>
                      </div>
                      {handleStatus === "available" && <p className="text-emerald-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">✓ @{handle} protocol available</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">HQ Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={city}
                            onChange={e => { setCity(e.target.value); if (step1Errors.city) setStep1Errors(p => { const n = { ...p }; delete n.city; return n; }); }}
                            placeholder="Mumbai"
                            className={`w-full h-14 rounded-2xl bg-slate-50 border pl-10 pr-4 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${step1Errors.city ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-100 focus:ring-blue-600/10"}`}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Region</label>
                        <select
                          value={country}
                          onChange={e => setCountry(e.target.value)}
                          className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-100 px-4 text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600/10 appearance-none cursor-pointer"
                        >
                          {["India", "USA", "UK", "UAE", "Singapore", "Australia", "Other"].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Platform Connection */}
              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-3 text-slate-950">Sync Intelligence</h2>
                    <p className="text-slate-500 font-bold text-lg">Connect nodes to primary social platforms.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Instagram", icon: Instagram, color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", desc: "Engine for Reels & Stories" },
                      { name: "YouTube", icon: Youtube, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "Terminal for Video Metrics" },
                      { name: "TikTok", icon: Zap, color: "text-slate-950", bg: "bg-slate-50", border: "border-slate-200", desc: "Viral Trajectory Hub" },
                    ].map(p => {
                      const state = connectedPlatforms[p.name];
                      const connected = state?.connected;
                      const connecting = state?.connecting;
                      return (
                        <div
                          key={p.name}
                          className={`p-6 rounded-[2rem] border transition-all ${connected ? "border-blue-600 bg-blue-50/30" : "border-slate-100 bg-white hover:bg-slate-50"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${p.border} ${p.bg}`}>
                                <p.icon className={`w-6 h-6 ${p.color}`} />
                              </div>
                              <div>
                                <p className="font-black text-sm text-slate-950 uppercase tracking-tight">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{p.desc}</p>
                                {connected && (
                                  <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> {state.followers} Data Nodes Synced
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => connectPlatform(p.name)}
                              disabled={connecting || connected}
                              className={`h-12 px-6 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-2 ${
                                connected
                                  ? "bg-slate-950 text-white border-none cursor-default"
                                  : "bg-white border border-slate-200 text-slate-950 hover:border-blue-600 hover:text-blue-600"
                              }`}
                            >
                              {connecting ? "Syncing..." : connected ? "Synced" : "Deploy Sync"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-blue-600 transition-colors"
                  >
                    Bypass Synchronisation // Deploy Post-Setup
                  </button>
                </div>
              )}

              {/* STEP 3 — Niche Selection */}
              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-3 text-slate-950">Module Focus</h2>
                    <p className="text-slate-500 font-bold text-lg">Define 1–3 specialisations for AI content optimization.</p>
                  </div>
                  
                  {nicheError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1">{nicheError}</p>}
                  
                  <div className="grid grid-cols-3 gap-4">
                    {niches.map(n => (
                      <button
                        key={n.label}
                        onClick={() => toggleNiche(n.label)}
                        className={`relative p-5 rounded-[2rem] border text-center transition-all group overflow-hidden active:scale-[0.95] ${
                          selectedNiches.includes(n.label)
                            ? "border-blue-600 bg-blue-50 text-blue-600 shadow-xl shadow-blue-500/10"
                            : "border-slate-200 bg-slate-50/50 text-slate-400 hover:border-blue-600 hover:text-slate-950"
                        }`}
                      >
                        {/* Hover Background Image */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                          <img src={n.image} alt={n.label} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-white/60" />
                        </div>
                        
                        <div className="relative z-10 transition-transform group-hover:scale-110 duration-500">
                          <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-3 shadow-sm transition-colors ${selectedNiches.includes(n.label) ? "bg-blue-600 text-white" : "bg-white text-slate-400 group-hover:text-blue-600"}`}>
                            <n.icon className="w-5 h-5" />
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-[0.1em]">{n.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 — Goals */}
              {step === 4 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-3 text-slate-950">Command Objectives</h2>
                    <p className="text-slate-500 font-bold text-lg">Establishing target parameters for AI strategy generation.</p>
                  </div>
                  
                  {goalError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1">{goalError}</p>}

                  <div className="space-y-4">
                    {goalsList.map(g => (
                      <button
                        key={g.label}
                        onClick={() => toggleGoal(g.label)}
                        className={`w-full flex items-center gap-5 p-6 rounded-[2rem] border text-left transition-all group active:scale-[0.98] ${
                          selectedGoals.includes(g.label)
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${selectedGoals.includes(g.label) ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-50 border-slate-100 text-slate-400 group-hover:text-slate-950"}`}>
                          <g.icon className="w-6 h-6" />
                        </div>
                        <span className="font-black text-sm flex-1 uppercase tracking-tight">{g.label}</span>
                        {selectedGoals.includes(g.label) && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 — Welcome */}
              {step === 5 && (
                <div className="text-center space-y-8 py-4">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 rounded-[2rem] bg-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-slate-300 group"
                  >
                    <Sparkles className="w-12 h-12 text-blue-600 group-hover:scale-110 transition-transform" />
                  </motion.div>

                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-950">Warroom Deployed 🚀</h2>
                    <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-sm mx-auto">{aiMessage}</p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-[2.5rem] bg-slate-50 border border-slate-100 p-8 text-left space-y-5"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 flex items-center gap-2">
                       <Zap className="w-3 h-3 fill-blue-600" /> Primary Calibration Results:
                    </p>
                    <ul className="grid gap-4">
                      {[
                        `AI content studio tuned for ${selectedNiches.join(" & ")|| "Creativity"}`,
                        `Synchronized schedule for your connected hub`,
                        `Growth strategy aligned with: ${selectedGoals[0]?.split(' ')[0] || "Empire"} goals`,
                        `Proprietary Brand CRT pipeline established`,
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-tight text-slate-950">
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                             <Check className="w-3 h-3 text-white stroke-[4]" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-12">
            {step > 1 && step < 5 ? (
              <button 
                onClick={back} 
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 hover:text-slate-950 transition-all group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Re-Calibrate
              </button>
            ) : <div />}

            <button
              onClick={next}
              className="group h-16 px-12 rounded-[2rem] bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-[0.95] transition-all flex items-center gap-4"
            >
              {step === 5 ? "Launch Command Centre" : "Initialize Next Phase"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
           © 2026 CreatorForge Intelligence • All Systems Operational
        </p>
      </motion.div>
    </div>
  );
};

export default Onboarding;
