import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles } from "lucide-react";

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
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Background grain texture for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
      
      {/* Zone A */}
      <Sidebar />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col ml-[72px] transition-all duration-300 relative z-10 w-full">
        {/* Zone B */}
        <Header title={pageTitle} />
        
        {/* Zone C */}
        <main className="flex-1 overflow-y-auto pt-[60px] p-4 md:p-8 relative">
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isAIChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.4 }}
              className="w-[380px] h-[560px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-muted/20">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="w-4 h-4 text-primary" />
                  CreatorForge AI Assistant
                </div>
                <button 
                  onClick={() => setIsAIChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm flex flex-col">
                <div className="bg-primary/10 border border-primary/20 rounded-xl rounded-tl-sm p-3 max-w-[85%]">
                  👋 Hey Alex! Your follower growth is performing well today. How can I help you scale faster?
                </div>
              </div>

              <div className="p-3 border-t border-border/40 bg-muted/10">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    "What should I post today?",
                    "Write a pitch for Zomato",
                    "Why is my reach dropping?"
                  ].map((prompt) => (
                    <button key={prompt} className="whitespace-nowrap px-3 py-1.5 text-xs bg-background border border-border/50 rounded-full hover:border-primary/50 transition-colors">
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Ask your AI coach anything..." 
                    className="w-full h-10 bg-background border border-border/50 rounded-xl pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button className="absolute right-1 top-1 bottom-1 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                    ▲
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary))] relative z-50 group hover:animate-none"
        >
          <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" />
          {isAIChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
};
