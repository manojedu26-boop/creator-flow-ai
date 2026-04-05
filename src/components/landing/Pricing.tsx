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
    <section className="py-32 md:py-64 px-6 bg-slate-950 relative overflow-hidden" id="pricing">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container max-w-7xl relative z-10">
        <motion.div
           className="text-center mb-40"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 shadow-2xl">
             <Stars className="w-4 h-4" /> Investment Tiers
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.8] mb-10 text-white uppercase">
            Forge Your <br />
            <span className="text-blue-500 font-black italic">Legacy</span>
          </h2>
          <p className="text-slate-400 font-medium text-xl md:text-3xl max-w-2xl mx-auto leading-relaxed">
            Elite-tier intelligence for every phase of your creator evolution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-[3.5rem] p-12 transition-all flex flex-col group overflow-hidden ${
                plan.highlighted
                  ? "bg-slate-900/60 border-2 border-blue-600 shadow-[0_30px_100px_rgba(37,99,235,0.15)] scale-105 z-10"
                  : "bg-slate-900/30 border border-white/5 hover:border-white/10"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {plan.highlighted && (
                <div className="absolute -top-1 left-0 w-full flex justify-center">
                   <div className="bg-blue-600 px-8 py-2 rounded-b-3xl text-[10px] font-black uppercase tracking-[0.3em] text-white shadow-xl">
                      Elite Recommended
                   </div>
                </div>
              )}
              
              <div className={`w-18 h-18 rounded-[1.8rem] flex items-center justify-center mb-10 shadow-2xl transition-transform group-hover:scale-110 ${plan.highlighted ? "bg-blue-600 text-white shadow-blue-500/20" : "bg-white/5 text-blue-400 border border-white/10"}`}>
                 <plan.icon className="w-8 h-8" />
              </div>

              <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tight">{plan.name}</h3>
              <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed">{plan.desc}</p>
              
              <div className="flex items-baseline gap-3 mb-10 overflow-hidden">
                <span className="text-6xl font-black text-white tracking-tighter">{plan.price}</span>
                {plan.period && <span className="text-slate-500 font-black uppercase text-sm tracking-widest leading-none shrink-0">{plan.period}</span>}
              </div>

              <div className="h-px bg-white/5 mb-10 w-full" />

              <ul className="space-y-6 mb-16 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-4 text-base font-medium text-slate-400">
                    <div className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${plan.highlighted ? "bg-blue-600" : "bg-white/10"}`}>
                       <Check className="w-3.5 h-3.5 text-white stroke-[4]" />
                    </div>
                    <span className="group-hover:text-slate-300 transition-colors">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/register")}
                className={`group w-full h-20 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all active:scale-[0.97] flex items-center justify-center gap-4 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white shadow-[0_15px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500"
                    : "bg-white text-slate-950 hover:bg-blue-600 hover:text-white"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Pricing;
