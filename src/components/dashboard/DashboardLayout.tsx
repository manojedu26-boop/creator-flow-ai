import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar, navItems } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Menu, Briefcase, Settings, LogOut } from "lucide-react";
import { FloatingAiChat } from "./FloatingAiChat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";

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
    default: return "Dashboard";
  }
};

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    if (user) {
      document.title = `CreatorForge — ${user.name}'s Dashboard`;
    } else {
      document.title = `CreatorForge`;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden">
      {/* Background grain texture for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
      
      {/* Desktop Sidebar (Left Zone) */}
      <Sidebar />
      
      {/* Mobile Top Header (Visible only on mobile) */}
      <div className="lg:hidden h-16 w-full border-b border-border/40 bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-black tracking-tighter text-lg uppercase">CreatorForge</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-muted/50 rounded-xl transition-all active:scale-95 border border-border/20 shadow-sm">
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 bg-background border-r border-border/40">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  <span className="font-black tracking-tighter text-xl uppercase">CreatorForge</span>
                </div>
              </div>
              <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.href);
                  return (
                    <Link 
                      key={item.label} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        isActive ? "bg-primary/10 text-primary shadow-sm border border-primary/20" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold text-sm tracking-tight">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-6 border-t border-border/30 bg-muted/5 space-y-3">
                <Link 
                  to="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/50 transition-all font-bold text-sm"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </Link>
                <div className="h-px bg-border/20 mx-2" />
                <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-card border border-border/20 shadow-sm">
                   {user?.photo ? (
                     <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                   ) : (
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 shrink-0 flex items-center justify-center text-white text-[10px] font-black uppercase">
                       {user?.firstName?.[0] || user?.name?.[0] || 'U'}
                     </div>
                   )}
                   <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-black truncate">{user?.name || "User"}</span>
                      <span className="text-[9px] text-muted-foreground font-bold truncate">{user?.handle || "@creator"}</span>
                   </div>
                   <button 
                    onClick={logout}
                    className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
                   >
                      <LogOut className="w-4 h-4" />
                   </button>
                </div>
                <Link 
                    to="/brand"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full h-12 rounded-xl bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
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
      <div className="flex-1 flex flex-col lg:ml-[72px] relative z-10 w-full overflow-hidden">
        {/* Header (Top Zone) - Adjusted for mobile */}
        <div className="hidden lg:block">
          <Header title={pageTitle} />
        </div>
        
        {/* Simple Mobile Title (Optional, since Header is hidden on mobile in this pattern) */}
        {!location.pathname.includes('index') && (
           <div className="lg:hidden px-6 py-4 border-b border-border/10 bg-muted/5">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">{pageTitle}</h2>
           </div>
        )}
        
        {/* Zone C */}
        <main className="flex-1 overflow-y-auto lg:pt-[60px] p-4 md:p-8 relative no-scrollbar">
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

      {/* Floating AI Chat Assistant */}
      <FloatingAiChat />
    </div>
  );
};
