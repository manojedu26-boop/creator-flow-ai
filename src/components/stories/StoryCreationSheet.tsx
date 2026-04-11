import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Camera, Video, Trophy, Sparkles, 
  Target, Briefcase, Send, Loader2, Edit3, Image 
} from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { cn } from "../../lib/utils";

interface StoryCreationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (type: string, content: string) => void;
}

export const StoryCreationSheet = ({ isOpen, onClose, onPost }: StoryCreationSheetProps) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const types = [
    { id: 'bts', label: 'Photo/BTS', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'video', label: 'Video Clip', icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'win', label: 'Win Story', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'poll', label: 'Poll / Question', icon: Edit3, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'collab', label: 'Open Collab', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'casting', label: 'Brand Casting', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const handleGenerateAiCaption = () => {
    if (!selectedType) return;
    setIsGenerating(true);
    setTimeout(() => {
      const captions: Record<string, string> = {
        bts: "Node sequence active: Late night deep work session. 💻🚀",
        win: "Strategic milestone unlocked: Just hit my Q2 revenue goal early! 🔥",
        poll: "Critical calibration required: Which creative direction for the next drop? 👇",
        collab: "Seeking high-engagement nodes for a collaborative mission in Wellness. 🤝",
        casting: "New campaign deployment: Looking for 3 creators to scale this brand node. 📈",
      };
      setContent(captions[selectedType] || "Scaling the ecosystem today.");
      setIsGenerating(false);
      toast.success("AI Caption Processed", { description: "Neural matching completed." });
    }, 1200);
  };

  const handlePost = () => {
    if (!content) return;
    onPost(selectedType || 'bts', content);
    toast.success("Story Deployed", { description: "Propagating to your network hub." });
    onClose();
    setSelectedType(null);
    setContent("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-end justify-center">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white rounded-t-[3rem] shadow-2xl overflow-hidden border-t border-slate-100"
          >
            <div className="p-8 md:p-12 space-y-10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white stroke-[3px]" />
                   </div>
                   <h2 className="text-xl font-black uppercase tracking-tight">Deploy Intelligence</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                   <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>

              {!selectedType ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedType(t.id)}
                      className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-950 transition-all flex flex-col items-center gap-4 group"
                    >
                      <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform shadow-sm", t.bg, t.color)}>
                        <t.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">{t.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between">
                     <button 
                       onClick={() => setSelectedType(null)}
                       className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 flex items-center gap-2"
                     >
                        ← Reselect Template
                     </button>
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-600">
                        <Sparkles className="w-3 h-3 fill-blue-600" /> Template: {selectedType}
                     </div>
                  </div>

                  <div className="relative">
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Input intelligence drop details..."
                      className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm focus:outline-none focus:ring-4 focus:ring-slate-950/5 resize-none transition-all"
                    />
                    <button 
                      onClick={handleGenerateAiCaption}
                      disabled={isGenerating}
                      className="absolute bottom-4 right-4 h-10 px-6 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {isGenerating ? "MAPPING..." : "AI ASSIST"}
                    </button>
                  </div>

                  <div className="flex gap-4">
                     <button className="flex-1 h-16 rounded-2xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-950 flex items-center justify-center gap-3">
                        <Image className="w-4 h-4" /> Media Attach
                     </button>
                     <button 
                       onClick={handlePost}
                       disabled={!content}
                       className="flex-[2] h-16 rounded-2xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-200"
                     >
                        Propagate Story <Send className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
               <p className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-300 italic">Deployment Logic v4.2 • Encryption Active</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { Plus } from "lucide-react";
