import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Sidebar, navItems } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, Menu, Briefcase, Settings, LogOut } from "lucide-react";
import { FloatingAiChat } from "./FloatingAiChat";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden">
      {/* Background grain texture for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
      
      {/* Desktop Sidebar (Left Zone) */}
      <Sidebar />
      
      {/* Mobile Top Header (Visible only on mobile) */}
      <div className="lg:hidden h-16 w-full border-b border-white/5 bg-[#07071A]/90 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/30">
            <Sparkles className="w-4.5 h-4.5 text-primary" />
          </div>
          <span className="font-bebas text-xl tracking-[2px] text-white">FORGE</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to="/settings" className="p-2 text-muted-foreground hover:text-white transition-colors">
            <Settings className="w-4.5 h-4.5" />
          </Link>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="h-9 px-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all active:scale-95 border border-white/10 flex items-center gap-2">
                <Menu className="w-4 h-4 text-white" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-[#07071A] border-r border-white/5">
              <div className="flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="font-bebas text-xl tracking-[2px] text-white">CREATORFORGE</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-muted-foreground hover:text-white"><X className="w-4.5 h-4.5" /></button>
                </div>
                
                <nav className="flex-1 py-4 px-4 space-y-1.5 flex flex-col justify-start">
                  {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                      <Link 
                        key={item.label} 
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all ${
                          isActive ? "bg-primary/20 text-white border border-primary/30" : "text-muted-foreground hover:bg-white/5"
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                        <span className="font-syne text-[10px] uppercase font-bold tracking-[1.5px]">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-6 border-t border-white/5 bg-white/[0.01] space-y-3">
                  <div className="flex items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                     <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-secondary shrink-0 flex items-center justify-center text-white text-[10px] font-black uppercase">AC</div>
                     <div className="ml-3 flex-1 min-w-0">
                        <p className="text-[10px] font-syne font-black text-white uppercase truncate">ALEX_CREATOR</p>
                        <p className="text-[8px] text-muted-foreground font-mono uppercase tracking-wider">L1_CORE</p>
                     </div>
                     <div className="flex gap-0.5">
                        <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 text-muted-foreground hover:text-white transition-colors"><Settings className="w-3.5 h-3.5" /></Link>
                        <button className="p-1.5 text-muted-foreground hover:text-rose-500 transition-colors"><LogOut className="w-3.5 h-3.5" /></button>
                     </div>
                  </div>
                  
                  <Link 
                      to="/brand"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full h-11 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[9px] uppercase font-bold tracking-[2px] flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      BRAND_MODE
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col lg:ml-[72px] relative z-10 w-full overflow-hidden">
        {/* Header (Top Zone) - Desktop Only */}
        <div className="hidden lg:block">
          <Header title={pageTitle} />
        </div>
        
        {/* Mobile Page Header */}
        {!location.pathname.includes('index') && (
           <div className="lg:hidden px-6 py-4 bg-white/[0.01]">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-1 h-2.5 bg-primary rounded-full" />
                 <h2 className="font-mono text-[8.5px] font-bold uppercase tracking-[2.5px] text-muted-foreground opacity-50">CORE_SESSION</h2>
              </div>
              <h1 className="text-3xl font-bebas text-white tracking-[1px]">{pageTitle}</h1>
           </div>
        )}
        
        {/* Zone C */}
        <main className="flex-1 overflow-y-auto lg:pt-[60px] p-4 md:p-8 relative no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
