import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Calendar, 
  DollarSign, Briefcase, MessageSquare, FileText, 
  Phone, AlertCircle, ChevronRight, ChevronDown, X, Sparkles,
  Instagram, Youtube, Twitter, CheckCircle2,
  Zap
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { SwipeUpAction } from "../../components/shared/MobileInteractions";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { MobilePicker } from "../../components/ui/MobilePicker";
import { useEffect } from "react";

type DealStatus = 'prospecting' | 'outreach' | 'negotiating' | 'signed' | 'live' | 'paid';

interface Deal {
  id: string;
  brand: string;
  logo: string;
  type: string;
  platforms: string[];
  value: string;
  deadline: string;
  status: DealStatus;
  deadlineColor: 'red' | 'yellow' | 'green';
  notes?: string;
}

const initialDeals: Deal[] = [
  { 
    id: '1', 
    brand: 'MuscleBlaze', 
    logo: 'https://logo.clearbit.com/muscleblaze.com', 
    type: 'Sponsored Reel', 
    platforms: ['IG', 'YT'], 
    value: '₹35,000', 
    deadline: 'Mar 28', 
    status: 'live', 
    deadlineColor: 'red',
    notes: "AI Insight: Your last Reel for MuscleBlaze had 4.8% engagement. Use similar hook for this one."
  },
  { 
    id: '2', 
    brand: 'Decathlon India', 
    logo: 'https://logo.clearbit.com/decathlon.in', 
    type: 'Ambassador Program', 
    platforms: ['IG', 'YT', 'TT'], 
    value: '₹75,000', 
    deadline: 'Apr 15', 
    status: 'signed', 
    deadlineColor: 'green',
    notes: "Contract Shield: Exclusivity for 3 months. No gym-wear from competitors."
  },
  { 
    id: '3', 
    brand: 'Nike India', 
    logo: 'https://logo.clearbit.com/nike.com', 
    type: 'Marathon Campaign', 
    platforms: ['IG'], 
    value: '₹60,000', 
    deadline: 'Apr 05', 
    status: 'outreach', 
    deadlineColor: 'yellow',
    notes: "Follow up needed: No reply in 5 days."
  },
  { 
    id: '4', 
    brand: 'Fittr App', 
    logo: 'https://logo.clearbit.com/fittr.com', 
    type: 'App Integration', 
    platforms: ['YT'], 
    value: '₹42,000', 
    deadline: 'Mar 10', 
    status: 'paid', 
    deadlineColor: 'green' 
  },
  { 
    id: '5', 
    brand: 'HealthKart', 
    logo: 'https://logo.clearbit.com/healthkart.com', 
    type: 'Supplement Review', 
    platforms: ['IG'], 
    value: '₹28,000', 
    deadline: 'Apr 20', 
    status: 'prospecting', 
    deadlineColor: 'green' 
  },
];

const columns: { id: DealStatus; label: string; icon: string }[] = [
  { id: 'prospecting', label: 'Prospecting', icon: '🔍' },
  { id: 'outreach', label: 'Outreach Sent', icon: '📨' },
  { id: 'negotiating', label: 'Negotiating', icon: '🤝' },
  { id: 'signed', label: 'Signed', icon: '✍️' },
  { id: 'live', label: 'Content Live', icon: '📸' },
  { id: 'paid', label: 'Paid', icon: '💸' },
];

export const BrandDeals = () => {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'discovery'>('pipeline');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedColumns, setExpandedColumns] = useState<string[]>(['prospecting']);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pipelineValue = "₹ 2,40,000";

  const toggleColumn = (id: string) => {
    if (!isMobile) return;
    setExpandedColumns(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Deal <span className="text-primary italic">Pipeline</span></h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Active Pipeline Value: <span className="text-white">{pipelineValue}</span></p>
        </div>
        <button onClick={() => setIsAddDealOpen(true)} className="h-12 px-6 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
          <Plus className="w-4 h-4" /> New Deal
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:overflow-x-auto gap-4 md:gap-6 pb-8 no-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
        {columns.map((col) => {
          const colDeals = deals.filter(d => d.status === col.id);
          const isExpanded = !isMobile || expandedColumns.includes(col.id);
          
          return (
          <div key={col.id} className="min-w-0 md:min-w-[300px] flex flex-col gap-4">
            <div 
               onClick={() => toggleColumn(col.id)}
               className={`flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-xl ${isMobile ? 'cursor-pointer active:scale-[0.98] transition-all' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{col.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{col.label}</span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                   {colDeals.length}
                 </span>
                 {isMobile && <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {colDeals.map((deal) => (
                <SwipeUpAction
                  key={deal.id}
                  actions={
                    <>
                      <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Message</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Contract</span>
                      </button>
                    </>
                  }
                >
                  <motion.div
                    layoutId={deal.id}
                    onClick={() => setSelectedDeal(deal)}
                    className="group relative bg-black/40 backdrop-blur-3xl border border-white/5 hover:border-primary/40 p-5 rounded-[2rem] cursor-pointer transition-all shadow-xl overflow-hidden"
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-white/5 p-1 border border-white/10">
                         <img src={deal.logo} alt="" className="w-full h-full object-contain rounded-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-sm truncate">{deal.brand}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          {deal.platforms.map(p => (
                            <span key={p} className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 uppercase">{p}</span>
                          ))}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-xl transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Estimated Value</p>
                        <p className="text-lg font-black text-primary leading-none">{deal.value}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Deadline</p>
                         <div className={`flex items-center gap-1.5 text-[10px] font-black ${
                          deal.deadlineColor === 'red' ? 'text-rose-500' : 
                          deal.deadlineColor === 'yellow' ? 'text-amber-500' : 'text-emerald-500'
                        }`}>
                           <Calendar className="w-3 h-3" /> {deal.deadline}
                         </div>
                      </div>
                    </div>

                    {deal.notes && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                         <p className="text-[10px] font-bold text-muted-foreground italic line-clamp-1">
                           "{deal.notes}"
                         </p>
                      </div>
                    )}
                  </motion.div>
                </SwipeUpAction>
              ))}
              
              <button onClick={() => setIsAddDealOpen(true)} className="w-full flex items-center justify-center gap-2 py-6 rounded-[2rem] border-2 border-dashed border-white/5 text-muted-foreground/30 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest">
                <Plus className="w-4 h-4" /> Add Deal
              </button>
            </motion.div>
            )}
            </AnimatePresence>
          </div>
        )})}
      </div>

      <AnimatePresence>
        {selectedDeal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDeal(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-white/10 shadow-2xl z-[160] flex flex-col p-8 overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 border border-white/10">
                      <img src={selectedDeal.logo} alt="" className="w-full h-full object-contain rounded-xl" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight">{selectedDeal.brand}</h3>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mt-1">{selectedDeal.type}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedDeal(null)} className="p-3 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Deal Value</p>
                       <p className="text-2xl font-black text-primary leading-none">{selectedDeal.value}</p>
                    </div>
                    <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Deadline</p>
                       <p className="text-2xl font-black leading-none">{selectedDeal.deadline}</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-[2rem] bg-primary/10 border border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Sparkles className="w-16 h-16" />
                    </div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3">AI Contract Shield</h5>
                    <p className="text-sm font-bold leading-relaxed text-white/90">
                       {selectedDeal.notes || "Based on your niche norms, this contract is fairly standard. We recommend adding a 24-hour turnaround clause for brand feedback to stay on track."}
                    </p>
                 </div>

                 <div className="space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Activity</h5>
                    <div className="space-y-6 relative ml-3 border-l border-white/10 pl-6">
                       {[
                         { date: 'Step 1', text: 'Negotiation phase initiated' },
                         { date: 'Step 2', text: 'Primary deliverables agreed upon' },
                         { date: 'Step 3', text: 'Final contract draft under review' },
                       ].map((evt, i) => (
                         <div key={i} className="relative">
                           <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-primary" />
                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">{evt.date}</span>
                           <p className="text-sm font-bold mt-1 text-white/80">{evt.text}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-auto pt-10 grid grid-cols-2 gap-4">
                 <button className="h-14 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Download Brief</button>
                 <button className="h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">Go to Deal Hub</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const renderDiscovery = () => (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search brands looking for creators..." className="w-full h-14 bg-white/5 border border-white/5 rounded-[1.5rem] pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Red Bull India', cat: 'Fitness & Adventure', budget: '₹50K - ₹2.5L', logo: 'https://logo.clearbit.com/redbull.com' },
          { name: 'Pure Gym', cat: 'Health & Wellness', budget: '₹20K - ₹60K', logo: 'https://logo.clearbit.com/puregym.com' },
          { name: 'MyProtein', cat: 'Nutrition', budget: '₹40K - ₹1.2L', logo: 'https://logo.clearbit.com/myprotein.com' },
        ].map((brand, i) => (
          <div key={i} className="group bg-black/40 border border-white/5 hover:border-primary/30 rounded-[2.5rem] p-8 transition-all flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 border border-white/10">
                 <img src={brand.logo} alt="" className="w-full h-full object-contain rounded-xl" />
              </div>
              <button className="p-3 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all">
                 <Zap className="w-4 h-4 text-primary" />
              </button>
            </div>
            <h4 className="text-xl font-black tracking-tighter uppercase">{brand.name}</h4>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{brand.cat}</span>
            <div className="mt-8">
               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Avg Deal Size</span>
               <span className="text-lg font-black text-primary">{brand.budget}</span>
            </div>
            <button className="w-full mt-10 py-4 bg-white/5 hover:bg-primary hover:text-white border border-white/10 hover:border-primary transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest">
               Express Interest
            </button>
          </div>
        ))}
      </div>

      <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-primary/20 to-purple-500/10 border border-white/10 text-center space-y-4">
         <Sparkles className="w-10 h-10 text-primary mx-auto" />
         <h3 className="text-2xl font-black tracking-tight uppercase">Unlock Premium Discovery</h3>
         <p className="text-[11px] font-bold text-muted-foreground/80 max-w-lg mx-auto leading-relaxed">
            Naveen, you're currently seeing 15% of available fitness deals. Upgrade to Growth Plan to see direct contacts for 200+ brands.
         </p>
         <button className="h-12 px-8 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all mt-4">Upgrade for ₹2,499</button>
      </div>
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      <div className="flex items-center gap-6 border-b border-white/5 mb-8">
        <button onClick={() => setActiveTab('pipeline')} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'pipeline' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
          Deal Pipeline 
          {activeTab === 'pipeline' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,60,172,0.4)]" />}
        </button>
        <button onClick={() => setActiveTab('discovery')} className={`pb-4 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'discovery' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}>
          Brand Discovery
          {activeTab === 'discovery' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,60,172,0.4)]" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === 'pipeline' ? renderPipeline() : renderDiscovery()}
        </motion.div>
      </AnimatePresence>

      <BottomSheet isOpen={isAddDealOpen} onClose={() => setIsAddDealOpen(false)} title="Add New Deal" height="90vh">
        <form className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Brand Name</label>
            <input type="text" placeholder="e.g. Nike" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Deal Type</label>
            <MobilePicker 
              options={[
                { label: 'Sponsored Reel', value: 'reel' },
                { label: 'YouTube Integration', value: 'yt' },
                { label: 'Ambassador Program', value: 'ambassador' }
              ]}
              value=""
              onChange={() => {}}
              placeholder="Select Type"
              title="Deal Type"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Value (₹)</label>
            <input type="text" inputMode="numeric" placeholder="e.g. 50000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-12" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Stage</label>
            <MobilePicker 
              options={columns.map(c => ({ label: c.label, value: c.id }))}
              value="prospecting"
              onChange={() => {}}
              placeholder="Select Stage"
              title="Pipeline Stage"
            />
          </div>
          <button type="button" onClick={() => setIsAddDealOpen(false)} className="w-full h-14 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 mt-8 mb-safe-offset">
            Save Contract
          </button>
        </form>
      </BottomSheet>
    </PageTransition>
  );
};
