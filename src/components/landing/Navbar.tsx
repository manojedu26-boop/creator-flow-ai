import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container max-w-6xl flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          <Sparkles className="w-5 h-5 text-primary" />
          <span>CREATORX</span>
          <span className="text-primary text-sm font-semibold">AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="relative inline-flex h-9 overflow-hidden rounded-lg p-[1px] focus:outline-none transition-colors hidden sm:inline-flex"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-glass px-4 py-1 text-sm text-foreground backdrop-blur-3xl hover:bg-muted font-medium transition-all">
              Log In
            </span>
          </button>

          <button
            onClick={() => navigate("/register")}
            className="relative inline-flex h-9 overflow-hidden rounded-lg p-[1px] focus:outline-none transition-all active:scale-[0.97]"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(318,100%,62%)_0%,#393BB2_50%,hsl(318,100%,62%)_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-1 text-sm text-primary-foreground font-semibold backdrop-blur-3xl hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_-5px_hsl(318,100%,62%,0.3)]">
              Get Started
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};


export default Navbar;
