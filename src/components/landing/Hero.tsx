
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, X, Stars, Zap, PlayCircle, Brain, Activity, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Magnetic } from "../shared/MotionComponents";

const NeuralCore = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-slate-950/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl group transition-all hover:border-blue-500/20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"
        />
        <div className="relative">
           <div className="w-24 h-24 bg-slate-900 rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <Brain className="w-10 h-10 text-blue-500 animate-pulse" />
           </div>
        </div>
      </div>
      <div className="absolute top-8 left-8 grid gap-3">
         <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl">
            <Activity className="w-4 h-4 text-emerald-400" />
            <p className="text-[9px] font-black uppercase text-white">Neural Flux: Optimal</p>
         </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 pt-24 pb-12">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
      </div>

      <div className="container relative z-10 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md px-5 py-2 text-[9px] font-black uppercase tracking-[0.4em] text-blue-400 mb-8 shadow-2xl"
        >
          <Sparkles className="w-3.5 h-3.5 fill-blue-500" />
          Synchronising Creator Intelligence
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-6 text-white uppercase"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Forge Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 inline-block py-2">
            Legacy
          </span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Disrupt the manual grind with obsidian-grade precision. Predict trends, automate production, and scale with the industry's most advanced neural core.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            Trusted by <span className="text-blue-500">11,240+ Titans</span>
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Magnetic>
             <button onClick={() => navigate("/register")} className="h-16 px-10 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all flex items-center gap-3">
               Initiate <ArrowRight className="w-4 h-4" />
             </button>
          </Magnetic>
          <Magnetic>
             <button onClick={() => setShowVideo(true)} className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.4em] backdrop-blur-md hover:bg-white/10 transition-all flex items-center gap-3">
               <Zap className="w-4 h-4 text-blue-400" /> Intelligence
             </button>
          </Magnetic>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto"
        >
           <NeuralCore />
        </motion.div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6"
          >
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-slate-950 hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" title="Demo" frameBorder="0" allowFullScreen></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
