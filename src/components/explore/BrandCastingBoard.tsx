
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Clock, Users, ChevronRight, Sparkles, Filter, Briefcase, Target, ArrowRight } from 'lucide-react';
import { useExplore } from '@/contexts/ExploreContext';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import { PitchArchitectModal } from '@/components/studio/PitchArchitectModal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const BrandCard = ({ brand, index, onApply, aiTip }: { brand: any, index: number, onApply: (b: any) => void, aiTip?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="p-8 bg-white border border-slate-100 rounded-[3rem] shadow-premium hover:shadow-floating-indigo transition-all group flex flex-col justify-between h-[450px] relative overflow-hidden"
    >
       {aiTip && (
         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="absolute top-0 left-0 right-0 p-4 bg-indigo-600/5 border-b border-indigo-600/10 flex items-center gap-3 z-10 backdrop-blur-sm"
         >
           <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
           <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest line-clamp-1">{aiTip}</p>
         </motion.div>
       )}
       <div className={cn("space-y-6", aiTip ? "pt-8" : "")}>
          <div className="flex justify-between items-start">
             <div className="w-16 h-16 rounded-2xl border border-slate-100 p-3 bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <img src={brand.logo} className="w-full h-full object-contain" alt="Logo" />
             </div>
             <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 italic">Verified Node</span>
                <div className="flex items-center gap-1.5 text-slate-400">
                   <Clock className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-widest">{brand.deadline}</span>
                </div>
             </div>
          </div>

          <div className="space-y-2">
             <div className="flex items-center gap-2 text-indigo-600">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{brand.campaignType}</span>
             </div>
             <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tighter leading-none">{brand.name}</h4>
          </div>

          <div className="flex flex-wrap gap-2">
             {brand.niches.map((n: string) => (
                <span key={n} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-500">{n}</span>
             ))}
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-50 space-y-4 shadow-inner">
             <div className="flex justify-between items-end">
                <div className="space-y-1">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Budget Node</p>
                   <p className="text-lg font-black text-slate-950">{brand.budget}</p>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Spots</p>
                   <p className="text-sm font-black text-indigo-600">{brand.spotsRemaining} / {brand.totalSpots} Left</p>
                </div>
             </div>
             <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(brand.spotsRemaining / brand.totalSpots) * 100}%` }}
                   className="h-full bg-indigo-600"
                />
             </div>
          </div>
       </div>

       <button 
          onClick={() => onApply(brand)}
          className="w-full h-14 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 group shadow-xl"
       >
          Apply Now <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
       </button>
    </motion.div>
  );
};

export const BrandCastingBoard = () => {
  const { brands } = useExplore();
  const { user } = useAuth();
  const [filter, setFilter] = useState('All budgets');
  const [selectedForPitch, setSelectedForPitch] = useState<any | null>(null);
  const [aiTips, setAiTips] = useState<Record<string, string>>({});

  // Fetch AI tips for visible brands on mount
  useEffect(() => {
    if (brands.length > 0) {
      brands.slice(0, 3).forEach(brand => fetchBrandTip(brand));
    }
  }, [brands.length]);

  const fetchBrandTip = async (brand: any) => {
    if (aiTips[brand.id]) return;
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: {
          action: "BRAND_ANALYSIS",
          brandName: brand.name,
          niche: brand.niches[0],
          inputData: brand.campaignType,
        },
      });
      if (!error && data?.output) {
        setAiTips(prev => ({ ...prev, [brand.id]: data.output.pitchAngle }));
      }
    } catch (e) {}
  };

  const budgetFilters = ['All budgets', 'Under ₹25K', '₹25K–₹1L', '₹1L+'];

  return (
    <section className="space-y-10 px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Briefcase className="w-6 h-6 text-white" />
           </div>
           <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-slate-950">Open Brand Opportunities — Right Now</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Neural Briefing Node • Direct Monetization Hub</p>
           </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
           {budgetFilters.map(f => (
             <button
               key={f}
               onClick={() => setFilter(f)}
               className={cn(
                 "flex-shrink-0 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
                 filter === f ? "bg-slate-950 text-white shadow-xl" : "bg-white text-slate-400 border border-slate-100 hover:border-slate-900 hover:text-slate-950"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <AnimatePresence mode="popLayout">
            {brands.map((brand, i) => (
               <BrandCard 
                 key={brand.id} 
                 brand={brand} 
                 index={i} 
                 onApply={(b) => setSelectedForPitch(b)}
                 aiTip={aiTips[brand.id]}
               />
            ))}
         </AnimatePresence>
         
         <div className="lg:col-span-1 p-10 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-6 group hover:border-indigo-600 transition-all h-[420px]">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 transition-all">
               <ArrowRight className="w-10 h-10 text-slate-300 group-hover:text-indigo-600" />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-black text-slate-950 uppercase tracking-tight">Access Pro Briefs</p>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest max-w-[200px] mx-auto">Upgrade to Gold Tier to access premium briefs and exclusive brand nodes.</p>
            </div>
            <button className="px-8 h-12 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all">Explore Gold Access</button>
         </div>
      </div>

      {selectedForPitch && (
        <PitchArchitectModal 
          isOpen={true} 
          onClose={() => setSelectedForPitch(null)} 
          brand={selectedForPitch}
        />
      )}
    </section>
  );
};
