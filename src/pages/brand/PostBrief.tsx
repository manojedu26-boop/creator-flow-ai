import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, CheckCircle2, ChevronRight,
  Sparkles, Globe, Share2, Eye,
  Layout, Send, Trash2, Megaphone, Target, IndianRupee, Calendar, Plus, RefreshCcw
} from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { PageTransition } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { AutoResizeTextarea } from "../../components/shared/AutoResizeTextarea";

export const PostBrief = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    niche: "Lifestyle",
    audienceMin: "10K",
    location: "India",
    deliverables: ["1x Instagram Reel"],
    budgetMin: "15,000",
    budgetMax: "45,000",
    deadline: "2025-05-01"
  });

  const generateAIDescription = () => {
    toast.promise(new Promise(res => setTimeout(() => res(`We are looking for creative storytellers to showcase our new ${form.title || 'product'} in a high-energy, authentic way. The focus should be on how the product integrates into your daily ${form.niche} routine. We value cinematic quality and real engagement over generic promos.`), 1500)), {
      loading: 'AI drafting brief...',
      success: (data: any) => { setForm(prev => ({ ...prev, description: data })); return "AI draft ready!"; },
      error: 'Generation failed.'
    });
  };

  const handlePublish = () => {
    if (!form.title) return toast.error("Campaign Name is required");
    setIsPublishing(true);
    toast.loading("Publishing to Creator Network...");
    
    setTimeout(() => {
      const newCasting = { ...form, id: `cast_${Date.now()}`, brand: 'Your Brand', status: 'Live', date: new Date().toISOString().split('T')[0] };
      // @ts-ignore
      import("../../lib/db").then(({ db }) => {
        db.insert('castings', newCasting);
        setIsPublishing(false);
        toast.dismiss();
        toast.success("Campaign Published!", {
           description: "Creators will now see this in their Network feed."
        });
        setActiveStep(1);
        setForm({ ...form, title: "", description: "" });
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between border-b border-white/5 pb-10">
         <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tight text-white">Post a Brief</h2>
            <p className="text-zinc-500 text-lg">Create a campaign opportunity for the creator network.</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="p-3 bg-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="h-14 px-10 bg-primary text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
               {isPublishing ? <><RefreshCcw className="w-4 h-4 animate-spin" /> Sharing...</> : "Publish Live"}
            </button>
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
                        <input 
                          value={form.title}
                          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Summer Fitness Revolution 2026" 
                          className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium" 
                        />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Product/Service Description</label>
                           <button 
                             onClick={generateAIDescription}
                             className="text-[9px] font-black text-primary uppercase flex items-center gap-2 hover:underline"
                           >
                              <Sparkles className="w-3 h-3" /> AI Help
                           </button>
                        </div>
                        <AutoResizeTextarea 
                          value={form.description}
                          onChange={(e: any) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4} 
                          className="w-full bg-black border border-white/10 rounded-[1.5rem] p-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium resize-none leading-relaxed" 
                        />
                     </div>
                  </div>
               )}

               {activeStep === 2 && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Target Niche</label>
                           <select 
                             value={form.niche}
                             onChange={(e) => setForm(prev => ({ ...prev, niche: e.target.value }))}
                             className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                           >
                              <option>Fitness</option>
                              <option>Tech</option>
                              <option>Lifestyle</option>
                              <option>Beauty</option>
                              <option>Finance</option>
                           </select>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Min. Audience Size</label>
                           <select 
                             value={form.audienceMin}
                             onChange={(e) => setForm(prev => ({ ...prev, audienceMin: e.target.value }))}
                             className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                           >
                              <option>5K+</option>
                              <option>10K+</option>
                              <option>50K+</option>
                              <option>100K+</option>
                              <option>500K+</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location Targeting</label>
                        <div className="flex gap-4">
                           {['India', 'Global', 'SEA', 'USA'].map(loc => (
                             <button 
                                key={loc}
                                onClick={() => setForm(prev => ({ ...prev, location: loc }))}
                                className={`flex-1 h-14 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                  form.location === loc ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-zinc-500 hover:border-white/30'
                                }`}
                             >
                                {loc}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeStep === 3 && (
                  <div className="space-y-8">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign Deliverables</label>
                     <div className="space-y-3">
                        {['1x Instagram Reel', '2x Story Sets (3 frames)', '1x YouTube Integration', 'Static Feed Post', 'UGC Raw Content'].map(del => (
                           <div 
                             key={del}
                             onClick={() => {
                               setForm(prev => ({
                                 ...prev,
                                 deliverables: prev.deliverables.includes(del) 
                                   ? prev.deliverables.filter(d => d !== del) 
                                   : [...prev.deliverables, del]
                               }));
                             }}
                             className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                               form.deliverables.includes(del) ? 'bg-primary/5 border-primary text-white' : 'bg-black border-white/10 text-zinc-500 hover:border-white/20'
                             }`}
                           >
                              <span className="text-[11px] font-bold">{del}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                form.deliverables.includes(del) ? 'bg-primary border-primary' : 'border-white/20'
                              }`}>
                                 {form.deliverables.includes(del) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-all"><Plus className="w-4 h-4" /> Add Custom Deliverable</button>
                  </div>
               )}

               {activeStep === 4 && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Lower Bound</label>
                           <input 
                             value={form.budgetMin}
                             onChange={(e) => setForm(prev => ({ ...prev, budgetMin: e.target.value }))}
                             placeholder="₹ 15,000" 
                             className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-black" 
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Upper Bound</label>
                           <input 
                             value={form.budgetMax}
                             onChange={(e) => setForm(prev => ({ ...prev, budgetMax: e.target.value }))}
                             placeholder="₹ 45,000" 
                             className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] px-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-black" 
                           />
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

               {activeStep === 5 && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Campaign Content Deadline</label>
                        <div className="relative">
                           <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                           <input 
                             type="date"
                             value={form.deadline}
                             onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                             className="w-full h-16 bg-black border border-white/10 rounded-[1.5rem] pl-16 pr-8 text-white focus:outline-none focus:ring-1 focus:ring-primary font-medium" 
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-3 gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl">
                        {[
                          { label: 'Published On', val: 'Today' },
                          { label: 'App Closures', val: '7 Days' },
                          { label: 'Completion', val: '21 Days' },
                        ].map(t => (
                          <div key={t.label} className="text-center space-y-1">
                             <span className="text-[8px] font-black text-zinc-500 uppercase">{t.label}</span>
                             <p className="text-[10px] font-bold text-white uppercase">{t.val}</p>
                          </div>
                        ))}
                     </div>
                     <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Estimated ROI: 3.4x — 5.1x</p>
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
