import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-6 bg-[#07080c] text-white border-t border-white/5 text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-10">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]"
        >
          READY TO STOP <br />
          <span className="underline decoration-indigo-500/80 decoration-2 underline-offset-8">GUESSING?</span>
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-3 px-14 py-6 rounded-full border border-white/20 bg-white/5 hover:bg-indigo-500 hover:border-indigo-500 hover:text-black font-bold text-base uppercase tracking-widest transition-all duration-300 shadow-2xl"
          >
            <span>enter</span>
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTA;
