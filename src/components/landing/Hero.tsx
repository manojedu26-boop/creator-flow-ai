import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Play, X, Stars, Zap, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-32 pb-20">
      {/* High-Fidelity Ambient Background + Tech Grid */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container relative z-10 max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] text-white mb-12 shadow-2xl shadow-slate-200"
        >
          <Zap className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
          The Unified Command Centre for Creators
        </motion.div>

        <motion.h1
          className="text-7xl sm:text-8xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.8] mb-12 text-slate-950 uppercase"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Grow Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 flex items-center justify-center gap-4 py-4">
            Empire <Stars className="w-10 h-10 md:w-16 md:h-16 text-slate-950 animate-pulse" />
          </span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 font-bold leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Stop guessing. Start dominating. CreatorForge AI fuses predictive local analytics, automated production pipelines, and brand deal synchronization into one elite dashboard.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button 
            onClick={() => navigate("/register")} 
            className="group relative h-16 px-12 rounded-[2rem] bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-slate-300 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-4"
          >
            Deploy Your Suite
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          <button 
            onClick={() => setShowVideo(true)} 
            className="h-16 px-12 rounded-[2rem] bg-white border border-slate-200 text-slate-950 font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-slate-100 hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-4"
          >
            <PlayCircle className="w-5 h-5 text-blue-600" />
            Watch Intelligence
          </button>
        </motion.div>

        {/* Dashboard Preview Mockup - High Fidelity */}
        <motion.div
          className="mt-24 md:mt-32 relative mx-auto max-w-6xl px-4"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rounded-[3rem] border border-slate-200 bg-white/70 backdrop-blur-3xl p-4 md:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] relative group">
            <div className="absolute -inset-[1px] rounded-[3rem] bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-8 px-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
                CreatorForge // Alpha Terminal v3.1
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100" />
            </div>

            {/* Mock Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total Reach", value: "3.8M", color: "text-blue-600" },
                { label: "Growth Index", value: "+14.2%", color: "text-emerald-500" },
                { label: "Engagement", value: "8.4%", color: "text-slate-950" },
                { label: "Deal Pipeline", value: "₹ 1.2M", color: "text-blue-600" },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-200 space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Visual Stream Mockup */}
            <div className="mt-8 grid grid-cols-3 gap-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
               <div className="h-48 rounded-[2rem] bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/10" />
               </div>
               <div className="h-48 rounded-[2rem] bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
               </div>
               <div className="h-48 rounded-[2rem] bg-slate-100 overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1611162618071-b39a2ec05525?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/10" />
               </div>
            </div>
          </div>
          
          {/* Accent Glow */}
          <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[80%] h-32 bg-blue-500/10 blur-[100px] -z-10" />
        </motion.div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6"
          >
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.3)] border border-white/10">
              <button 
                onClick={() => setShowVideo(false)}
                className="absolute top-8 right-8 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white text-slate-950 hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-90"
              >
                <X className="w-6 h-6" />
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
