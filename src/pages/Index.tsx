
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import { FluidCursor } from "@/components/shared/FluidCursor";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FluidCursor />
      <Navbar />
      <main>
        {/* Elite Positional Refinement: Reordered for 'Architecture First' Narrative */}
        <PainPoints />
        
        <div id="features">
           <Features />
        </div>

        {/* The Master Legacy Section (Moved after Architecture cards) */}
        <Hero />
        
        <div id="pricing">
          <Pricing />
        </div>

        <div id="faq">
          <FAQ />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
