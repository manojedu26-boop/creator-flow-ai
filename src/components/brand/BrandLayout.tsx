import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { BrandSidebar } from "./BrandSidebar";
import { Header } from "../dashboard/Header";
import { FloatingAiChat } from "../dashboard/FloatingAiChat";

const getBrandPageTitle = (pathname: string) => {
  switch (pathname) {
    case "/brand": return "Brand Mission Control";
    case "/brand/discover": return "Creator Discovery Engine";
    case "/brand/post-brief": return "Campaign Brief Publication";
    case "/brand/analytics": return "Global Campaign Analytics";
    case "/brand/messages": return "Creator Communications";
    case "/brand/deals": return "Active Partnerships";
    case "/brand/contracts": return "Legal & Contracts";
    default: return "Brand Dashboard";
  }
};

export const BrandLayout = () => {
  const location = useLocation();
  const title = getBrandPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground flex overflow-hidden">
      {/* Background grain texture */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-0" />
      
      {/* Brand Sidebar */}
      <BrandSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative z-10 w-full overflow-hidden">
        <Header title={title} />
        
        <main className="flex-1 overflow-y-auto pt-[60px] p-8 no-scrollbar scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Still show AI Assistant but it might be data-aware of brand stats */}
      <FloatingAiChat />
    </div>
  );
};
