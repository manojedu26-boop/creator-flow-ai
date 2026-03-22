import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero px-4">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-glass px-4 py-1.5 text-sm text-muted-foreground mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI-Powered Creator Growth Engine
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ textWrap: "balance" }}
        >
          Grow Your
          <br />
          <span className="text-gradient-primary">Creator Empire</span>
          <br />
          With AI
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ textWrap: "pretty" }}
        >
          The all-in-one command centre for Instagram, YouTube & TikTok creators. 
          AI scripts, analytics, brand deals, and growth strategies — built for you.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-5px_hsl(318,100%,62%,0.4)] active:scale-[0.97]">
            Start Free — No Card Needed
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-glass px-8 py-3.5 font-medium text-foreground transition-all hover:bg-muted active:scale-[0.97]">
            Watch Demo
          </button>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div
          className="mt-16 md:mt-20 relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 md:p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-gold/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <span className="ml-3 text-xs text-muted-foreground">CREATORX AI — Dashboard</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Total Reach", value: "2.4M", delta: "+18.2%" },
                { label: "Follower Growth", value: "+12,847", delta: "+6.1%" },
                { label: "Engagement Rate", value: "4.7%", delta: "+0.8%" },
                { label: "Est. Revenue", value: "$3,240", delta: "+$890" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg bg-muted/50 p-3 md:p-4">
                  <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
                  <p className="text-xl md:text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-accent mt-1">{kpi.delta}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg bg-muted/30 h-24 md:h-32 flex items-center justify-center">
                  <div className="w-3/4 h-2/3 rounded bg-gradient-to-t from-primary/20 to-secondary/10" />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
