import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube, MapPin, AtSign, CheckCircle2, XCircle, Loader2, Zap, Target, TrendingUp, DollarSign, BarChart3, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/db";

// ─── Confetti ──────────────────────────────────────────────────────────────
const ConfettiParticle = ({ delay }: { delay: number }) => {
  const colors = ["#FF3CAC", "#784BA0", "#2B86C5", "#10b981", "#f59e0b", "#ef4444"];
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
  { label: "Fitness", emoji: "💪" }, { label: "Lifestyle", emoji: "✨" },
  { label: "Beauty", emoji: "💄" }, { label: "Tech", emoji: "⚡" },
  { label: "Food", emoji: "🍜" }, { label: "Travel", emoji: "✈️" },
  { label: "Finance", emoji: "💰" }, { label: "Gaming", emoji: "🎮" },
  { label: "Fashion", emoji: "👗" }, { label: "Education", emoji: "📚" },
  { label: "Comedy", emoji: "😄" }, { label: "Other", emoji: "🌟" }
];

const goalsList = [
  { label: "Grow my followers fast", icon: TrendingUp },
  { label: "Land brand deals", icon: Zap },
  { label: "Increase my income", icon: DollarSign },
  { label: "Post consistently", icon: Clock },
  { label: "Understand my analytics", icon: BarChart3 },
  { label: "Build a personal brand", icon: Target },
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

  // Debounced handle check
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
      toast.success(`${platform} Connected! ✅`, { description: `${defaultFollowers[platform] || "5K"} followers imported.` });
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
    return `Hey ${firstName}! 🚀 Your AI warroom is ready. Based on your ${nicheStr} focus and goal to ${goalStr}, I've built a personalised growth strategy and content calendar. Your first AI action plan drops at 8:00 AM tomorrow. Let's build something incredible.`;
  };

  const next = () => {
    if (step === 1) {
      const errs: Record<string, string> = {};
      if (!creatorName.trim()) errs.name = "Full name is required";
      if (!handle) errs.handle = "Handle is required";
      else if (handle.length < 3) errs.handle = "Handle must be at least 3 characters";
      else if (handleStatus === "taken") errs.handle = "This handle is taken — try another";
      else if (handleStatus === "checking") errs.handle = "Please wait while we check availability";
      if (!city.trim()) errs.city = "City is required";
      if (Object.keys(errs).length) { setStep1Errors(errs); return; }
      updateUser({ name: creatorName, handle: `@${handle}` });
      db.update("users", user?.id || "u1", { name: creatorName, handle: `@${handle}` } as any);
    }

    if (step === 2) {
      const anyConnected = Object.values(connectedPlatforms).some(p => p.connected);
      if (!anyConnected) {
        toast.error("Connect at least one platform", { description: "You can always add more later in Settings." });
        return;
      }
      const platforms = Object.keys(connectedPlatforms).filter(p => connectedPlatforms[p].connected);
      const followerCounts = Object.fromEntries(platforms.map(p => [p, connectedPlatforms[p].followers]));
      updateUser({ platforms, followerCounts });
    }

    if (step === 3) {
      if (selectedNiches.length === 0) { setNicheError("Select at least one niche"); return; }
      updateUser({ niche: selectedNiches[0] });
      db.update("users", user?.id || "u1", { niche: selectedNiches[0] } as any);
    }

    if (step === 4) {
      if (selectedGoals.length === 0) { setGoalError("Select at least one goal"); return; }
    }

    if (step === 4) {
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      {showConfetti && <Confetti />}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: s <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Step {step} of 5</div>

        <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1 — Creator Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Your Creator Identity</h2>
                    <p className="text-sm text-muted-foreground">Tell us about yourself so we can personalise everything.</p>
                  </div>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                    <input
                      type="text"
                      value={creatorName}
                      onChange={e => { setCreatorName(e.target.value); if (step1Errors.name) setStep1Errors(p => { const n = { ...p }; delete n.name; return n; }); }}
                      placeholder="e.g. Naveen Kumar"
                      className={`w-full h-14 rounded-2xl bg-white/5 border px-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${step1Errors.name ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                    />
                    {step1Errors.name && <p className="text-rose-400 text-[11px] font-bold">{step1Errors.name}</p>}
                  </div>

                  {/* Handle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Display Handle</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={handle}
                        onChange={e => { setHandle(e.target.value.replace("@", "").toLowerCase()); if (step1Errors.handle) setStep1Errors(p => { const n = { ...p }; delete n.handle; return n; }); }}
                        placeholder="yourcreatorname"
                        className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-12 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${step1Errors.handle ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {handleStatus === "checking" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                        {handleStatus === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {handleStatus === "taken" && <XCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                    </div>
                    {handleStatus === "available" && <p className="text-emerald-500 text-[11px] font-bold">✓ @{handle} is available!</p>}
                    {handleStatus === "taken" && <p className="text-rose-400 text-[11px] font-bold">✗ @{handle} is taken — try @{handle}fits or @{handle}creates</p>}
                    {step1Errors.handle && handleStatus !== "available" && handleStatus !== "taken" && <p className="text-rose-400 text-[11px] font-bold">{step1Errors.handle}</p>}
                  </div>

                  {/* City & Country */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={city}
                          onChange={e => { setCity(e.target.value); if (step1Errors.city) setStep1Errors(p => { const n = { ...p }; delete n.city; return n; }); }}
                          placeholder="Mumbai"
                          className={`w-full h-12 rounded-2xl bg-white/5 border pl-10 pr-3 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${step1Errors.city ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                        />
                      </div>
                      {step1Errors.city && <p className="text-rose-400 text-[11px] font-bold">{step1Errors.city}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Country</label>
                      <select
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-3 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer"
                      >
                        {["India", "USA", "UK", "Canada", "Australia", "UAE", "Singapore", "Germany", "France", "Brazil", "Other"].map(c => (
                          <option key={c} value={c} className="bg-zinc-900">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — Platform Connection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Connect Your Platforms</h2>
                    <p className="text-sm text-muted-foreground">Connect at least one platform to import your data.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: "Instagram", icon: Instagram, color: "text-pink-500 border-pink-500/30 bg-pink-500/10", desc: "Reels, Stories & Feed Analytics" },
                      { name: "YouTube", icon: Youtube, color: "text-red-500 border-red-500/30 bg-red-500/10", desc: "Video Performance & Subscribers" },
                      { name: "TikTok", icon: Sparkles, color: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10", desc: "For You Page & Viral Metrics" },
                    ].map(p => {
                      const state = connectedPlatforms[p.name];
                      const connected = state?.connected;
                      const connecting = state?.connecting;
                      return (
                        <div
                          key={p.name}
                          className={`p-5 rounded-3xl border transition-all ${connected ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/5"}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${p.color}`}>
                                <p.icon className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="font-black text-sm">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground font-bold">{p.desc}</p>
                                {connected && (
                                  <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">
                                    ✓ {state.followers} followers imported
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => connectPlatform(p.name)}
                              disabled={connecting || connected}
                              className={`h-10 px-5 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center gap-2 ${
                                connected
                                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 cursor-default"
                                  : "bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white disabled:opacity-70"
                              }`}
                            >
                              {connecting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Connecting...</> : connected ? <><Check className="w-3.5 h-3.5" /> Connected</> : "Connect"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => { toast.info("You can connect platforms later in Settings."); setStep(3); }}
                    className="w-full text-[11px] font-bold text-muted-foreground hover:text-white transition-colors"
                  >
                    Skip for now → Connect later in Settings
                  </button>
                </div>
              )}

              {/* STEP 3 — Niche Selection */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Your Content Niche</h2>
                    <p className="text-sm text-muted-foreground">Select 1–3 niches that best describe your content.</p>
                  </div>
                  {nicheError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-[11px] font-bold">
                      {nicheError}
                    </motion.p>
                  )}
                  <div className="grid grid-cols-3 gap-2.5">
                    {niches.map(n => (
                      <button
                        key={n.label}
                        onClick={() => toggleNiche(n.label)}
                        className={`p-3.5 rounded-2xl border text-center transition-all active:scale-[0.97] ${
                          selectedNiches.includes(n.label)
                            ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className="text-lg mb-1">{n.emoji}</div>
                        <div className="text-[11px] font-black uppercase tracking-tight">{n.label}</div>
                      </button>
                    ))}
                  </div>
                  {selectedNiches.length > 0 && (
                    <p className="text-[11px] font-bold text-muted-foreground text-center">
                      Selected: <span className="text-primary">{selectedNiches.join(", ")}</span> ({selectedNiches.length}/3)
                    </p>
                  )}
                </div>
              )}

              {/* STEP 4 — Goals */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Your Creator Goals</h2>
                    <p className="text-sm text-muted-foreground">These drive your AI's weekly action plan. Select all that apply.</p>
                  </div>
                  {goalError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 text-[11px] font-bold">
                      {goalError}
                    </motion.p>
                  )}
                  <div className="space-y-2.5">
                    {goalsList.map(g => (
                      <button
                        key={g.label}
                        onClick={() => toggleGoal(g.label)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                          selectedGoals.includes(g.label)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${selectedGoals.includes(g.label) ? "bg-primary/20 border-primary/40" : "bg-white/5 border-white/10"}`}>
                          <g.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm flex-1">{g.label}</span>
                        {selectedGoals.includes(g.label) && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 — Welcome */}
              {step === 5 && (
                <div className="text-center space-y-6 py-2">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center mx-auto shadow-2xl shadow-primary/30"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Your Warroom is Ready! 🚀</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{aiMessage}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-2xl bg-white/5 border border-white/10 p-5 text-left space-y-3"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">✨ Your personalised dashboard includes:</p>
                    <ul className="space-y-2">
                      {[
                        `AI content ideas for ${selectedNiches.join(" & ") || "your niche"}`,
                        `Optimal posting schedule for ${Object.keys(connectedPlatforms).filter(p => connectedPlatforms[p].connected)[0] || "your platforms"}`,
                        `Growth strategy tailored to: ${selectedGoals[0] || "your goals"}`,
                        `Brand deal rate calculator based on your followers`,
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 && step < 5 ? (
              <button onClick={back} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
              </button>
            ) : <div />}

            <button
              onClick={next}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 font-black text-[11px] uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              {step === 5 ? "Go to My Dashboard" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
