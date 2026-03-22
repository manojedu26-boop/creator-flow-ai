import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
  <section className="py-24 md:py-32 px-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.04] to-transparent" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[150px]" />
    
    <motion.div
      className="container max-w-3xl relative z-10 text-center"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-glass px-4 py-1.5 text-sm text-muted-foreground mb-6">
        <Sparkles className="w-3.5 h-3.5 text-gold" />
        Join 2,400+ creators already growing
      </div>
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5" style={{ textWrap: "balance" }}>
        Stop guessing.
        <br />
        <span className="text-gradient-primary">Start growing.</span>
      </h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto" style={{ textWrap: "pretty" }}>
        Your AI-powered creator growth engine is ready. Connect your accounts, get your first AI-generated content plan, and start scaling — all in under 4 minutes.
      </p>
      <button onClick={() => navigate("/register")} className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground transition-all hover:shadow-[0_0_40px_-5px_hsl(318,100%,62%,0.4)] active:scale-[0.97]">
        Start Free — No Credit Card Needed
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  </section>
  );
};

export default FinalCTA;
