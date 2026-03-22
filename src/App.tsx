import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import NotFound from "./pages/NotFound.tsx";

import { DashboardLayout } from "./components/dashboard/DashboardLayout.tsx";
import { Home as DashboardHome } from "./pages/dashboard/Home.tsx";
import { Analytics } from "./pages/dashboard/Analytics.tsx";
import { BrandDeals } from "./pages/dashboard/BrandDeals.tsx";
import { ContentStudio } from "./pages/dashboard/ContentStudio.tsx";
import { Calendar } from "./pages/dashboard/Calendar.tsx";
import { Growth } from "./pages/dashboard/Growth.tsx";
import { Network } from "./pages/dashboard/Network.tsx";
import { Profile } from "./pages/dashboard/Profile.tsx";
import { Revenue } from "./pages/dashboard/Revenue.tsx";
import { Contracts } from "./pages/dashboard/Contracts.tsx";
import { MediaKit } from "./pages/dashboard/MediaKit.tsx";
import { Messages } from "./pages/dashboard/Messages.tsx";
import { BrandLayout } from "./components/brand/BrandLayout.tsx";
import { BrandHome } from "./pages/brand/BrandHome.tsx";
import { DiscoverCreators } from "./pages/brand/DiscoverCreators.tsx";
import { PostBrief } from "./pages/brand/PostBrief.tsx";
import { ComingSoon } from "./pages/dashboard/ComingSoon.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Post-Login CreatorForge Architecture */}
          <Route element={<DashboardLayout />}>
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
            <Route path="/mediakit" element={<MediaKit />} />
            <Route path="/messages" element={<Messages />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
