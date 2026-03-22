import { motion } from "framer-motion";
import { Instagram, Youtube } from "lucide-react";

const testimonials = [
  {
    name: "Mia Chen",
    handle: "@miacreates",
    niche: "Lifestyle & Wellness",
    platform: "instagram" as const,
    avatar: "MC",
    quote: "CREATORX AI wrote me a brand pitch in 30 seconds that landed a $2,000 deal. I used to spend hours on those.",
  },
  {
    name: "Jake Torres",
    handle: "@jaketechtalks",
    niche: "Tech Reviews",
    platform: "youtube" as const,
    avatar: "JT",
    quote: "The analytics hub showed me my Tuesday uploads get 3x more views. Simple insight, massive results.",
  },
  {
    name: "Priya Sharma",
    handle: "@priyafitlife",
    niche: "Fitness & Health",
    platform: "instagram" as const,
    avatar: "PS",
    quote: "My media kit looks like a Fortune 500 deck. Brands take me seriously now. Worth every penny.",
  },
  {
    name: "Leo Park",
    handle: "@leoparkvibes",
    niche: "Travel & Food",
    platform: "youtube" as const,
    avatar: "LP",
    quote: "The AI content calendar fills my entire month in minutes. I just tweak and post. Game changer.",
  },
];

const PlatformIcon = ({ platform }: { platform: "instagram" | "youtube" }) =>
  platform === "instagram" ? (
    <Instagram className="w-3.5 h-3.5 text-primary" />
  ) : (
    <Youtube className="w-3.5 h-3.5 text-destructive" />
  );

const Testimonials = () => (
  <section className="py-24 md:py-32 px-4">
    <div className="container max-w-5xl">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Creators are winning with CREATORX
        </h2>
        <p className="text-muted-foreground text-lg">Real results from real creators on the platform.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="rounded-xl bg-glass p-6 flex flex-col"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-foreground leading-relaxed mb-5 flex-1">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-semibold text-sm text-primary">
                {t.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{t.name}</span>
                  <PlatformIcon platform={t.platform} />
                </div>
                <p className="text-xs text-muted-foreground">{t.niche} · {t.handle}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
