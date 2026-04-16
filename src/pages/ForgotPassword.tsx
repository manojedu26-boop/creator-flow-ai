import { useState } from "react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/Logo";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (val: string) => {
    if (!val) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) { setEmailError(err); return; }

    setIsLoading(true);
    // Simulate API call — always show success (prevents email enumeration)
    await new Promise(r => setTimeout(r, 1200));

    // In reality: POST /api/auth/forgot-password
    // If email exists, send reset link with 1-hour token
    // Always show same response to prevent enumeration
    const token = btoa(`${email}:${Date.now() + 3600000}`);
    localStorage.setItem("cf_reset_token", JSON.stringify({ token, email, expires: Date.now() + 3600000 }));

    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to login
        </button>

        <div className="flex items-center gap-3 font-black text-3xl tracking-tighter uppercase text-white mb-10">
          <Logo iconOnly iconClassName="w-10 h-10 shadow-none bg-transparent" />
          <span>CreatorForge<span className="text-blue-500">AI</span></span>
        </div>

        <div className="rounded-[2.5rem] bg-black/40 backdrop-blur-3xl p-8 md:p-10 border border-white/10 shadow-2xl mt-8">
          {!submitted ? (
            <>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Reset Password</h2>
              <p className="text-sm text-muted-foreground mb-8">Enter your email and we'll send you a reset link.</p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                      onBlur={() => setEmailError(validateEmail(email))}
                      placeholder="you@example.com"
                      className={`w-full h-14 rounded-2xl bg-white/5 border pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${emailError ? "border-rose-500/60 focus:ring-rose-500/30" : "border-white/10 focus:ring-primary/50"}`}
                    />
                  </div>
                  {emailError && <p className="text-rose-400 text-[11px] font-bold pl-1">{emailError}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending</>
                  ) : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Check your inbox</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If an account exists for <span className="text-white font-bold">{email}</span>, you'll receive a password reset link shortly. It expires in 1 hour.
              </p>
              <p className="text-xs text-muted-foreground">Didn't receive it? Check your spam folder.</p>
              <button
                onClick={() => navigate("/login")}
                className="w-full h-12 mt-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
