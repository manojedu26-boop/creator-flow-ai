import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, BarChart3, Handshake, BrainCircuit, Calendar, 
  TrendingUp, Globe, DollarSign, ShieldCheck, Palette, 
  MessageSquare, Bell, Settings, Menu, Sparkles, Briefcase
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
        {/* Glowing animated divider line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 shadow-[0_0_10px_hsl(var(--primary))]" />
      </div>

      <nav className="flex-1 overflow-visible py-2 px-3 space-y-0.5">
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

      <div className="p-4 border-t border-border/30 flex flex-col gap-3 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary shrink-0 relative">
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                <span className="text-[10px]">📸</span>
              </div>
            </div>
            <div className={`flex flex-col whitespace-nowrap transition-opacity ${isExpanded ? "opacity-100" : "opacity-0 invisible absolute"}`}>
              <span className="text-sm font-bold">Alex Creator</span>
              <span className="text-[10px] text-muted-foreground">@alexcreates</span>
            </div>
          </div>
          
          {isExpanded && (
            <Link 
              to="/settings"
              className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-lg group"
              title="Settings"
            >
              <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 duration-500" />
            </Link>
          )}
        </div>

        {!isExpanded && (
           <Link 
            to="/settings"
            className="flex justify-center p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        )}

        <div className="flex flex-col gap-2">
          <Link 
            to="/brand"
            className="relative w-full rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-2 text-indigo-400 font-bold overflow-hidden group"
            title={!isExpanded ? "Switch to Brand Mode" : undefined}
          >
            <div className="flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" />
              {isExpanded && <span className="text-xs">Brand Mode</span>}
            </div>
          </Link>
          <button 
            className="relative w-full rounded-lg bg-primary/10 border border-primary/30 p-2 text-primary font-bold overflow-hidden group"
            title={!isExpanded ? "AI Chat" : undefined}
          >
            <span className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isExpanded && <span className="text-xs">AI Chat</span>}
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
