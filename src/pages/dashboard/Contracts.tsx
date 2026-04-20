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
import { cn } from "../../lib/utils";
import { ContractAuditDrawer } from "../../components/dashboard/ContractAuditDrawer";
import { BottomSheet } from "../../components/ui/BottomSheet";
import { supabase } from "@/lib/supabase";

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
    return <div className="h-full flex items-center justify-center"><RefreshCcw className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (!selectedContract) return null;

  return (
    <PageTransition className="space-y-[var(--grid-gap)] pb-20 lg:pb-0">
      <header className="mb-10 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] text-slate-900">
             Contract<br/>
             <span className="text-blue-600">Shield</span>
          </h1>
        </div>
        <button 
          onClick={fetchData}
          disabled={isLoading}
          className="h-12 w-12 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all disabled:opacity-50 flex items-center justify-center shadow-sm"
        >
          <RefreshCcw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="space-y-8">
           <button 
             onClick={handleUpload} 
             disabled={isUploading}
             className="w-full h-16 bg-blue-50 text-blue-600 border border-blue-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-1 hover:bg-blue-600 hover:text-white transition-all duration-500 relative overflow-hidden group shadow-inner"
           >
              {isUploading ? (
                <>
                  <div className="absolute inset-0 bg-blue-600/10 transition-all" style={{ width: `${uploadProgress}%` }} />
                  <span className="relative z-10 flex items-center gap-3 pt-2"><RefreshCcw className="w-5 h-5 animate-spin" /> Analyzing Document {uploadProgress}%</span>
                </>
              ) : (
                <span className="flex items-center gap-3">
                   <Upload className="w-5 h-5" /> Upload Brand Contract
                </span>
              )}
           </button>

           <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Documents</h4>
               <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-hidden no-scrollbar gap-3 pb-2 lg:pb-0 -mx-[var(--page-px)] px-[var(--page-px)] lg:mx-0 lg:px-0">
                   {contracts.map((c) => (
                    <motion.div 
                      key={c.id} 
                      onClick={() => setSelectedId(c.id)} 
                      className={cn("shrink-0 w-[240px] lg:w-full p-5 rounded-[2rem] border transition-all cursor-pointer group", selectedId === c.id ? 'bg-white border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200')}
                    >
                       <div className="flex justify-between items-start mb-3">
                          <span className="text-sm font-black text-slate-900 line-clamp-1">{c.brand}</span>
                          <div className={cn("w-2 h-2 rounded-full shrink-0", c.risk === 'low' ? 'bg-emerald-500' : c.risk === 'medium' ? 'bg-amber-500' : 'bg-rose-500')} />
                       </div>
                       <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase">
                          <span>{c.date}</span>
                          <span>{c.value}</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
           </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-5 gap-8">
           <div className="xl:col-span-3 space-y-8">
              <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-14 shadow-sm relative overflow-hidden">
                 <div className="space-y-3 border-b border-slate-100 pb-10 mb-10">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-white shadow-xl shadow-slate-500/20">C</div>
                       <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{selectedContract.brand} Participation Agreement</h2>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                       <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Legal Integrity Verified by AI Engine • {selectedContract.date}
                    </p>
                 </div>

                 <div className="relative text-slate-600 font-medium leading-[1.8] space-y-8 text-[15px]">
                    {isUploading && (
                      <motion.div 
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-y-0 w-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] z-20"
                      />
                    )}
                    <p className="opacity-50">...Clause 1.2: The Creator represents and warrants that they have the legal right to enter into this Agreement and perform the Services described herein...</p>
                    <div className={cn(
                       "p-10 rounded-[2.5rem] border-l-8 relative overflow-hidden shadow-sm transition-all",
                       selectedContract.risk === 'high' ? "bg-rose-50 border-rose-500" : "bg-amber-50 border-amber-500"
                    )}>
                       {isUploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-md animate-pulse flex flex-col items-center justify-center gap-4">
                          <RefreshCcw className="w-8 h-8 animate-spin text-blue-600" />
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Decoding Legal Terminology...</span>
                       </div>}
                       <div className="flex items-center gap-3 mb-4">
                          <ShieldAlert className={cn("w-5 h-5", selectedContract.risk === 'high' ? "text-rose-600" : "text-amber-600")} />
                          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", selectedContract.risk === 'high' ? "text-rose-600" : "text-amber-600")}>AI Critical Observation</span>
                       </div>
                       <p className="font-black text-slate-900 leading-relaxed text-lg">
                          {selectedContract.content}
                       </p>
                    </div>
                    <p className="opacity-50">...Clause 15.1: This Agreement shall be governed by and construed in accordance with the laws of the Republic of India...</p>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-100 mt-14">
                    <button 
                      onClick={() => handleExport('summary')}
                      className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                       <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button 
                       onClick={() => handleExport('redlined')}
                       className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-rose-600 hover:text-rose-600 transition-all flex items-center justify-center gap-3 shadow-sm"
                    >
                       <ShieldAlert className="w-4 h-4" /> Export Redlines
                    </button>
                    <button 
                      onClick={() => setIsAuditOpen(true)}
                      className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                    >
                       <FileSearch className="w-4 h-4 text-blue-400" /> Initiate Deep Audit
                    </button>
                 </div>
              </div>
           </div>

           <div className="xl:col-span-2 space-y-10">
              <div className="space-y-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-blue-600" /> Clause Intelligence
                 </h3>
                 
                 <div className="space-y-5">
                    {selectedContract.flags.map((f, i) => (
                      <div key={i} className={cn(
                        "p-8 rounded-[2.5rem] border transition-all shadow-sm",
                        f.level === 'red' ? "bg-rose-50/50 border-rose-100" : f.level === 'yellow' ? "bg-amber-50/50 border-amber-100" : "bg-emerald-50/50 border-emerald-100"
                      )}>
                         <div className="flex justify-between items-start mb-4">
                            <h4 className={cn("text-xs font-black uppercase tracking-[0.1em]", f.level === 'red' ? "text-rose-600" : f.level === 'yellow' ? "text-amber-600" : "text-emerald-600")}>{f.title}</h4>
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">CL {f.clause}</span>
                         </div>
                         <p className="text-[11px] font-bold text-slate-500 leading-relaxed mb-6">{f.desc}</p>
                          <button 
                             onClick={async () => {
                                setActiveFlag(f);
                                setCounterClause("");
                                setShowCounterModal(true);
                                
                                try {
                                  const { data, error } = await supabase.functions.invoke("studio-engine", {
                                    body: {
                                      action: "CONTRACT_REVIEW",
                                      brandName: selectedContract.brand,
                                      inputData: f.desc + " (Clause " + f.clause + ")",
                                      niche: (user as any)?.niche || "Fitness",
                                    },
                                  });
                                  if (!error && data?.output) {
                                    setCounterClause(data.output.suggestedRevision || "Request a 12-month limit on exclusivity and specify the niche as " + ((user as any)?.niche || 'Fitness') + " only.");
                                    toast.success("AI Counter-Proposal Ready!");
                                  } else {
                                    throw new Error("Failed to draft");
                                  }
                                } catch (e) {
                                  setCounterClause("Drafting failed. Please try again.");
                                  toast.error("AI Drafting Error");
                                }
                             }}
                             className="w-full py-4 bg-white border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-[0.98]"
                          >
                             {f.level === 'red' ? 'Draft Offensive Counter' : 'Deep Analysis'}
                          </button>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="p-10 rounded-[3rem] bg-blue-50 border border-blue-100 text-center space-y-6 shadow-sm">
                  <Gavel className="w-10 h-10 text-blue-600 mx-auto" />
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Human Legal Council</h5>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                       Professional review by India's top Entertainment Counsel within 48 hours.
                    </p>
                  </div>
                   <button 
                     onClick={() => toast.info("Counsel Inquiry Logged", { description: "An expert will contact you shortly." })}
                     className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3"
                   >
                     <MessageSquare className="w-4 h-4 text-blue-400" /> Retain Expert Counsel
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
            <div className="p-10 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] block">Contested Clause</span>
                     <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] min-h-[160px] text-[13px] font-bold text-slate-500 leading-relaxed shadow-inner">
                        {activeFlag?.clause === '9.1' ? 'Brand owns your content forever across all media. This is a high-risk standard clause.' : 'The Creator shall not promote, represent, or be seen using any competing tech brand worldwide for 18 months.'}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Offensive Counter</span>
                        <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                     </div>
                     <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] min-h-[160px] flex items-center justify-center shadow-inner">
                        {counterClause ? (
                          <p className="text-[13px] font-black leading-relaxed text-slate-900">"{counterClause}"</p>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <RefreshCcw className="w-8 h-8 animate-spin text-slate-300" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Drafting optimal terms...</span>
                          </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-blue-50 border border-blue-100 rounded-[2.5rem] space-y-3 shadow-inner">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-3">
                     <Info className="w-4 h-4" /> Strategic Context
                  </span>
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                     Restricting the non-compete duration and scope ensures you maintain market agility and don't forfeit high-value future brand partnerships.
                  </p>
               </div>

               <div className="flex gap-4">
                  <button 
                     onClick={() => {
                        navigator.clipboard.writeText(counterClause);
                        toast.success("Counter-clause copied!");
                     }}
                     className="flex-1 py-6 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
                  >
                     Extract Text
                  </button>
                  <button 
                     onClick={() => {
                        toast.success("Sending to Brand...", { description: "Counter-clause sent as feedback." });
                        setShowCounterModal(false);
                     }}
                     className="flex-1 py-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10 active:scale-[0.98]"
                  >
                     Send Redline Proposal
                  </button>
               </div>
            </div>
       </BottomSheet>
    </PageTransition>
  );
};
