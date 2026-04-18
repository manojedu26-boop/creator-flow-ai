import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import ArcCarousel from "@/components/landing/ArcCarousel";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import { StackedExperience } from "@/components/landing/StackedExperience";
import { FluidCursor } from "@/components/shared/FluidCursor";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FluidCursor />
      <Navbar />
      <main>
        <Hero />
        <FinalCTA />
        <PainPoints />
        <div id="features">
          <Features />
        </div>
        <StackedExperience />
        <div id="pricing">
          <Pricing />
        </div>
        <ArcCarousel />
        <Testimonials />
        <div id="faq">
          <FAQ />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
