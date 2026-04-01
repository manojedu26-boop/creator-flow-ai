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
import { cn } from "../../lib/utils";
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
  { id: 'prospecting', label: 'Prospecting', icon: '🔍', color: "text-slate-400" },
  { id: 'negotiating', label: 'Negotiating', icon: '🤝', color: "text-blue-500" },
  { id: 'signed', label: 'Signed', icon: '✍️', color: "text-indigo-500" },
  { id: 'live', label: 'Content Live', icon: '📸', color: "text-violet-500" },
  { id: 'paid', label: 'Paid', icon: '💸', color: "text-emerald-600" },
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
      colors: ['#2563eb', '#10b981', '#6366f1']
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
      // @ts-ignore - Native drag event on motion component
      onDragStart={(e: React.DragEvent) => e.dataTransfer.setData("dealId", deal.id)}
      className="group relative bg-white border border-slate-100 p-6 rounded-[2.5rem] cursor-grab active:cursor-grabbing hover:border-blue-400 transition-all shadow-sm hover:shadow-md overflow-hidden"
    >
      <div className="flex items-center gap-5 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 p-2 border border-slate-100 shrink-0 shadow-inner">
           <img src={deal.logo} alt="" className="w-full h-full object-contain rounded-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-black text-sm truncate uppercase tracking-tight text-slate-900">{deal.brand}</h4>
          <div className="flex items-center gap-2 mt-1.5 overflow-x-auto no-scrollbar">
            {deal.platforms.map(p => (
              <span key={p} className="text-[8px] font-black px-2 py-0.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 uppercase shrink-0">{p}</span>
            ))}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-50 rounded-xl transition-all">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deal Maturity</p>
            <p className="text-xl font-black text-blue-600 leading-none">{deal.value}</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Action Date</p>
             <div className={`flex items-center gap-2 text-[10px] font-black ${
              deal.deadlineColor === 'red' ? 'text-rose-600' : 
              deal.deadlineColor === 'yellow' ? 'text-amber-600' : 'text-emerald-600'
            }`}>
               <Calendar className="w-3.5 h-3.5" /> {deal.deadline}
             </div>
          </div>
        </div>

        {deal.status === 'negotiating' && (
          <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center gap-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <p className="text-[9px] font-bold text-blue-700/80">AI Insight: Data suggests a 12% rate increase is viable.</p>
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center pointer-events-none group-active:opacity-0">
         <div className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-xl pointer-events-auto active:scale-95 transition-all">
            Open Deal Workspace
         </div>
      </div>
    </motion.div>
  );

  const renderPipeline = () => (
    <div className="space-y-8">
      {/* Search & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">Brand <span className="text-blue-600">Partnerships</span></h2>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Pipeline: <span className="text-slate-900">₹ 2,45,000</span></p>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] shadow-sm">3 High Velocity</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search brands or deals..." className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-inner" />
          </div>
          <button onClick={() => setIsAddDealOpen(true)} className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10">
            <Plus className="w-4 h-4" /> Secure New Deal
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
              <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                  <span className={col.color}>{col.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900">{col.label}</span>
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-slate-50 text-slate-500 border border-slate-100">
                  {colDeals.length}
                </span>
              </div>

              <div className={`flex flex-col gap-5 p-3 rounded-[3rem] min-h-[300px] transition-colors ${colDeals.length === 0 ? 'bg-slate-50/50 border-2 border-dashed border-slate-100' : ''}`}>
                <AnimatePresence mode="popLayout">
                  {colDeals.map(renderKanbanCard)}
                </AnimatePresence>
                
                <button 
                   onClick={() => setIsAddDealOpen(true)}
                   className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-300 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center group"
                >
                  <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
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
            className="group bg-white border border-slate-200 rounded-[3rem] p-10 transition-all flex flex-col shadow-sm hover:shadow-xl hover:border-blue-300"
          >
            <div className="flex items-start justify-between mb-10">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-50 p-3 border border-slate-100 shadow-inner">
                 <img src={brand.logo} alt="" className="w-full h-full object-contain rounded-xl" />
              </div>
              <button className="p-4 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-2xl transition-all shadow-sm text-slate-400">
                 <Mail className="w-5 h-5" />
              </button>
            </div>
            <h4 className="text-2xl font-black tracking-tighter uppercase text-slate-900">{brand.name}</h4>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">{brand.cat}</span>
            <div className="mt-10">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-2">Avg Partnership Value</span>
               <span className="text-2xl font-black text-blue-600 tracking-tight">{brand.budget}</span>
            </div>
            <button className="w-full mt-12 py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-95">
               Engage with AI Proposal
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <PageTransition className="p-4 md:p-12 space-y-12 max-w-[1700px] mx-auto pb-32">
      <div className="flex items-center gap-10 border-b border-slate-100">
        <button onClick={() => setActiveTab('pipeline')} className={`pb-6 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'pipeline' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
          Deal Pipeline 
          {activeTab === 'pipeline' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('discovery')} className={`pb-6 text-[11px] font-black uppercase tracking-[0.2em] relative transition-all ${activeTab === 'discovery' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
          Partner Discovery 
          {activeTab === 'discovery' && <motion.div layoutId="dealTab" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
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
          <BottomSheet isOpen={true} onClose={() => setSelectedDeal(null)} title="Deal Workspace" height="90vh">
             <div className="space-y-10 pt-8 pb-32">
                <div className="flex items-center gap-8">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 p-4 border border-slate-100 shrink-0 shadow-inner">
                      <img src={selectedDeal.logo} alt="" className="w-full h-full object-contain rounded-2xl" />
                   </div>
                   <div>
                      <h3 className="text-4xl font-black tracking-tight uppercase text-slate-900">{selectedDeal.brand}</h3>
                      <div className="flex items-center gap-3 mt-2">
                         <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{selectedDeal.type}</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created 4 days ago</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Partnership Value</p>
                      <p className="text-4xl font-black text-blue-600 leading-none">{selectedDeal.value}</p>
                   </div>
                   <div className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Campaign ROI</p>
                      <p className="text-3xl font-black leading-none text-slate-900">4.2x <span className="text-xs uppercase text-emerald-500 font-bold ml-1">+12%</span></p>
                   </div>
                </div>

                <div className="space-y-6">
                   <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3">
                     <Zap className="w-4 h-4 text-blue-600" /> AI Accelerator Hub
                   </h5>
                   <div className="grid grid-cols-1 gap-5">
                      <button 
                        onClick={() => handleWritePitch(selectedDeal)}
                        className="group flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[3rem] hover:border-blue-400 transition-all shadow-sm group"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
                               <Sparkles className="w-7 h-7 text-blue-600" />
                            </div>
                            <div className="text-left">
                               <p className="text-md font-black uppercase text-slate-900 tracking-tight">AI Proposal Engine</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Generate high-conversion response</p>
                            </div>
                         </div>
                         <ArrowRight className="w-6 h-6 text-blue-600 transition-transform group-hover:translate-x-2" />
                      </button>

                      <button 
                        onClick={() => setIsInvoiceOpen(true)}
                        className="group flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[3rem] hover:border-blue-400 transition-all shadow-sm"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                               <FileText className="w-7 h-7 text-slate-400" />
                            </div>
                            <div className="text-left">
                               <p className="text-md font-black uppercase text-slate-900 tracking-tight">Financial Suite</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Auto-calculated GST & Smart Invoicing</p>
                            </div>
                         </div>
                         <ArrowRight className="w-6 h-6 text-slate-400 transition-transform group-hover:translate-x-2" />
                      </button>

                      <button 
                        onClick={() => updateDealStatus(selectedDeal.id, 'paid')}
                        className="group flex items-center justify-between p-8 bg-emerald-50 border border-emerald-100 rounded-[3rem] hover:bg-emerald-100 transition-all shadow-sm"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                               <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div className="text-left">
                               <p className="text-md font-black uppercase text-emerald-900 tracking-tight">Mark as Completed</p>
                               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mt-1">Finalize deal & trigger celebration</p>
                            </div>
                         </div>
                         <CheckCircle2 className="w-6 h-6 text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" />
                      </button>
                   </div>
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                   <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Campaign Timeline</h5>
                   <div className="space-y-8 ml-5 border-l-2 border-slate-100 pl-10 relative">
                      {[
                        { icon: Plus, text: "Partnership initiated by AI Radar", time: "2h ago", color: "bg-blue-600" },
                        { icon: Mail, text: "Custom proposal delivered to brand", time: "1h ago", color: "bg-slate-900" },
                        { icon: History, text: "Contract signed & secured", time: "45m ago", color: "bg-emerald-600" },
                      ].map((item, i) => (
                        <div key={i} className="relative">
                           <div className={cn("absolute -left-[58px] top-0 w-10 h-10 rounded-2xl flex items-center justify-center border border-white shadow-md", item.color)}>
                              <item.icon className="w-4 h-4 text-white" />
                           </div>
                           <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.text}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{item.time}</p>
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
          <div className="space-y-8 pt-10 pb-20">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Brand Designation</label>
              <input name="brand" required className="w-full h-16 bg-slate-50 border border-slate-200 rounded-3xl px-6 transition-all focus:ring-2 focus:ring-blue-100 font-bold text-slate-900 shadow-inner" placeholder="e.g. Red Bull India" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Total Contract Value (INR)</label>
              <input name="value" type="number" required className="w-full h-16 bg-slate-50 border border-slate-200 rounded-3xl px-6 transition-all focus:ring-2 focus:ring-blue-100 font-black text-2xl text-blue-600 shadow-inner" placeholder="50,000" />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Initial Pipeline Stage</label>
              <select name="status" className="w-full h-16 bg-slate-50 border border-slate-200 rounded-3xl px-6 appearance-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-900 shadow-inner">
                {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full h-20 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all mt-10 active:scale-95">
              Secure & Log Partnership
            </button>
          </div>
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
