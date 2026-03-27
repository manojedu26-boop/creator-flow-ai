import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, BarChart3, BrainCircuit, Calendar, Globe, MessageSquare 
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: BrainCircuit, label: "Studio", href: "/studio" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Globe, label: "Network", href: "/network" },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[100]">
      <div className="bg-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 h-16 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-around relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
        
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.href} 
              to={item.href}
              className="relative flex flex-col items-center justify-center w-12 h-12 transition-all active:scale-90"
            >
              {isActive && (
                <motion.div 
                  layoutId="mobileNavDot"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-primary fill-primary/20 scale-110" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-300",
                isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-50"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
