import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, BarChart3, Sparkles, Calendar, User, 
  Menu, Briefcase, Settings, LogOut, ChevronRight,
  Target, Globe, Wallet, Shield, Activity, Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../contexts/AuthContext";

const mainNavItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: Activity, label: "Pulse", href: "/pulse" },
  { icon: Sparkles, label: "Studio", href: "/studio" },
];

const secondaryNavItems = [
  { icon: Briefcase, label: "Brand Deals", href: "/deals" },
  { icon: Globe, label: "Network", href: "/network" },
  { icon: Wallet, label: "Revenue", href: "/revenue" },
  { icon: Shield, label: "Contracts", href: "/contracts" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export const MobileBottomNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[5000] bg-white/90 backdrop-blur-xl border-t border-slate-100 safe-area-pb shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
      <div className="h-16 flex items-center justify-around px-2 relative">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.href} 
              to={item.href}
              onClick={() => setIsMoreOpen(false)}
              className="relative flex flex-col items-center justify-center w-16 h-full transition-all active:scale-95"
            >
              {isActive && (
                <motion.div 
                  layoutId="mobileNavDot"
                  className="absolute top-0 w-1 h-1 rounded-full bg-blue-600 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive ? "text-blue-600" : "text-slate-400"
                )} 
              />
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="text-[9px] font-black uppercase tracking-widest mt-1 text-blue-600"
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
                  isMoreOpen ? "text-blue-600" : "text-slate-400"
                )} 
              />
              <AnimatePresence>
                {isMoreOpen && (
                  <motion.span 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] font-black uppercase tracking-widest mt-1 text-blue-600"
                  >
                    Profile
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] bg-white border-t border-slate-100 p-0 rounded-t-[3rem] overflow-hidden shadow-2xl">
             <div className="flex flex-col h-full">
                {/* Drag handle */}
                <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mt-4 mb-8" />
                
                <div className="px-8 mb-8 flex items-center gap-6">
                   <div className="w-20 h-20 rounded-[2.2rem] bg-blue-50 border border-blue-100 p-1 shadow-sm">
                      <div className="w-full h-full rounded-[2rem] bg-white overflow-hidden flex items-center justify-center">
                         {user?.photo ? (
                           <img src={user.photo} alt="" className="w-full h-full object-cover" />
                         ) : (
                           <span className="text-3xl font-black text-blue-600 shadow-sm">{user?.firstName?.[0]}</span>
                         )}
                      </div>
                   </div>
                   <div>
                      <h2 className="text-2xl font-black tracking-tight text-slate-900">{user?.name}</h2>
                      <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">@{user?.handle || 'creator'}</p>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 space-y-2 no-scrollbar">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
                         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Creator Score</p>
                         <p className="text-2xl font-black text-slate-900">74<span className="text-xs text-slate-400">/100</span></p>
                      </div>
                      <div className="p-5 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col gap-2">
                         <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Growth Tier</p>
                         <p className="text-lg font-black text-blue-600 uppercase tracking-tight">Gold Elite</p>
                      </div>
                   </div>

                   {secondaryNavItems.map((item) => (
                      <Link 
                        key={item.href} 
                        to={item.href}
                        onClick={() => setIsMoreOpen(false)}
                        className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                               <item.icon className="w-5 h-5 text-slate-400" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">{item.label}</span>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300" />
                      </Link>
                   ))}
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                   <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-rose-600 transition-all text-[10px] font-black uppercase tracking-[0.2em]">
                      <LogOut className="w-4 h-4" /> Sign Out
                   </button>
                   <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all text-[10px] font-black uppercase tracking-[0.2em]">
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
