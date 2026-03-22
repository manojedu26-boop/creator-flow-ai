import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Check, Instagram, Youtube } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const niches = ["Fitness", "Lifestyle", "Beauty", "Tech", "Food", "Travel", "Finance", "Gaming", "Fashion", "Other"];
const goals = ["Grow followers", "Land brand deals", "Make more money", "Post consistently", "Understand my analytics"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creatorName, setCreatorName] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));

  const toggleGoal = (g: string) =>
    setSelectedGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const next = () => {
    if (step === 1 && !creatorName) { toast.error("Enter your creator name"); return; }
    if (step === 2 && platforms.length === 0) { toast.error("Select at least one platform"); return; }
    if (step === 3 && !niche) { toast.error("Pick your niche"); return; }
    if (step === 4 && selectedGoals.length === 0) { toast.error("Select at least one goal"); return; }
    if (step < 5) setStep(step + 1);
    else {
      toast.success("You're all set! 🚀");
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome! What's your creator name?</h2>
                <p className="text-muted-foreground mb-6">This is how you'll be known on the platform.</p>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. @CreativeKate"
                  className="w-full rounded-lg bg-muted/50 border border-border/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Connect your platforms</h2>
                <p className="text-muted-foreground mb-6">Which platforms do you create on?</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { name: "Instagram", icon: <Instagram className="w-5 h-5" /> },
                    { name: "YouTube", icon: <Youtube className="w-5 h-5" /> },
                    { name: "TikTok", icon: <Sparkles className="w-5 h-5" /> },
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => togglePlatform(p.name)}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-all active:scale-[0.97] ${
                        platforms.includes(p.name)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {p.icon}
                      <span className="font-medium">{p.name}</span>
                      {platforms.includes(p.name) && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What's your niche?</h2>
                <p className="text-muted-foreground mb-6">This helps us personalise your AI recommendations.</p>
                <div className="grid grid-cols-2 gap-2">
                  {niches.map((n) => (
                    <button
                      key={n}
                      onClick={() => setNiche(n)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                        niche === n
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
                <p className="text-muted-foreground mb-6">Select all that apply.</p>
                <div className="space-y-2">
                  {goals.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGoal(g)}
                      className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                        selectedGoals.includes(g)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {g}
                      {selectedGoals.includes(g) && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Your AI plan is ready! 🚀</h2>
                <p className="text-muted-foreground mb-6">
                  Hey {creatorName || "Creator"}! We've built a personalised growth strategy for your{" "}
                  {niche || "content"} niche across {platforms.join(", ") || "your platforms"}.
                </p>
                <div className="rounded-xl bg-glass border border-border/50 p-5 text-left">
                  <p className="text-sm font-semibold mb-3 text-accent">✨ Your personalised dashboard includes:</p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• AI-generated content ideas for {niche || "your niche"}</li>
                    <li>• Optimal posting schedule for {platforms[0] || "your platform"}</li>
                    <li>• Growth strategy tailored to your goals</li>
                    <li>• Brand deal rate calculator</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-foreground transition-all hover:shadow-[0_0_30px_-5px_hsl(318,100%,62%,0.4)] active:scale-[0.97]"
          >
            {step === 5 ? "Go to Dashboard" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
