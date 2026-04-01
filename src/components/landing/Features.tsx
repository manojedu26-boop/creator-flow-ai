import { motion } from "framer-motion";
import { 
  Wand2, BarChart3, Handshake, Calendar, 
  FileText, Zap, Brain, Shield, Stars, Sparkles 
} from "lucide-react";

const features = [
  { icon: Wand2, title: "AI Content Studio", desc: "Scripts, captions, hashtags, and reel ideas — generated in seconds for any platform.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: BarChart3, title: "Analytics Control", desc: "Unified insights across Instagram, YouTube & TikTok with AI-powered summaries.", color: "text-slate-900", bg: "bg-slate-100" },
  { icon: Handshake, title: "Brand Deal CRM", desc: "Track deals from pitch to payment. AI writes your proposals and calculates your rates.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Calendar, title: "Smart Calendar", desc: "Drag-and-drop scheduling with AI-optimised posting times for maximum reach.", color: "text-slate-900", bg: "bg-slate-100" },
  { icon: FileText, title: "Media Kit Builder", desc: "One-click professional media kits with live stats. PDF and shareable link.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Zap, title: "Growth Strategy", desc: "Personalised weekly growth plans, collab suggestions, and niche gap analysis.", color: "text-slate-900", bg: "bg-slate-100" },
  { icon: Brain, title: "AI Mod Node", desc: "Auto-draft comment replies in your voice. Filter spam. Save hours daily.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Shield, title: "Contract Shield", desc: "AI scans brand contracts for red flags and suggests counter-terms.", color: "text-slate-900", bg: "bg-slate-100" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

const Features = () => (
  <section className="py-32 md:py-48 relative overflow-hidden bg-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.03),transparent)]" />
    <div className="container max-w-7xl relative z-10 px-6 sm:px-8 lg:px-12">
      <motion.div
        className="text-center mb-32"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8">
           <Stars className="w-3.5 h-3.5" /> Core Intelligence
        </div>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-950 uppercase italic">
          Everything You Need <br />
          To <span className="text-blue-600">Dominate</span>
        </h2>
        <p className="text-slate-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
          The most powerful ecosystem ever built for creators. One platform, infinite reach.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -10 }}
            className="group relative rounded-[3rem] bg-white p-10 flex flex-col transition-all cursor-default border border-slate-100 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className={`w-16 h-16 rounded-[1.5rem] ${f.bg} flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110 group-hover:bg-slate-950 group-hover:text-white`}>
               <f.icon className={`w-7 h-7 ${f.color} group-hover:text-white transition-colors`} />
            </div>
            <h3 className="text-xl font-black mb-3 text-slate-950 uppercase italic tracking-tight">{f.title}</h3>
            <p className="text-sm text-slate-500 font-bold leading-relaxed">{f.desc}</p>
            
            <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-blue-600 transition-colors">
               Explore Module <Zap className="w-3 h-3" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
