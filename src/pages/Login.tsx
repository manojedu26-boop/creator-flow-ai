import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Welcome back! 🔥", {
      description: "Redirecting to your dashboard...",
    });
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen bg-[#07071A] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs — TOUCH IGNORE */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div
        className="relative z-50 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 text-xs font-mono font-bold text-muted-foreground hover:text-white transition-all mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          BACK_TO_HOME
        </button>

        <div className="flex items-center gap-3 mb-2">
           <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Sparkles className="w-6 h-6 text-primary" />
           </div>
           <h1 className="text-4xl font-bebas tracking-[3px] text-white">CREATORFORGE</h1>
        </div>
        <p className="font-syne text-[11px] font-bold text-muted-foreground mb-10 uppercase tracking-widest pl-1">Strategic Command Interface // v4.2</p>

        <div className="glass-card p-8 md:p-12 border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity // Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ID_SEQUENCE@FORGE.AI"
                  className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 pl-12 pr-4 text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Access // Protocol</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 pl-12 pr-12 text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-primary text-white font-bebas text-xl tracking-[2px] transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.6)] active:scale-[0.98] shadow-xl flex items-center justify-center gap-3"
            >
              INITIALIZE_SESSION <Sparkles className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
              No credentials? {" "}
              <button onClick={() => navigate("/register")} className="text-primary hover:text-white transition-all font-bold">
                ESTABLISH_NEW_IDENTITY
              </button>
            </p>
          </div>
        </div>
        
        <div className="mt-12 text-center opacity-20 group">
           <p className="font-mono text-[8px] uppercase tracking-[0.6em] text-white">FORGE_SYSTEMS_AUTHENTICATION_STABLE</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
