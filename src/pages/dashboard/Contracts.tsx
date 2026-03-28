import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, 
  FileText, Upload, Download, Search, 
  HelpCircle, ChevronRight, FileSearch, 
  ExternalLink, MessageSquare, RefreshCcw, 
  Gavel, Info, ShieldAlert, Check, Share2, Printer
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { db } from "../../lib/db";
import { toast } from "../../components/ui/sonner";

type RiskLevel = 'low' | 'medium' | 'high';

interface Contract {
  id: string;
  brand: string;
  date: string;
  value: string;
  risk: RiskLevel;
  content: string;
  flags: { level: 'red' | 'yellow' | 'green'; title: string; desc: string; clause: string }[];
}

const mockContracts: Contract[] = [
  { 
    id: '1', 
    brand: 'Decathlon India', 
    date: '15 Mar 2025', 
    value: '₹ 75,000', 
    risk: 'high', 
    content: '...Clause 8.4: The Creator shall not promote, represent, or be seen using any competing gym-wear or athletic footwear brand for a period of 12 months from the date of this agreement. This exclusivity is worldwide...',
    flags: [
      { level: 'red', title: 'Severe Exclusivity', desc: '12-month lock-in for all athletic footwear. This prevents Nike/Puma deals.', clause: '8.4' },
      { level: 'yellow', title: 'Usage Rights', desc: 'Perpetual digital usage for social ads. Counter: Request 24-month cap.', clause: '3.2' },
      { level: 'green', title: 'Kill Fee', desc: '50% fee if brand cancels after filming begins.', clause: '12.1' },
    ]
  },
  { 
    id: '2', 
    brand: 'MuscleBlaze', 
    date: '10 Mar 2025', 
    value: '₹ 35,000', 
    risk: 'medium', 
    content: '...Section 5.1: Payment for services shall be rendered within Net-60 days following the verification of live content and submission of a valid tax invoice...',
    flags: [
      { level: 'yellow', title: 'Payment Terms (Net-60)', desc: 'Payout is 60 days after live date. Try negotiating for Net-30.', clause: '5.1' },
      { level: 'red', title: 'Unlimited Revisions', desc: 'Brand can request "any number of edits" until satisfied. Risky.', clause: '6.2' },
    ]
  },
  { 
    id: '3', 
    brand: 'Fittr App', 
    date: '01 Mar 2025', 
    value: '₹ 42,000', 
    risk: 'low', 
    content: '...Standard sponsorship agreement for YouTube integration. Non-exclusive. Net-15 payment terms...',
    flags: [
      { level: 'green', title: 'Creator Friendly', desc: 'Net-15 payment and no exclusivity. Safe to sign.', clause: '4.1' },
    ]
  },
];

export const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = db.getAll<Contract>('contracts');
      setContracts(data);
      if (data.length > 0 && !selectedId) {
        setSelectedId(data[0].id);
      }
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = () => {
    toast.info("Opening File Picker...", {
      description: "Select your contract PDF for AI analysis."
    });
    // Simulate upload success after 2s
    setTimeout(() => {
      const newContract: Contract = {
        id: `con_${Math.random().toString(36).substr(2, 5)}`,
        brand: 'New Brand Deal',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        value: '₹ 0',
        risk: 'low',
        content: 'Analysis pending...',
        flags: []
      };
      db.insert('contracts', newContract);
      setContracts(prev => [newContract, ...prev]);
      setSelectedId(newContract.id);
      toast.success("Contract Uploaded!", {
        description: "AI Audit is now running on your new document."
      });
    }, 2000);
  };

  const selectedContract = contracts.find((c: Contract) => c.id === selectedId) || contracts[0];

  if (isLoading && contracts.length === 0) {
    return <div className="h-full flex items-center justify-center"><RefreshCcw className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!selectedContract) return null;

  return (
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="mb-[var(--section-mb)] flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
            <ShieldCheck className="w-3 h-3" />
            Legal Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
             Contract<br/>
             <span className="text-primary italic">Shield</span>
          </h1>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Sidebar / Top Section */}
        <div className="space-y-6">
           <button onClick={handleUpload} className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all transition-colors duration-300">
              <Upload className="w-4 h-4" /> Upload New Doc
           </button>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Documents</h4>
               <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-hidden no-scrollbar gap-3 pb-2 lg:pb-0 -mx-[var(--page-px)] px-[var(--page-px)] lg:mx-0 lg:px-0">
                   {contracts.map((c) => (
                    <motion.div 
                      key={c.id} 
                      onClick={() => setSelectedId(c.id)} 
                      className={`shrink-0 w-[240px] lg:w-full p-5 rounded-[2rem] border transition-all cursor-pointer group ${selectedId === c.id ? 'bg-white/5 border-primary/40 shadow-xl' : 'bg-transparent border-white/5 hover:border-white/20'}`}
                    >
                       <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-black text-white line-clamp-1">{c.brand}</span>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${c.risk === 'low' ? 'bg-emerald-500' : c.risk === 'medium' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black text-muted-foreground uppercase">
                          <span>{c.date}</span>
                          <span>{c.value}</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-5 gap-8">
           <div className="xl:col-span-3 space-y-8">
              <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-8 relative">
                 <div className="space-y-2 border-b border-white/5 pb-8">
                    <h2 className="text-2xl font-black tracking-tight">{selectedContract.brand} Participation Agreement</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Analysed by CreatorForge AI • {selectedContract.date}</p>
                 </div>

                 <div className="prose prose-invert max-w-none text-white/60 font-medium leading-[1.8] space-y-6 text-sm">
                    <p>...Clause 1.2: The Creator represents and warrants that they have the legal right to enter into this Agreement and perform the Services described herein...</p>
                    <p className={`p-6 rounded-2xl border-l-4 ${selectedContract.risk === 'high' ? 'bg-rose-500/10 border-rose-500' : 'bg-amber-500/10 border-amber-500'}`}>
                       <span className="block text-[10px] font-black uppercase mb-3 text-white">AI ALERT: RESTRICTIVE COVENANT DETECTED</span>
                       {selectedContract.content}
                    </p>
                    <p>...Clause 15.1: This Agreement shall be governed by and construed in accordance with the laws of the Republic of India...</p>
                 </div>
                                  <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5 mt-10">
                    <button 
                      onClick={() => toast.success("PDF Downloaded", { description: "Your safe copy is saved." })}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                       <Download className="w-4 h-4" /> Download PDF
                    </button>
                    <button 
                      onClick={() => toast.info("Deep Audit Running", { description: "Refining AI context for specific risky clauses..." })}
                      className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
                    >
                       <FileSearch className="w-4 h-4" /> Deep Audit
                    </button>
                 </div>
              </div>
           </div>

           <div className="xl:col-span-2 space-y-8">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" /> Risk Intelligence
                 </h3>
                 
                 <div className="space-y-4">
                    {selectedContract.flags.map((f, i) => (
                      <div key={i} className={`p-6 rounded-[2rem] border transition-all ${f.level === 'red' ? 'bg-rose-500/10 border-rose-500/30' : f.level === 'yellow' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                         <div className="flex justify-between items-start mb-2">
                            <h4 className={`text-xs font-black uppercase ${f.level === 'red' ? 'text-rose-500' : f.level === 'yellow' ? 'text-amber-500' : 'text-emerald-500'}`}>{f.title}</h4>
                            <span className="text-[8px] font-black text-white/20 uppercase">Clause {f.clause}</span>
                         </div>
                         <p className="text-[11px] font-bold text-white/70 leading-relaxed mb-4">{f.desc}</p>
                         <button 
                            onClick={() => toast.promise(new Promise(res => setTimeout(res, 2000)), {
                              loading: 'AI rewriting clause...',
                              success: 'Modified clause copied to clipboard!',
                              error: 'Failure generating rewrite.'
                            })}
                            className="w-full py-3 bg-black/40 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                         >
                            {f.level === 'red' ? 'Generate Counter-Clause' : 'More Context'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 text-center space-y-4">
                 <Gavel className="w-8 h-8 text-indigo-400 mx-auto" />
                 <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Legal Review Package</h5>
                 <p className="text-[11px] font-bold text-white/60 leading-relaxed">
                    Get this document reviewed by an actual human lawyer specializing in influencer law for ₹8,999.
                 </p>
                  <button 
                    onClick={() => toast.info("Legal Inquiry Sent", { description: "A lawyer will contact you in the next 4 hours." })}
                    className="w-full py-4 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-500/20 uppercase"
                  >
                    Talk to a Lawyer
                  </button>
              </div>
           </div>
        </div>
      </div>
    </PageTransition>
  );

};
