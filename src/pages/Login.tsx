import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome } from "lucide-react";
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
        </button>

        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-1 uppercase">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>CreatorForge</span>
          <span className="text-primary">AI</span>
        </div>
        <p className="text-muted-foreground mb-8 text-sm">Welcome back. Sign in to your account.</p>

        <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-5">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleOAuth}
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/5" />OR<div className="h-px flex-1 bg-white/5" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold"
              >
                {errors.general}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                  onBlur={handleBlurEmail}
                  placeholder="you@example.com"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-primary hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })); }}
                  onBlur={handleBlurPassword}
                  placeholder="••••••••"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-12 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.password ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.password}</p>}
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-primary border-primary" : "border-white/20 group-hover:border-primary/50"}`}
              >
                {rememberMe && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-[12px] font-bold text-muted-foreground group-hover:text-white transition-colors">Remember me for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-2 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-xs font-bold text-muted-foreground text-center">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")} className="text-primary hover:underline">Sign up free</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
