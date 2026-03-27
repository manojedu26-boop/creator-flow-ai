import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Handshake, BrainCircuit, Calendar, 
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette, 
  MessageSquare, Bell, Settings, Menu, Sparkles, Briefcase,
  LogOut, Instagram, Youtube
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

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
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <motion.div 
      className="fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border/40 hidden lg:flex flex-col shadow-2xl overflow-hidden"
      animate={{ width: isExpanded ? 260 : 72 }}
      transition={springTransition}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center h-16 px-5 mb-4 gap-3 cursor-pointer border-b border-border/30 relative shrink-0">
        <Sparkles className="w-8 h-8 text-primary shrink-0" />
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              className="font-black tracking-tighter text-xl whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              CREATORFORGE
            </motion.span>
          )}
        </AnimatePresence>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-2 px-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg relative transition-all group ${
                isActive ? "bg-primary/10 text-white" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary shadow-[4px_0_15px_rgba(255,60,172,0.4)]"
                />
              )}
              <item.icon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:-translate-y-0.5" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="font-medium text-[13px] whitespace-nowrap"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION — SETTINGS & PROFILE */}
      <div className="mt-auto p-3 border-t border-border/30 flex flex-col gap-2 bg-muted/5 backdrop-blur-md shrink-0">
        <Link 
          to="/settings"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors group ${
            location.pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title={!isExpanded ? "Settings" : undefined}
        >
          <Settings className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:rotate-45" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                className="font-medium text-[13px] whitespace-nowrap"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div className="flex items-center h-14 p-1.5 rounded-xl border border-border/20 bg-background/50 group relative">
           {user?.photo ? (
             <img src={user.photo} alt={user.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
           ) : (
             <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 shrink-0 flex items-center justify-center text-white text-[10px] font-black uppercase">
               {user?.name?.split(' ').map(n => n[0]).join('')}
             </div>
           )}
           <AnimatePresence>
             {isExpanded && (
               <motion.div 
                className="ml-3 flex flex-col min-w-0 flex-1"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -5 }}
                transition={{ duration: 0.15 }}
               >
                  <span className="text-xs font-black truncate">{user?.name || "Anonymous"}</span>
                  <span className="text-[9px] text-muted-foreground font-bold truncate">{user?.handle || "@creator"}</span>
                  <div className="flex gap-1 mt-0.5 opacity-60">
                    {user?.platforms.includes("Instagram") && <Instagram className="w-2.5 h-2.5" />}
                    {user?.platforms.includes("YouTube") && <Youtube className="w-2.5 h-2.5" />}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           {isExpanded && (
             <button 
              onClick={logout}
              className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all"
             >
                <LogOut className="w-3.5 h-3.5" />
             </button>
           )}
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <Link 
            to="/brand"
            className="w-full h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold overflow-hidden flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-all active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <AnimatePresence>
              {isExpanded && (
                <motion.span 
                  className="text-[10px] uppercase font-black tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Brand Mode
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
