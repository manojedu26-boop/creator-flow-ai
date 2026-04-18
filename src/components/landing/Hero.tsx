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
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-950/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 overflow-hidden shadow-2xl group">
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
           {/* Enhanced Neural Nodes */}
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               animate={{ 
                 rotate: 360,
                 scale: [1, 1.2, 1],
                 opacity: [0.2, 0.5, 0.2]
               }}
               transition={{ 
                 rotate: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" },
                 scale: { duration: 3, repeat: Infinity, delay: i * 0.4 },
                 opacity: { duration: 3, repeat: Infinity, delay: i * 0.4 }
               }}
               className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
               style={{ 
                 transformOrigin: `${80 + (i % 4) * 25}px`,
                 marginLeft: "-0.25rem",
                 marginTop: "-0.25rem"
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

      {/* Alpha Telemetry Logs (Fills the space) */}
      <div className="absolute bottom-12 left-12 w-64 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] hidden lg:block">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 mb-4 flex items-center gap-2">
            <Zap className="w-3 h-3" /> Alpha_Logs
         </p>
         <div className="space-y-3">
            {[
              "Neural cluster synchronized",
              "Protocol L-9 active",
              "Core temperature: 24°C",
              "Trend detection operational"
            ].map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 1 }}
                className="text-[9px] font-mono text-slate-400 uppercase tracking-wider"
              >
                {">"} {log}
              </motion.div>
            ))}
         </div>
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
const TITAN_DATA = [
  { name: "CarryMinati", followers: "41M+", quote: "The AI script engine is actually legit. It understands the vibe of my niche better than most humans.", photo: "/assets/creators/titan_1.png" },
  { name: "Dhruv Rathee", followers: "24M+", quote: "CreatorForge AI actually understands the scale of my production. It's like having a neural expansion of my team.", photo: "/assets/creators/titan_6.png" },
  { name: "Technical Guruji", followers: "23M+", quote: "Managing 5 channels used to be a nightmare. Now it's a single obsidian dashboard.", photo: "/assets/creators/titan_7.png" },
  { name: "Bhuvan Bam", followers: "26M+", quote: "The content calendar is absolute fire. Keeps my consistency on point without the creative burnout.", photo: "/assets/creators/titan_8.png" },
  { name: "Prajakta Koli", followers: "7M+", quote: "My brand deals have 3x conversion since I started using the AI Media Kit. It's too professional.", photo: "/assets/creators/titan_2.png" },
  { name: "Flying Beast", followers: "9M+", quote: "Data-backed trend detection helps me stay ahead of the curve every single vlog. Essential tool.", photo: "/assets/creators/titan_3.png" },
  { name: "Zakir Khan", followers: "7M+", quote: "The hashtag engine is surprisingly good at catching the local pulse. Very impressive tech.", photo: "/assets/creators/titan_9.png" },
  { name: "Amit Bhadana", followers: "24M+", quote: "The predictor core caught a viral trend 14 hours before it peaked. This is unfair advantage.", photo: "/assets/creators/titan_10.png" },
  { name: "Ranveer Allahbadia", followers: "7M+", quote: "Neural networking for creators is the future. This is the command center we've been waiting for.", photo: "/assets/creators/titan_4.png" },
  { name: "Sandeep Maheshwari", followers: "28M+", quote: "True intelligence is about focus. This platform gives me exactly what I need to impact more lives.", photo: "/assets/creators/titan_5.png" },
];

const TitanCarousel = () => {
  const [cards, setCards] = useState(TITAN_DATA);

  useEffect(() => {
    const timer = setInterval(() => {
      setCards((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[380px] md:h-[420px] mb-12 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {cards.slice(0, 3).reverse().map((titan, i) => {
          const isTop = (2 - i) === 0;
          const isBack = (2 - i) === 2;
          
          return (
            <motion.div
              key={titan.name}
              layout
              initial={{ opacity: 0, scale: 0.8, x: 100 }}
              animate={{ 
                opacity: isTop ? 1 : (isBack ? 0.05 : 0.25),
                scale: isTop ? 1 : (isBack ? 0.90 : 0.95),
                y: isTop ? 0 : (isBack ? 40 : 20),
                zIndex: 20 - (2 - i),
                filter: isTop ? "blur(0px)" : "blur(4px)",
                rotate: isTop ? 0 : (isBack ? 4 : 2)
              }}
              exit={{ 
                x: -800, 
                opacity: 0, 
                rotate: -20,
                scale: 0.9,
                transition: { duration: 0.8, ease: "anticipate" }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 25,
              }}
              className="absolute w-full h-full bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-8 md:p-14 rounded-[4.5rem] shadow-2xl flex flex-col justify-center overflow-hidden"
              style={{
                boxShadow: isTop ? "0 30px 100px -20px rgba(59, 130, 246, 0.5)" : "none",
                perspective: "1200px"
              }}
            >
              {/* Premium Glossy Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
              
              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Stars key={s} className="w-4 h-4 text-blue-500 fill-blue-500" />
                ))}
              </div>

              <p className="text-xl md:text-3xl font-black text-white italic leading-[1.15] mb-10 uppercase tracking-tighter">
                "{titan.quote}"
              </p>

              <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                <div className="w-20 h-20 rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950 shrink-0">
                  <img 
                    src={titan.photo} 
                    alt={titan.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${titan.name}`;
                    }}
                  />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-white uppercase tracking-tighter leading-none">{titan.name}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 opacity-80">
                    {titan.followers} Scale · Neural Power User
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 pt-32 pb-12">
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
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8 text-white uppercase"
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
          className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed italic"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          CreatorForge AI disrupts the manual grind with obsidian-grade precision. Predict trends, automate production, and scale your brand with the industry's most advanced neural core.
        </motion.p>
        <TitanCarousel />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <p className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-500">
            Trusted by <span className="text-blue-500">11,240+ Titans</span> scaling to $1B+
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16"
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
               onClick={() => window.open("https://play.google.com/store/apps", "_blank")} 
               className="h-20 px-16 rounded-[2.5rem] bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-black text-[12px] uppercase tracking-[0.4em] backdrop-blur-md hover:bg-indigo-600/30 transition-all active:scale-95 flex items-center gap-4"
             >
               <PlayCircle className="w-5 h-5 text-indigo-400" />
               Get the App
             </button>
          </Magnetic>
          <Magnetic>
             <button 
               onClick={() => setShowVideo(true)} 
               className="h-20 px-16 rounded-[2.5rem] bg-white/5 border border-white/10 text-white font-black text-[12px] uppercase tracking-[0.4em] backdrop-blur-md hover:bg-white/10 transition-all active:scale-95 flex items-center gap-4"
             >
               <Zap className="w-5 h-5 text-blue-400" />
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
