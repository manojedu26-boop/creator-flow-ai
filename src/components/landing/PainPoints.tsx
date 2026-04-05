import { motion } from "framer-motion";
import { TrendingDown, Clock, DollarSign, BarChart3, Users, FileText, Megaphone, HelpCircle, XCircle, AlertCircle, Stars, Zap } from "lucide-react";

const painPoints = [
  { icon: TrendingDown, title: "Inconsistent Growth", desc: "Follower count stuck? No idea what's working?" },
  { icon: Clock, title: "Planning Fatigue", desc: "Spending hours on content ideas and captions?" },
  { icon: DollarSign, title: "Revenue Leakage", desc: "Undercharging brands because you don't know your worth?" },
  { icon: BarChart3, title: "Data Overwhelm", desc: "Too many platforms, too many numbers to track?" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
};

const PainPoints = () => (
  <section className="py-32 md:py-64 px-6 bg-slate-950 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    
    <div className="container max-w-7xl relative z-10">
      <motion.div
        className="text-center mb-40"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 shadow-2xl">
           <AlertCircle className="w-4 h-4" /> Systemic Bottlenecks
        </div>
        <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10 text-white uppercase">
          The Creator <br />
          <span className="text-blue-500 font-black italic">Ceiling.</span>
        </h2>
        <p className="text-slate-400 font-medium text-xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
          Most creators fail because they manually manage chaos. Intelligence is the only way through the noise.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {painPoints.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            className="group relative rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl p-10 border border-white/5 transition-all hover:border-blue-500/30 cursor-default overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
               <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)]">
                 <p.icon className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-2xl font-black mb-4 text-white uppercase tracking-tight leading-none">{p.title}</h3>
               <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">{p.desc}</p>
               
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 transition-colors group-hover:text-blue-400">
                  <XCircle className="w-3.5 h-3.5" /> High Criticality
               </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>

    {/* Ambient Glow */}
    <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-64 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
  </section>
);

export default PainPoints;
