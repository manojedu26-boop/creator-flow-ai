import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    register(name, email);
    
    toast.success("Account created! 🎉", {
      description: "Let's set up your creator profile...",
    });
    setTimeout(() => navigate("/onboarding"), 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-[100px]" />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </button>

        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>CREATORX</span>
          <span className="text-primary text-lg font-semibold">AI</span>
        </div>
        <p className="text-muted-foreground mb-8">Create your free account and start growing.</p>

        <div className="rounded-xl bg-glass p-6 md:p-8 border border-border/50">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Creator Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your creator name"
                  className="w-full rounded-lg bg-muted/50 border border-border/50 pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg bg-muted/50 border border-border/50 pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-lg bg-muted/50 border border-border/50 pl-10 pr-10 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-5px_hsl(318,100%,62%,0.4)] active:scale-[0.97]"
            >
              Create Account
            </button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-5">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
