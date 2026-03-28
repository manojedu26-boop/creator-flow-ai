import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User, ChevronRight, Eye, EyeOff, Chrome, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";

const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
  if (pw.length === 0) return { label: "", color: "", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "bg-rose-500", width: "25%" };
  if (pw.length < 8) return { label: "Fair", color: "bg-amber-500", width: "50%" };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10) return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  return { label: "Medium", color: "bg-blue-400", width: "75%" };
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    // Check if email already exists
    const users: any[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      setErrors({ email: "An account with this email already exists" });
      setIsLoading(false);
      return;
    }

    // Store user with hashed (btoa) password — simulated
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden py-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to home
        </button>

        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter mb-1 uppercase">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>CreatorForge</span><span className="text-primary">AI</span>
        </div>
        <p className="text-muted-foreground mb-8 text-sm font-medium">Join 5,000+ creators scaling their influence.</p>

        <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-5">
          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => {
              toast.info("Google Sign-Up", { description: "Connecting to Google... (simulated)" });
              setTimeout(() => { register("Google User", "googleuser@gmail.com"); navigate("/onboarding"); }, 1500);
            }}
            className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-[0.98]"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-white/5" />OR<div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Account Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {(["Creator", "Brand"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAccountType(t)}
                  className={`h-12 rounded-2xl border text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${accountType === t ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/40"}`}
                >
                  {t === "Creator" ? <Sparkles className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
                  onBlur={() => handleBlur("name", name)}
                  placeholder="Naveen Kumar"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.name ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
              </div>
              {errors.name && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => { const n = { ...p }; delete n.email; return n; }); }}
                  onBlur={() => handleBlur("email", email)}
                  placeholder="you@example.com"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
              </div>
              {errors.email && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                  onBlur={() => handleBlur("password", password)}
                  placeholder="Min. 8 characters"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-12 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.password ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="space-y-1 px-1">
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${strength.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${strength.color.replace("bg-", "text-")}`}>{strength.label} password</p>
                </div>
              )}
              {errors.password && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                  onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                  placeholder="Repeat your password"
                  className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-12 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.confirmPassword ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-2 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
              ) : (<>Create Account <ChevronRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-xs font-bold text-muted-foreground text-center">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline">Sign In</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
