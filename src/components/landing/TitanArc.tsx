
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stars, Zap, ShieldCheck } from "lucide-react";
import { TITAN_DATA } from "@/constants/titans";

export const TitanArc = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rotate = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TITAN_DATA.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(rotate, 4000);
    return () => clearInterval(interval);
  }, [rotate, isPaused]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-visible"
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {TITAN_DATA.map((titan, i) => {
          // Calculate relative position with wrapping
          let diff = i - activeIndex;
          if (diff > Math.floor(TITAN_DATA.length / 2)) diff -= TITAN_DATA.length;
          if (diff < -Math.floor(TITAN_DATA.length / 2)) diff += TITAN_DATA.length;

          const isActive = diff === 0;
          const absDiff = Math.abs(diff);
          
          // Parabolic Arc Physics
          // Focused cards are closer and brighter
          const x = diff * 280; // Horizontal spread
          const y = absDiff * 50;  // Curved arc downwards
          const zZ = 100 - absDiff * 50; // Depth
          const rotateZ = diff * 12; // Fanned rotation
          const scale = isActive ? 1.1 : (1 - absDiff * 0.15);
          const opacity = isActive ? 1 : (1 - absDiff * 0.4);
          const brightness = isActive ? 1.2 : (1 - absDiff * 0.3);
          const blur = isActive ? 0 : (absDiff * 2);

          // Only render cards within a certain distance for performance/visual clarity
          if (absDiff > 3) return null;

          return (
            <motion.div
              key={titan.name}
              initial={false}
              animate={{
                x,
                y,
                z: zZ,
                rotateZ,
                scale,
                opacity,
                filter: `brightness(${brightness}) blur(${blur}px)`,
                zIndex: 50 - absDiff,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              className="absolute w-[320px] md:w-[400px] aspect-[4/5] rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-10 flex flex-col shadow-2xl overflow-hidden group cursor-pointer"
              onMouseEnter={() => {
                setActiveIndex(i);
                setIsPaused(true);
              }}
            >
              {/* Premium Glossy Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 pointer-events-none" />
              
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Stars key={s} className="w-3 h-3 text-blue-500 fill-blue-500" />
                  ))}
                </div>

                <p className="text-lg md:text-2xl font-black text-white italic leading-[1.2] mb-10 uppercase tracking-tighter transition-all group-hover:text-blue-400">
                  "{titan.quote}"
                </p>

                <div className="mt-auto flex items-center gap-5 pt-8 border-t border-white/5">
                  <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950 shrink-0">
                    <img src={titan.photo} alt={titan.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-white uppercase tracking-tighter leading-none">{titan.name}</p>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] mt-2 opacity-80">
                      {titan.followers} Scale
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-60 transition-opacity">
                   <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
