
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Youtube, Twitter, Zap, ArrowLeft, ArrowRight } from "lucide-react";

const SOCIAL_CARDS = [
  { id: 1, type: "instagram", user: "@creator.forge", img: "/assets/social/social_1.png", tag: "Creative Studio" },
  { id: 2, type: "youtube", user: "Forge Academy", img: "/assets/social/social_2.png", tag: "Intelligence Hub" },
  { id: 3, type: "twitter", user: "Forge_Ops", img: "/assets/social/social_3.png", tag: "Strategy" },
  { id: 4, type: "instagram", user: "@founder.daily", img: "/assets/social/social_4.png", tag: "Visionary" },
  { id: 5, type: "youtube", user: "Neural Mastery", img: "/assets/social/social_5.png", tag: "Performance" },
];

const ArcCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  const rotateRight = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SOCIAL_CARDS.length);
  }, []);

  const rotateLeft = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SOCIAL_CARDS.length) % SOCIAL_CARDS.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(rotateRight, 4000);
    return () => clearInterval(interval);
  }, [rotateRight, isPaused]);

  return (
    <section className="py-32 bg-slate-950 overflow-hidden relative">
      <div className="container max-w-7xl px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-4"
          >
            Social Intelligence
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none"
          >
            What's up on <br />
            <span className="text-blue-500 italic">Socials.</span>
          </motion.h3>
        </div>

        <div 
          className="relative h-[600px] flex items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-20 pointer-events-none" />

          <div className="relative w-full h-full flex items-center justify-center">
            {SOCIAL_CARDS.map((card, i) => {
              // Calculate relative position with wrapping
              let diff = i - activeIndex;
              if (diff > Math.floor(SOCIAL_CARDS.length / 2)) diff -= SOCIAL_CARDS.length;
              if (diff < -Math.floor(SOCIAL_CARDS.length / 2)) diff += SOCIAL_CARDS.length;

              const isActive = diff === 0;
              const absDiff = Math.abs(diff);
              
              // Parabolic Positioning
              const x = diff * 320;
              const y = absDiff * 60;
              const rotate = diff * 8;
              const scale = 1 - absDiff * 0.15;
              const opacity = 1 - absDiff * 0.3;
              const blur = absDiff * 4;

              return (
                <motion.div
                  key={card.id}
                  animate={{
                    x,
                    y,
                    rotateZ: rotate,
                    scale,
                    opacity,
                    filter: `blur(${blur}px)`,
                    zIndex: 10 - absDiff,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  className="absolute w-[340px] aspect-[4/5] rounded-[3rem] bg-slate-900 overflow-hidden border border-white/10 group cursor-pointer shadow-2xl"
                  onClick={() => setActiveIndex(i)}
                >
                  <img src={card.img} alt={card.user} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                  
                  {/* Glassmorphic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-8 left-8 right-8 text-left transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-[8px] font-black uppercase tracking-[0.2em] text-blue-400">
                          {card.tag}
                       </div>
                       {card.type === 'instagram' && <Instagram className="w-4 h-4 text-white opacity-40" />}
                       {card.type === 'youtube' && <Youtube className="w-4 h-4 text-white opacity-40" />}
                       {card.type === 'twitter' && <Twitter className="w-4 h-4 text-white opacity-40" />}
                    </div>
                    <p className="text-xl font-black text-white uppercase tracking-tighter">{card.user}</p>
                    
                    <div className="mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                          View Activity <Zap className="w-3 h-3" />
                       </button>
                    </div>
                  </div>

                  {/* Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center gap-6 mt-12 relative z-30">
          <button 
            onClick={rotateLeft}
            className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={rotateRight}
            className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-xl"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default ArcCarousel;
