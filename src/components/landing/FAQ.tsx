import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Sparkles, Plus, Minus, Stars } from "lucide-react";

const faqs = [
  { q: "Is CreatorForge AI free to deploy?", a: "Yes. Our Starter node is permanently free — no credit card required. You gain 1 platform sync, 50 AI generations per month, real-time analytics, and a standard media kit." },
  { q: "Which intelligence nodes are supported?", a: "We currently integrate with Instagram, YouTube, and TikTok. Synchronize your accounts via high-security OAuth for automated data ingestion." },
  { q: "How does the Predictive AI Studio operate?", a: "Our models are trained on elite-tier creator data. Input your parameters, and our engine generates high-converting scripts, captions, and strategies tailored specifically to your audience's unique velocity." },
  { q: "Can I terminate my session anytime?", a: "Absolutely. No long-term contracts or lock-in protocols. You can terminate your premium subscription instantly from your secure account settings." },
  { q: "What is your data security protocol?", a: "We operate on military-grade encryption standards and are fully GDPR compliant. Your intelligence is your own — we never share data with third-party nodes. You retain full control over export and deletion." },
  { q: "Do you publish directly to platform hubs?", a: "Where platform APIs permit high-fidelity direct publishing (Instagram and YouTube), yes. For TikTok, we prepare your content and provide precise timing notifications for manual execution." },
];

const FAQ = () => {
  return (
    <section className="py-32 md:py-64 px-6 bg-slate-950 relative overflow-hidden" id="faq">
      {/* Background Detail */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container max-w-4xl relative z-10">
        <motion.div
          className="text-center mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 shadow-2xl">
             <HelpCircle className="w-4 h-4" /> Operations Support
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-10 text-white uppercase">
            Intelligence <br />
            <span className="text-blue-500 font-black italic">Support.</span>
          </h2>
          <p className="text-slate-400 font-medium text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Critical answers for your high-performance creator ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-900/30 rounded-[3.5rem] p-8 md:p-14 border border-white/5 backdrop-blur-3xl shadow-2xl"
        >
          <Accordion type="single" collapsible className="space-y-6">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i} 
                value={`faq-${i}`} 
                className="rounded-[2.5rem] bg-white/5 border border-white/5 px-10 py-3 transition-all hover:border-blue-500/30 group overflow-hidden"
              >
                <AccordionTrigger className="text-left font-black uppercase text-white text-lg tracking-tight hover:no-underline py-8 md:py-10">
                  <span className="flex items-center gap-6">
                     <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400 font-extrabold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                        {i + 1}
                     </div>
                     <span className="group-hover:text-blue-400 transition-colors">{faq.q}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 font-medium text-lg leading-relaxed pb-12 pt-4 max-w-2xl border-t border-white/5 mt-4 group-hover:text-slate-300 transition-colors">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
