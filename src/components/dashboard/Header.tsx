import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Search, ChevronDown, CheckCircle2, 
  Sparkles, DollarSign, Users, Info, 
  TrendingUp, AlertTriangle, FileText, Target,
  Menu, X, Trash2
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { SwipeAction } from "../shared/MobileInteractions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchOverlay } from "./SearchOverlay";

const notifications = [
  { id: 1, type: "platform", icon: TrendingUp, color: "text-blue-400", text: "Your Reel is trending — 3.2x above your average reach!", time: "2m ago", isRead: false },
  { id: 2, type: "deal", icon: DollarSign, color: "text-green-400", text: "Brand reply received from Nike — respond now", time: "15m ago", isRead: false },
  { id: 3, type: "ai", icon: Sparkles, color: "text-purple-400", text: "You have no posts scheduled for Thursday", time: "1h ago", isRead: true },
];

export const Header = ({ title = "Dashboard" }: { title?: string }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky-header lg:fixed top-0 left-0 lg:left-[80px] right-0 h-[var(--header-h)] bg-black/60 backdrop-blur-3xl border-b border-white/5 z-[100] flex items-center justify-between px-4 md:px-10 transition-all duration-300">
      <div className="flex items-center gap-8">
        <h1 className="text-lg md:text-2xl font-black tracking-tight uppercase truncate max-w-[200px] md:max-w-none">{title}</h1>
        
        <div className="hidden xl:flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
          {["Global", "Instagram", "YouTube", "TikTok"].map((platform, i) => (
            <button key={platform} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? "bg-primary text-white shadow-lg" : "text-zinc-500 hover:text-white"}`}>
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" placeholder="Search insights..." className="h-11 w-64 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-[11px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all" />
        </div>

        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="lg:hidden p-2 text-zinc-500 hover:text-white transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-zinc-500 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full border border-black" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 md:w-9 md:h-9 shrink-0 relative">
             {user?.photo ? (
               <img src={user.photo} alt="" className="w-full h-full rounded-full object-cover border border-white/10 group-hover:border-primary/50 transition-colors" />
             ) : (
               <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                  {user?.firstName?.[0]}
               </div>
             )}
          </div>
          <div className="hidden sm:flex flex-col">
             <span className="text-[10px] font-black text-white uppercase tracking-widest">{user?.firstName || "Naveen"}</span>
             <span className="text-[8px] font-black text-primary uppercase tracking-widest">Growth Plan</span>
          </div>
          <ChevronDown className="hidden md:block w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <AnimatePresence>
        {showNotifications && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 bg-black/60 z-[150]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30 }} className="fixed top-0 right-0 bottom-0 w-[400px] bg-background border-l border-white/5 z-[160] flex flex-col pt-[var(--header-h)]">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight">Notifications</h3>
                <button onClick={() => setShowNotifications(false)}><X className="w-5 h-5 text-zinc-500 hover:text-white" /></button>
              </div>
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
                {[1, 2].map(id => (
                  <SwipeAction
                    key={id}
                    onSwipeLeft={() => setShowNotifications(false)} // Simplification for demo
                    rightAction={
                      <div className="flex flex-col items-center justify-center p-4">
                        <Trash2 className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase mt-1">Dismiss</span>
                      </div>
                    }
                  >
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative z-10 flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold leading-tight">Decathlon accepted your final contract draft.</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mt-2">Just now</p>
                      </div>
                    </div>
                  </SwipeAction>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
