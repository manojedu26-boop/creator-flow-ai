import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MoveHorizontal } from "lucide-react";

interface CardItem {
  id: number;
  niche: string;
  creator: string;
  stat: string;
  before: string;
  after: string;
}

const CARDS: CardItem[] = [
  { id: 1, niche: "Fitness", creator: "@naveenfitlife", stat: "3.2x reach in 60 days", before: "12K reach", after: "48.2K reach" },
  { id: 2, niche: "Gaming", creator: "@shadow_playz", stat: "+140K subscribers", before: "15K subs", after: "155K subs" },
  { id: 3, niche: "Finance", creator: "@market_pulse", stat: "5.8% avg engagement", before: "1.2% rate", after: "5.8% rate" },
  { id: 4, niche: "Beauty", creator: "@glow_by_maya", stat: "₹2.4L deal volume", before: "₹30K / mo", after: "₹2.4L / mo" },
  { id: 5, niche: "Tech", creator: "@gadget_nexus", stat: "4.1M reel views", before: "40K views", after: "4.1M views" },
  { id: 6, niche: "Lifestyle", creator: "@mumbai_vlog", stat: "12x audience growth", before: "3.4K follow", after: "42K follow" },
  { id: 7, niche: "Design", creator: "@pixel_craft", stat: "88% hook retention", before: "24% retention", after: "88% retention" },
  { id: 8, niche: "Food", creator: "@chef_urban", stat: "+95K viral saves", before: "800 saves", after: "95K saves" },
];

export const GrowthGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 px-6 bg-[#07080c] text-white border-t border-white/5 overflow-hidden">
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-orange-400 mb-3 block">
            [03 // VERIFIED CASE STUDIES]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            PROOF, NOT <span className="underline decoration-orange-400/80 decoration-2 underline-offset-8">PROMISES.</span>
          </h2>
        </div>

        {/* Animated Drag Hint */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-400 animate-pulse">
          <MoveHorizontal className="w-4 h-4" /> DRAG HORIZONTALLY TO EXPLORE
        </div>
      </div>

      {/* Draggable Motion Container */}
      <motion.div ref={containerRef} className="cursor-grab active:cursor-grabbing overflow-hidden px-4">
        <motion.div
          drag="x"
          dragConstraints={{ right: 0, left: -1400 }}
          className="flex gap-6 w-max py-6"
        >
          {CARDS.map((card) => (
            <motion.div
              key={card.id}
              whileHover={{ y: -8, rotateZ: 1 }}
              className="w-80 sm:w-96 p-8 rounded-3xl border border-white/10 bg-white/[0.03] space-y-6 shrink-0 relative overflow-hidden select-none hover:border-orange-400/60 transition-all duration-300 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  {card.niche}
                </span>
                <span className="text-xs font-mono text-slate-400">{card.creator}</span>
              </div>

              <div className="space-y-1">
                <p className="text-2xl sm:text-3xl font-black text-white">{card.stat}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-white/5">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Before</p>
                  <p className="font-bold text-slate-300 mt-1">{card.before}</p>
                </div>
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-[9px] uppercase tracking-wider text-orange-400">After Dragon</p>
                  <p className="font-bold text-orange-300 mt-1">{card.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GrowthGallery;
