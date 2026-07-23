
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { sound } from "@/lib/sound";

export const Hero = ({ onEnter, isEntered }: { onEnter: () => void; isEntered: boolean }) => {
  const [creatorCount, setCreatorCount] = useState(4892);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCreatorCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Enter key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isEntered) {
        sound.playEnter();
        onEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEntered, onEnter]);

  const handleEnterClick = () => {
    sound.playEnter();
    onEnter();
  };

  const toggleSound = () => {
    sound.enabled = !sound.enabled;
    setSoundOn(sound.enabled);
  };

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-between bg-gradient-to-b from-[#07080c] via-[#0b0c12] to-[#07080c] text-white px-6 pt-24 pb-12 overflow-hidden select-none">
      {/* Top Controls & Live Counter */}
      <div className="w-full max-w-6xl flex items-center justify-between z-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-xs tracking-wider shadow-lg"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-widest">
            Creators growing right now: <span className="text-white font-bold">{creatorCount.toLocaleString()}</span>
          </span>
        </motion.div>

        {/* Ambient Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className="p-2.5 px-4 rounded-full border border-white/10 bg-white/[0.04] text-slate-400 hover:text-pink-400 hover:border-pink-500/40 transition-all shadow-md flex items-center gap-2 text-xs font-mono"
        >
          {soundOn ? <Volume2 className="w-3.5 h-3.5 text-pink-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline uppercase text-[10px] tracking-widest">{soundOn ? "SOUND ON" : "MUTED"}</span>
        </button>
      </div>

      {/* Main Gated Rhetorical Cover Headline */}
      <div className="my-auto max-w-5xl text-center space-y-6 z-20">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[0.95] drop-shadow-xl"
        >
          WHAT IF YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">NEXT POST</span> <br />
          <span className="underline decoration-pink-500/70 decoration-2 underline-offset-8">WASN'T LUCK?</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-lg text-slate-400 max-w-xl mx-auto font-normal leading-relaxed"
        >
          Dragon All is an AI-powered growth engine that predicts trends, generates viral hooks, and scales creators across Instagram, YouTube, and TikTok.
        </motion.p>

        {/* Gated ENTER Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-6 flex flex-col items-center gap-4"
        >
          <button 
            onClick={handleEnterClick}
            className="group relative inline-flex items-center gap-4 px-16 py-6 rounded-full border-2 border-pink-500/80 bg-pink-500/10 hover:bg-pink-500 hover:text-black font-extrabold text-base uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_50px_rgba(236,72,153,0.3)] hover:scale-105 active:scale-95"
          >
            <span>ENTER</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

          <p className="text-[11px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">
            PRESS <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">ENTER ↵</kbd> ON KEYBOARD OR CLICK TO UNLOCK
          </p>
        </motion.div>
      </div>

      {/* Atmospheric Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-pink-500/5 rounded-full blur-[180px] animate-pulse" />
      </div>
    </section>
  );
};

export default Hero;
