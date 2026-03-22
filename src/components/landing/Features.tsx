import { motion } from "framer-motion";
import { Wand2, BarChart3, Handshake, Calendar, FileText, Zap, Brain, Shield } from "lucide-react";

const features = [
  { icon: Wand2, title: "AI Content Studio", desc: "Scripts, captions, hashtags, and reel ideas — generated in seconds for any platform.", color: "text-primary" },
  { icon: BarChart3, title: "Analytics Command Centre", desc: "Unified insights across Instagram, YouTube & TikTok with AI-powered summaries.", color: "text-secondary" },
  { icon: Handshake, title: "Brand Deal CRM", desc: "Track deals from pitch to payment. AI writes your proposals and calculates your rates.", color: "text-gold" },
  { icon: Calendar, title: "Smart Content Calendar", desc: "Drag-and-drop scheduling with AI-optimised posting times for maximum reach.", color: "text-accent" },
  { icon: FileText, title: "Media Kit Builder", desc: "One-click professional media kits with live stats. PDF and shareable link.", color: "text-primary" },
  { icon: Zap, title: "Growth Strategy Engine", desc: "Personalised weekly growth plans, collab suggestions, and niche gap analysis.", color: "text-secondary" },
  { icon: Brain, title: "AI Community Manager", desc: "Auto-draft comment replies in your voice. Filter spam. Save hours daily.", color: "text-gold" },
  { icon: Shield, title: "Contract Shield", desc: "AI scans brand contracts for red flags and suggests counter-terms.", color: "text-accent" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } },
};

const Features = () => (
  <section className="py-24 md:py-32 px-4 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
    <div className="container max-w-5xl relative z-10">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ textWrap: "balance" }}>
          Everything you need to
          <span className="text-gradient-primary"> dominate</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          One platform. Every tool. Powered by AI that actually understands creators.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            className="group rounded-xl bg-glass p-5 transition-all hover:border-primary/20 cursor-default"
          >
            <f.icon className={`w-8 h-8 ${f.color} mb-3 transition-transform group-hover:scale-110`} />
            <h3 className="font-semibold mb-1.5">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default Features;
