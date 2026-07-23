
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import GrowthGallery from "@/components/landing/GrowthGallery";
import HowItWorks from "@/components/landing/HowItWorks";
import LiveIdeaBoard from "@/components/landing/LiveIdeaBoard";
import CommunityGallery from "@/components/landing/CommunityGallery";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { FluidCursor } from "@/components/shared/FluidCursor";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-pink-500 selection:text-black overflow-x-hidden relative">
      {/* Animated Film Grain Overlay */}
      <div className="bg-noise-overlay" />
      <FluidCursor />
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Problem */}
        <Problem />

        {/* Section 3: Draggable Growth Gallery */}
        <GrowthGallery />

        {/* Section 4: How It Works */}
        <HowItWorks />

        {/* Section 5: Live Idea Board */}
        <LiveIdeaBoard />

        {/* Section 6: Community Proof */}
        <CommunityGallery />

        {/* Section 7: Final CTA */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
