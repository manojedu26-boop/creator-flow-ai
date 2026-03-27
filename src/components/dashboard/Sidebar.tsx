import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, BarChart3, Handshake, BrainCircuit, Calendar, 
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette, 
  MessageSquare, Bell, Settings, Menu, Sparkles, Briefcase,
  LogOut
} from "lucide-react";

const navItems = [
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

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.div 
      className="fixed left-0 top-0 bottom-0 z-50 bg-card border-r border-border/40 flex flex-col transition-all duration-300 shadow-2xl"
      animate={{ width: isExpanded ? 260 : 72 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center h-16 px-4 mb-4 gap-3 cursor-pointer border-b border-border/30 relative">
        <Sparkles className="w-8 h-8 text-primary shrink-0" />
        <motion.span 
          className="font-black tracking-tight text-xl whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          CREATORFORGE
        </motion.span>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>

      <nav className="flex-1 overflow-visible py-2 px-3 space-y-0.5 no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link 
              key={item.label} 
              to={item.href}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-lg relative transition-all group ${
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              title={!isExpanded ? item.label : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-md shadow-[0_0_10px_hsl(var(--primary))]"
                />
              )}
              <item.icon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:-translate-y-0.5" />
              <motion.span 
                className="font-medium text-[13px] whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: isExpanded ? 1 : 0, width: "auto" }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER SECTION — SETTINGS & PROFILE */}
      <div className="mt-auto p-3 border-t border-border/30 flex flex-col gap-2 bg-muted/5 backdrop-blur-md">
        <Link 
          to="/settings"
          className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all group ${
            location.pathname === "/settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          }`}
          title={!isExpanded ? "Settings" : undefined}
        >
          <Settings className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:rotate-45" />
          <motion.span 
            className="font-medium text-[13px] whitespace-nowrap"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0, width: "auto" }}
            transition={{ duration: 0.2 }}
          >
            Settings
          </motion.span>
        </Link>

        <div className="flex items-center h-14 p-1.5 rounded-xl border border-border/20 bg-background/50 group relative">
           <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 shrink-0 flex items-center justify-center text-white text-[10px] font-black uppercase">AC</div>
           <motion.div 
            className="ml-3 flex flex-col min-w-0"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: isExpanded ? 1 : 0, width: "auto" }}
           >
              <span className="text-xs font-black truncate">Alex Creator</span>
              <span className="text-[9px] text-muted-foreground font-bold truncate">@alexcreates</span>
           </motion.div>
           {isExpanded && (
             <button className="ml-auto p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all">
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
            {isExpanded && <span className="text-[10px] uppercase font-black uppercase tracking-widest">Brand Mode</span>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
