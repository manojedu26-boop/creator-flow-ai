import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Wand2, BarChart3, Handshake } from "lucide-react";
import { toast } from "sonner";

const handleAction = () => {
  toast("Mobile App Coming Soon!", {
    description: "We're currently optimizing the mobile experience.",
  });
};

const MobileLanding = () => {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20 overflow-x-hidden">
      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border/30 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>CREATORX</span>
          <span className="text-primary text-sm font-semibold">AI</span>
        </div>
        <button onClick={handleAction} className="text-sm font-semibold text-primary">
          Log In
        </button>
      </nav>

      {/* Mobile Hero */}
      <section className="pt-24 px-4 relative flex flex-col items-center text-center">
        <div className="absolute top-10 w-full h-64 rounded-full bg-primary/10 blur-[80px] -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-medium mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          The App for Creators & Brands
        </motion.div>

        <motion.h1 
          className="text-4xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Grow Your Empire
          <br className="my-1"/>
          <span className="text-gradient-primary">On The Go</span>
        </motion.h1>

        <motion.p 
          className="text-sm text-muted-foreground mb-8 text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Manage your brands, insights, and AI content creation directly from your pocket.
        </motion.p>

        <motion.button 
          onClick={handleAction}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground shadow-[0_0_30px_-5px_hsl(318,100%,62%,0.4)] active:scale-[0.98] transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Download App <ArrowRight className="w-4 h-4"/>
        </motion.button>
      </section>

      {/* Mobile Features Grid */}
      <section className="pt-16 px-4">
        <motion.h3 
          className="font-bold text-xl mb-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Pocket Command Center
        </motion.h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: Wand2, title: "AI Content Studio", desc: "Generate captions and scripts instantly.", color: "text-primary" },
            { icon: BarChart3, title: "Live Analytics", desc: "Track conversions and metrics anywhere.", color: "text-secondary" },
            { icon: Handshake, title: "Brand Deals CRM", desc: "Reply to pitches before they expire.", color: "text-gold" }
          ].map((feature, i) => (
            <motion.div 
              key={feature.title}
              className="bg-muted/30 border border-border/40 rounded-2xl p-5 flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`p-3 rounded-xl bg-background shadow-sm ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-base mb-1">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Mobile Mockup representation */}
      <section className="mt-16 px-4 flex justify-center pb-12">
        <motion.div 
          className="w-full max-w-[320px] aspect-[9/19] rounded-[2rem] border-[6px] border-muted/50 bg-card p-4 shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-muted/50 rounded-b-xl" />
          <div className="mt-8 space-y-4">
            <div className="h-24 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex flex-col justify-end p-3">
              <div className="h-2 w-1/2 bg-primary/40 rounded-full mb-2" />
              <div className="h-2 w-3/4 bg-primary/20 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-20 rounded-xl bg-muted/50" />
              <div className="h-20 rounded-xl bg-muted/50" />
            </div>
            <div className="h-32 rounded-xl bg-muted/30" />
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default MobileLanding;
