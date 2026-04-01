import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, 
  FileText, Upload, Download, Search, 
  HelpCircle, ChevronRight, FileSearch, 
  ExternalLink, MessageSquare, RefreshCcw, 
  Gavel, Info, ShieldAlert, Check, Share2, Printer, Sparkles
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { PageTransition } from "../../components/shared/MotionComponents";
import { db } from "../../lib/db";
import jsPDF from "jspdf";
import { toast } from "../../components/ui/sonner";
import { ContractAuditDrawer } from "../../components/dashboard/ContractAuditDrawer";
import { BottomSheet } from "../../components/ui/BottomSheet";

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

export const Contracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeFlag, setActiveFlag] = useState<any>(null);
  const [counterClause, setCounterClause] = useState("");

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
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    toast.info("Uploading Contract PDF...", {
      description: "AI is initializing analysis engine."
    });

    let p = 0;
    const iv = setInterval(() => {
      p += 2;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(iv);
        setIsUploading(false);
        const newContract: Contract = {
          id: `con_${Math.random().toString(36).substr(2, 5)}`,
          brand: 'Samsung Global',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          value: '₹ 1,20,000',
          risk: 'high',
          content: 'Analysis shows significant Red Flags in Clause 4.2 (Exclusivity) and Clause 9.1 (Perpetual Usage Rights). Recommendation: Request 24-month cap on usage.',
          flags: [
            { level: 'red', title: 'Perpetual Usage', desc: 'Brand owns your content forever across all media. This is a high-risk standard clause.', clause: '9.1' },
            { level: 'red', title: 'Global Exclusivity', desc: 'Prevents you from working with ANY tech brand worldwide for 18 months.', clause: '4.2' },
            { level: 'yellow', title: 'Net-90 Payment', desc: '90-day wait for payment. Standard is Net-30.', clause: '11.5' },
            { level: 'green', title: 'Kill Fee', desc: '75% fee protected if brand cancels late.', clause: '15.2' }
          ]
        };
        db.insert('contracts', newContract);
        setContracts(prev => [newContract, ...prev]);
        setSelectedId(newContract.id);
        toast.success("AI Audit Complete!", {
          description: "2 high-risk clauses identified. Reviewing now."
        });
      }
    }, 50);
  };

  const handleExport = (type: 'summary' | 'redlined') => {
    const selectedContract = contracts.find((c: Contract) => c.id === selectedId) || contracts[0];
    if (!selectedContract) return;

    toast.info(`Generating ${type} PDF...`);
    setTimeout(() => {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(255, 60, 172);
      doc.text("CREATORFORGE LEGAL SHIELD", 14, 20);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`${type.toUpperCase()} REPORT: ${selectedContract.brand}`, 14, 35);
      
      doc.setFontSize(10);
      doc.text("Risk Score: " + (selectedContract.risk === 'high' ? 'HIGH (85/100)' : 'MEDIUM (42/100)'), 14, 45);
      
      let y = 60;
      selectedContract.flags.forEach(f => {
        doc.setFontSize(11);
        doc.setTextColor(f.level === 'red' ? 220 : 0, 0, 0);
        doc.text(`[${f.level.toUpperCase()}] ${f.title} (Clause ${f.clause})`, 14, y);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(f.desc, 14, y + 5, { maxWidth: 180 });
        y += 20;
      });
      
      doc.save(`${selectedContract.brand}_${type}_Audit.pdf`);
      toast.success(`${type} PDF Saved!`);
    }, 1500);
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
           <button 
             onClick={handleUpload} 
             disabled={isUploading}
             className="w-full h-14 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex flex-col items-center justify-center gap-1 hover:bg-primary hover:text-white transition-all transition-colors duration-300 relative overflow-hidden group"
           >
              {isUploading ? (
                <>
                  <div className="absolute inset-0 bg-primary/20 transition-all" style={{ width: `${uploadProgress}%` }} />
                  <span className="relative z-10 flex items-center gap-2 pt-2"><RefreshCcw className="w-4 h-4 animate-spin" /> Uploading {uploadProgress}%</span>
                </>
              ) : (
                <span className="flex items-center gap-3">
                   <Upload className="w-4 h-4" /> Upload New Doc
                </span>
              )}
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

                 <div className="prose prose-invert max-w-none text-white/60 font-medium leading-[1.8] space-y-6 text-sm relative">
                    {isUploading && (
                      <motion.div 
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-x-0 h-0.5 bg-primary/50 shadow-[0_0_15px_rgba(255,60,172,0.8)] z-10"
                      />
                    )}
                    <p>...Clause 1.2: The Creator represents and warrants that they have the legal right to enter into this Agreement and perform the Services described herein...</p>
                    <p className={`p-6 rounded-2xl border-l-4 relative overflow-hidden ${selectedContract.risk === 'high' ? 'bg-rose-500/10 border-rose-500' : 'bg-amber-500/10 border-amber-500'}`}>
                       {isUploading && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-pulse flex items-center justify-center font-black text-[10px] text-primary">ANALYSING CLAUSE...</div>}
                       <span className="block text-[10px] font-black uppercase mb-3 text-white">AI ALERT: RESTRICTIVE COVENANT DETECTED</span>
                       {selectedContract.content}
                    </p>
                    <p>...Clause 15.1: This Agreement shall be governed by and construed in accordance with the laws of the Republic of India...</p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-white/5 mt-10">
                    <button 
                      onClick={() => handleExport('summary')}
                      className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                       <Download className="w-4 h-4" /> Export Summary
                    </button>
                    <button 
                       onClick={() => handleExport('redlined')}
                       className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                       <ShieldAlert className="w-4 h-4" /> Redlined PDF
                    </button>
                    <button 
                      onClick={() => setIsAuditOpen(true)}
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
                             onClick={() => {
                                setActiveFlag(f);
                                setCounterClause("");
                                setShowCounterModal(true);
                                toast.promise(new Promise(res => setTimeout(() => res("Creator and Brand agree that the non-compete shall be limited strictly to " + (user?.niche || 'Fitness') + " supplements and shall not apply to generic apparel or standard fitness equipment."), 2000)), {
                                  loading: 'AI drafting counter-clause...',
                                  success: (data: any) => { setCounterClause(data); return "Counter-clause ready!"; },
                                  error: 'Drafting failed.'
                                });
                             }}
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

       <ContractAuditDrawer 
          isOpen={isAuditOpen} 
          onClose={() => setIsAuditOpen(false)} 
          brandName={selectedContract.brand} 
          riskScore={selectedContract.risk === 'high' ? 88 : selectedContract.risk === 'medium' ? 45 : 12}
          flags={selectedContract.flags.map(f => ({ ...f, recommendation: f.level === 'red' ? 'Request removal or shorter duration.' : 'Clarify payment portal details.' }))}
       />

       <BottomSheet isOpen={showCounterModal} onClose={() => setShowCounterModal(false)} title="AI Counter-Proposal" height="auto">
           <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block">Original Clause (High Risk)</span>
                    <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-2xl min-h-[120px] text-xs font-bold text-white/50 italic leading-relaxed">
                       {activeFlag?.clause === '9.1' ? 'Brand owns your content forever across all media. This is a high-risk standard clause.' : 'The Creator shall not promote, represent, or be seen using any competing tech brand worldwide for 18 months.'}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Creator-Friendly Suggestion</span>
                       <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    </div>
                    <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl min-h-[120px] flex items-center justify-center">
                       {counterClause ? (
                         <p className="text-xs font-bold leading-relaxed text-white italic">"{counterClause}"</p>
                       ) : (
                         <div className="flex flex-col items-center gap-2">
                           <RefreshCcw className="w-6 h-6 animate-spin text-zinc-600" />
                           <span className="text-[9px] font-black text-zinc-600 uppercase">Drafting Pro-Creator terms...</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl space-y-2">
                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" /> Strategy Note
                 </span>
                 <p className="text-[11px] font-bold text-white/60 leading-relaxed">
                    By limiting the usage duration to 24 months, you retain future asset value and licensing potential.
                 </p>
              </div>

              <div className="flex gap-3">
                 <button 
                    onClick={() => {
                       navigator.clipboard.writeText(counterClause);
                       toast.success("Counter-clause copied!");
                    }}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all font-black"
                 >
                    Copy Clause
                 </button>
                 <button 
                    onClick={() => {
                       toast.success("Sending to Brand...", { description: "Counter-clause sent as feedback." });
                       setShowCounterModal(false);
                    }}
                    className="flex-1 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                 >
                    Send Proposal
                 </button>
              </div>
           </div>
       </BottomSheet>
    </PageTransition>
  );
};
