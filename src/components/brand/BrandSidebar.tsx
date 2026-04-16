import { motion } from "framer-motion";
import { 
  Home, Users, Megaphone, BarChart3, 
  MessageSquare, Briefcase, FileText, 
  Settings, LogOut, ChevronLeft, ChevronRight,
  ShieldCheck, Zap, Sparkles
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Logo } from "../shared/Logo";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Home, label: "Brand Home", path: "/brand" },
  { icon: Users, label: "Discover Creators", path: "/brand/discover" },
  { icon: Megaphone, label: "Post a Brief", path: "/brand/post-brief" },
  { icon: BarChart3, label: "Campaign Analytics", path: "/brand/analytics" },
  { icon: MessageSquare, label: "Messages", path: "/brand/messages" },
  { icon: Briefcase, label: "Active Deals", path: "/brand/deals" },
  { icon: FileText, label: "Contracts", path: "/brand/contracts" },
  { icon: Settings, label: "Settings", path: "/brand/settings" },
];

export const BrandSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 72 : 280 }}
      className="h-screen bg-zinc-950 border-r border-white/5 flex flex-col relative z-[100] transition-all duration-300 shadow-2xl overflow-hidden shrink-0"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className={cn(
        "p-6 mb-8 flex items-center transition-all duration-300",
        isCollapsed ? "justify-center px-0" : "gap-3"
      )}>
         <Logo 
            iconOnly={isCollapsed} 
            iconClassName={isCollapsed ? "w-8 h-8" : "w-10 h-10"}
            textClassName="text-lg"
            className={cn(isCollapsed && "gap-0")}
         />
         {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col -mt-1">
               <div className="flex items-center gap-1.5 opacity-50">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Verified Enterprise</span>
               </div>
            </motion.div>
         )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 space-y-1">
         {menuItems.map((item) => {
           const isActive = location.pathname === item.path;
           return (
             <Link key={item.path} to={item.path}>
               <motion.div 
                 whileHover={{ x: 4 }}
                 className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group ${
                   isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-400 hover:text-white hover:bg-white/5"
                 }`}
               >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-primary transition-colors"}`} />
                  {!isCollapsed && (
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  )}
                  {isActive && (
                    <motion.div layoutId="brand-active-pill" className="absolute left-0 w-1 h-6 bg-white rounded-full" />
                  )}
               </motion.div>
             </Link>
           );
         })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-white/5">
         {!isCollapsed && (
           <div className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                 <Sparkles className="w-3 h-3 text-primary" />
                 <span className="text-[9px] font-black uppercase text-primary">AI Insights</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                 High ROI detected in "Sustainability" niche this week.
              </p>
           </div>
         )}
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-all active:scale-95"
         >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
         </button>
      </div>
    </motion.div>
  );
};
