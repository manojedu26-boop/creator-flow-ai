import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { motion } from "framer-motion";
import { Sparkles, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const getPasswordStrength = (pw: string) => {
  if (pw.length === 0) return { label: "", color: "bg-transparent", width: "0%" };
  if (pw.length < 6) return { label: "Weak", color: "bg-rose-500", width: "25%" };
  if (pw.length < 8) return { label: "Fair", color: "bg-amber-500", width: "50%" };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw) && pw.length >= 10) return { label: "Strong", color: "bg-emerald-500", width: "100%" };
  return { label: "Medium", color: "bg-blue-400", width: "75%" };
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getPasswordStrength(password);

  // Validate token
  const stored = JSON.parse(localStorage.getItem("cf_reset_token") || "null");
  const tokenValid = stored && stored.token === token && stored.expires > Date.now();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!password || password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 900));

    // Update user password in localStorage
    const users: any[] = JSON.parse(localStorage.getItem("cf_users") || "[]");
    const updated = users.map(u => u.email === stored.email ? { ...u, password: btoa(password) } : u);
    localStorage.setItem("cf_users", JSON.stringify(updated));
    localStorage.removeItem("cf_reset_token");

    setIsLoading(false);
    setDone(true);
    toast.success("Password reset successful!", { description: "You can now log in with your new password." });
    setTimeout(() => navigate("/login"), 2000);
  };

  if (!token || !tokenValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-10 border border-white/10 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-black uppercase tracking-tight">Link Expired or Invalid</h2>
          <p className="text-sm text-muted-foreground">This reset link has expired or is invalid. Please request a new one.</p>
          <button onClick={() => navigate("/forgot-password")} className="w-full h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02]">
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-white mb-10">
          <Logo iconOnly iconClassName="w-10 h-10 shadow-none bg-transparent" />
          <span>CreatorForge<span className="text-blue-500">AI</span></span>
        </div>

        <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-8 md:p-10 border border-white/10 shadow-2xl mt-8">
          {done ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Password Updated!</h2>
              <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Set New Password</h2>
              <p className="text-sm text-muted-foreground mb-8">Choose a strong password for your account.</p>

              <form onSubmit={handleReset} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => { const n = { ...p }; delete n.password; return n; }); }}
                      placeholder="Min. 8 characters"
                      className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-12 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.password ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="space-y-1 px-1">
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${strength.color}`} animate={{ width: strength.width }} />
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${strength.color.replace("bg-", "text-")}`}>{strength.label} password</p>
                    </div>
                  )}
                  {errors.password && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.password}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); if (errors.confirmPassword) setErrors(p => { const n = { ...p }; delete n.confirmPassword; return n; }); }}
                      placeholder="Repeat your password"
                      className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.confirmPassword ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-rose-400 text-[11px] font-bold pl-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</> : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
