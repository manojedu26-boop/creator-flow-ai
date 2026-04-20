import React from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Clock, Hash, Wand2, Copy, Check, 
  Share2, Calendar, Target, Zap 
} from "lucide-react";
import { ContentSuggestion } from "../../lib/gemini";
import { cn } from "../../lib/utils";
import { toast } from "../../components/ui/sonner";

interface DailyPostCardProps {
  suggestion: ContentSuggestion;
  onApprove?: () => void;
}

export const DailyPostCard: React.FC<DailyPostCardProps> = ({ suggestion, onApprove }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-huge relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8">
        <div className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em]">
          <Zap className="w-4 h-4 fill-current" />
          Neural Match
        </div>
      </div>

      <div className="space-y-10">
        {/* Header Information */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
               <Target className="w-4 h-4" /> Recommended Strategy
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
               {suggestion.topic}
            </h3>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Window</p>
                <p className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
                   <Clock className="w-5 h-5 text-blue-600" /> {suggestion.bestTime}
                </p>
             </div>
             <div className="h-10 w-[1px] bg-slate-100 hidden md:block" />
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Format</p>
                <p className="text-xl font-black text-slate-900 uppercase">{suggestion.type}</p>
             </div>
          </div>
        </div>

        {/* Caption Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Primary Narrative</label>
             <button 
               onClick={() => copyToClipboard(suggestion.caption)}
               className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2 hover:text-blue-700 transition-colors"
             >
               {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
               {copied ? "Copied" : "Copy Caption"}
             </button>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-lg font-bold text-slate-700 leading-relaxed shadow-inner">
            "{suggestion.caption}"
          </div>
        </div>

        {/* Footer Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                 <Wand2 className="w-3 h-3" /> Technical Hook
              </label>
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100/50 text-sm font-black text-blue-700 uppercase tracking-tight">
                 {suggestion.hook}
              </div>
           </div>
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2 flex items-center gap-2">
                 <Hash className="w-3 h-3" /> Engagement Nodes
              </label>
              <div className="flex flex-wrap gap-2 text-[10px] font-black text-slate-500 uppercase">
                 {suggestion.hashtags.map((tag, i) => (
                   <span key={i} className="hover:text-blue-600 transition-colors cursor-pointer">#{tag}</span>
                 ))}
              </div>
           </div>
        </div>

        {/* Tactical Reasoning */}
        {suggestion.reason && (
          <div className="p-6 rounded-3xl bg-slate-900 text-white flex items-center gap-6 shadow-2xl">
             <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
             </div>
             <p className="text-[13px] font-bold text-slate-400 leading-snug">
                <span className="text-white font-black uppercase tracking-widest mr-2">Core Logic:</span>
                {suggestion.reason}
             </p>
          </div>
        )}

        <div className="flex gap-4">
           <button 
             onClick={onApprove}
             className="flex-1 h-16 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
           >
              <Calendar className="w-5 h-5" /> Schedule to Timeline
           </button>
           <button className="w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center active:scale-95">
              <Share2 className="w-6 h-6" />
           </button>
        </div>
      </div>
    </motion.div>
  );
};
