import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import MobileLanding from "@/components/landing/MobileLanding";

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PainPoints />
      <div id="features">
        <Features />
      </div>
      <Pricing />
      <Testimonials />
      <div id="faq">
        <FAQ />
      </div>
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
