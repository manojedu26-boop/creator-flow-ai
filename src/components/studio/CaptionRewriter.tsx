import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wand2, RefreshCcw, Check, Copy, 
  MessageSquare, Sparkles, Loader2 
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { cn } from "../../lib/utils";
import { toast } from "../../components/ui/sonner";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";

const TONES = [
  { id: "Professional", icon: Sparkles, color: "text-blue-600", bg: "bg-blue-50" },
  { id: "Casual", icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50" },
  { id: "Funny", icon: Sparkles, color: "text-pink-600", bg: "bg-pink-50" },
  { id: "Inspirational", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
] as const;

type Tone = typeof TONES[number]["id"];

export const CaptionRewriter: React.FC = () => {
  const [caption, setCaption] = React.useState("");
  const [selectedTone, setSelectedTone] = React.useState<Tone>("Professional");
  const [isRewriting, setIsRewriting] = React.useState(false);
  const [result, setResult] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const handleRewrite = async () => {
    if (!caption.trim()) {
      toast.error("Enter a caption to rewrite");
      return;
    }
    setIsRewriting(true);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "TONE_ARCHITECT", 
          inputData: caption,
          targetAesthetic: selectedTone 
        },
      });

      if (error) throw error;

      if (data?.output) {
        setResult(data.output);
        toast.success(`Success! Transformed to ${selectedTone} tone.`);
      } else {
        throw new Error("Invalid response from Forge");
      }
    } catch (error: any) {
      console.error("The Forge failed:", error);
      toast.error("The Forge failed to reconstruct linguistic nodes.");
    } finally {
      setIsRewriting(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-huge">
        <div className="space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Source Narrative</label>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                   {caption.length} / 2200
                </div>
             </div>
             <AutoResizeTextarea
               value={caption}
               onChange={(e: any) => setCaption(e.target.value)}
               placeholder="Paste your baseline caption here..."
               className="w-full min-h-[160px] bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-base font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner"
             />
          </div>

          {/* Tone Selection */}
          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Target Aesthetic</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "h-14 rounded-2xl border text-[10px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all",
                      selectedTone === tone.id 
                        ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]" 
                        : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600"
                    )}
                  >
                    <tone.icon className={cn("w-4 h-4", selectedTone === tone.id ? "text-blue-400" : tone.color)} />
                    {tone.id}
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={handleRewrite}
            disabled={isRewriting || !caption.trim()}
            className="w-full h-20 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.4em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
          >
             {isRewriting ? <Loader2 className="w-6 h-6 animate-spin" /> : <RefreshCcw className="w-6 h-6" />}
             {isRewriting ? "Processing Linguistic Transfer..." : "Execute Reconstruction"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-blue-600 rounded-[3rem] p-10 shadow-huge text-white relative overflow-hidden"
          >
             <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]" />
             
             <div className="relative space-y-8">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
                         <Wand2 className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Optimized Output</p>
                         <h4 className="text-xl font-black uppercase tracking-tighter">{selectedTone} Variant</h4>
                      </div>
                   </div>
                   <button 
                     onClick={copyResult}
                     className="px-6 h-12 rounded-xl bg-white text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-opacity-90 transition-all shadow-lg"
                   >
                     {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     {copied ? "Copied" : "Copy to Clipboard"}
                   </button>
                </div>

                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/10 text-lg font-bold leading-relaxed">
                   "{result}"
                </div>

                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 w-fit">
                   <Sparkles className="w-4 h-4 text-blue-300" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em]">Viral Velocity Coefficient Enhanced (+42%)</span>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
