import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 md:py-64 px-6 bg-slate-950 relative overflow-hidden">
      {/* High-Fidelity Background Details */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -track-x-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />
      
      <div className="container max-w-5xl relative z-10">
        <motion.div
           className="rounded-[4rem] bg-slate-900/40 backdrop-blur-3xl p-12 md:p-24 text-center relative overflow-hidden border border-white/5 shadow-2xl shadow-blue-500/5 group"
           initial={{ opacity: 0, y: 40, scale: 0.95 }}
           whileInView={{ opacity: 1, y: 0, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Background Objects */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600 rounded-full blur-[80px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-12 shadow-xl"
          >
            <Stars className="w-4 h-4" /> 
            Deployment Session Active
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-12 text-white uppercase">
            Stop Guessing. <br />
            <span className="text-blue-500 font-black italic">Start Scaling.</span>
          </h2>

          <p className="text-lg md:text-2xl text-slate-400 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
            Your high-fidelity creator intelligence engine is ready. Initialize your command centre and dominate your growth trajectory.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => navigate("/register")} 
              className="group h-20 px-16 rounded-[2.5rem] bg-blue-600 text-white font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all active:scale-95 flex items-center gap-4"
            >
              Initiate Node Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
               <Zap className="w-4 h-4 text-blue-500 fill-blue-500" /> Professional Deployment v4.2
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
