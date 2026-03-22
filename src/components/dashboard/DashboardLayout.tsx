import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles } from "lucide-react";
import { FloatingAiChat } from "./FloatingAiChat";

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

      {/* Floating AI Chat Assistant (Section 12) */}
      <FloatingAiChat />
    </div>
  );
};
