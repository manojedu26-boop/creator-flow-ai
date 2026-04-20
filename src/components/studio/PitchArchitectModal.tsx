
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Send, Wand2, Calculator, 
  MessageSquare, Target, User, ShieldCheck, 
  ArrowRight, Loader2, RefreshCcw
} from 'lucide-react';
import { db } from '@/lib/db';
import { generatePitch } from '@/lib/gemini';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PitchArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
}

export const PitchArchitectModal = ({ isOpen, onClose, brand }: PitchArchitectModalProps) => {
  const [pitch, setPitch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generated = await generatePitch(brand.name, brand.niches[0], "Naveen Kumar");
      setPitch(generated);
      toast.success("AI Pitch Constructed!");
    } catch (error) {
      toast.error("Failed to generate pitch. Using fallback.");
      setPitch(`Hi ${brand.name} team! I'm a creator in the ${brand.niches.join(', ')} space and I'd love to collaborate on your ${brand.campaignType}. My audience matches your target demographics perfectly.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!pitch) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Create application in DB
      const newApplication = {
        id: `app_${Date.now()}`,
        castingId: brand.id,
        creatorId: 'u1',
        creatorName: 'Naveen Kumar',
        status: 'Pending',
        match: 94,
        date: new Date().toISOString().split('T')[0],
        pitch_message: pitch
      };
      
      db.insert('applications', newApplication);

      // Also create a 'deal' node in the pipeline
      const newDeal = {
        id: `deal_${Date.now()}`,
        brand: brand.name,
        logo: brand.logo,
        type: brand.campaignType,
        platforms: ['IG', 'YT'],
        value: brand.budget,
        deadline: brand.deadline,
        status: 'outreach',
        deadlineColor: 'yellow',
        notes: `AI Pitch: ${pitch.substring(0, 100)}...`
      };
      db.insert('deals', newDeal);

      setIsSubmitting(false);
      toast.success("MISSION DISPATCHED 🚀", {
        description: "Your pitch is now in the brand's neural queue."
      });
      onClose();
    }, 400); // 0.4s (Down from 1.5s)
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm">
                     <img src={brand.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div>
                     <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{brand.name} Partnership</h2>
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mt-1">AI Pitch Architect v2.0</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
               </button>
            </div>

            <div className="p-8 space-y-8">
               {/* Brand Brief Summary */}
               <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <Target className="w-5 h-5 text-indigo-600" />
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Campaign Goal</p>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{brand.campaignType}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-lg font-black text-slate-900 tracking-tighter">{brand.budget}</p>
                     <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Budget Match: 98%</p>
                  </div>
               </div>

               {/* Pitch Editor */}
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Neural Pitch</label>
                     <button 
                       onClick={handleGenerate}
                       disabled={isGenerating}
                       className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-all disabled:opacity-50"
                     >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
                        Re-Architect with AI
                     </button>
                  </div>
                  
                  <div className="relative group">
                     <textarea
                       value={pitch}
                       onChange={(e) => setPitch(e.target.value)}
                       placeholder="Click 'Construct Pitch' to let AI build your proposal..."
                       className="w-full h-48 bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all resize-none shadow-inner"
                     />
                     {!pitch && !isGenerating && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <button 
                             onClick={handleGenerate}
                             className="px-8 h-12 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-600/20 pointer-events-auto active:scale-95"
                           >
                              <Wand2 className="w-4 h-4" /> Construct Original Pitch
                           </button>
                        </div>
                     )}
                     {isGenerating && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 animate-in fade-in">
                           <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                              className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full"
                           />
                           <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">Analyzing Brand DNA...</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Action Bar */}
               <div className="flex gap-4">
                  <button 
                    onClick={onClose}
                    className="flex-1 h-16 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 hover:border-slate-300 transition-all"
                  >
                     Abort Sync
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!pitch || isSubmitting}
                    className="flex-[2] h-16 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/30 hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                  >
                     {isSubmitting ? (
                        <>Dispatching Nodes... <Loader2 className="w-4 h-4 animate-spin" /></>
                     ) : (
                        <>Transmit Proposal Hub <Send className="w-4 h-4" /></>
                     )}
                  </button>
               </div>

               {/* Compliance Note */}
               <div className="flex items-center gap-3 justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" /> Encrypted Transmission via CreatorForge Neural Mesh
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
