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
import { ThemeProvider } from "next-themes";
import { PulseProvider } from "./contexts/PulseContext.tsx";
import { ExploreProvider } from "./contexts/ExploreContext.tsx";

// Lazy-loaded components
const Index = lazy(() => import("./pages/Index.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Register = lazy(() => import("./pages/Register.tsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.tsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const PublicMediaKit = lazy(() => import("./pages/PublicMediaKit.tsx"));
const Marketplace = lazy(() => import("./pages/Marketplace.tsx"));
const MarketplaceDetail = lazy(() => import("./pages/MarketplaceDetail.tsx"));

const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout.tsx").then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import("./pages/dashboard/Home.tsx").then(m => ({ default: m.Home })));
const PulseFeed = lazy(() => import("./pages/dashboard/PulseFeed.tsx").then(m => ({ default: m.PulseFeed })));
const Explore = lazy(() => import("./pages/dashboard/Explore.tsx").then(m => ({ default: m.Explore })));
const Analytics = lazy(() => import("./pages/dashboard/Analytics.tsx").then(m => ({ default: m.Analytics })));
const BrandDeals = lazy(() => import("./pages/dashboard/BrandDeals.tsx").then(m => ({ default: m.BrandDeals })));
const ContentStudio = lazy(() => import("./pages/dashboard/ContentStudio.tsx").then(m => ({ default: m.ContentStudio })));
const Growth = lazy(() => import("./pages/dashboard/Growth.tsx").then(m => ({ default: m.Growth })));
const Network = lazy(() => import("./pages/dashboard/Network.tsx").then(m => ({ default: m.Network })));
const Profile = lazy(() => import("./pages/dashboard/Profile.tsx").then(m => ({ default: m.Profile })));
const Revenue = lazy(() => import("./pages/dashboard/Revenue.tsx").then(m => ({ default: m.Revenue })));
const Contracts = lazy(() => import("./pages/dashboard/Contracts.tsx").then(m => ({ default: m.Contracts })));
const MediaKit = lazy(() => import("./pages/dashboard/MediaKit.tsx").then(m => ({ default: m.MediaKit })));
const Messages = lazy(() => import("./pages/dashboard/Messages.tsx").then(m => ({ default: m.Messages })));
const Settings = lazy(() => import("./pages/dashboard/Settings.tsx").then(m => ({ default: m.Settings })));
const NotificationsPage = lazy(() => import("./pages/dashboard/Notifications.tsx").then(m => ({ default: m.Notifications })));
const CollabRoom = lazy(() => import("./pages/dashboard/CollabRoom.tsx").then(m => ({ default: m.CollabRoom })));
const VideoEditor = lazy(() => import("./pages/dashboard/VideoEditor.tsx").then(m => ({ default: m.VideoEditor })));

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
      <BrowserRouter key="app">
        <TooltipProvider>
          <Sonner />
          <Toaster />
          <AnimatePresence mode="wait">
            {showIntro ? (
              <Intro key="intro" onComplete={() => setShowIntro(false)} />
            ) : (
              <AuthProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                  <ExploreProvider>
                    <PulseProvider>
                      <Suspense fallback={<PageLoader />}>
                        <Routes>
                      {/* Public Routes */}
                      <Route path="/media-kit/:id" element={<PublicMediaKit />} />
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/marketplace/:id" element={<MarketplaceDetail />} />

                      {/* Post-Login CreatorForge Architecture */}
                      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<DashboardHome />} />
                        <Route path="/pulse" element={<PulseFeed />} />
                        <Route path="/explore" element={<Explore />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/deals" element={<BrandDeals />} />
                        <Route path="/editor" element={<VideoEditor />} />
                        <Route path="/studio" element={<ContentStudio />} />
                        <Route path="/growth" element={<Growth />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="/network" element={<Network />} />
                        <Route path="/network/profile/:id" element={<Profile />} />
                        <Route path="/revenue" element={<Revenue />} />
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/mediakit" element={<MediaKit />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/collab/:id" element={<CollabRoom />} />
                      </Route>

                      {/* Brand Mode Routes */}
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
                    </PulseProvider>
                  </ExploreProvider>
                </ThemeProvider>
              </AuthProvider>
            )}
          </AnimatePresence>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
