import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User, ChevronRight, Eye, EyeOff, Chrome, Briefcase, Zap, Stars, CheckCircle2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";
import { Logo } from "@/components/shared/Logo";
import { supabase } from "../lib/supabase";
import { cn } from "@/lib/utils";

const getPasswordStrength = (pw: string): { label: string; color: string; barColor: string; width: string } => {
  if (pw.length === 0) return { label: "", color: "", barColor: "", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "text-rose-500", barColor: "bg-rose-500", width: "25%" };
  if (pw.length < 8) return { label: "Fair", color: "text-amber-500", barColor: "bg-amber-500", width: "50%" };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10) return { label: "Strong", color: "text-emerald-500", barColor: "bg-emerald-500", width: "100%" };
  return { label: "Medium", color: "text-blue-500", barColor: "bg-blue-500", width: "75%" };
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"Creator" | "Brand">("Creator");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"options" | "email">("options");
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<null | number>(null);

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleBlur = (field: string, value: string) => {
    const all = validate();
    if (all[field]) setErrors(prev => ({ ...prev, [field]: all[field] }));
    else setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));

    const users: any[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      setErrors({ email: "An account with this email already exists" });
      setIsLoading(false);
      return;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: btoa(password),
      type: accountType,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem("cf_users", JSON.stringify([...users, newUser]));

    register(name, email);

    toast.success("Account created! 🎉", { description: "Welcome to CreatorForge. Finishing your setup..." });
    setTimeout(() => navigate("/onboarding"), 1100);
  };

  const handleGoogleOAuth = async () => {
    if (!supabase) {
      toast.error("Configuration Missing", { 
        description: "Supabase keys not found. Please add them to your Vercel Dashboard.",
        duration: 5000
      });
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Authentication Failed", { description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Google Identity Picker Modal */}
      <AnimatePresence>
        {showGooglePicker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGooglePicker(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[400px] bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-white">Identity Cluster</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Select authorization node</p>
                </div>
                <button onClick={() => setShowGooglePicker(false)} className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="p-4 space-y-2">
                {/* Real OAuth Trigger Buttons */}
                <button
                  onClick={handleGoogleOAuth}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all text-left relative group border border-white/5 hover:border-blue-500/50"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20">
                    <Chrome className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Authorize via Google</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fast Sync Protocol</p>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full bg-emerald-500 animate-pulse")} />
                </button>

                <button 
                  onClick={handleGoogleOAuth}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                    <User className="w-5 h-5 text-slate-500 group-hover:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">Use another account</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Standard SDK Auth</p>
                  </div>
                </button>
              </div>
              <div className="p-8 bg-black/20 border-t border-white/5 text-[10px] text-slate-500 leading-relaxed font-bold">
                Verification required: Google will share your identity metadata with the CreatorForge security cluster.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden font-sans py-20 text-white">
      {/* High-Fidelity Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[520px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }}
      >
        <button onClick={() => navigate("/")} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-all mb-12 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Home
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-white">
            <Logo iconOnly iconClassName="w-10 h-10 shadow-none bg-transparent" />
            <span>CreatorForge<span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-slate-400 font-bold text-lg">Join 5,000+ operatives scaling their empire.</p>
        </div>

        <AnimatePresence mode="wait">
          {view === "options" ? (
            <motion.div
              key="options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2.5rem] md:rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-slate-200/60 p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] space-y-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Stars className="w-20 h-20 text-blue-600" />
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-950 mb-2">Initialize Hub</h2>
                <p className="text-slate-500 font-bold text-sm">Select your preferred authentication node.</p>
              </div>

              <div className="space-y-4">
                {/* Google OAuth Option */}
                <button
                  type="button"
                  onClick={() => setShowGooglePicker(true)}
                  className="w-full h-24 rounded-3xl bg-white/5 border border-white/10 p-6 flex items-center gap-6 hover:border-blue-500 hover:bg-white/10 transition-all active:scale-[0.98] group/opt overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-blue-600/0 group-hover/opt:bg-blue-600/5 transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/opt:bg-white group-hover/opt:border-blue-200 transition-all relative z-10">
                    <Chrome className="w-6 h-6 text-blue-500 group-hover/opt:scale-110 transition-transform" />
                  </div>
                  <div className="text-left relative z-10 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-1">Sync with Google Intelligence cluster</p>
                    <p className="text-[10px] text-slate-500 font-bold">Accelerated deployment • Zero configuration</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover/opt:translate-x-1 group-hover/opt:text-blue-500 transition-all relative z-10" />
                </button>

                {/* Email Option */}
                <button
                  type="button"
                  onClick={() => setView("email")}
                  className="w-full h-24 rounded-3xl bg-white/5 border border-white/10 p-6 flex items-center gap-6 hover:border-white/20 hover:bg-white/10 transition-all active:scale-[0.98] group/opt overflow-hidden relative"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover/opt:bg-white group-hover/opt:text-slate-950 group-hover/opt:scale-110 transition-all relative z-10">
                    <Mail className="w-6 h-6 text-slate-500 group-hover/opt:text-slate-950 transition-all" />
                  </div>
                  <div className="text-left relative z-10 flex-1">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white mb-1">Establish Neural Link via Email</p>
                    <p className="text-[10px] text-slate-500 font-bold">Standard secure encryption protocol</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover/opt:translate-x-1 group-hover/opt:text-white transition-all relative z-10" />
                </button>
              </div>
              <div className="pt-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  Secured by CreatorForge Quantum Guard Protocol
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2.5rem] md:rounded-[3rem] bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-10 md:p-12 shadow-2xl space-y-8 relative overflow-hidden group"
            >
              <button 
                onClick={() => setView("options")}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Switch Auth Protocol
              </button>
              <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Stars className="w-20 h-20 text-blue-600" />
              </div>

              {/* Account Type */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Operative Designation</label>
                <div className="grid grid-cols-2 gap-4">
                  {(["Creator", "Brand"] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAccountType(t as any)}
                      className={`h-14 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${accountType === t ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20 scale-[1.02]" : "bg-white/5 border-white/10 text-slate-500 hover:border-blue-500 hover:text-white"}`}
                    >
                      {t === "Creator" ? <Sparkles className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      {t === "Creator" ? "Intelligence Node" : "Corporate Entity"}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Full Identity (Legal Name)</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
                      onBlur={() => handleBlur("name", name)}
                      placeholder="Operative Name"
                      className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                    />
                  </div>
                  {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Primary Intelligence Link (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => { const n = { ...p }; delete n.email; return n; }); }}
                      onBlur={() => handleBlur("email", email)}
                      placeholder="contact@forge.ai"
                      className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                    />
                  </div>
                  {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Security Protocol (Password)</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                      onBlur={() => handleBlur("password", password)}
                      placeholder="Min. 8 characters"
                      className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-14 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {password.length > 0 && (
                    <div className="space-y-2 px-1">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${(strength as any).barColor}`}
                          initial={{ width: 0 }}
                          animate={{ width: strength.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${strength.color}`}>{strength.label} Verification Level</p>
                    </div>
                  )}
                  {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Verify Protocol</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                      onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                      placeholder="Repeat protocol"
                      className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-14 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-16 mt-6 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" /> Authorizing account cluster...</>
                  ) : (<>Establish Identity <ChevronRight className="w-4 h-4" /></>)}
                </button>
              </form>

              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center pt-4">
                Existing operative?{" "}
                <button onClick={() => navigate("/login")} className="text-blue-500 hover:text-blue-400 hover:underline">Re-Initialize Session</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </>
  );
};

export default Register;
