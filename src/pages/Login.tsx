import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome, Stars, Zap, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (val: string) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const handleBlurEmail = () => {
    const err = validateEmail(email);
    setErrors(prev => ({ ...prev, email: err }));
  };

  const handleBlurPassword = () => {
    if (!password) setErrors(prev => ({ ...prev, password: "Password is required" }));
    else setErrors(prev => ({ ...prev, password: "" }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const passwordErr = !password ? "Password is required" : "";
    if (emailErr || passwordErr) {
      setErrors({ email: emailErr, password: passwordErr });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call — 800ms delay
    await new Promise(r => setTimeout(r, 800));

    // Check against stored users in localStorage
    const users: any[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
    const found = users.find(u => u.email === email);

    if (!found || found.password !== btoa(password)) {
      setErrors({ general: "Incorrect email or password." });
      setIsLoading(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem("cf_remember", "true");
      localStorage.setItem("cf_session_expiry", String(Date.now() + 30 * 24 * 60 * 60 * 1000));
    } else {
      localStorage.setItem("cf_session_expiry", String(Date.now() + 24 * 60 * 60 * 1000));
    }

    login(email, password);
    toast.success("Welcome back! 🔥", { description: "Redirecting to your dashboard..." });
    setTimeout(() => navigate("/dashboard"), 900);
  };

  const handleGoogleOAuth = () => {
    toast.info("Google Sign-In", { description: "Connecting to Google... (simulated)" });
    setIsLoading(true);
    setTimeout(() => {
      const googleUser = { name: "Google User", email: "googleuser@gmail.com" };
      login(googleUser.email, "google-oauth");
      toast.success("Signed in with Google!", { description: "Welcome to CreatorForge." });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* High-Fidelity Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[480px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={() => navigate("/")} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-all mb-12 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Home
        </button>

        <div className="flex flex-col gap-4 mb-12">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-white">
               <Logo iconOnly iconClassName="w-10 h-10 shadow-none bg-transparent" />
               <span>CreatorForge<span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-slate-400 font-bold text-lg">Authorize Identity Node to access your creator suite.</p>
        </div>

        <div className="rounded-[2.5rem] md:rounded-[3rem] bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-10 md:p-12 shadow-2xl space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Stars className="w-20 h-20 text-blue-600" />
          </div>

          {/* Google OAuth - Premium SDK Look */}
          <button
            type="button"
            onClick={handleGoogleOAuth}
            disabled={isLoading}
            className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] text-white flex items-center justify-center gap-4 hover:border-blue-500 hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50 relative group/google overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600/0 group-hover/google:bg-blue-600/5 transition-colors" />
            <Chrome className="w-5 h-5 text-blue-500 relative z-10 transition-transform group-hover/google:scale-110" />
            <span className="relative z-10">Vault Sync via Google Intelligence</span>
          </button>

          <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            <div className="h-px flex-1 bg-white/5" />
            SECURE ACCESS
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-6 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black uppercase tracking-wider text-center"
              >
                {errors.general}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Neural Link (Email)</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                  onBlur={handleBlurEmail}
                  placeholder="operative@forge.ai"
                  className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                />
              </div>
              {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Protocol (Password)</label>
                <Link to="/forgot-password" title="Reset your password" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 hover:underline">Reset Key?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })); }}
                  onBlur={handleBlurPassword}
                  placeholder="••••••••"
                  className={`w-full h-16 rounded-2xl bg-white/5 border pl-14 pr-14 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-rose-500/50 focus:ring-rose-500/10" : "border-white/10 focus:ring-blue-500/20"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between px-1 transition-all">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-blue-600 border-blue-600" : "bg-white/5 border-white/10 group-hover:border-blue-500"}`}
                >
                  {rememberMe && <Check className="w-4 h-4 text-white stroke-[4]" />}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white">Persist Session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 mt-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" /> Authorizing...</>
              ) : (
                <>Authorize Identity <Zap className="w-3.5 h-3.5 fill-white" /></>
              )}
            </button>
          </form>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 text-center pt-4">
            New operative?{" "}
            <button onClick={() => navigate("/register")} className="text-blue-500 hover:text-blue-400 hover:underline">Establish Account</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
