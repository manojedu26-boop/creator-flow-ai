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

const FAQ = () => (
  <section className="py-32 md:py-48 px-6 bg-white relative overflow-hidden" id="faq">
    <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/20 blur-[100px] rounded-full -z-10" />
    
    <div className="container max-w-4xl relative z-10">
      <motion.div
        className="text-center mb-24"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 shadow-sm">
           <HelpCircle className="w-3.5 h-3.5" /> Operations Support
        </div>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-slate-950 uppercase">
          Intelligence <br />
          <span className="text-blue-600 font-black">Support.</span>
        </h2>
        <p className="text-slate-500 font-bold text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Critical answers for your high-performance creator ecosystem.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-50/50 rounded-[3rem] p-8 md:p-12 border border-slate-100"
      >
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem 
              key={i} 
              value={`faq-${i}`} 
              className="rounded-[2rem] bg-white border border-slate-100 px-8 py-2 transition-all hover:border-blue-600 group"
            >
              <AccordionTrigger className="text-left font-black uppercase text-slate-950 tracking-tight hover:no-underline py-6">
                <span className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {i + 1}
                   </div>
                   {faq.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-slate-500 font-bold text-[15px] leading-relaxed pb-8 pt-2 max-w-2xl border-t border-slate-50 mt-2">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQ;
