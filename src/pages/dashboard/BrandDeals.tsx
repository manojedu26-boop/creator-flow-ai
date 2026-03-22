import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Calendar, 
  DollarSign, Briefcase, MessageSquare, FileText, 
  Phone, AlertCircle, ChevronRight, X, Sparkles,
  Instagram, Youtube, Twitter, CheckCircle2
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";

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
}

const initialDeals: Deal[] = [
  { id: '1', brand: 'Nike', logo: 'https://logo.clearbit.com/nike.com', type: 'Sponsored Post', platforms: ['IG', 'TT'], value: '₹45,000', deadline: 'Mar 25', status: 'negotiating', deadlineColor: 'yellow' },
  { id: '2', brand: 'Adobe', logo: 'https://logo.clearbit.com/adobe.com', type: 'UGC Content', platforms: ['YT'], value: '₹1,20,000', deadline: 'Apr 02', status: 'prospecting', deadlineColor: 'green' },
  { id: '3', brand: 'Zomato', logo: 'https://logo.clearbit.com/zomato.com', type: 'Ambassador', platforms: ['IG', 'YT', 'TT'], value: '₹85,000', deadline: 'Mar 23', status: 'live', deadlineColor: 'red' },
  { id: '4', brand: 'Samsung', logo: 'https://logo.clearbit.com/samsung.com', type: 'Event', platforms: ['IG'], value: '₹35,000', deadline: 'Mar 28', status: 'signed', deadlineColor: 'green' },
  { id: '5', brand: 'Spotify', logo: 'https://logo.clearbit.com/spotify.com', type: 'Affiliate', platforms: ['TT'], value: '₹15,000', deadline: 'Mar 24', status: 'outreach', deadlineColor: 'yellow' },
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

  const pipelineValue = "₹ 4,85,000";

  const moveDeal = (id: string, newStatus: DealStatus) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
  };

  const renderPipeline = () => (
    <div className="space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Deal Pipeline</span>
          <h2 className="text-2xl font-black text-primary">{pipelineValue} <span className="text-muted-foreground text-sm font-medium">total pipeline</span></h2>
        </div>
        <button className="h-10 px-5 bg-primary text-primary-foreground rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_15px_-3px_hsl(var(--primary))] transition-all">
          <Plus className="w-4 h-4" /> Add New Deal
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent min-h-[600px]">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[280px] flex flex-col gap-4">
            <div className="flex items-center justify-between px-3 py-2 bg-card/40 border border-border/30 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">{col.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{col.label}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted/50 border border-border/30">
                {deals.filter(d => d.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 space-y-3">
              {deals.filter(d => d.status === col.id).map((deal) => (
                <motion.div
                  layoutId={deal.id}
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  whileDrag={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", zIndex: 50 }}
                  className="premium-card bg-card border border-border/40 p-4 rounded-3xl cursor-pointer transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img src={deal.logo} alt="" className="w-8 h-8 rounded-full border border-border/20 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-sm truncate">{deal.brand}</h4>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{deal.type}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mb-4">
                    {deal.platforms.map(p => (
                      <span key={p} className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-muted/40 border border-border/20">{p}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">Value</span>
                      <span className="text-sm font-black text-primary">{deal.value}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none mb-1">Deadline</span>
                      <div className={`flex items-center gap-1.5 text-xs font-black ${
                        deal.deadlineColor === 'red' ? 'text-rose-500' : 
                        deal.deadlineColor === 'yellow' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                         <Calendar className="w-3 h-3" />
                         {deal.deadline}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/20 flex items-center justify-around text-muted-foreground">
                    <button className="hover:text-primary transition-colors"><Phone className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-primary transition-colors"><FileText className="w-3.5 h-3.5" /></button>
                    <button className="hover:text-primary transition-colors"><MessageSquare className="w-3.5 h-3.5" /></button>
                  </div>
                </motion.div>
              ))}
              
              <button 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl border border-dashed border-border/40 text-muted-foreground/50 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Add Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedDeal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDeal(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[150]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[450px] bg-card border-l border-border/40 shadow-2xl z-[160] flex flex-col"
            >
              <div className="p-6 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={selectedDeal.logo} alt="" className="w-12 h-12 rounded-full border border-border/20" />
                  <div>
                    <h3 className="text-xl font-black tracking-tight">{selectedDeal.brand}</h3>
                    <span className="text-xs text-muted-foreground font-bold uppercase">{selectedDeal.type}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-muted rounded-full transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">Value</span>
                      <span className="text-lg font-black text-primary">{selectedDeal.value}</span>
                   </div>
                   <div className="p-4 rounded-2xl bg-muted/20 border border-border/30">
                      <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest block mb-1">Start Date</span>
                      <span className="text-lg font-black">Mar 12</span>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-primary" /> AI Deal Notes
                    </h4>
                  </div>
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 text-sm italic leading-relaxed text-muted-foreground/80">
                    "This contract grants unlimited usage rights for 12 months. Recommendation: Negotiate a kill fee of 25% and request Net-30 payment terms instead of the current Net-60."
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-sm font-black uppercase tracking-widest">Timeline</h4>
                   <div className="space-y-6 relative ml-3 border-l border-border/40 pl-6">
                      {[
                        { date: 'Mar 2', text: 'Outreach sent to Brand manager' },
                        { date: 'Mar 5', text: 'Reply received - Brand interested' },
                        { date: 'Mar 8', text: 'Initial terms and contract sent' },
                      ].map((evt, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">{evt.date}</span>
                          <p className="text-sm font-medium mt-1">{evt.text}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                   <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Contract Shield Warning
                   </h4>
                   <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex gap-2"><span>🔴</span> Perpetual usage rights detected.</li>
                      <li className="flex gap-2"><span>🔴</span> No exclusivity compensation mentioned.</li>
                   </ul>
                </div>
              </div>

              <div className="p-6 border-t border-border/30 bg-muted/10 grid grid-cols-2 gap-3">
                 <button className="px-4 py-3 rounded-xl bg-background border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Write Follow-Up</button>
                 <button className="px-4 py-3 rounded-xl bg-background border border-border/40 text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Upload Contract</button>
                 <button className="px-4 py-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest col-span-2 hover:shadow-lg transition-all active:scale-95">Generate Invoice</button>
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
            <input type="text" placeholder="Search brands by name, category, or budget..." className="w-full h-12 bg-muted/20 border border-border/40 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto">
            {["Your Niche", "Budget", "Platform", "Location"].map(f => (
              <button key={f} className="px-4 py-2 bg-muted/30 border border-border/40 rounded-xl text-xs font-bold whitespace-nowrap hover:bg-muted transition-colors">{f}</button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Red Bull', cat: 'Fitness & Lifestyle', budget: '₹50K - ₹2L', logo: 'https://logo.clearbit.com/redbull.com' },
          { name: 'Skillshare', cat: 'Education & Tech', budget: '₹30K - ₹80K', logo: 'https://logo.clearbit.com/skillshare.com' },
          { name: 'Puma', cat: 'Sports & Active', budget: '₹1L - ₹5L', logo: 'https://logo.clearbit.com/puma.com' },
          { name: 'Uber Eats', cat: 'Food & Travel', budget: '₹40K - ₹1.5L', logo: 'https://logo.clearbit.com/ubereats.com' },
          { name: 'Airbnb', cat: 'Travel & Decor', budget: '₹2L - ₹10L', logo: 'https://logo.clearbit.com/airbnb.com' },
        ].map((brand, i) => (
          <div key={i} className="premium-card bg-card border border-border/40 rounded-3xl p-6 group transition-all flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <img src={brand.logo} alt="" className="w-14 h-14 rounded-2xl border border-border/20 shadow-sm" />
              <button className="p-2 rounded-xl bg-muted/20 text-muted-foreground hover:text-primary transition-colors">
                 <Sparkles className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-lg font-black tracking-tight">{brand.name}</h4>
            <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{brand.cat}</span>
            <div className="mt-6 flex flex-col gap-1">
               <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Avg Deal Size</span>
               <span className="text-md font-black">{brand.budget}</span>
            </div>
            <div className="mt-8 flex gap-3">
               <button className="flex-1 py-3 bg-muted/30 border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all">Save Brand</button>
               <button 
                 onClick={() => setSelectedDeal({ ...initialDeals[0], brand: brand.name, logo: brand.logo })}
                 className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
               >
                 Generate Pitch
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SHARED NAV TABS */}
        <div className="flex items-center gap-6 border-b border-border/30">
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
              activeTab === 'pipeline' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Deal Pipeline 
            {activeTab === 'pipeline' && (
              <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab('discovery')}
            className={`px-4 py-4 text-xs font-black uppercase tracking-widest relative transition-colors ${
              activeTab === 'discovery' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Brand Discovery
            {activeTab === 'discovery' && (
              <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'pipeline' ? renderPipeline() : renderDiscovery()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
