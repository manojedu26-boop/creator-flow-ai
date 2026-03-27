import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar, navItems } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Menu, Briefcase, Settings, LogOut, WifiOff } from "lucide-react";
import { FloatingAiChat } from "./FloatingAiChat";
import { MobileBottomNav } from "./MobileBottomNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/dashboard": return "Command Centre";
    case "/analytics": return "Analytics Intelli-Room";
    case "/deals": return "Brand Deals Pipeline";
    case "/studio": return "AI Content Studio";
    case "/calendar": return "Smart Content Calendar";
    case "/growth": return "Growth Strategy Engine";
    case "/network": return "Creator Network";
    case "/revenue": return "Monetisation Hub";
    case "/contracts": return "Contract Shield";
    case "/mediakit": return "Media Kit Builder";
    case "/messages": return "Inbox & DMs";
    case "/notifications": return "Notifications";
    default: return "Dashboard";
  }
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(true);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      setShowOfflineBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user) {
      document.title = `CF — ${user.name}'s Dashboard`;
    } else {
      document.title = `CreatorForge`;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Desktop Sidebar (Left Zone) */}
      <Sidebar />
      
      {/* Mobile Top Header (Visible only on mobile) */}
      <div className="lg:hidden h-20 w-full border-b border-white/5 bg-black/60 backdrop-blur-3xl flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-black tracking-tighter text-lg uppercase">CreatorForge<span className="text-primary italic">AI</span></span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2.5 bg-white/5 rounded-xl border border-white/10 active:scale-95 transition-all">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] p-0 bg-black border-r border-white/5">
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <span className="font-black tracking-tighter text-2xl uppercase">CreatorForge<span className="text-primary italic">AI</span></span>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-2 no-scrollbar">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                  return (
                    <Link 
                      key={item.label} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                        isActive ? "bg-primary/10 text-white border border-primary/20" : "text-zinc-500 hover:text-white"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                      <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-8 border-t border-white/5 bg-white/[0.02] space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                   <div className="w-10 h-10 rounded-full overflow-hidden">
                      {user?.photo ? (
                        <img src={user.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center font-black text-xs uppercase">{user?.firstName?.[0]}</div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-black uppercase tracking-tight truncate">{user?.name}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-widest">{user?.handle}</p>
                   </div>
                   <button onClick={logout} className="p-2 text-zinc-500"><LogOut className="w-4 h-4" /></button>
                </div>
                <Link 
                    to="/brand"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-14 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    <Briefcase className="w-4 h-4" />
                    Switch to Brand Mode
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-[80px] relative z-10 w-full overflow-hidden">
        {/* Header (Top Zone) - Adjusted for mobile */}
        <div className="hidden lg:block">
          <Header title={pageTitle} />
        </div>
        
        {/* Zone C */}
        <main className="flex-1 overflow-y-auto lg:pt-20 p-4 md:p-8 relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <FloatingAiChat />
      <MobileBottomNav />

      {/* ERROR STATE: OFFLINE BANNER (Section 5) */}
      <AnimatePresence>
        {isOffline && showOfflineBanner && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[1000] bg-amber-500 text-black py-4 px-8 flex items-center justify-between shadow-2xl font-black text-[10px] uppercase tracking-widest"
          >
            <div className="flex items-center gap-4">
              <WifiOff className="w-5 h-5" />
              You're offline. Some features may be unavailable.
            </div>
            <button onClick={() => setShowOfflineBanner(false)} className="p-2 hover:bg-black/10 rounded-full transition-all">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <TooltipProvider>
        <Toaster />
      </TooltipProvider>
    </div>
  );
};
