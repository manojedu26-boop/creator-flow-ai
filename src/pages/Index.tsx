import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import PainPoints from "@/components/landing/PainPoints";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => (
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

export default Index;
