import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, X, Stars, Zap, PlayCircle, Brain, Activity, Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Magnetic, MagneticPulse } from "../shared/MotionComponents";

const NeuralCore = () => {
  const [pulse, setPulse] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setPulse(p => (p + 1) % 100), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl group">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Central Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"
        />
        <div className="relative">
           <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent" />
              <Brain className="w-12 h-12 text-blue-500 animate-pulse" />
           </div>
           {/* Electrons/Nodes */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 rotate: 360,
                 scale: [1, 1.2, 1]
               }}
               transition={{ 
                 rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                 scale: { duration: 2, repeat: Infinity, delay: i * 0.3 }
               }}
               className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full blur-[2px]"
               style={{ 
                 transformOrigin: `${60 + i * 15}px`,
                 opacity: 0.4 + (i * 0.1)
               }}
             />
           ))}
        </div>
      </div>

      {/* Floating Status Cards */}
      <div className="absolute top-12 left-12 grid gap-4">
        {[
          { icon: Activity, label: "Neural Flux", value: "Optimal", color: "text-emerald-400" },
          { icon: Cpu, label: "Core Sync", value: "98.2%", color: "text-blue-400" }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-[1.5rem] shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
               <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
               <p className="text-sm font-black text-white">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-12 right-12 text-right">
         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 mb-2">Alpha Terminal v4.2</p>
         <div className="flex items-center justify-end gap-2">
            {[1,1,1,0].map((b, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full ${b ? 'bg-blue-500' : 'bg-slate-800'}`} />
            ))}
         </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 pt-32 pb-20">
      {/* Midnight Obsidian Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-12 shadow-2xl"
        >
          <Sparkles className="w-3.5 h-3.5 fill-blue-500" />
          Synchronising Creator Intelligence
        </motion.div>

        <motion.h1
          className="text-8xl md:text-9xl lg:text-[11rem] font-black tracking-tighter leading-[0.75] mb-12 text-white uppercase"
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Forge Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 inline-block py-4">
            Legacy
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-3xl text-slate-400 max-w-4xl mx-auto mb-16 font-medium leading-relaxed italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          CreatorForge AI disrupts the manual grind with obsidian-grade precision. Predict trends, automate production, and scale your brand with the industry's most advanced neural core.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic>
             <button 
               onClick={() => navigate("/register")} 
               className="group relative h-20 px-16 rounded-[2.5rem] bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-4"
             >
               Initiate Deployment
               <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
             </button>
          </Magnetic>
          <Magnetic>
             <button 
               onClick={() => setShowVideo(true)} 
               className="h-20 px-16 rounded-[2.5rem] bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.4em] backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 flex items-center gap-4"
             >
               <PlayCircle className="w-5 h-5 text-blue-400" />
               View Intelligence
             </button>
          </Magnetic>
        </motion.div>

        {/* Neural Processing Demo Mockup */}
        <motion.div
           initial={{ opacity: 0, y: 60 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="max-w-6xl mx-auto px-4"
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
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/5">
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-8 right-8 z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white text-slate-950 hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-90"
              >
                <X className="w-7 h-7" />
              </button>
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
                title="CreatorForge Intelligence Demo" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
