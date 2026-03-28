import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Calendar, 
  DollarSign, Briefcase, MessageSquare, FileText, 
  Phone, AlertCircle, ChevronRight, ChevronDown, X, Sparkles,
  Instagram, Youtube, Twitter, CheckCircle2,
  Zap, Trash2, Mail, Download, History, ArrowRight
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { SwipeUpAction } from "../../components/shared/MobileInteractions";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";
import { RefreshCcw } from "lucide-react";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { MobilePicker } from "../../components/ui/MobilePicker";
import { EmailComposer, EmailTemplate } from "../../components/dashboard/EmailComposer";
import { InvoiceGenerator } from "../../components/dashboard/InvoiceGenerator";
import confetti from "canvas-confetti";

type DealStatus = 'prospecting' | 'negotiating' | 'signed' | 'live' | 'paid';

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
  email?: string;
}

const columns: { id: DealStatus; label: string; icon: string; color: string }[] = [
  { id: 'prospecting', label: 'Prospecting', icon: '🔍', color: 'text-zinc-400' },
  { id: 'negotiating', label: 'Negotiating', icon: '🤝', color: 'text-amber-400' },
  { id: 'signed', label: 'Signed', icon: '✍️', color: 'text-emerald-400' },
  { id: 'live', label: 'Content Live', icon: '📸', color: 'text-sky-400' },
  { id: 'paid', label: 'Paid', icon: '💸', color: 'text-primary' },
];

export const BrandDeals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'discovery'>('pipeline');
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Modal States
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = db.getAll<Deal>('deals');
      setDeals(data);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateDealStatus = (dealId: string, newStatus: DealStatus) => {
    const prevDeal = deals.find(d => d.id === dealId);
    if (!prevDeal) return;

    db.update<Deal>('deals', dealId, { status: newStatus } as any);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, status: newStatus } : d));

    if (newStatus === 'paid') {
      triggerPaidCelebration();
    } else {
      toast.success(`Deal moved to ${newStatus}`);
    }
  };

  const triggerPaidCelebration = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF1493', '#FFD700', '#FFFFFF']
    });
    
    toast.success("PAYMENT RECEIVED! 💸", {
      description: "Gold flash animation and portfolio updated.",
      className: "animate-flash-gold"
    });
  };

  const handleWritePitch = (deal: Deal) => {
    setEmailTemplates([
      { 
        name: "Professional Outreach", 
        subject: `Partnership Proposal: Naveen Kumar x ${deal.brand}`, 
        body: `Hi team at ${deal.brand},\n\nI've been a huge fan of your products for a long time. I'd love to discuss a potential ${deal.type} collaboration for my audience of 250k+ fitness enthusiasts.\n\nLooking forward to hearing from you!\n\nBest,\nNaveen Kumar` 
      },
      {
        name: "Follow-up",
        subject: `Following up: Naveen Kumar x ${deal.brand}`,
        body: `Hi there,\n\nJust circling back on my previous email. I'm really excited about the possibility of working together!\n\nBest,\nNaveen Kumar`
      }
    ]);
    setSelectedDeal(deal);
    setIsEmailOpen(true);
  };

  const renderKanbanCard = (deal: Deal) => (
    <motion.div
      key={deal.id}
      layoutId={deal.id}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => setSelectedDeal(deal)}
      draggable
      onDragStart={(e) => e.dataTransfer.setData("dealId", deal.id)}
      className="group relative bg-white/5 dark:bg-white/5 light:bg-zinc-50 border border-white/5 dark:border-white/5 light:border-zinc-200 p-5 rounded-[2rem] cursor-grab active:cursor-grabbing hover:border-primary/40 transition-all shadow-xl overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 p-1 border border-white/10 shrink-0">
           <img src={deal.logo} alt="" className="w-full h-full object-contain rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-sm truncate uppercase tracking-tight">{deal.brand}</h4>
          <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar">
            {deal.platforms.map(p => (
              <span key={p} className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/10 uppercase shrink-0">{p}</span>
            ))}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-xl transition-all">
          <MoreVertical className="w-4 h-4 text-zinc-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Estimated Value</p>
            <p className="text-lg font-black text-primary leading-none italic">{deal.value}</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Due Date</p>
             <div className={`flex items-center gap-1.5 text-[10px] font-black ${
              deal.deadlineColor === 'red' ? 'text-rose-500' : 
              deal.deadlineColor === 'yellow' ? 'text-amber-500' : 'text-emerald-500'
            }`}>
               <Calendar className="w-3 h-3" /> {deal.deadline}
             </div>
          </div>
        </div>

        {deal.status === 'negotiating' && (
          <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <p className="text-[9px] font-bold text-amber-500/80">AI Suggestion: Ask for 15% more for exclusivity.</p>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center pointer-events-none group-active:opacity-0">
         <div className="bg-white text-black px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl pointer-events-auto">
            View Deal Details
         </div>
      </div>
    </motion.div>
  );

  const renderPipeline = () => (
    <div className="space-y-8">
      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Deal <span className="text-primary italic">Pipeline</span></h2>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active Pipeline: <span className="text-white dark:text-white light:text-zinc-900">₹ 2,45,000</span></p>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse">3 High Priority</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Filtering {brands}..." className="w-full h-12 bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 text-xs font-bold" />
          </div>
          <button onClick={() => setIsAddDealOpen(true)} className="h-12 px-6 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 lg:overflow-x-auto pb-8 min-h-[600px] no-scrollbar">
        {columns.map((col) => {
          const colDeals = deals.filter(d => d.status === col.id);
          
          return (
            <div 
              key={col.id} 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const dealId = e.dataTransfer.getData("dealId");
                if (dealId) updateDealStatus(dealId, col.id);
              }}
              className="flex flex-col gap-4 min-w-[280px]"
            >
              <div className="flex items-center justify-between p-4 bg-white/5 dark:bg-white/5 light:bg-zinc-100 border border-white/5 rounded-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <span className={col.color}>{col.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{col.label}</span>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  {colDeals.length}
                </span>
              </div>

              <div className={`flex flex-col gap-4 p-2 rounded-[2.5rem] min-h-[200px] transition-colors ${colDeals.length === 0 ? 'bg-white/[0.02] border border-dashed border-white/5' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {colDeals.map(renderKanbanCard)}
                </AnimatePresence>
                
                <button 
                  onClick={() => setIsAddDealOpen(true)}
                  className="w-full py-6 rounded-[2rem] border-2 border-dashed border-white/5 text-zinc-700 hover:text-primary hover:border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDiscovery = () => (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Red Bull India', cat: 'Fitness & Adventure', budget: '₹50K - ₹2.5L', logo: 'https://logo.clearbit.com/redbull.com' },
          { name: 'Decathlon', cat: 'Sports Gear', budget: '₹20K - ₹60K', logo: 'https://logo.clearbit.com/decathlon.in' },
          { name: 'MyProtein', cat: 'Nutrition', budget: '₹40K - ₹1.2L', logo: 'https://logo.clearbit.com/myprotein.com' },
        ].map((brand, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="group bg-white/5 dark:bg-white/5 light:bg-zinc-50 border border-white/5 dark:border-white/5 light:border-zinc-200 rounded-[2.5rem] p-8 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 border border-white/10">
                 <img src={brand.logo} alt="" className="w-full h-full object-contain rounded-xl" />
              </div>
              <button className="p-3 bg-white/5 hover:bg-primary/20 rounded-2xl transition-all">
                 <Mail className="w-4 h-4 text-primary" />
              </button>
            </div>
            <h4 className="text-xl font-black tracking-tighter uppercase">{brand.name}</h4>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{brand.cat}</span>
            <div className="mt-8">
               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Avg Deal Size</span>
               <span className="text-lg font-black text-primary italic">{brand.budget}</span>
            </div>
            <button className="w-full mt-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
               Write AI Pitch
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-10 space-y-10 max-w-[1600px] mx-auto pb-32">
      <div className="flex items-center gap-8 border-b border-white/5">
        <button onClick={() => setActiveTab('pipeline')} className={`pb-6 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'pipeline' ? 'text-primary' : 'text-zinc-500 hover:text-white'}`}>
          Deal Pipeline 
          {activeTab === 'pipeline' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,60,172,0.6)]" />}
        </button>
        <button onClick={() => setActiveTab('discovery')} className={`pb-6 text-[11px] font-black uppercase tracking-widest relative transition-all ${activeTab === 'discovery' ? 'text-primary' : 'text-zinc-500 hover:text-white'}`}>
          Partner Match 
          {activeTab === 'discovery' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(255,60,172,0.6)]" />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
          {activeTab === 'pipeline' ? renderPipeline() : renderDiscovery()}
        </motion.div>
      </AnimatePresence>

      {/* Deal Detail Drawer */}
      <AnimatePresence>
        {selectedDeal && !isEmailOpen && !isInvoiceOpen && (
          <BottomSheet isOpen={true} onClose={() => setSelectedDeal(null)} title="Deal Hub" height="90vh">
             <div className="space-y-8 pt-6 pb-20">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 rounded-3xl bg-white/5 p-3 border border-white/10 shrink-0">
                      <img src={selectedDeal.logo} alt="" className="w-full h-full object-contain rounded-xl" />
                   </div>
                   <div>
                      <h3 className="text-3xl font-black tracking-tight uppercase">{selectedDeal.brand}</h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">{selectedDeal.type}</span>
                         <div className="w-1 h-1 rounded-full bg-zinc-700" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Added 4 days ago</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Deal Worth</p>
                      <p className="text-3xl font-black text-primary italic leading-none">{selectedDeal.value}</p>
                   </div>
                   <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Platform Fee</p>
                      <p className="text-2xl font-black leading-none text-zinc-300">₹ 2,450</p>
                   </div>
                </div>

                {/* Automation Station */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Automation Hub</h5>
                   <div className="grid grid-cols-1 gap-4">
                      <button 
                        onClick={() => handleWritePitch(selectedDeal)}
                        className="group flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-[2rem] hover:bg-primary/10 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                               <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left">
                               <p className="text-sm font-black uppercase text-white">AI Pitch Writer</p>
                               <p className="text-[10px] font-bold text-zinc-500">Generate high-conversion response</p>
                            </div>
                         </div>
                         <ArrowRight className="w-5 h-5 text-primary transition-transform group-hover:translate-x-2" />
                      </button>

                      <button 
                        onClick={() => setIsInvoiceOpen(true)}
                        className="group flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center">
                               <FileText className="w-6 h-6 text-zinc-400" />
                            </div>
                            <div className="text-left">
                               <p className="text-sm font-black uppercase text-white">Smart Invoicing</p>
                               <p className="text-[10px] font-bold text-zinc-500">Auto-calculated GST included</p>
                            </div>
                         </div>
                         <ArrowRight className="w-5 h-5 text-zinc-400 transition-transform group-hover:translate-x-2" />
                      </button>

                      <button 
                        onClick={() => updateDealStatus(selectedDeal.id, 'paid')}
                        className="group flex items-center justify-between p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] hover:bg-emerald-500/10 transition-all"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                               <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div className="text-left">
                               <p className="text-sm font-black uppercase text-white">Mark as Paid</p>
                               <p className="text-[10px] font-bold text-zinc-500">Finalize deal & alert team</p>
                            </div>
                         </div>
                         <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                   </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Deal Activity</h5>
                   <div className="space-y-6 ml-4 border-l border-white/5 pl-8">
                      {[
                        { icon: Plus, text: "Deal created by Naveen", time: "2h ago" },
                        { icon: Mail, text: "Outreach sent via AI Pitch", time: "1h ago" },
                        { icon: History, text: "Status changed to Negotiating", time: "45m ago" },
                      ].map((item, i) => (
                        <div key={i} className="relative">
                           <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                              <item.icon className="w-4 h-4 text-zinc-500" />
                           </div>
                           <p className="text-xs font-bold text-white">{item.text}</p>
                           <p className="text-[9px] font-black text-zinc-600 uppercase mt-1">{item.time}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </BottomSheet>
        )}
      </AnimatePresence>

      {/* Support Modals */}
      <EmailComposer 
        isOpen={isEmailOpen} 
        onClose={() => setIsEmailOpen(false)}
        initialTo={selectedDeal?.email || `${selectedDeal?.brand.toLowerCase().replace(/\s+/g, '')}@brands.com`}
        initialSubject={emailTemplates[0]?.subject}
        initialBody={emailTemplates[0]?.body}
        templates={emailTemplates}
        dealContext={selectedDeal ? { brand: selectedDeal.brand, amount: selectedDeal.value, type: selectedDeal.type } : undefined}
      />

      {selectedDeal && (
        <InvoiceGenerator
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
          brandName={selectedDeal.brand}
          dealValue={selectedDeal.value}
          dealType={selectedDeal.type}
        />
      )}

      {/* Add Deal (kept from original for CRUD support) */}
      <BottomSheet isOpen={isAddDealOpen} onClose={() => setIsAddDealOpen(false)} title="New Partnership" height="90vh">
        <form className="space-y-6 pt-6 pb-12" onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const name = formData.get('brand') as string;
          const val = formData.get('value') as string;
          const stage = formData.get('status') as DealStatus;

          const dealId = `deal_${Math.random().toString(36).substr(2, 5)}`;
          const brandHandle = name.toLowerCase().replace(/\s+/g, '');
          const dealEntry: Deal = {
            id: dealId,
            brand: name,
            logo: `https://logo.clearbit.com/${brandHandle}.com`,
            type: 'Sponsored Reel',
            platforms: ['IG'],
            value: `₹${val}`,
            deadline: 'Apr 30',
            status: stage,
            deadlineColor: 'green'
          };
          db.insert('deals', dealEntry);
          setDeals(prev => [...prev, dealEntry]);
          setIsAddDealOpen(false);
          toast.success("Deal Added to Pipeline");
        }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Brand Name</label>
            <input name="brand" required className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 transition-all focus:ring-1 focus:ring-primary" placeholder="e.g. Nike" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Value (INR)</label>
            <input name="value" type="number" required className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 transition-all focus:ring-1 focus:ring-primary font-black italic" placeholder="50000" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pipeline Stage</label>
            <select name="status" className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 appearance-none focus:ring-1 focus:ring-primary">
              {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 mt-6 lg:mt-10">
            Secure Partnership
          </button>
        </form>
      </BottomSheet>

      <ConfirmationModal 
        isOpen={!!isDeleting}
        title="Delete Deal?"
        description="This will permanently remove this partnership from your pipeline."
        onConfirm={() => {
          if (isDeleting) {
            db.delete('deals', isDeleting);
            setDeals(prev => prev.filter(d => d.id !== isDeleting));
            setIsDeleting(null);
            toast.success("Deal Deleted");
          }
        }}
        onCancel={() => setIsDeleting(null)}
      />
    </PageTransition>
  );
};
