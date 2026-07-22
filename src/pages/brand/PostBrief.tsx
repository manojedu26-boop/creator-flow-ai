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
    <div className="max-w-4xl mx-auto space-y-12 pb-20 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-10">
         <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-950">Post a Brief</h2>
            <p className="text-slate-500 text-lg">Create a campaign opportunity for the creator network.</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all"><Trash2 className="w-5 h-5" /></button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="h-14 px-10 bg-indigo-600 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 hover:bg-indigo-500"
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
                       activeStep === s.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 
                       activeStep > s.id ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'
                     }`}>
                        {activeStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeStep === s.id ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-700'
                     }`}>{s.label}</span>
                  </div>
                  {s.id !== 5 && <div className="ml-5 mt-2 h-10 w-px bg-slate-100" />}
              </div>
            ))}
         </div>

         {/* RIGHT: FORM CONTENT */}
         <div className="lg:col-span-4 space-y-12">
            <motion.div 
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-md space-y-10"
            >
                {activeStep === 1 && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Name</label>
                        <input 
                          value={form.title}
                          onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Summer Fitness Revolution 2026" 
                          className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium" 
                        />
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Product/Service Description</label>
                           <button 
                             onClick={generateAIDescription}
                             className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-2 hover:underline"
                           >
                              <Sparkles className="w-3 h-3" /> AI Help
                           </button>
                        </div>
                        <AutoResizeTextarea 
                          value={form.description}
                          onChange={(e: any) => setForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={4} 
                          className="w-full bg-white border border-slate-200 rounded-[1.5rem] p-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium resize-none leading-relaxed" 
                        />
                     </div>
                  </div>
               )}

               {activeStep === 2 && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target Niche</label>
                           <select 
                             value={form.niche}
                             onChange={(e) => setForm(prev => ({ ...prev, niche: e.target.value }))}
                             className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium"
                           >
                              <option>Fitness</option>
                              <option>Tech</option>
                              <option>Lifestyle</option>
                              <option>Beauty</option>
                              <option>Finance</option>
                           </select>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Min. Audience Size</label>
                           <select 
                             value={form.audienceMin}
                             onChange={(e) => setForm(prev => ({ ...prev, audienceMin: e.target.value }))}
                             className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium"
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location Targeting</label>
                        <div className="flex gap-4">
                           {['India', 'Global', 'SEA', 'USA'].map(loc => (
                             <button 
                                key={loc}
                                onClick={() => setForm(prev => ({ ...prev, location: loc }))}
                                className={`flex-1 h-14 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                  form.location === loc ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
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
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Deliverables</label>
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
                               form.deliverables.includes(del) ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                             }`}
                           >
                              <span className="text-[11px] font-bold">{del}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                form.deliverables.includes(del) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                              }`}>
                                 {form.deliverables.includes(del) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 hover:text-slate-900 transition-all"><Plus className="w-4 h-4" /> Add Custom Deliverable</button>
                  </div>
               )}

               {activeStep === 4 && (
                  <div className="space-y-10">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lower Bound</label>
                           <input 
                             value={form.budgetMin}
                             onChange={(e) => setForm(prev => ({ ...prev, budgetMin: e.target.value }))}
                             placeholder="₹ 15,000" 
                             className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-black" 
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upper Bound</label>
                           <input 
                             value={form.budgetMax}
                             onChange={(e) => setForm(prev => ({ ...prev, budgetMax: e.target.value }))}
                             placeholder="₹ 45,000" 
                             className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] px-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-black" 
                           />
                        </div>
                     </div>
                     <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] flex items-start gap-4">
                        <Sparkles className="w-5 h-5 text-indigo-600 mt-1" />
                        <div className="space-y-1">
                           <h5 className="text-[10px] font-black uppercase text-indigo-600">AI Pricing Insight</h5>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                This budget range matches 640+ creators in your target niche. We recommend this for 4-5 Reels with high engagement potential.
                           </p>
                        </div>
                     </div>
                  </div>
               )}

               {activeStep === 5 && (
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Content Deadline</label>
                        <div className="relative">
                           <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input 
                             type="date"
                             value={form.deadline}
                             onChange={(e) => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                             className="w-full h-16 bg-white border border-slate-200 rounded-[1.5rem] pl-16 pr-8 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium" 
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                        {[
                          { label: 'Published On', val: 'Today' },
                          { label: 'App Closures', val: '7 Days' },
                          { label: 'Completion', val: '21 Days' },
                        ].map(t => (
                          <div key={t.label} className="text-center space-y-1">
                             <span className="text-[8px] font-black text-slate-400 uppercase">{t.label}</span>
                             <p className="text-[10px] font-bold text-slate-950 uppercase">{t.val}</p>
                          </div>
                        ))}
                     </div>
                     <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Estimated ROI: 3.4x — 5.1x</p>
                     </div>
                  </div>
               )}

               <div className="flex gap-4 pt-10 border-t border-slate-100">
                  <button onClick={() => setActiveStep(prev => Math.max(1, prev - 1))} className="flex-1 h-14 bg-slate-50 border border-slate-200 text-[10px] font-black uppercase rounded-2xl text-slate-500 hover:bg-slate-100 hover:text-slate-950 transition-all">Previous Step</button>
                  <button onClick={() => setActiveStep(prev => Math.min(5, prev + 1))} className="flex-1 h-14 bg-slate-950 text-white border border-slate-900 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-900 transition-all">Next Step</button>
               </div>
            </motion.div>

            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Eye className="w-6 h-6" /></div>
                  <div>
                     <h5 className="text-[10px] font-black uppercase text-emerald-600">Live Brief Preview</h5>
                     <p className="text-xs text-slate-500 font-medium">See how creators will see your campaign from the network feed.</p>
                  </div>
               </div>
               <button className="h-12 px-6 rounded-xl border border-emerald-500/30 text-[9px] font-black uppercase text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all">Preview Now</button>
            </div>
         </div>
      </div>
    </div>
  );
};
