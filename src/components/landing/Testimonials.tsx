import { motion } from "framer-motion";
import { Instagram, Youtube, Stars } from "lucide-react";

const testimonials = [
  {
    name: "Mia Chen",
    handle: "@miacreates",
    niche: "Lifestyle & Wellness",
    platform: "instagram" as const,
    avatar: "MC",
    quote: "CREATORX AI wrote me a brand pitch in 30 seconds that landed a $2,000 deal. I used to spend hours on those.",
  },
  {
    name: "Jake Torres",
    handle: "@jaketechtalks",
    niche: "Tech Reviews",
    platform: "youtube" as const,
    avatar: "JT",
    quote: "The analytics hub showed me my Tuesday uploads get 3x more views. Simple insight, massive results.",
  },
  {
    name: "Priya Sharma",
    handle: "@priyafitlife",
    niche: "Fitness & Health",
    platform: "instagram" as const,
    avatar: "PS",
    quote: "My media kit looks like a Fortune 500 deck. Brands take me seriously now. Worth every penny.",
  },
  {
    name: "Leo Park",
    handle: "@leoparkvibes",
    niche: "Travel & Food",
    platform: "youtube" as const,
    avatar: "LP",
    quote: "The AI content calendar fills my entire month in minutes. I just tweak and post. Game changer.",
  },
];

const PlatformIcon = ({ platform }: { platform: "instagram" | "youtube" }) =>
  platform === "instagram" ? (
    <Instagram className="w-3.5 h-3.5 text-primary" />
  ) : (
    <Youtube className="w-3.5 h-3.5 text-destructive" />
  );

const Testimonials = () => (
  <section className="py-32 md:py-64 px-6 bg-slate-950 relative overflow-hidden">
    {/* Background Detail */}
    <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
    
    <div className="container max-w-7xl relative z-10">
      <motion.div
        className="text-center mb-40"
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
        <p className="text-slate-400 font-medium text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
          The high-fidelity command centre for the world's most ambitious icons.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="group relative rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl p-12 border border-white/5 flex flex-col transition-all hover:border-blue-500/30 overflow-hidden h-full"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <p className="relative z-10 text-xl text-slate-300 font-medium leading-relaxed mb-12 italic shrink-0">
               "{t.quote}"
            </p>
            
            <div className="relative z-10 mt-auto flex items-center gap-5 pt-10 border-t border-white/5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600/20 border border-blue-500/10 flex items-center justify-center font-black text-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl shadow-blue-900/20">
                {t.avatar}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-black text-lg text-white uppercase tracking-tight leading-none">{t.name}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <PlatformIcon platform={t.platform} />
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-blue-500 transition-colors">
                  {t.niche} · <span className="text-blue-500/60">{t.handle}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
