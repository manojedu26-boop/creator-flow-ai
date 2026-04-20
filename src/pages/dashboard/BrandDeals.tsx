
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Calendar, 
  DollarSign, Briefcase, MessageSquare, FileText, 
  Phone, AlertCircle, ChevronRight, ChevronDown, X, Sparkles,
  Instagram, Youtube, CheckCircle2,
  Zap, Trash2, Mail, Download, History, ArrowRight, ShieldCheck,
  Layout, Gavel, Radio, Globe, BarChart3
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

type DealStatus = 'outreach' | 'live' | 'signed' | 'completed';

const columns: { id: DealStatus; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'outreach', label: 'Neural Outreach', icon: Radio, color: "text-blue-500", desc: "Pending Handshake" },
  { id: 'signed', label: 'Contract Secured', icon: ShieldCheck, color: "text-indigo-500", desc: "Legal Ops Locked" },
  { id: 'live', label: 'Active Deployment', icon: Zap, color: "text-amber-500", desc: "Content in Orbit" },
  { id: 'completed', label: 'Final Settlement', icon: CheckCircle2, color: "text-emerald-500", desc: "Revenue Dispatched" },
];

export const BrandDeals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [dealInsight, setDealInsight] = useState<any | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const fetchDeals = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = db.getAll('deals');
      setDeals(data);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Load AI insight whenever a deal is selected
  useEffect(() => {
    if (selectedDeal) {
      setDealInsight(null);
      fetchDealInsight(selectedDeal);
    }
  }, [selectedDeal?.id]);

  const fetchDealInsight = async (deal: any) => {
    setIsLoadingInsight(true);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: {
          action: "DEAL_INSIGHT",
          brandName: deal.brand,
          inputData: deal.type,
          niche: (user as any)?.niche || "Fitness",
          format: deal.value,
        },
      });
      if (!error && data?.output) {
        setDealInsight(data.output);
      }
    } catch (e) {
      // Fail silently
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const updateStatus = (id: string, status: DealStatus) => {
    db.update('deals', id, { status });
    fetchDeals();
    toast.success(`Pipeline Updated to ${status.toUpperCase()}`);
  };

  const finalizeDeal = (deal: any) => {
    db.update('deals', deal.id, { status: 'completed' });
    
    // Add to revenue (mock logic)
    const amount = parseInt(deal.value.replace(/\D/g, '')) || 0;
    const currentRevenue = db.getAll<any>('invoices');
    db.insert('invoices', {
      id: `inv_${Date.now()}`,
      brand: deal.brand,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      type: 'Bilateral Deal'
    });

    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#10b981', '#6366f1']
    });

    toast.success("REVENUE HANDOVER COMPLETE 💸", {
      description: `${deal.value} has been dispatched to your global account.`
    });
    
    fetchDeals();
    setSelectedDeal(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full"
        />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Syncing Global Partnership Nodes...</p>
      </div>
    );
  }

  return (
    <PageTransition className="space-y-12 max-w-[1800px] mx-auto pb-32 px-4">
      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Revenue Ops v4.2</span>
             </div>
             <div className="flex items-center gap-2 text-emerald-500 animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                <span className="text-[9px] font-black uppercase tracking-widest">Market Active</span>
             </div>
          </div>
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] text-slate-900">
            Global<br/>
            <span className="text-indigo-600 italic">Partnerships.</span>
          </h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed">
            Managing <span className="text-slate-900">{deals.length} active nodes</span> with a localized pipeline value of <span className="text-indigo-600">₹ {(deals.length * 55)}K</span>.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <button className="h-16 px-8 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 hover:border-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
              <Download className="w-4 h-4" /> Export Ledger
           </button>
           <button 
             onClick={() => navigate('/explore')}
             className="h-16 px-10 bg-indigo-600 text-white rounded-2xl flex items-center gap-4 hover:bg-slate-950 transition-all shadow-2xl shadow-indigo-500/20 active:scale-95 group font-black text-[10px] uppercase tracking-widest"
           >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Acquire Deals
           </button>
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {columns.map(col => {
          const colDeals = deals.filter(d => d.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-6">
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn("p-2 rounded-xl bg-slate-50", col.color)}>
                    <col.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 leading-none mb-1">{col.label}</h4>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{col.desc}</p>
                  </div>
                </div>
                <span className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-900 border border-slate-100">
                  {colDeals.length}
                </span>
              </div>

              <div className={cn(
                "flex flex-col gap-6 min-h-[500px] p-2 rounded-[3.5rem] transition-all",
                colDeals.length === 0 ? "bg-slate-50/50 border-2 border-dashed border-slate-100" : ""
              )}>
                <AnimatePresence mode="popLayout">
                  {colDeals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      layoutId={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:border-indigo-600 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden"
                      onClick={() => setSelectedDeal(deal)}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-2xl -z-10 group-hover:bg-indigo-600/10 transition-all" />
                      
                      <div className="flex items-center justify-between mb-6">
                         <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm group-hover:scale-110 transition-transform">
                            <img src={deal.logo} alt="" className="w-full h-full object-contain" />
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-slate-900 tracking-tighter">{deal.value}</p>
                            <p className={cn("text-[9px] font-black uppercase tracking-widest", deal.deadlineColor === 'red' ? 'text-rose-500' : 'text-emerald-500')}>
                               {deal.deadline} Deadline
                            </p>
                         </div>
                      </div>

                      <h4 className="text-sm font-black uppercase tracking-tight text-slate-950 mb-2 truncate">
                         {deal.brand} • {deal.type}
                      </h4>

                      <div className="flex items-center gap-3 mb-6">
                        {deal.platforms?.map((p: string) => (
                          <span key={p} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 border border-slate-100 uppercase">{p}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:animate-ping" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Node Secure</span>
                         </div>
                         <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform group-hover:text-indigo-600" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Fidelity Workspace Detail */}
      <AnimatePresence>
        {selectedDeal && (
          <BottomSheet isOpen={true} onClose={() => setSelectedDeal(null)} title="Partnership Warroom v4.2" height="90vh">
             <div className="max-w-6xl mx-auto py-10 pb-40 space-y-16">
                {/* Detail Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-slate-100 p-4 shadow-xl">
                         <img src={selectedDeal.logo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-5xl font-black uppercase tracking-tighter text-slate-900">{selectedDeal.brand}</h3>
                         <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 italic">Campaign Workspace</span>
                            <span className="pro-label text-slate-300">/</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDeal.type}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{selectedDeal.value}</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-2 italic">88% Creator Net Retention</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   {/* Left Col: AI Intelligence & Insights */}
                   <div className="lg:col-span-2 space-y-10">
                      {/* Neural Insight Hub — Live AI Data */}
                      <div className="p-10 rounded-[4rem] bg-slate-950 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-10 opacity-10">
                            <Sparkles className="w-20 h-20" />
                         </div>
                         <div className="flex items-center justify-between mb-8">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500">AI Strategic Pulse</h4>
                           {isLoadingInsight && (
                             <div className="flex items-center gap-2">
                               <div className="w-3 h-3 border border-indigo-400/30 border-t-indigo-400 rounded-full animate-spin" />
                               <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Analyzing...</span>
                             </div>
                           )}
                         </div>
                         {dealInsight ? (
                           <>
                             <p className="text-lg font-medium leading-relaxed italic text-indigo-100 mb-10">
                               "{dealInsight.negotiationTip}"
                             </p>
                             <div className="grid grid-cols-3 gap-6 mb-8">
                               {[
                                 { label: 'Match Score', val: `${dealInsight.matchScore}%`, color: 'text-blue-400' },
                                 { label: 'Est. Engagement', val: dealInsight.engagementEstimate, color: 'text-indigo-400' },
                                 { label: 'Risk Level', val: dealInsight.riskLevel, color: `text-${dealInsight.riskColor || 'emerald'}-400` },
                               ].map(idx => (
                                 <div key={idx.label} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                   <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">{idx.label}</p>
                                   <p className={cn("text-lg font-black tracking-tight", idx.color)}>{idx.val}</p>
                                 </div>
                               ))}
                             </div>
                             <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                               <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Recommended Action</p>
                               <p className="text-sm font-bold text-emerald-400">{dealInsight.recommendedAction}</p>
                             </div>
                             {dealInsight.redFlags?.length > 0 && (
                               <div className="mt-6 space-y-2">
                                 <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">⚠ Red Flags</p>
                                 {dealInsight.redFlags.map((f: string, i: number) => (
                                   <p key={i} className="text-xs text-rose-300 font-medium">• {f}</p>
                                 ))}
                               </div>
                             )}
                           </>
                         ) : (
                           <>
                             <p className="text-2xl font-medium leading-relaxed italic text-indigo-100 mb-10">
                               "{selectedDeal.notes}"
                             </p>
                             <div className="grid grid-cols-3 gap-6">
                               {[
                                 { label: 'Match Confidence', val: '—', color: 'text-blue-400' },
                                 { label: 'Est. Engagement', val: '—', color: 'text-indigo-400' },
                                 { label: 'Risk Factor', val: '—', color: 'text-emerald-400' },
                               ].map(idx => (
                                 <div key={idx.label} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                   <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">{idx.label}</p>
                                   <p className={cn("text-lg font-black tracking-tight animate-pulse", idx.color)}>{idx.val}</p>
                                 </div>
                               ))}
                             </div>
                           </>
                         )}
                      </div>

                      {/* Content Deliverables */}
                      <div className="space-y-6">
                         <div className="flex items-center justify-between px-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Node Deliverables</h4>
                            <span className="text-[10px] font-black text-indigo-600">3 TOTAL SLOTS</span>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                               { label: 'Hero Reel Deployment', status: 'In Review', icon: Youtube },
                               { label: 'Twitter/X Strategy Sync', status: 'Pending', icon: Radio },
                               { label: 'Story Series (3-part)', status: 'Drafting', icon: Instagram },
                            ].map(item => (
                               <div key={item.label} className="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between hover:border-indigo-600 transition-all group">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:text-indigo-600 transition-colors">
                                        <item.icon className="w-5 h-5" />
                                     </div>
                                     <span className="text-xs font-black uppercase tracking-tight">{item.label}</span>
                                  </div>
                                  <span className="px-3 py-1 bg-slate-50 text-[8px] font-black uppercase tracking-widest text-slate-400 rounded-lg">{item.status}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Action & Compliance */}
                   <div className="space-y-10">
                      {/* Strategic Actions */}
                      <div className="space-y-4">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Terminal</p>
                         <div className="space-y-4">
                            {selectedDeal.status === 'outreach' && (
                               <button 
                                 onClick={() => updateStatus(selectedDeal.id, 'signed')}
                                 className="w-full h-20 rounded-[2rem] bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 active:scale-95"
                               >
                                 <Gavel className="w-5 h-5" /> Execute Billateral Contract
                               </button>
                            )}
                            {selectedDeal.status === 'signed' && (
                               <button 
                                 onClick={() => updateStatus(selectedDeal.id, 'live')}
                                 className="w-full h-20 rounded-[2rem] bg-amber-500 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-amber-500/30 hover:bg-amber-400 transition-all flex items-center justify-center gap-4 active:scale-95"
                               >
                                 <Zap className="w-5 h-5" /> Initialise Active Campaign
                               </button>
                            )}
                            {selectedDeal.status === 'live' && (
                               <button 
                                 onClick={() => finalizeDeal(selectedDeal)}
                                 className="w-full h-20 rounded-[2rem] bg-emerald-600 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all flex items-center justify-center gap-4 active:scale-95"
                               >
                                 <CheckCircle2 className="w-5 h-5" /> Trigger Revenue Handover
                               </button>
                            )}
                            
                            <button 
                              onClick={() => navigate('/messages')}
                              className="w-full h-16 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-indigo-600 transition-all flex items-center justify-center gap-3"
                            >
                               <MessageSquare className="w-4 h-4 text-indigo-600" /> Multi-Thread Comms
                            </button>
                            <button 
                               onClick={() => navigate('/contracts')}
                               className="w-full h-16 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-indigo-600 transition-all flex items-center justify-center gap-3"
                            >
                               <ShieldCheck className="w-4 h-4 text-emerald-500" /> Contract Shield Audit
                            </button>
                            <button 
                               onClick={() => navigate(`/collab/${selectedDeal.id}`)}
                               className="w-full h-16 rounded-[1.5rem] bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm hover:border-indigo-600 transition-all flex items-center justify-center gap-3"
                            >
                               <Globe className="w-4 h-4 text-blue-500" /> Enter Partner Warroom
                            </button>
                         </div>
                      </div>

                      {/* Revenue Splitting Node */}
                      <div className="p-10 rounded-[3.5rem] bg-slate-50 border border-slate-100 space-y-8">
                         <div className="space-y-1">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Topology</h5>
                            <p className="text-xl font-black text-slate-950 uppercase tracking-tighter italic">Net Value Node</p>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center pro-label text-slate-400">
                               <span>Gross Agreement</span>
                               <span className="font-bold text-slate-900">{selectedDeal.value}</span>
                            </div>
                            <div className="flex justify-between items-center pro-label text-blue-600">
                               <span>CreatorForge Fee (12%)</span>
                               <span className="font-bold">₹ {(parseInt(selectedDeal.value.replace(/\D/g, '')) || 0) * 0.12}</span>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="flex justify-between items-center">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquid Payoff</span>
                               <span className="text-2xl font-black text-emerald-600 font-mono tracking-tighter">
                                  ₹ {(parseInt(selectedDeal.value.replace(/\D/g, '')) || 0) * 0.88}
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
