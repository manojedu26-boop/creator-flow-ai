import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Flame } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface IdeaCard {
  id: string;
  text: string;
  author: string;
  niche: string;
  time: string;
  likes: number;
}

const INITIAL_IDEAS: IdeaCard[] = [
  { id: "1", text: "5 Morning Habits that 10x my edit speed in Premiere Pro", author: "@tech_vlog", niche: "Tech", time: "2m ago", likes: 38 },
  { id: "2", text: "Stop doing squats like this! Fixing lower back pressure", author: "@naveenfitlife", niche: "Fitness", time: "4m ago", likes: 92 },
  { id: "3", text: "Why 90% of micro-influencers miss brand deals in Q4", author: "@growth_hacks", niche: "Business", time: "7m ago", likes: 145 },
  { id: "4", text: "POV: You switched from Davinci to Final Cut for YouTube Shorts", author: "@editor_pro", niche: "Editing", time: "11m ago", likes: 64 },
];

export const LiveIdeaBoard = () => {
  const [ideas, setIdeas] = useState<IdeaCard[]>(INITIAL_IDEAS);
  const [inputIdea, setInputIdea] = useState("");
  const [userHandle, setUserHandle] = useState("");

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIdea.trim()) return;

    const newIdea: IdeaCard = {
      id: `user_${Date.now()}`,
      text: inputIdea,
      author: userHandle.trim() ? (userHandle.startsWith('@') ? userHandle : `@${userHandle}`) : "@guest_creator",
      niche: "Creative",
      time: "Just now",
      likes: 1
    };

    setIdeas(prev => [newIdea, ...prev]);
    setInputIdea("");
    toast.success("Idea Posted to Live Community Board!", {
      description: "Your card is now floating live on the community stream."
    });
  };

  const handleLike = (id: string) => {
    setIdeas(prev => prev.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item));
  };

  return (
    <section className="py-24 px-6 bg-[#07080c] text-white border-t border-white/5 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-pink-400 mb-3 block">
            [05 // LIVE COMMUNITY CANVAS]
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            DROP AN IDEA. <span className="underline decoration-pink-500/80 decoration-2 underline-offset-8">WATCH IT LAND.</span>
          </h2>
          <p className="text-slate-400 mt-3 text-sm sm:text-base max-w-xl font-normal">
            Type your next Reel or Short concept below. Live visitors interact with ideas in real time.
          </p>
        </motion.div>

        {/* Input Box Form */}
        <form onSubmit={handleAddIdea} className="p-6 rounded-3xl border border-white/10 bg-white/[0.03] space-y-4 max-w-3xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              placeholder="@yourhandle (optional)"
              value={userHandle}
              onChange={e => setUserHandle(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <input 
              type="text" 
              placeholder="What's your next viral video hook?"
              value={inputIdea}
              onChange={e => setInputIdea(e.target.value)}
              className="flex-1 px-5 py-3 rounded-2xl bg-black/60 border border-white/10 text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <button 
              type="submit" 
              className="px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-400 text-black font-bold text-xs uppercase tracking-widest transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>post</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Floating Idea Stream Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <AnimatePresence>
            {ideas.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4 hover:border-pink-500/40 transition-all shadow-lg"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-pink-400 font-bold">{item.author}</span>
                  <span>{item.time}</span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-white leading-snug">
                  "{item.text}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase bg-white/5 text-slate-400">
                    {item.niche}
                  </span>
                  <button 
                    onClick={() => handleLike(item.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-black transition-all text-xs font-bold"
                  >
                    <Flame className="w-3.5 h-3.5" /> {item.likes}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LiveIdeaBoard;
