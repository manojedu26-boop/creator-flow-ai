import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Perfect for creators just starting out.",
    features: ["1 platform connected", "10 AI captions/month", "Basic analytics", "1 media kit"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$29",
    period: "/mo",
    desc: "For creators ready to scale their game.",
    features: ["2 platforms", "Unlimited AI content", "Full analytics suite", "Deal CRM (5 deals)", "Collab finder", "Content calendar"],
    cta: "Start 14-Day Trial",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/mo",
    desc: "For serious creators who mean business.",
    features: ["All platforms", "Everything unlimited", "Contract Shield", "AI pitch decks", "Team access (2 seats)", "Priority support"],
    cta: "Start 14-Day Trial",
    highlighted: false,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 md:py-32 px-4" id="pricing">
    <div className="container max-w-5xl">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Simple, creator-friendly pricing
        </h2>
        <p className="text-muted-foreground text-lg">
          Start free. Upgrade when you're ready. Annual billing saves 2 months.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            className={`relative rounded-xl p-6 md:p-8 transition-all ${
              plan.highlighted
                ? "bg-card border-2 border-primary/40 glow-pink"
                : "bg-glass"
            }`}
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-xs font-semibold text-primary-foreground">
                Most Popular
              </div>
            )}
            <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
            </div>
            <ul className="space-y-2.5 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/register")}
              className={`group w-full inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all active:scale-[0.97] ${
                plan.highlighted
                  ? "bg-primary text-primary-foreground hover:shadow-[0_0_30px_-5px_hsl(318,100%,62%,0.4)]"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {plan.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Pricing;
