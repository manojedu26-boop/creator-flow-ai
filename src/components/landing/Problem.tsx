import { motion } from "framer-motion";

export const Problem = () => {
  const factLines = [
    { stat: "87%", label: "of creators waste 15+ hours weekly guessing what hooks will work." },
    { stat: "3.4x", label: "higher viral velocity achieved when posting during micro-audience spikes." },
    { stat: "0", label: "guessing required when your content calendar is backed by real-time neural data." }
  ];

  return (
    <section className="py-32 px-6 bg-[#0A0A0A] text-white border-t border-white/5 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-left max-w-4xl"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400 mb-4 block">
            [02 // ALGORITHM RESTRUCTURE]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95]">
            WHAT IF THE ALGORITHM <br />
            <span className="underline decoration-emerald-400 decoration-4 underline-offset-8">WASN'T THE ENEMY?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {factLines.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4 hover:border-emerald-400/50 transition-all duration-300"
            >
              <div className="text-4xl sm:text-6xl font-black font-mono text-emerald-400">
                {item.stat}
              </div>
              <p className="text-slate-300 font-medium text-base sm:text-lg leading-snug">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
