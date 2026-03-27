import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Handshake, BrainCircuit, Calendar, 
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette, 
  MessageSquare, Bell, Settings, Menu, Sparkles, Briefcase,
  LogOut
} from "lucide-react";

export const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics Command Centre", href: "/analytics" },
  { icon: Handshake, label: "Brand Deals & Collab Hub", href: "/deals" },
  { icon: BrainCircuit, label: "AI Content Studio", href: "/studio" },
  { icon: Calendar, label: "Smart Content Calendar", href: "/calendar" },
  { icon: TrendingUp, label: "Growth Strategy Engine", href: "/growth" },
  { icon: Globe, label: "Creator Network", href: "/network" },
  { icon: DollarSign, label: "Monetisation & Revenue", href: "/revenue" },
  { icon: ShieldCheck, label: "Contract Shield", href: "/contracts" },
  { icon: Palette, label: "Media Kit Builder", href: "/mediakit" },
  { icon: MessageSquare, label: "Messages & DMs", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

const springTransition: any = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.div 
      className="fixed left-0 top-0 bottom-0 z-50 glass-sidebar hidden lg:flex flex-col shadow-2xl overflow-hidden"
      animate={{ width: isExpanded ? 260 : 72 }}
      transition={springTransition}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center h-16 px-5 mb-4 gap-3 cursor-pointer border-b border-white/5 relative shrink-0">
        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Sparkles className="w-6 h-6 text-primary shrink-0" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              className="font-bebas text-2xl whitespace-nowrap tracking-[3px] text-white"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              CREATORFORGE
            </motion.span>
          )}
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 shadow-[0_0_10px_hsla(325,100%,62%,0.2)]" />
      </div>

      <nav className="flex-1 py-4 px-3 space-y-2 flex flex-col justify-start">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex items-center gap-4 px-3 py-2 rounded-xl relative transition-all group ${
                isActive ? "bg-primary/20 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -left-1.5 top-2 bottom-2 w-1.5 bg-primary rounded-r-full shadow-[0_0_20px_rgba(var(--primary),0.6)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`w-4.5 h-4.5 shrink-0 transition-transform ${isActive ? 'scale-110 shadow-glow' : 'group-hover:-translate-y-0.5'}`} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="font-syne text-[10px] uppercase font-bold tracking-[2px] whitespace-nowrap pt-0.5"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION — PROFILE & SYSTEM */}
      <div className="mt-auto p-4 border-t border-white/5 flex flex-col gap-4 bg-[#07071A]/60 backdrop-blur-2xl shrink-0">
        <div className="flex items-center h-16 p-2 rounded-[1.25rem] border border-white/10 bg-white/[0.03] group relative overflow-hidden">
           {/* GLOW BACKGROUND ON HOVER */}
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary shrink-0 flex items-center justify-center text-white text-[11px] font-black uppercase shadow-xl relative z-10">AC</div>
           
           <AnimatePresence>
             {isExpanded && (
               <motion.div 
                className="ml-4 flex flex-col min-w-0 flex-1 relative z-10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
               >
                  <span className="text-[11px] font-syne font-black text-white uppercase tracking-tight truncate">ALEX_CREATOR</span>
                  <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider truncate">VERIFIED // L1</span>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="flex items-center gap-1 relative z-10">
              {/* SETTINGS MOVED HERE AS A MINI BUTTON */}
              <Link 
                to="/settings"
                className="p-2 text-muted-foreground hover:text-white transition-all rounded-lg hover:bg-white/10"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
              
              {isExpanded && (
                <button 
                  onClick={() => {/* logout logic */}}
                  className="p-2 text-muted-foreground hover:text-rose-500 transition-all rounded-lg hover:bg-rose-500/10"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
           </div>
        </div>

        <Link 
          to="/brand"
          className="w-full h-12 rounded-[1.25rem] bg-secondary/10 border border-secondary/20 text-secondary font-bold overflow-hidden flex items-center justify-center gap-3 hover:bg-secondary/20 transition-all active:scale-95 shadow-2xl group"
        >
          <Briefcase className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                className="font-mono text-[9px] uppercase font-bold tracking-[2.5px] pt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                DEPLOY BRAND
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.div>
  );
};
