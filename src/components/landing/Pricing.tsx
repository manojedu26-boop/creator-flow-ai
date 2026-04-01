import { motion } from "framer-motion";
import { Check, ArrowRight, Zap, Stars, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Deploy your first intelligence node.",
    features: ["1 platform sync", "50 AI captions/month", "Real-time analytics", "Standard media kit"],
    cta: "Initialize Free",
    highlighted: false,
    icon: Sparkles,
  },
  {
    name: "Growth",
    price: "₹ 2,499",
    period: "/mo",
    desc: "Scale your empire with predictive AI.",
    features: ["3 platforms sync", "Unlimited AI studio", "Advanced growth suite", "Brand CRM (10 deals)", "Contract Shield v1", "Production calendar"],
    cta: "Start Scaling",
    highlighted: true,
    icon: Zap,
  },
  {
    name: "Elite",
    price: "₹ 5,999",
    period: "/mo",
    desc: "The ultimate command centre for icons.",
    features: ["All platforms sync", "Infinite AI generation", "Priority support node", "Automated pitch decks", "Team federation (3 seats)", "Full agency access"],
    cta: "Go Elite",
    highlighted: false,
    icon: Shield,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 md:py-48 px-6 bg-white relative overflow-hidden" id="pricing">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/30 blur-[120px] rounded-full -z-10" />
      
      <div className="container max-w-7xl">
        <motion.div
           className="text-center mb-32"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-950 border border-slate-900 text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8 shadow-xl shadow-slate-200">
             <Stars className="w-3.5 h-3.5 text-blue-500" /> Investment Tiers
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-950 uppercase">
            Simple, Powerful <br />
            <span className="text-blue-600 font-black">Investment</span>
          </h2>
          <p className="text-slate-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
            High-fidelity intelligence for every stage of your creator journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-[3rem] p-10 md:p-12 transition-all flex flex-col group ${
                plan.highlighted
                  ? "bg-white border-2 border-blue-600 shadow-2xl shadow-blue-500/10 scale-105 z-10"
                  : "bg-slate-50/50 border border-slate-100 hover:border-slate-300"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {plan.highlighted && (
                <div className="absolute -top-5 left-1/2 -track-x-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/30">
                  Most Deployed
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110 ${plan.highlighted ? "bg-blue-600 text-white" : "bg-white text-slate-950 border border-slate-100"}`}>
                 <plan.icon className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-black mb-2 text-slate-950 uppercase tracking-tight">{plan.name}</h3>
              <p className="text-sm text-slate-500 font-bold mb-8">{plan.desc}</p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-slate-950 tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-slate-400 font-black uppercase text-xs tracking-widest leading-none">{plan.period}</span>}
              </div>

              <div className="h-px bg-slate-100 mb-10 w-full" />

              <ul className="space-y-5 mb-12 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? "bg-blue-600" : "bg-slate-950"}`}>
                       <Check className="w-3 h-3 text-white stroke-[4]" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/register")}
                className={`group w-full h-16 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.97] flex items-center justify-center gap-4 ${
                  plan.highlighted
                    ? "bg-slate-950 text-white shadow-2xl shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-500/20"
                    : "bg-white border border-slate-200 text-slate-950 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Pricing;
