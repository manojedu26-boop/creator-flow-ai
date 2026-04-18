
import { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { Brain, BarChart3, ShieldCheck, LayoutDashboard, Sparkles, Zap } from "lucide-react";

interface PillarCardProps {
  i: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const PILLARS = [
  {
    title: "The Neural Core",
    description: "AI that thinks like you. Engineered to generate high-retention scripts and visual concepts in seconds. Trained on 10,000+ viral hooks.",
    icon: Brain,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Autonomous Analytics",
    description: "Stop guessing. Every view, click, and conversion across all platforms—unified into a single intelligence feed for elite decision making.",
    icon: BarChart3,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "Strategic CRM",
    description: "Brand deals on autopilot. Predictive pitching and automated contract management designed for the top 1% of the creator economy.",
    icon: ShieldCheck,
    color: "from-blue-600 to-cyan-500",
  },
  {
    title: "Operational Command",
    description: "The only dashboard you'll ever need. A minimalist, high-density interface for global creator operations and neural team management.",
    icon: LayoutDashboard,
    color: "from-slate-700 to-slate-900",
  },
];

const Card = ({ i, title, description, icon: Icon, color, progress, range, targetScale }: PillarCardProps) => {
  const container = useRef(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  const opacity = useTransform(progress, range, [1, 0.4]);
  const brightness = useTransform(progress, range, [1, 0.5]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 group">
      <motion.div
        style={{
          scale,
          opacity,
          filter: `brightness(${brightness})`,
          top: `calc(100px + ${i * 25}px)`,
        }}
        className="relative w-full max-w-[800px] aspect-[16/10] md:aspect-[1.8/1] rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/10 p-12 md:p-16 flex flex-col shadow-2xl overflow-hidden transition-all duration-700 hover:border-blue-500/30"
      >
        {/* Inner Glow & Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-12 right-12 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
           <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color} animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]`} />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${color} flex items-center justify-center mb-12 shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="w-10 h-10 text-white" />
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 opacity-60">Strategic Pillar 0{i + 1}</span>
              <div className="w-8 h-[1px] bg-white/10" />
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              {title}
            </h3>
            <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed tracking-tight">
              {description}
            </p>
          </div>

          <div className="mt-auto flex items-center gap-12 pt-12 border-t border-white/5">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60">
                Operational <Zap className="w-3 h-3" />
             </div>
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60">
                Encrypted <ShieldCheck className="w-3 h-3" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const StackedExperience = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={container} className="relative h-[180vh] bg-slate-950 py-12">
       <div className="sticky top-24 z-20 pointer-events-none container max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-0"
          >
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] mb-4">Strategic Workflow</h2>
            <div className="flex items-baseline gap-4">
               <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">The Experience</span>
               <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
       </div>

      <div className="container max-w-7xl px-6">
        {PILLARS.map((pillar, i) => {
          const targetScale = 1 - (PILLARS.length - i) * 0.05;
          return (
            <Card
              key={pillar.title}
              i={i}
              {...pillar}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};

export default StackedExperience;
