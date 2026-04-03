import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User, ChevronRight, Eye, EyeOff, Chrome, Briefcase, Zap, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "../contexts/AuthContext";

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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden font-sans py-20">
      {/* High-Fidelity Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[100px] opacity-50" />
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
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-slate-950">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span>CreatorForge<span className="text-blue-600">AI</span></span>
          </div>
          <p className="text-slate-500 font-bold text-lg">Join 5,000+ creators scaling their empire.</p>
        </div>

        <div className="rounded-[2.5rem] md:rounded-[3rem] bg-white/80 backdrop-blur-2xl border border-slate-200/60 p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
             <Stars className="w-20 h-20 text-blue-600" />
          </div>

          {/* Google OAuth - Premium SDK Look */}
          <button
            type="button"
            onClick={() => {
              toast.info("Google Sign-Up", { description: "Connecting to Google... (simulated)" });
              setTimeout(() => { register("Google User", "googleuser@gmail.com"); navigate("/onboarding"); }, 1500);
            }}
            className="w-full h-16 rounded-2xl bg-white border border-slate-200/80 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center justify-center gap-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-[0.98] disabled:opacity-50 relative group/google overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-50/0 group-hover/google:bg-blue-50/50 transition-colors" />
            <Chrome className="w-5 h-5 text-blue-500 relative z-10 transition-transform group-hover/google:scale-110" />
            <span className="relative z-10">Deploy Account via Google SDK</span>
          </button>

          <div className="flex items-center gap-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            <div className="h-px flex-1 bg-slate-100" />
            DIRECT REGISTRATION
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Account Type */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Operative Role</label>
            <div className="grid grid-cols-2 gap-4">
              {(["Creator", "Brand"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAccountType(t)}
                  className={`h-14 rounded-2xl border text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${accountType === t ? "bg-slate-950 border-slate-950 text-white shadow-xl shadow-slate-200 scale-[1.02]" : "bg-slate-50 border-slate-200 text-slate-400 hover:border-blue-300 hover:text-slate-950"}`}
                >
                  {t === "Creator" ? <Sparkles className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                  {t}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6" noValidate>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Full Identity</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
                  onBlur={() => handleBlur("name", name)}
                  placeholder="Operative Name"
                  className={`w-full h-16 rounded-2xl bg-slate-50 border pl-14 pr-6 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                />
              </div>
              {errors.name && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Intelligence Link (Email)</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => { const n = { ...p }; delete n.email; return n; }); }}
                  onBlur={() => handleBlur("email", email)}
                  placeholder="contact@domain.com"
                  className={`w-full h-16 rounded-2xl bg-slate-50 border pl-14 pr-6 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                />
              </div>
              {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Security Protocol (Password)</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                  onBlur={() => handleBlur("password", password)}
                  placeholder="Min. 8 characters"
                  className={`w-full h-16 rounded-2xl bg-slate-50 border pl-14 pr-14 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="space-y-2 px-1">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${(strength as any).barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${strength.color}`}>{strength.label} Strength Detected</p>
                </div>
              )}
              {errors.password && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Verify Protocol</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                  onBlur={() => handleBlur("confirmPassword", confirmPassword)}
                  placeholder="Repeat protocol"
                  className={`w-full h-16 rounded-2xl bg-slate-50 border pl-14 pr-14 text-sm font-bold text-slate-950 placeholder:text-slate-300 focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-rose-300 focus:ring-rose-500/10" : "border-slate-200 focus:ring-blue-600/10"}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider pl-1 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 mt-6 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <><div className="w-5 h-5 border-[3px] border-white/20 border-t-white rounded-full animate-spin" /> Finalizing account...</>
              ) : (<>Establish Identity <ChevronRight className="w-4 h-4" /></>)}
            </button>
          </form>

          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center pt-4">
            Existing operative?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline">Re-Initialize Session</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
