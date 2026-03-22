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
import { ContentStudio } from "./pages/dashboard/ContentStudio.tsx";
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
            <Route path="/analytics" element={<ComingSoon title="Analytics Command Centre" />} />
            <Route path="/deals" element={<ComingSoon title="Brand Deals & Collab Hub" />} />
            <Route path="/studio" element={<ContentStudio />} />
            <Route path="/calendar" element={<ComingSoon title="Smart Content Calendar" />} />
            <Route path="/growth" element={<ComingSoon title="Growth Strategy Engine" />} />
            <Route path="/network" element={<ComingSoon title="Creator Network" />} />
            <Route path="/revenue" element={<ComingSoon title="Monetisation & Revenue" />} />
            <Route path="/contracts" element={<ComingSoon title="Contract Shield" />} />
            <Route path="/mediakit" element={<ComingSoon title="Media Kit Builder" />} />
            <Route path="/messages" element={<ComingSoon title="Messages & DMs" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
