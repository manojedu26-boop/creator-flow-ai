import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Sparkles, Calendar, User, 
  Menu, Briefcase, Settings, LogOut, ChevronRight,
  Target, Globe, Wallet, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../contexts/AuthContext";

const mainNavItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Sparkles, label: "Studio", href: "/studio" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
];

const secondaryNavItems = [
  { icon: Briefcase, label: "Brand Deals", href: "/deals" },
  { icon: Globe, label: "Network", href: "/network" },
  { icon: Wallet, label: "Monetisation", href: "/revenue" },
  { icon: Shield, label: "Contract Shield", href: "/contracts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const MobileBottomNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[150] bg-[#07071A]/95 backdrop-blur-2xl border-t border-white/[0.06] safe-area-pb">
      <div className="h-16 flex items-center justify-around px-2 relative">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.href} 
              to={item.href}
              className="relative flex flex-col items-center justify-center w-16 h-full transition-all active:scale-90"
            >
              {isActive && (
                <motion.div 
                  layoutId="mobileNavDot"
                  className="absolute top-0 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive ? "text-primary" : "text-[#5A5A90]"
                )} 
              />
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-[10px] font-black uppercase tracking-widest mt-1 text-primary font-mono"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Profile / More Tab */}
        <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <SheetTrigger asChild>
            <button className="relative flex flex-col items-center justify-center w-16 h-full transition-all active:scale-90">
              <User 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isMoreOpen ? "text-primary" : "text-[#5A5A90]"
                )} 
              />
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-widest mt-1 text-primary font-mono"
                  >
                    Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] bg-[#07071A] border-t border-white/10 p-0 rounded-t-[2.5rem] overflow-hidden">
             <div className="flex flex-col h-full">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-8" />
                
                <div className="px-8 mb-8 flex items-center gap-6">
                   <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-primary to-blue-500 p-1">
                      <div className="w-full h-full rounded-[1.8rem] bg-[#07071A] overflow-hidden flex items-center justify-center">
                         {user?.photo ? (
                           <img src={user.photo} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-3xl font-black">{user?.firstName?.[0]}</span>
                         )}
                      </div>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black tracking-tight">{user?.name}</h2>
                      <p className="text-primary font-black uppercase tracking-[0.2em] text-xs">@{user?.handle || 'creator'}</p>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-2 no-scrollbar">
                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-2">
                         <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest tracking-widest">Creator Score</p>
                         <p className="text-2xl font-black">74<span className="text-xs text-zinc-500">/100</span></p>
                      </div>
                      <div className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-2">
                         <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Growth Tier</p>
                         <p className="text-lg font-black text-primary">GOLD</p>
                      </div>
                   </div>

                   {secondaryNavItems.map((item) => (
                      <Link 
                        key={item.href} 
                        to={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all active:scale-[0.98]"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                               <item.icon className="w-5 h-5 text-zinc-400" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </Link>
                   ))}
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                   <button onClick={logout} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                      <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                   <button className="flex items-center gap-2 text-indigo-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                      <Settings className="w-4 h-4" /> Preferences
                   </button>
                </div>
             </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
