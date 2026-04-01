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
      className="fixed top-0 left-0 right-0 z-header bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container max-w-[1440px] flex items-center justify-between h-[var(--header-h)] px-6 md:px-12">
        <div 
          className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer group" 
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
             <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-950 uppercase">CREATORFORGE<span className="text-blue-600">AI</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              className="text-[11px] font-black text-slate-400 hover:text-slate-950 transition-colors uppercase tracking-[0.3em]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="hidden xs:flex h-12 items-center justify-center px-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 hover:text-blue-600 transition-all active:scale-95"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="hidden sm:flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-8 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all active:scale-95"
          >
            Get Started
          </button>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm active:scale-95">
                <Menu className="w-5 h-5 text-slate-950" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] bg-white border-l border-slate-100 p-0">
               <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-950 uppercase">CREATORFORGE<span className="text-blue-600">AI</span></span>
                    </div>
                  </div>
                  <nav className="flex-1 px-8 py-12 space-y-10">
                    {navLinks.map((link) => (
                      <a 
                        key={link.label} 
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className="block text-3xl font-black uppercase tracking-tight text-slate-400 hover:text-slate-950 transition-all"
                      >
                        {link.label}
                      </a>
                    ))}
                    <div className="h-px bg-slate-100" />
                    <div className="space-y-4">
                      <button 
                        onClick={() => { navigate("/login"); setIsOpen(false); }}
                        className="w-full h-16 rounded-[2rem] bg-slate-50 border border-slate-100 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex items-center justify-center gap-2"
                      >
                        Log In
                      </button>
                      <button 
                        onClick={() => { navigate("/register"); setIsOpen(false); }}
                        className="w-full h-16 rounded-[2rem] bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
                      >
                        Get Started <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </nav>
                  <div className="p-8 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] border-t border-slate-50">
                    © 2026 CreatorForge AI • v3.1
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
