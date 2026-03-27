import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Handshake, BrainCircuit, Calendar, 
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette, 
  MessageSquare, Bell, Settings, Menu, Sparkles, Briefcase,
  LogOut, Instagram, Youtube, Play
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
      className="fixed left-0 top-0 bottom-0 z-50 bg-black/40 backdrop-blur-3xl border-r border-white/5 hidden lg:flex flex-col shadow-2xl overflow-hidden"
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={springTransition}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center h-20 px-6 gap-3 cursor-pointer border-b border-white/5 relative shrink-0">
        <Sparkles className="w-8 h-8 text-primary shrink-0" />
        <AnimatePresence>
          {isExpanded && (
            <motion.span 
              className="font-black tracking-tighter text-xl whitespace-nowrap uppercase"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              CreatorForge<span className="text-primary italic">AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl relative transition-all group ${
                isActive ? "bg-[#FF3CAC]/[0.08] text-white" : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FF3CAC] shadow-[2px_0_10px_rgba(255,60,172,0.5)]"
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 transition-all ${isActive ? "text-[#FF3CAC]" : "group-hover:text-white"}`} />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.02] flex flex-col gap-4">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/5 group relative overflow-hidden">
           <div className="w-9 h-9 shrink-0 relative">
             {user?.photo ? (
               <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover border border-white/10" />
             ) : (
               <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                 {user?.firstName?.[0]}
               </div>
             )}
             <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
           </div>

           <AnimatePresence>
             {isExpanded && (
               <motion.div 
                className="flex flex-col min-w-0 flex-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
               >
                  <span className="text-[11px] font-black text-white truncate uppercase tracking-tight">{user?.handle || "@creator"}</span>
                  <div className="flex gap-1.5 mt-0.5">
                    {user?.platforms.includes("Instagram") && <Instagram className="w-3 h-3 text-pink-500" />}
                    {user?.platforms.includes("YouTube") && <Youtube className="w-3 h-3 text-red-500" />}
                    {user?.platforms.includes("TikTok") && <Play className="w-3 h-3 text-white" />}
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
           
           {isExpanded && (
             <button onClick={logout} className="p-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white transition-all">
                <LogOut className="w-4 h-4" />
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};
