import { useState, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { Sidebar, navItems } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Menu, Briefcase, Settings, LogOut, WifiOff, ChevronRight, Home } from "lucide-react";
import { FloatingAiChat } from "./FloatingAiChat";
import { MobileBottomNav } from "./MobileBottomNav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../contexts/AuthContext";
import { Toaster, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { db } from "../../lib/db";
import { CommandPalette } from "./CommandPalette";
import { cn } from "../../lib/utils";

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

const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split('/').filter(p => p);
  const crumbs = [{ label: 'Home', path: '/dashboard' }];
  
  let currentPath = '';
  parts.forEach((part, i) => {
    currentPath += `/${part}`;
    if (part === 'dashboard') return;
    crumbs.push({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' '),
      path: currentPath
    });
  });
  
  return crumbs;
};

import { PullToRefresh, IOSSwipeBack } from "../shared/MobileInteractions";

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOfflineBanner, setShowOfflineBanner] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const breadcrumbs = getBreadcrumbs(location.pathname);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+K or Quick Search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }

      // Quick Nav (Only if not typing in an input)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key.toLowerCase() === "g") {
        const nextKeyHandler = (nextE: KeyboardEvent) => {
          const key = nextE.key.toLowerCase();
          if (key === "d") navigate("/dashboard");
          if (key === "a") navigate("/analytics");
          if (key === "s") navigate("/studio");
          if (key === "b") navigate("/deals");
          if (key === "c") navigate("/calendar");
          window.removeEventListener("keydown", nextKeyHandler);
        };
        window.addEventListener("keydown", nextKeyHandler, { once: true });
        // Auto-cleanup if no second key pressed
        setTimeout(() => window.removeEventListener("keydown", nextKeyHandler), 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Simulated NProgress Effect
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

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
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  useEffect(() => {
    const smartNotifJob = () => {
      const jobs = [
        {
          check: () => Math.random() < 0.3,
          notif: () => ({ id: `not_poll_deal_${Date.now()}`, title: 'Deal Deadline Alert', body: 'MuscleBlaze campaign deadline is in 24 hours.', type: 'warning', time: 'Just now', read: false, link: '/deals' })
        },
        {
          check: () => Math.random() < 0.25,
          notif: () => ({ id: `not_poll_trend_${Date.now()}`, title: 'Post Going Viral 🔥', body: 'Your latest Reel hit 2x your average reach.', type: 'trending', time: 'Just now', read: false, link: '/analytics' })
        },
      ];

      const triggered = jobs.find(j => j.check());
      if (!triggered) return;

      const newNotif = triggered.notif();
      db.insert('notifications', newNotif);
      toast.info(newNotif.title, { description: newNotif.body });
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
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* Global Route Bar Simulation */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-[2px] bg-primary z-route-bar shadow-[0_0_10px_rgba(37,99,235,0.5)]"
          />
        )}
      </AnimatePresence>

      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div 
        className="flex-1 flex flex-col relative z-header w-full overflow-hidden transition-[padding] duration-300 ease-in-out lg:pl-[var(--sidebar-w)] h-screen"
      >
        <Header title={pageTitle} onSearch={() => setIsCommandPaletteOpen(true)} />
        
        <main className="flex-1 pb-[calc(var(--bottom-nav-h)+1rem)] relative bg-mesh-primary overflow-y-auto no-scrollbar scroll-smooth">
          <PullToRefresh onRefresh={handleRefresh}>
            <IOSSwipeBack>
              <div className="px-[var(--page-px)] py-4 no-scrollbar max-w-[1600px] mx-auto min-h-screen space-y-4">
                
                {/* DYNAMIC BREADCRUMBS */}
                {/* DYNAMIC BREADCRUMBS */}
                <motion.nav 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 mb-6 px-1"
                >
                  <Link to="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-slate-50 transition-colors group">
                    <Home className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </Link>
                  {breadcrumbs.length > 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  
                  {breadcrumbs.slice(1).map((crumb, i) => (
                    <div key={crumb.path} className="flex items-center gap-3">
                      <Link 
                        to={crumb.path}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                          i === breadcrumbs.length - 2 
                            ? "bg-blue-50 text-blue-600 border border-blue-100" 
                            : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        {crumb.label}
                      </Link>
                      {i < breadcrumbs.length - 2 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                    </div>
                  ))}
                </motion.nav>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </IOSSwipeBack>
          </PullToRefresh>
        </main>
      </div>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
      <FloatingAiChat />
      <MobileBottomNav />

      <AnimatePresence>
        {isOffline && showOfflineBanner && (
          <motion.div 
            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
            className="fixed top-0 left-0 right-0 z-[1000] bg-amber-500 text-black py-4 px-8 flex items-center justify-between shadow-floating font-black text-[10px] uppercase tracking-widest"
          >
            <div className="flex items-center gap-4">
              <WifiOff className="w-5 h-5" />
              Intelligence Node Offline
            </div>
            <button onClick={() => setShowOfflineBanner(false)} className="p-2 hover:bg-black/10 rounded-full transition-all">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
