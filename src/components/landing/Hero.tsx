
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  const [creatorCount, setCreatorCount] = useState(4892);

  useEffect(() => {
    const interval = setInterval(() => {
      setCreatorCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between bg-[#0A0A0A] text-white px-6 pt-32 pb-16 overflow-hidden">
      {/* Live Counter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-xs tracking-wider"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-slate-400 font-mono text-[11px] uppercase tracking-widest">
          Creators growing right now: <span className="text-white font-bold">{creatorCount.toLocaleString()}</span>
        </span>
      </motion.div>

      {/* Main Rhetorical Cover Headline */}
      <div className="my-auto max-w-6xl text-center space-y-8">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.88] select-none"
        >
          WHAT IF YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">NEXT POST</span> <br />
          <span className="underline decoration-pink-500/80 decoration-4 underline-offset-8">WASN'T LUCK?</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Dragon All is an AI-powered growth engine that predicts trends, generates viral hooks, and scales creators across Instagram, YouTube, and TikTok.
        </motion.p>

        {/* Minimal CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <button 
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-full border border-white/20 bg-white/5 hover:bg-pink-500 hover:border-pink-500 hover:text-black font-semibold text-sm uppercase tracking-widest transition-all duration-300 shadow-xl"
          >
            <span>enter</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Hint Indicator */}
      <div className="text-[10px] text-slate-500 uppercase tracking-[0.4em] animate-pulse">
        Scroll to reveal algorithm secrets
      </div>
    </section>
  );
};

export default Hero;
