import { motion } from "framer-motion";
import { TrendingDown, Clock, DollarSign, BarChart3, Users, FileText, Megaphone, HelpCircle } from "lucide-react";

const painPoints = [
  { icon: TrendingDown, title: "Inconsistent Growth", desc: "Follower count stuck? No idea what's working?" },
  { icon: Clock, title: "No Time to Plan", desc: "Spending hours on content ideas and captions?" },
  { icon: DollarSign, title: "Undercharging Brands", desc: "Don't know your worth for brand deals?" },
  { icon: BarChart3, title: "Analytics Overwhelm", desc: "Can't make sense of all those numbers?" },
  { icon: Users, title: "Finding Collabs", desc: "Struggling to find the right collab partners?" },
  { icon: FileText, title: "No Media Kit", desc: "Brands ask for one and you don't have it?" },
  { icon: Megaphone, title: "Pitch Anxiety", desc: "Don't know how to approach brands?" },
  { icon: HelpCircle, title: "What to Post?", desc: "Blank screen syndrome every single day?" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const PainPoints = () => (
  <section className="py-24 md:py-32 px-4">
    <div className="container max-w-5xl">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ textWrap: "balance" }}>
          Sound familiar?
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Every creator hits these walls. CREATORX AI breaks through them — with intelligence.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {painPoints.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            className="group rounded-xl bg-glass p-5 transition-all hover:border-primary/30 hover:glow-pink cursor-default"
          >
            <p.icon className="w-8 h-8 text-primary mb-3 transition-transform group-hover:scale-110" />
            <h3 className="font-semibold mb-1">{p.title}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default PainPoints;
