import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <PainPoints />
        <div id="features">
          <Features />
        </div>
        <div id="pricing">
          <Pricing />
        </div>
        <Testimonials />
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
