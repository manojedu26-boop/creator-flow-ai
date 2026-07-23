
import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Problem from "@/components/landing/Problem";
import GrowthGallery from "@/components/landing/GrowthGallery";
import HowItWorks from "@/components/landing/HowItWorks";
import LiveIdeaBoard from "@/components/landing/LiveIdeaBoard";
import CommunityGallery from "@/components/landing/CommunityGallery";
import InteractiveCanvas from "@/components/landing/InteractiveCanvas";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import { FluidCursor } from "@/components/shared/FluidCursor";

const Index = () => {
  const [isEntered, setIsEntered] = useState(false);

  // Lock scroll until user hits ENTER
  useEffect(() => {
    if (!isEntered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Smooth scroll down to Problem section
      const problemEl = document.getElementById("problem-section");
      if (problemEl) {
        problemEl.scrollIntoView({ behavior: "smooth" });
      }
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEntered]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500 selection:text-black overflow-x-hidden relative">
      {/* Animated Film Grain Overlay */}
      <div className="bg-noise-overlay" />
      <FluidCursor />
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Section 1: Hero (Gated Portal) */}
        <Hero isEntered={isEntered} onEnter={() => setIsEntered(true)} />

        {/* Unlocked Cinematic Sections */}
        <div className={`transition-opacity duration-1000 ${isEntered ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
          {/* Section 2: Problem */}
          <div id="problem-section">
            <Problem />
          </div>

          {/* Section 3: Draggable Growth Gallery */}
          <GrowthGallery />

          {/* Section 4: How It Works */}
          <HowItWorks />

          {/* Section 5: Live Idea Board */}
          <LiveIdeaBoard />

          {/* Section 6: Community Proof */}
          <CommunityGallery />

          {/* Section 8: Interactive Spray Canvas */}
          <InteractiveCanvas />

          {/* Section 7: Final CTA */}
          <FinalCTA />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
