import { motion } from "framer-motion";
import { 
  Wand2, BarChart3, Handshake, Calendar, 
  FileText, Zap, Brain, Shield, Stars, Sparkles 
} from "lucide-react";

const features = [
  { icon: Wand2, title: "AI Content Studio", desc: "Scripts, captions, and reel ideas — generated in seconds.", size: "lg", color: "text-blue-400" },
  { icon: BarChart3, title: "Intelligence Hub", desc: "Unified analytics across all platforms.", size: "md", color: "text-indigo-400" },
  { icon: Handshake, title: "Deal CRM", desc: "Track pitches and payments with AI assistance.", size: "md", color: "text-blue-400" },
  { icon: Calendar, title: "Smart Planner", desc: "Drag-and-drop scheduling.", size: "sm", color: "text-slate-400" },
  { icon: Zap, title: "Growth Engine", desc: "Weekly strategic plans.", size: "sm", color: "text-blue-400" },
  { icon: Brain, title: "Neural Mod", desc: "Auto-reply in your brand voice.", size: "md", color: "text-indigo-400" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const Features = () => (
  <section className="py-24 md:py-32 relative overflow-hidden bg-slate-950">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),transparent)]" />
    
    <div className="container max-w-7xl relative z-10 px-6">
      <motion.div
        className="text-center mb-40"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10">
           <Sparkles className="w-4 h-4" /> The Intelligence Stack
        </div>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-10 text-white uppercase">
          Elite <br />
          <span className="text-blue-500 font-black italic">Architecture.</span>
        </h2>
        <p className="text-slate-400 font-medium text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
          The most powerful workspace ever forged for professional creators. Pure technical edge.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group relative rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl p-10 border border-white/5 flex flex-col transition-all duration-500 cursor-default hover:border-blue-500/50 hover:-translate-y-4 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.2)] overflow-hidden h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 h-full flex flex-col">
               <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center mb-10 shadow-2xl transition-transform group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                 <f.icon className={`w-8 h-8 ${f.color} group-hover:text-white transition-colors`} />
               </div>
               <h3 className="text-3xl font-black mb-4 text-white uppercase tracking-tight">{f.title}</h3>
               <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-[280px]">{f.desc}</p>
               
               <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60">
                     Operational <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="w-full h-full bg-blue-600"
                     />
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
