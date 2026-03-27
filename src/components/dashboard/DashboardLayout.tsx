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
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-[80px] relative z-10 w-full overflow-hidden">
        {/* Header - Always visible but height is variable via CSS */}
        <Header title={pageTitle} />
        
        {/* Zone C */}
        <main className="flex-1 overflow-y-auto pt-[var(--header-h)] pb-[var(--bottom-nav-h)] px-[var(--page-px)] relative no-scrollbar">
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
