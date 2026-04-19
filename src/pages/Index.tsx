
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
        {/* Master Hero & Titan Arc: The Alpha Entry Point */}
        <Hero />
        
        {/* Creator Ceiling: Optimized for narrative momentum */}
        <PainPoints />
        
        {/* Elite Architecture: High-fidelity feature stack */}
        <div id="features">
           <Features />
        </div>

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
