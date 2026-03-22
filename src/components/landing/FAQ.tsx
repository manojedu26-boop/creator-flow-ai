import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Is CREATORX AI free to start?", a: "Yes! Our Starter plan is completely free — no credit card needed. You get 1 platform connection, 10 AI generations per month, basic analytics, and 1 media kit." },
  { q: "Which platforms do you support?", a: "We support Instagram, YouTube, and TikTok. Connect your accounts via OAuth and we pull in your data automatically." },
  { q: "How does the AI content generation work?", a: "Our AI is trained on high-performing creator content. Tell it your topic, platform, and tone — and it generates scripts, captions, hashtags, and reel ideas tailored to your niche and audience." },
  { q: "Can I cancel anytime?", a: "Absolutely. No contracts, no lock-in. Cancel your subscription anytime from your account settings." },
  { q: "Is my data safe?", a: "We take privacy seriously. All data is encrypted, we're GDPR compliant, and we never share your data with third parties. You can export or delete your data at any time." },
  { q: "Do you actually post to my accounts?", a: "Where platform APIs allow direct publishing (currently Instagram and YouTube), yes. For TikTok, we prepare your content and remind you to post at the optimal time." },
];

const FAQ = () => (
  <section className="py-24 md:py-32 px-4">
    <div className="container max-w-3xl">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Got questions?
        </h2>
        <p className="text-muted-foreground text-lg">We've got answers.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-lg bg-glass border-none px-5">
              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
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
