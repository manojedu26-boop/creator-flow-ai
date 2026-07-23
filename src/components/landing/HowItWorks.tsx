import { motion } from "framer-motion";

const MOVES = [
  {
    num: "01",
    title: "CONTENT IDEATION & SCRIPTING",
    desc: "AI analyzes top 1% viral content in your niche and drafts hooks that force viewers to stay.",
    align: "md:ml-0 md:mr-auto"
  },
  {
    num: "02",
    title: "TREND DETECTION & TIMING",
    desc: "Catch micro-trends 24 hours before they peak on Instagram Reels and YouTube Shorts.",
    align: "md:ml-auto md:mr-0"
  },
  {
    num: "03",
    title: "AUDIENCE INSIGHTS & RETENTION",
    desc: "See exact second-by-second drop-off points so every video converts viewers into followers.",
    align: "md:ml-24 md:mr-auto"
  },
  {
    num: "04",
    title: "AUTO-OPTIMIZATION ENGINE",
    desc: "Automatically adapt captions, hashtags, and posting schedules to maximum peak reach.",
    align: "md:ml-auto md:mr-12"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-[#07080c] text-white border-t border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400 mb-3 block">
            [04 // ARCHITECTURE EXECUTION]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            FOUR MOVES. <span className="underline decoration-blue-500/80 decoration-2 underline-offset-8">ONE ENGINE.</span>
          </h2>
        </motion.div>

        {/* Staggered Vertical Cascade */}
        <div className="space-y-16">
          {MOVES.map((move, idx) => (
            <motion.div
              key={move.num}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className={`max-w-2xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 bg-white/[0.02] hover:border-blue-500/50 transition-all duration-300 ${move.align}`}
            >
              <div className="text-5xl md:text-7xl font-black font-mono text-blue-400 mb-4">
                {move.num}
              </div>
              <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-3">
                {move.title}
              </h3>
              <p className="text-slate-300 font-normal text-base md:text-lg leading-relaxed">
                {move.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
