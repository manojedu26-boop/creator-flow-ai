import { motion } from "framer-motion";
import { Wand2, BarChart3, Handshake, Calendar, FileText, Zap, Brain, Shield } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

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

const Features = () => {
  const stackOneFeatures = features.slice(0, 3).map((f, i) => ({
    icon: <f.icon className={`w-8 h-8 ${f.color}`} />,
    title: f.title,
    description: f.desc,
    date: "Available Now",
    iconClassName: f.color,
    titleClassName: f.color,
    className: i === 0 
      ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
      : i === 1
      ? "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
      : "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10"
  }));

  const stackTwoFeatures = features.slice(3, 6).map((f, i) => ({
    icon: <f.icon className={`w-8 h-8 ${f.color}`} />,
    title: f.title,
    description: f.desc,
    date: "Available Now",
    iconClassName: f.color,
    titleClassName: f.color,
    className: i === 0 
      ? "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
      : i === 1
      ? "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0"
      : "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10"
  }));

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container max-w-6xl relative z-10">
        <motion.div
          className="text-center mb-24"
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

        <div className="flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-32 pb-20">
          <DisplayCards cards={stackOneFeatures} />
          <DisplayCards cards={stackTwoFeatures} />
        </div>
        
        {/* Render remaining 2 features directly below if needed, or omit for cleaner UI */}
        <div className="flex flex-col md:flex-row justify-center gap-8 opacity-80 mt-10">
           {features.slice(6).map(f => (
             <div key={f.title} className="flex items-center gap-3 bg-muted/20 px-6 py-4 rounded-xl border border-border/40">
               <f.icon className={`w-6 h-6 ${f.color}`} />
               <div>
                  <h4 className="font-semibold">{f.title}</h4>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
