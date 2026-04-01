import { motion } from "framer-motion";
import { TrendingDown, Clock, DollarSign, BarChart3, Users, FileText, Megaphone, HelpCircle, XCircle, AlertCircle, Stars } from "lucide-react";

const painPoints = [
  { icon: TrendingDown, title: "Inconsistent Growth", desc: "Follower count stuck? No idea what's working?" },
  { icon: Clock, title: "Planning Fatigue", desc: "Spending hours on content ideas and captions?" },
  { icon: DollarSign, title: "Revenue Leakage", desc: "Undercharging brands because you don't know your worth?" },
  { icon: BarChart3, title: "Data Overwhelm", desc: "Too many platforms, too many numbers to track?" },
  { icon: Users, title: "Collab Friction", desc: "Struggling to find the right partners for growth?" },
  { icon: FileText, title: "Static Media Kits", desc: "Still sending outdated PDFs to high-tier brands?" },
  { icon: Megaphone, title: "Pitch Anxiety", desc: "Template emails getting ignored by top agencies?" },
  { icon: HelpCircle, title: "Posting Blinds", desc: "No predictive strategy for your next 30 days?" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
};

const PainPoints = () => (
  <section className="py-32 md:py-48 px-6 bg-slate-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-slate-950 to-blue-600 opacity-10" />
    <div className="container max-w-7xl relative z-10">
      <motion.div
        className="text-center mb-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 shadow-sm">
           <AlertCircle className="w-3.5 h-3.5" /> Market Challenges
        </div>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-950 uppercase">
          Every Creator Hits <br />
          These <span className="text-blue-600 font-black">Walls.</span>
        </h2>
        <p className="text-slate-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Stop struggling with the manual grind. CreatorForge AI provides the technical edge to break through.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {painPoints.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            className="group rounded-[2.5rem] bg-white p-8 border border-slate-100 transition-all hover:bg-slate-950 hover:border-slate-950 cursor-default"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
              <p.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-950 uppercase tracking-tight group-hover:text-white">{p.title}</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed group-hover:text-slate-400">{p.desc}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 group-hover:border-white/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600">
               Critical Pain Point <XCircle className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default PainPoints;
