import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Intro } from "./components/shared/Intro.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.tsx";

// Lazy-loaded components
const Index = lazy(() => import("./pages/Index.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout.tsx").then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import("./pages/dashboard/Home.tsx").then(m => ({ default: m.Home })));
const Analytics = lazy(() => import("./pages/dashboard/Analytics.tsx").then(m => ({ default: m.Analytics })));
const BrandDeals = lazy(() => import("./pages/dashboard/BrandDeals.tsx").then(m => ({ default: m.BrandDeals })));
const ContentStudio = lazy(() => import("./pages/dashboard/ContentStudio.tsx").then(m => ({ default: m.ContentStudio })));
const Calendar = lazy(() => import("./pages/dashboard/Calendar.tsx").then(m => ({ default: m.Calendar })));
const Growth = lazy(() => import("./pages/dashboard/Growth.tsx").then(m => ({ default: m.Growth })));
const Network = lazy(() => import("./pages/dashboard/Network.tsx").then(m => ({ default: m.Network })));
const Profile = lazy(() => import("./pages/dashboard/Profile.tsx").then(m => ({ default: m.Profile })));
const Revenue = lazy(() => import("./pages/dashboard/Revenue.tsx").then(m => ({ default: m.Revenue })));
const Contracts = lazy(() => import("./pages/dashboard/Contracts.tsx").then(m => ({ default: m.Contracts })));
const MediaKit = lazy(() => import("./pages/dashboard/MediaKit.tsx").then(m => ({ default: m.MediaKit })));
const Messages = lazy(() => import("./pages/dashboard/Messages.tsx").then(m => ({ default: m.Messages })));
const Settings = lazy(() => import("./pages/dashboard/Settings.tsx").then(m => ({ default: m.Settings })));

const BrandLayout = lazy(() => import("./components/brand/BrandLayout").then(m => ({ default: m.BrandLayout })));
const BrandHome = lazy(() => import("./pages/brand/BrandHome.tsx").then(m => ({ default: m.BrandHome })));
const DiscoverCreators = lazy(() => import("./pages/brand/DiscoverCreators.tsx").then(m => ({ default: m.DiscoverCreators })));
const PostBrief = lazy(() => import("./pages/brand/PostBrief.tsx").then(m => ({ default: m.PostBrief })));
const ComingSoon = lazy(() => import("./pages/dashboard/ComingSoon.tsx").then(m => ({ default: m.ComingSoon })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <div className="absolute inset-0 blur-lg bg-primary/20 rounded-full animate-pulse" />
    </motion.div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AnimatePresence mode="wait">
          {showIntro ? (
            <Intro key="intro" onComplete={() => setShowIntro(false)} />
          ) : (
            <AuthProvider>
              <BrowserRouter key="app">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/onboarding" element={<Onboarding />} />
                    
                    {/* Post-Login CreatorForge Architecture */}
                    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                      <Route path="/dashboard" element={<DashboardHome />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/deals" element={<BrandDeals />} />
                      <Route path="/studio" element={<ContentStudio />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/growth" element={<Growth />} />
                      <Route path="/network" element={<Network />} />
                      <Route path="/network/profile/:id" element={<Profile />} />
                      <Route path="/revenue" element={<Revenue />} />
                      <Route path="/contracts" element={<Contracts />} />
                      <Route path="/mediakit" element={< MediaKit />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Brand Mode Routes (Section 13) */}
                    <Route path="/brand" element={<BrandLayout />}>
                      <Route index element={<BrandHome />} />
                      <Route path="discover" element={<DiscoverCreators />} />
                      <Route path="post-brief" element={<PostBrief />} />
                      <Route path="analytics" element={<ComingSoon title="Campaign Analytics" />} />
                      <Route path="messages" element={<ComingSoon title="Brand Messages" />} />
                      <Route path="deals" element={<ComingSoon title="Active Deals" />} />
                      <Route path="contracts" element={<ComingSoon title="Brand Contracts" />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


export default App;
