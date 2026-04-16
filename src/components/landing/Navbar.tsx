import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/Logo";

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
      className="fixed top-0 left-0 right-0 z-header bg-slate-950/60 backdrop-blur-2xl border-b border-white/5 shadow-2xl transition-all"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container max-w-[1440px] flex items-center justify-between h-[var(--header-h)] px-6 md:px-12 text-white">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-[10px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-[0.4em]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="hidden xs:flex h-12 items-center justify-center px-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-all active:scale-95"
          >
            Terminal Access
          </button>

          <button
            onClick={() => navigate("/register")}
            className="hidden sm:flex h-14 items-center justify-center rounded-2xl bg-blue-600 px-10 text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:bg-blue-500 transition-all active:scale-95"
          >
            Initiate Forge
          </button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] bg-slate-950 border-l border-white/5 p-0">
               <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-white/5 bg-slate-900/50">
                    <Logo />
                  </div>
                  <nav className="flex-1 px-8 py-12 space-y-10">
                    {navLinks.map((link) => (
                      <a 
                        key={link.label} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="block text-4xl font-black uppercase tracking-tighter text-slate-500 hover:text-white transition-all"
                      >
                        {link.label}
                      </a>
                    ))}
                    <div className="h-px bg-white/5" />
                    <div className="space-y-6 pt-10">
                      <button 
                        onClick={() => { navigate("/login"); setIsOpen(false); }}
                        className="w-full h-18 rounded-[2rem] bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center justify-center gap-2"
                      >
                        Terminal Access
                      </button>
                      <button 
                        onClick={() => { navigate("/register"); setIsOpen(false); }}
                        className="w-full h-18 rounded-[2rem] bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl"
                      >
                        Initiate Forge <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </nav>
                  <div className="p-8 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] border-t border-white/5">
                    Forge AI Terminal • ALPHA v4.2
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
