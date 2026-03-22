import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Megaphone, Target, IndianRupee, 
  Calendar, CheckCircle2, Plus, 
  Sparkles, Globe, Share2, Eye,
  Layout, Send, Trash2
} from "lucide-react";

export const PostBrief = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
         <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tight text-white">Post a Brief</h2>
            <p className="text-zinc-500 text-lg">Create a campaign opportunity for the creator network.</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
            <button className="h-14 px-10 bg-primary text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Publish Live</button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
         {/* LEFT NAV STEPS */}
         <div className="lg:col-span-1 space-y-8">
            {[
              { id: 1, label: 'Basics' },
              { id: 2, label: 'Targeting' },
              { id: 3, label: 'Deliverables' },
              { id: 4, label: 'Budget' },
              { id: 5, label: 'Timeline' },
            ].map(s => (
              <div key={s.id} onClick={() => setActiveStep(s.id)} className="group cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border ${
                      activeStep === s.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 
                      activeStep > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-zinc-500'
                    }`}>
                       {activeStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeStep === s.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}>{s.label}</span>
                 </div>
                 {s.id !== 5 && <div className="ml-5 mt-2 h-10 w-px bg-white/5" />}
              </div>
            ))}
         </div>

         {/* RIGHT: FORM CONTENT */}
         <div className="lg:col-span-4 space-y-12">
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl space-y-10"
            >
               {activeStep === 1 && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign Name</label>
                        <input placeholder="e.g. Summer Fitness Revolution 2026" className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium" />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product/Service Description</label>
                           <button className="text-[9px] font-black text-primary uppercase flex items-center gap-2"><Sparkles className="w-3 h-3" /> AI Help</button>
                        </div>
                        <textarea rows={4} className="w-full bg-black border border-white/10 rounded-[1.5rem] p-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium resize-none leading-relaxed" />
                     </div>
                  </div>
               )}

               {activeStep === 4 && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Lower Bound</label>
                           <input placeholder="₹ 15,000" className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-black" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Upper Bound</label>
                           <input placeholder="₹ 45,000" className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-black" />
                        </div>
                     </div>
                     <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-primary mt-1" />
                        <div className="space-y-1">
                           <h5 className="text-[10px] font-black uppercase text-primary">AI Pricing Insight</h5>
                           <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                              This budget range matches 640+ creators in your target niche. We recommend this for 4-5 Reels with high engagement potential.
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               <div className="flex gap-4 pt-10 border-t border-white/5">
                  <button onClick={() => setActiveStep(prev => Math.max(1, prev - 1))} className="flex-1 h-14 bg-white/5 text-[10px] font-black uppercase rounded-2xl text-zinc-400 hover:text-white transition-all">Previous Step</button>
                  <button onClick={() => setActiveStep(prev => Math.min(5, prev + 1))} className="flex-1 h-14 bg-white/10 text-[10px] font-black uppercase rounded-2xl text-white hover:bg-white hover:text-black transition-all">Next Step</button>
               </div>
            </motion.div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center"><Eye className="w-6 h-6" /></div>
                  <div>
                     <h5 className="text-[10px] font-black uppercase text-emerald-500">Live Brief Preview</h5>
                     <p className="text-xs text-zinc-400 font-medium">See how creators will see your campaign from the network feed.</p>
                  </div>
               </div>
               <button className="h-12 px-6 rounded-xl border border-emerald-500/30 text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">Preview Now</button>
            </div>
         </div>
      </div>
    </div>
  );
};
