
import { motion } from "framer-motion";
import { Stars, Quote } from "lucide-react";
import { TitanArc } from "./TitanArc";

const Testimonials = () => (
  <section className="py-20 md:py-32 px-6 bg-slate-950 relative overflow-hidden">
    {/* Background Detail */}
    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
    
    <div className="container max-w-7xl relative z-10 text-center">
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 shadow-2xl">
           <Stars className="w-4 h-4" /> Global Intelligence Sync
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-10 text-white uppercase">
          Elite Creator <br />
          <span className="text-blue-500 font-black italic">Network.</span>
        </h2>
        <p className="text-slate-400 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          The high-fidelity command centre for the world's most ambitious icons.
        </p>
      </motion.div>

      <TitanArc />
      
      <div className="mt-20 flex flex-col items-center">
         <div className="w-px h-16 bg-gradient-to-down from-blue-500/50 to-transparent mb-6" />
         <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-white hover:border-blue-500/30 transition-all flex items-center gap-3">
             <Quote className="w-4 h-4 text-blue-500" /> View Case Studies
         </button>
      </div>
    </div>
  </section>
);

export default Testimonials;
