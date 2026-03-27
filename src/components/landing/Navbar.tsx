import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container max-w-6xl flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
          <Sparkles className="w-5 h-5 text-primary" />
          <span>CREATORFORGE</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="hidden xs:flex h-10 items-center justify-center rounded-xl bg-muted/10 border border-border/40 px-5 text-sm font-black uppercase tracking-widest hover:bg-muted/20 transition-all active:scale-95"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="hidden sm:flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
          >
            Get Started
          </button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 hover:bg-muted/50 rounded-xl border border-border/20 shadow-sm transition-all active:scale-95">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-l border-border/40 p-0">
               <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-border/30">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <span>CREATORFORGE</span>
                    </div>
                  </div>
                  <nav className="flex-1 px-6 py-8 space-y-6">
                    {navLinks.map((link) => (
                      <a 
                        key={link.label} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="block text-lg font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                      >
                        {link.label}
                      </a>
                    ))}
                    <div className="h-px bg-border/20" />
                    <button 
                      onClick={() => { navigate("/login"); setIsOpen(false); }}
                      className="w-full h-14 rounded-2xl bg-muted/20 border border-border/40 text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => { navigate("/register"); setIsOpen(false); }}
                      className="w-full h-14 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                  </nav>
                  <div className="p-6 text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest border-t border-border/10">
                    © 2026 CreatorForge AI
                  </div>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
