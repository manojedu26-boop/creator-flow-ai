import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { BrandSidebar } from "./BrandSidebar";
import { Header } from "../dashboard/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const BrandLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  // Security: Redirect non-brands back to creator dashboard
  useEffect(() => {
    if (user && user.type !== 'Brand') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const getBrandPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/brand": return "Talent Discovery Hub";
      case "/brand/campaigns": return "Campaign Warroom";
      default: return "Brand Workspace";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden font-sans">
      <BrandSidebar />
      
      {/* Dynamic Navigation Progress */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-[3px] bg-indigo-600 z-[200] shadow-[0_0_20px_rgba(79,70,229,0.5)]"
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden ml-[280px]">
        <Header title={getBrandPageTitle(location.pathname)} onSearch={() => {}} />
        
        <main className="flex-1 relative bg-slate-950 overflow-y-auto no-scrollbar scroll-smooth">
           <div className="px-10 py-8 no-scrollbar max-w-[1700px] mx-auto min-h-screen">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
           </div>
        </main>
      </div>
      <TooltipProvider>
        <Toaster theme="dark" position="top-center" expand={true} />
      </TooltipProvider>
    </div>
  );
};
