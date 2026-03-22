import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => (
  <motion.nav
    className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/30"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="container max-w-6xl flex items-center justify-between h-14 px-4">
      <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
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
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
          Log In
        </button>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_20px_-5px_hsl(318,100%,62%,0.3)] active:scale-[0.97]">
          Get Started
        </button>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
