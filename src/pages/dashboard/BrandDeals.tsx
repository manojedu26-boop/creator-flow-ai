import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, MessageSquare, ShieldCheck, Zap, 
  CheckCircle2, Plus, ArrowRight, Shield, 
  Star, Target, Radio, Globe, CreditCard,
  Instagram, Youtube, Smartphone, Search,
  Filter, Calendar, DollarSign, Wallet,
  Handshake, Sparkles, TrendingUp
} from "lucide-react";
import { PageTransition, CountUp } from "@/components/shared/MotionComponents";
import { db } from "@/lib/db";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const TABS = [
  { id: 'opportunities', label: 'Opportunities', icon: Target, desc: 'Casting Calls' },
  { id: 'incoming', label: 'Incoming', icon: Radio, desc: 'Direct Offers' },
  { id: 'active', label: 'Active Deals', icon: Zap, desc: 'Pipeline' },
  { id: 'rates', label: 'My Rates', icon: CreditCard, desc: 'Pricing' },
];

export const BrandDeals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [deals, setDeals] = useState<any[]>([]);
  const [castings, setCastings] = useState<any[]>([]);
  const [rates, setRates] = useState<any>({ story: 0, reel: 0, video: 0, post: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const dealData = db.getAll('deals');
      const castData = db.getAll('castings');
      const ratesData = db.getAll<any>('creator_rates').find(r => r.userId === user?.id) || { story: 8000, reel: 25000, post: 15000, video: 50000 };
      
      setDeals(dealData);
      setCastings(castData);
      setRates(ratesData);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateRate = (field: string, value: number) => {
    const updated = { ...rates, [field]: value };
    setRates(updated);
    db.update('creator_rates', rates.id, updated);
    toast.success("Rates Synchronized", { description: "Your profile has been updated for all brands." });
  };

  const handleAction = (deal: any, action: string) => {
     if (action === 'PAYMENT_SIMULATION') {
        toast.info("Escrow Initialised", { description: "Razorpay Secure connection established. Waiting for brand settlement..." });
        // Simulation of payment flow
        setTimeout(() => {
           confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
           toast.success("PAYMENT PROTECTED", { description: "₹ " + deal.value + " is now held in escrow." });
        }, 2000);
     }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950 space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Retrieving Marketplace Nodes...</p>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 max-w-[1800px] mx-auto pb-32 px-4">
      {/* Billion-Dollar Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 pt-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 rounded-full">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Global Marketplace Alpha</span>
             </div>
             <div className="flex items-center gap-2 text-emerald-500">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
             </div>
          </div>
          <h2 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-white">
            Brand<br/>
            <span className="text-blue-600 italic">Marketplace.</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] max-w-xl leading-relaxed">
            Collaborate with elite brands using the world's first <span className="text-white">AI-augmented deal engine</span>. 
            Automated contracts, real-time escrow, and high-fidelity media kits.
          </p>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-3xl shrink-0">
           <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Revenue Nodes</p>
              <p className="text-3xl font-black text-white italic">₹ 1.8L+</p>
           </div>
           <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Success Quantum</p>
              <p className="text-3xl font-black text-emerald-500 italic">94.2%</p>
           </div>
           <div className="hidden md:block space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Platform Trust</p>
              <p className="text-3xl font-black text-blue-500 italic">Tier-1</p>
           </div>
        </div>
      </div>

      {/* Navigation Hub */}
      <div className="flex flex-wrap gap-4 p-3 bg-slate-900/50 border border-white/5 rounded-[2.5rem] w-fit backdrop-blur-2xl">
         {TABS.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={cn(
               "px-8 py-5 rounded-[2rem] flex items-center gap-4 transition-all relative group",
               activeTab === tab.id ? "bg-blue-600 text-white shadow-2xl shadow-blue-600/30" : "hover:bg-white/5 text-slate-400"
             )}
           >
             <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-slate-500")} />
             <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">{tab.label}</p>
                {activeTab === tab.id && <p className="text-[8px] font-bold text-white/50 uppercase tracking-tighter mt-1">{tab.desc}</p>}
             </div>
           </button>
         ))}
      </div>

      {/* Dynamic Workspace */}
      <div className="min-h-[600px]">
         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
               {/* ——— T1: OPPORTUNITIES (Casting Board) ——— */}
               {activeTab === 'opportunities' && (
                 <div className="space-y-10">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                         <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Campaign Opportunities</h3>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sourced from global agency partners</p>
                      </div>
                      <div className="flex gap-4">
                         <div className="h-14 px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-slate-400 italic font-medium text-sm">
                            <Search className="w-4 h-4" /> Filter by niche...
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {castings.map(cast => (
                        <div key={cast.id} className="group p-10 bg-slate-900 border border-white/5 rounded-[4rem] hover:border-blue-600/50 transition-all shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-3xl -z-10 group-hover:bg-blue-600/10 transition-all" />
                           
                           <div className="flex items-center justify-between mb-8">
                              <div className="w-16 h-16 rounded-3xl bg-white border border-white/10 p-3 shadow-xl">
                                 <img src={`https://logo.clearbit.com/${cast.brand.toLowerCase()}.com`} alt="" className="w-full h-full object-contain" />
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-blue-500 tracking-tighter">{cast.budget}</p>
                                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Budget Node</p>
                              </div>
                           </div>

                           <h4 className="text-xl font-black text-white uppercase tracking-tight mb-4">{cast.title}</h4>
                           <p className="text-sm font-bold text-slate-500 leading-relaxed mb-8 line-clamp-2">{cast.description}</p>

                           <div className="flex items-center gap-3 mb-10">
                              <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black rounded-xl border border-blue-600/10 uppercase italic">{cast.niche}</span>
                              <span className="px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black rounded-xl border border-white/5 uppercase">Global</span>
                           </div>

                           <button className="w-full h-16 rounded-[1.5rem] bg-white text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 active:scale-95 group">
                              Initiate Handshake <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
                           </button>
                        </div>
                      ))}
                   </div>
                 </div>
               )}

               {/* ——— T2: INCOMING (Direct Offers) ——— */}
               {activeTab === 'incoming' && (
                 <div className="space-y-10">
                   <div className="p-10 rounded-[3rem] bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-blue-600/20">
                      <div className="space-y-4 relative z-10">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                            <Sparkles className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Alpha Insight</span>
                         </div>
                         <h3 className="text-4xl font-black uppercase tracking-tighter">Engagement Anomaly Detected!</h3>
                         <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px]">3 high-value brands just viewed your media kit. Respond now to lock rates.</p>
                      </div>
                      <div className="flex gap-4 relative z-10">
                         <div className="text-center p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-xl">
                            <p className="text-4xl font-black">₹ 60K</p>
                            <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Avg. Request Value</p>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      {deals.filter(d => d.status === 'offered').map(deal => (
                        <div key={deal.id} className="p-8 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-blue-600/30 transition-all flex flex-col md:flex-row items-center gap-10">
                           <div className="w-20 h-20 rounded-[2rem] bg-white p-4 shadow-2xl">
                              <img src={deal.logo} alt="" className="w-full h-full object-contain" />
                           </div>
                           <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-4 mb-2">
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{deal.brand}</h4>
                                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-lg border border-emerald-500/10 uppercase">High Match</span>
                              </div>
                              <p className="text-xs font-bold text-slate-500 max-w-lg leading-relaxed uppercase tracking-wide">Protocol: {deal.type} • Deadline: {deal.deadline}</p>
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <p className="text-3xl font-black text-white tracking-tighter">₹ {deal.value.toLocaleString()}</p>
                              <div className="flex gap-3 mt-4">
                                 <button className="h-12 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Decline</button>
                                 <button className="h-12 px-6 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-400 transition-all">Negotiate</button>
                                 <button className="h-12 px-10 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-all">Accept Offer</button>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                 </div>
               )}

               {/* ——— T3: ACTIVE (Pipeline) ——— */}
               {activeTab === 'active' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                   {['agreed', 'content_created', 'submitted', 'paid'].map((status) => {
                     const stepDeals = deals.filter(d => d.status === status);
                     const labels: any = { 
                       agreed: { label: 'Contracted', icon: ShieldCheck, color: 'text-indigo-500' },
                       content_created: { label: 'Production', icon: Camera, color: 'text-blue-500' },
                       submitted: { label: 'Review', icon: Globe, color: 'text-amber-500' },
                       paid: { label: 'Settled', icon: Wallet, color: 'text-emerald-500' }
                     };
                     
                     return (
                       <div key={status} className="flex flex-col gap-6">
                         <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-between backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                               <div className={cn("p-2 rounded-xl bg-slate-900 border border-white/5", labels[status].color)}>
                                  {/* Just rendering icon directly for demo */}
                                  <ShieldCheck className="w-5 h-5" />
                               </div>
                               <div>
                                  <h4 className="text-[11px] font-black uppercase tracking-widest text-white leading-none">{labels[status].label}</h4>
                                  <p className="text-[8px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">Active Nodes</p>
                               </div>
                            </div>
                            <span className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white border border-white/10">
                              {stepDeals.length}
                            </span>
                         </div>
                         
                         <div className="flex flex-col gap-6">
                            {stepDeals.map(deal => (
                              <div 
                                key={deal.id} 
                                className="group p-8 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-blue-600/30 transition-all shadow-xl relative overflow-hidden cursor-pointer"
                                onClick={() => setSelectedDeal(deal)}
                              >
                                 <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white p-3 shadow-2xl group-hover:scale-110 transition-transform">
                                       <img src={deal.logo} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1" />
                                 </div>
                                 <h5 className="text-sm font-black text-white uppercase tracking-tight truncate mb-2">{deal.brand}</h5>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{deal.type}</p>
                                 
                                 <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                                    <span className="text-sm font-black text-blue-500 tracking-tighter">₹ {deal.value.toLocaleString()}</span>
                                    <div className="flex items-center gap-1.5">
                                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Locked</span>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                       </div>
                     )
                   })}
                 </div>
               )}

               {/* ——— T4: RATES ——— */}
               {activeTab === 'rates' && (
                 <div className="w-full max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                       <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Monetization Pulse</h3>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">Configure your deployment costs for the global market</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                       {[
                         { id: 'story', label: 'IG Story', icon: Instagram, color: 'text-pink-500' },
                         { id: 'reel', label: 'IG/TT Reel', icon: Smartphone, color: 'text-blue-500' },
                         { id: 'video', label: 'YT Video', icon: Youtube, color: 'text-red-500' },
                         { id: 'post', label: 'Static Post', icon: Globe, color: 'text-emerald-500' },
                       ].map(rate => (
                         <div key={rate.id} className="p-10 bg-slate-900 border border-white/5 rounded-[4rem] hover:border-blue-600/30 transition-all shadow-2xl relative group overflow-hidden">
                            <div className="mb-8 flex items-center justify-between">
                               <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110", rate.color)}>
                                  <rate.icon className="w-6 h-6" />
                               </div>
                               <TrendingUp className="w-4 h-4 text-emerald-500 opacity-40" />
                            </div>
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{rate.label} Configuration</h4>
                            <div className="relative">
                               <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20 italic">₹</span>
                               <input 
                                 type="text" 
                                 value={rates[rate.id]} 
                                 onChange={(e) => updateRate(rate.id, parseInt(e.target.value) || 0)}
                                 className="w-full h-16 bg-transparent border-b border-white/10 text-4xl font-black text-white font-mono tracking-tighter pl-8 focus:border-blue-600 transition-all outline-none"
                               />
                            </div>
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-6">+12% Premium Service Fee</p>
                         </div>
                       ))}
                    </div>

                    {/* Media Kit Card Preview */}
                    <div className="p-12 rounded-[5rem] bg-gradient-to-br from-blue-600 to-indigo-900 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-blue-600/30 group">
                       <div className="space-y-6">
                          <h4 className="text-4xl font-black uppercase tracking-tighter">Your Public Media Kit</h4>
                          <p className="text-blue-100 font-bold text-sm uppercase tracking-widest leading-relaxed max-w-md">Your rates and performance data are synchronized to a cinema-grade public directory. Share it with brands to initiate instant deals.</p>
                          <div className="flex gap-4">
                             <button className="h-16 px-10 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Copy Hub URL</button>
                             <button 
                               onClick={() => navigate(`/kit/${user?.handle.replace('@', '')}`)}
                               className="h-16 px-10 bg-white/20 border border-white/20 backdrop-blur-xl rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/30 transition-all"
                             >View Live Kit</button>
                          </div>
                       </div>
                       <div className="w-80 h-48 bg-slate-950/40 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl p-8 relative overflow-hidden group-hover:rotate-2 transition-transform">
                          <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-12 rounded-full bg-blue-600" />
                             <div className="space-y-1">
                                <div className="w-24 h-2 bg-white/20 rounded-full" />
                                <div className="w-16 h-2 bg-white/10 rounded-full" />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="h-20 bg-white/5 rounded-2xl" />
                             <div className="h-20 bg-white/5 rounded-2xl" />
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </motion.div>
         </AnimatePresence>
      </div>

      {/* Deal Detail Workspace */}
      <AnimatePresence>
         {selectedDeal && (
           <BottomSheet isOpen={true} onClose={() => setSelectedDeal(null)} title="Partnership Hub v4.2" height="90vh">
              <div className="max-w-6xl mx-auto py-12 pb-40 space-y-16">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
                    <div className="flex items-center gap-10">
                       <div className="w-28 h-28 rounded-[3rem] bg-white border border-slate-100 p-5 shadow-2xl ring-1 ring-slate-100">
                          <img src={selectedDeal.logo} alt="" className="w-full h-full object-contain" />
                       </div>
                       <div className="space-y-3">
                          <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-950">{selectedDeal.brand}</h3>
                          <div className="flex items-center gap-4">
                             <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100 italic">Campaign Secured</span>
                             <span className="pro-label text-slate-300">/</span>
                             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{selectedDeal.type}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-5xl font-black text-slate-950 tracking-tighter">₹ {selectedDeal.value.toLocaleString()}</p>
                       <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-3 italic">Verified Payment Escrow Enabled</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                       {/* AI Analysis Block */}
                       <div className="p-12 rounded-[4rem] bg-slate-950 text-white relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Sparkles className="w-24 h-24" />
                          </div>
                          <div className="flex items-center justify-between mb-10">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Neural Deal Insight</h4>
                             <Shield className="w-5 h-5 text-indigo-400 opacity-40" />
                          </div>
                          <p className="text-2xl font-medium leading-[1.6] italic text-blue-100 mb-12">
                             "{selectedDeal.notes}"
                          </p>
                          <div className="grid grid-cols-3 gap-8">
                             {[
                               { label: 'Platform Fit', val: '98%', icon: Handshake },
                               { label: 'Risk Rating', val: 'Low', icon: ShieldCheck },
                               { label: 'Est. REACH', val: '45K+', icon: Smartphone },
                             ].map(item => (
                               <div key={item.label} className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-blue-600/30 transition-all">
                                  <p className="text-[9px] font-black uppercase text-white/30 tracking-[0.3em] mb-3">{item.label}</p>
                                  <p className="text-xl font-black text-white tracking-tight">{item.val}</p>
                               </div>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="flex items-center justify-between px-6">
                             <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Live Deliverables</h4>
                             <span className="text-[11px] font-black text-blue-600">PRODUCTION MODE</span>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                             {[
                               { title: 'Reel Submission', desc: 'Main brand integration with trending audio usage', status: 'In Review' },
                               { title: 'Twitter Thread', desc: 'Educational thread linking to product ecosystem', status: 'Pending' }
                             ].map(del => (
                               <div key={del.title} className="p-10 bg-white border border-slate-100 rounded-[3rem] flex items-center justify-between group hover:border-blue-600 transition-all shadow-sm">
                                  <div className="space-y-2">
                                     <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">{del.title}</h5>
                                     <p className="text-xs font-bold text-slate-400">{del.desc}</p>
                                  </div>
                                  <span className="px-5 py-2 bg-slate-50 text-[10px] font-black text-slate-400 border border-slate-100 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">{del.status}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-12">
                       <div className="space-y-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Operational Control</p>
                          <div className="space-y-4">
                             <button 
                                onClick={() => handleAction(selectedDeal, 'PAYMENT_SIMULATION')}
                                className="w-full h-24 rounded-[2.5rem] bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                             >
                                <span className="flex items-center gap-3">Secure Escrow Node <Zap className="w-4 h-4 fill-white" /></span>
                                <span className="text-[8px] opacity-60 font-black tracking-widest">RAZORPAY PROTECTED</span>
                             </button>
                             
                             <button className="w-full h-20 rounded-[2rem] bg-white border border-slate-200 text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] hover:border-blue-600 transition-all flex items-center justify-center gap-4 group">
                                <MessageSquare className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-all" /> Brand Transmission
                             </button>
                             <button className="w-full h-20 rounded-[2rem] bg-white border border-slate-200 text-slate-950 font-black text-[11px] uppercase tracking-[0.2em] hover:border-emerald-500 transition-all flex items-center justify-center gap-4 group">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-all" /> Legal Repository
                             </button>
                          </div>
                       </div>

                       {/* Payout Topology Widget */}
                       <div className="p-12 rounded-[4rem] bg-slate-50 border border-slate-100 space-y-10 relative overflow-hidden">
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/5 rounded-full blur-3xl" />
                          <div className="space-y-2">
                             <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Splitting Node</h5>
                             <p className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">Net Creator Value</p>
                          </div>
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                               <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Gross Node</span>
                               <span className="text-sm font-black text-slate-900">₹ {selectedDeal.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-600">
                               <span className="text-[11px] font-black uppercase tracking-widest">Service Fee (12%)</span>
                               <span className="text-sm font-black">- ₹ {(selectedDeal.value * 0.12).toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between items-center pb-2">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Dispatched</span>
                               <span className="text-4xl font-black text-emerald-600 font-mono tracking-tighter italic">
                                  ₹ {(selectedDeal.value * 0.88).toLocaleString()}
                               </span>
                            </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </BottomSheet>
         )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BrandDeals;
