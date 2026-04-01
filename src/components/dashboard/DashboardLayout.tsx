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
import { Toaster, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { db } from "../../lib/db";

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/dashboard":     return "Command Centre";
    case "/analytics":     return "Analytics Intelli-Room";
    case "/deals":         return "Brand Deals Pipeline";
    case "/studio":        return "AI Content Studio";
    case "/calendar":      return "Smart Content Calendar";
    case "/growth":        return "Growth Strategy Engine";
    case "/network":       return "Creator Network";
    case "/revenue":       return "Monetisation Hub";
    case "/contracts":     return "Contract Shield";
    case "/mediakit":      return "Media Kit Builder";
    case "/messages":      return "Inbox & DMs";
    case "/notifications": return "Notifications";
    case "/settings":      return "Settings";
    default:               return "Dashboard";
  }
};

import { PullToRefresh, IOSSwipeBack } from "../shared/MobileInteractions";

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

  const handleRefresh = async () => {
    // Simulate data fetch
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  // Rule #9: Smart notification job — runs every 30s in dev (simulates 30-min real job)
  useEffect(() => {
    const smartNotifJob = () => {
      const jobs = [
        {
          check: () => Math.random() < 0.3, // Simulate deal deadline within 48h
          notif: () => ({ id: `not_poll_deal_${Date.now()}`, title: 'Deal Deadline Alert', body: 'MuscleBlaze campaign deadline is in 24 hours. Submit your content now.', type: 'warning', time: 'Just now', read: false, link: '/deals' })
        },
        {
          check: () => Math.random() < 0.25, // Trending post
          notif: () => ({ id: `not_poll_trend_${Date.now()}`, title: 'Post Going Viral 🔥', body: 'Your latest Reel hit 2x your average reach in the first hour.', type: 'trending', time: 'Just now', read: false, link: '/analytics' })
        },
        {
          check: () => Math.random() < 0.2,  // New message
          notif: () => ({ id: `not_poll_msg_${Date.now()}`, title: 'New Message', body: 'A brand manager sent you a new collaboration inquiry.', type: 'message', time: 'Just now', read: false, link: '/messages' })
        },
        {
          check: () => Math.random() < 0.15, // Posting gap
          notif: () => ({ id: `not_poll_gap_${Date.now()}`, title: 'Content Gap Detected', body: 'No post scheduled for the next 3 days. Your engagement drops 40% without consistent posting.', type: 'reminder', time: 'Just now', read: false, link: '/calendar' })
        }
      ];

      const triggered = jobs.find(j => j.check());
      if (!triggered) return;

      const newNotif = triggered.notif();
      db.insert('notifications', newNotif);

      toast.info(newNotif.title, { description: newNotif.body });

      // OS push
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(newNotif.title, { body: newNotif.body, icon: '/favicon.ico' });
      }
    };

    const pollInterval = setInterval(smartNotifJob, 30000);
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (user) {
      document.title = `CF — ${user.name}'s Dashboard`;
    } else {
      document.title = `CreatorForge`;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Desktop Sidebar (Left Zone) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Main Content Wrapper */}
      <div 
        className="flex-1 flex flex-col relative z-header w-full overflow-hidden transition-all duration-300"
        style={{ paddingLeft: "var(--sidebar-w, 0px)" }}
      >
        {/* Header - Always visible but height is variable via CSS */}
        <Header title={pageTitle} />
        
        {/* Zone C */}
        <main className="flex-1 pt-[var(--header-h)] pb-[var(--bottom-nav-h)] relative bg-slate-50/30">
          <PullToRefresh onRefresh={handleRefresh}>
            <IOSSwipeBack>
              <div className="px-[var(--page-px)] py-8 no-scrollbar max-w-[1600px] mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </IOSSwipeBack>
          </PullToRefresh>
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
