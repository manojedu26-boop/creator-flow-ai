import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  handle: string;
  niche: string;
  rotation: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  { id: 1, quote: "Dragon All cut my scripting time from 4 hours to 10 minutes. My channel hit 100K in under 5 months.", author: "Dhruv Rathee", handle: "@dhruvrathee", niche: "Education", rotation: "-rotate-2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dhruv" },
  { id: 2, quote: "The brand deal tracker paid for itself 10x over on my first sponsored Reel. Mandatory tool for creators.", author: "Maya Hills", handle: "@mayahills", niche: "Lifestyle", rotation: "rotate-3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" },
  { id: 3, quote: "Finally software built by people who actually post every day. The hook engine is absurdly accurate.", author: "Rohan Varma", handle: "@rohan_fit", niche: "Fitness", rotation: "-rotate-1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" },
  { id: 4, quote: "Cross-platform analytics showed me my YouTube Shorts audience was completely different from IG. Gamechanger.", author: "Aisha Khan", handle: "@aisha_tech", niche: "Tech", rotation: "rotate-2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha" },
];

export const CommunityGallery = () => {
  return (
    <section className="py-32 px-6 bg-[#0A0A0A] text-white border-t border-white/5 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-emerald-400 mb-4 block">
            [06 // COMMUNITY COLLECTIVE]
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
            YOU'RE NOT <span className="underline decoration-emerald-400 decoration-4 underline-offset-8">BUILDING ALONE.</span>
          </h2>
        </motion.div>

        {/* Polaroid Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.03, rotate: 0 }}
              className={`p-6 rounded-[2rem] bg-white text-slate-900 ${t.rotation} shadow-2xl transition-all duration-300 space-y-6 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-emerald-500 fill-emerald-100" />
                <p className="text-sm font-semibold leading-relaxed tracking-tight text-slate-800">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full bg-slate-100 object-cover" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.author}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{t.handle} • {t.niche}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityGallery;
