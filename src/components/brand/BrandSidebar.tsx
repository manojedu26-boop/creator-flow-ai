import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, MessageSquare, Settings, 
  Plus, LogOut, Stars, TrendingUp, Search,
  ChevronRight, Sparkles, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const brandNavItems = [
  { id: 'discover', label: 'Discover Talent', icon: Users, path: '/brand' },
  { id: 'briefs', label: 'Campaign Hub', icon: Briefcase, path: '/brand/campaigns' },
  { id: 'messages', label: 'Transmissions', icon: MessageSquare, path: '/messages' },
  { id: 'settings', label: 'Corporate Desk', icon: Settings, path: '/settings' },
];

export const BrandSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="w-[280px] h-screen bg-slate-950 border-r border-white/5 flex flex-col p-8 fixed left-0 top-0 z-[100] overflow-hidden">
      {/* GLOW DECO */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
      
      {/* BRAND LOGO */}
      <div className="flex items-center gap-4 mb-16 px-2">
         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/30">
            <Building2 className="w-6 h-6 text-white" />
         </div>
         <div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white">Brand Hub</h1>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-500">Corporate Ops</p>
         </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-3">
         {brandNavItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link
               key={item.id}
               to={item.path}
               className={cn(
                 "flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden",
                 isActive 
                   ? "bg-white/5 border border-white/5 text-white" 
                   : "text-slate-500 hover:text-white hover:bg-white/5"
               )}
             >
               <div className="flex items-center gap-4 relative z-10">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-indigo-500" : "text-slate-500 group-hover:text-white")} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
               </div>
               {isActive && (
                 <motion.div 
                   layoutId="activeBrandNav"
                   className="absolute left-0 w-1 h-1/2 bg-indigo-600 rounded-full"
                 />
               )}
               <ChevronRight className={cn("w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0 transition-all", isActive && "opacity-40 translate-x-0")} />
             </Link>
           );
         })}
      </nav>

      {/* FOOTER ACTION */}
      <div className="mt-auto space-y-4">
         <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/20 relative overflow-hidden group hover:border-indigo-600/40 transition-all">
            <div className="flex items-center justify-between mb-4">
               <Stars className="w-4 h-4 text-indigo-500" />
               <span className="text-[8px] font-black uppercase text-slate-500">AI Recs</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">Post a campaign brief to get AI-matched creators instantly.</p>
            <button className="w-full h-12 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
               <Plus className="w-3.5 h-3.5" /> Post Campaign
            </button>
         </div>

         <div className="pt-8 border-t border-white/5">
            <div className="flex items-center gap-4 mb-6 px-2">
               <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.brandName || 'Brand'}`} alt="" />
               </div>
               <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-white truncate max-w-[120px] uppercase">{user?.brandName || 'Core Corporate'}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Administrator</p>
               </div>
            </div>
            <button 
               onClick={logout}
               className="w-full h-14 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all"
            >
               <LogOut className="w-4 h-4" /> Sever Session
            </button>
         </div>
      </div>
    </aside>
  );
};
