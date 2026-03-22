import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, 
  FileText, Upload, Download, Search, 
  HelpCircle, ChevronRight, FileSearch, 
  ExternalLink, MessageSquare, RefreshCcw, 
  Gavel, Info, ShieldAlert, Check, Share2
} from "lucide-react";

type RiskLevel = 'low' | 'medium' | 'high';

interface Contract {
  id: string;
  brand: string;
  date: string;
  value: string;
  risk: RiskLevel;
  content: string;
}

const mockContracts: Contract[] = [
  { id: '1', brand: 'Nike', date: '12 Jan 2026', value: '₹ 45k', risk: 'low', content: 'This agreement is between Nike Inc. and Creator. Clause 4.2 states that usage rights are limited to 12 months on Instagram.' },
  { id: '2', brand: 'Adobe', date: '05 Feb 2026', value: '₹ 15k', risk: 'medium', content: 'Adobe Creative Cloud Licensing Agreement. Net-60 payment terms. Unlimited digital usage for 24 months.' },
  { id: '3', brand: 'Samsung', date: '28 Feb 2026', value: '₹ 85k', risk: 'high', content: 'Samsung Galaxy Series S24 Promo. Unlimited usage in perpetuity. Exclusivity across all tech categories for 12 months.' },
];

export const Contracts = () => {
  const [selectedId, setSelectedId] = useState<string>('1');
  const [isAnalysing, setIsAnalysing] = useState(false);

  const selectedContract = mockContracts.find(c => c.id === selectedId) || mockContracts[0];

  const handleUpload = () => {
    setIsAnalysing(true);
    setTimeout(() => setIsAnalysing(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -mx-8 -my-6 overflow-hidden">
      {/* LEFT — CONTRACT LIBRARY */}
      <div className="w-[380px] border-r border-border/30 bg-card/10 overflow-y-auto p-8 space-y-10 no-scrollbar">
         <div className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
               <ShieldCheck className="w-6 h-6 text-primary" /> Contract Library
            </h2>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <input placeholder="Search contracts..." className="w-full h-12 bg-muted/10 border border-border/40 rounded-2xl pl-10 pr-4 text-xs focus:outline-none" />
            </div>
            <button 
              onClick={handleUpload}
              className="w-full py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all shadow-sm"
            >
               <Upload className="w-4 h-4" /> Upload New Contract
            </button>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent Documents</h4>
            <div className="space-y-3">
               {mockContracts.map((c) => (
                 <motion.div 
                   key={c.id} 
                   onClick={() => setSelectedId(c.id)}
                   className={`p-5 rounded-[2rem] border transition-all cursor-pointer group ${
                     selectedId === c.id ? 'bg-card border-primary/40 shadow-xl' : 'bg-muted/5 border-border/40 hover:border-primary/20'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-sm font-black text-foreground">{c.brand}</span>
                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-current/20 ${
                         c.risk === 'low' ? 'bg-emerald-500/5 text-emerald-500' : 
                         c.risk === 'medium' ? 'bg-amber-500/5 text-amber-500' : 
                         'bg-rose-500/5 text-rose-500'
                       }`}>
                          {c.risk} Risk
                       </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                       <span>{c.date}</span>
                       <span>{c.value}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Download Templates</h4>
            <div className="grid grid-cols-1 gap-2">
               {['Standard Collab', 'UGC Agreement', 'Affiliate Terms', 'NDA Template'].map(t => (
                 <button key={t} className="w-full py-3 px-4 bg-muted/10 border border-border/30 rounded-xl text-[10px] font-bold text-left hover:bg-muted/30 flex justify-between items-center transition-all">
                    {t} <Download className="w-3.5 h-3.5 opacity-40" />
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* RIGHT — CONTRACT ANALYSER WORKSPACE */}
      <div className="flex-1 overflow-y-auto bg-muted/5 p-12 relative no-scrollbar">
         {isAnalysing ? (
           <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-[2.5rem] bg-primary/10 flex items-center justify-center relative">
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-[2.5rem]" />
                 <FileSearch className="w-8 h-8 text-primary" />
              </div>
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tight">AI Analysing Clauses...</h3>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">Checking for 142 distinct legal risks & compliance markers</p>
              </div>
           </div>
         ) : (
           <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 space-y-8">
                 <div className="bg-card border border-border/40 rounded-[2.5rem] p-10 shadow-2xl space-y-10 min-h-[600px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 pt-6 pointer-events-none">
                       <ShieldCheck className="w-32 h-32 text-emerald-500 opacity-[0.03] -rotate-12" />
                    </div>
                    
                    <div className="space-y-2 border-b border-border/20 pb-8">
                        <h1 className="text-3xl font-black tracking-tight">{selectedContract.brand} Participation Agreement</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Document ID: CF-{selectedId}-2026</p>
                    </div>

                    <div className="prose prose-sm max-w-none text-foreground/80 font-medium leading-[1.8] space-y-8">
                       <p>Section 1: The Parties agree that the Creator will produce three (3) high-fidelity video assets for the Campaign.</p>
                       <p className="bg-rose-500/5 border-l-4 border-rose-500 pl-6 py-4 rounded-r-2xl">
                          <span className="block text-[10px] font-black uppercase text-rose-500 mb-2">Annotation Group ID: 4.2</span>
                          Clause 4.2: Creator hereby grants Brand a non-exclusive, world-wide, <span className="text-rose-600 font-black">unlimited license in perpetuity</span> to use the content across all known and unknown media channels.
                       </p>
                       <p>Section 5: Payment shall be rendered within <span className="text-amber-600 font-black">Net-60 days</span> of campaign completion and receipt of final invoice from Creator.</p>
                       <p className="bg-emerald-500/5 border-l-4 border-emerald-500 pl-6 py-4 rounded-r-2xl">
                          <span className="block text-[10px] font-black uppercase text-emerald-500 mb-2">Annotation Group ID: 7.1</span>
                          Clause 7.1: A kill fee of 50% shall be due to Creator if the Brand cancels the campaign after the start of production.
                       </p>
                       <p>Section 8: Creator must include #ad or #sponsored in the first three lines of the caption for all campaign-related posts.</p>
                    </div>
                    
                    <div className="flex gap-4 pt-10 border-t border-border/20 mt-10">
                       <button className="flex-1 py-4 bg-muted/10 border border-border/40 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                          <Printer className="w-4 h-4" /> Print PDF
                       </button>
                       <button className="flex-1 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all">
                          <Share2 className="w-4 h-4" /> Share Summary
                       </button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                 <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 px-2">
                       <ShieldAlert className="w-4 h-4 text-rose-500" /> AI Flags & Risks
                    </h3>
                    
                    <div className="space-y-4">
                       {[
                         { level: 'red', title: 'Unlimited Usage Rights', desc: 'Usage is "in perpetuity". Counter-proposal: Limit to 12 months & specific platforms.', clause: '4.2' },
                         { level: 'yellow', title: 'Payment Terms (Net-60)', desc: 'Industry standard is Net-30. Higher risk of cashflow issues.', clause: '5.1' },
                         { level: 'green', title: 'Kill Fee Protection', desc: '50% fee present. This protects you if brand cancels mid-way.', clause: '7.1' },
                       ].map(f => (
                         <div key={f.title} className={`p-6 rounded-[2rem] border transition-all ${
                           f.level === 'red' ? 'bg-rose-500/5 border-rose-500/30' : 
                           f.level === 'yellow' ? 'bg-amber-500/5 border-amber-500/30' : 
                           'bg-emerald-500/5 border-emerald-500/30'
                         }`}>
                            <div className="flex justify-between items-start mb-2">
                               <h4 className={`text-xs font-black uppercase truncate pr-4 ${
                                 f.level === 'red' ? 'text-rose-500' : 
                                 f.level === 'yellow' ? 'text-amber-500' : 
                                 'text-emerald-500'
                               }`}>{f.title}</h4>
                               <span className="text-[9px] font-black opacity-40 uppercase">Clause {f.clause}</span>
                            </div>
                            <p className="text-[11px] font-medium leading-relaxed mb-4">{f.desc}</p>
                            <button className="w-full py-2 bg-background border border-border/40 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-muted transition-all">
                               {f.level === 'red' ? 'Rewrite Clause' : 'More Info'}
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-card border border-border/40 rounded-[2rem] p-8 shadow-xl space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4" /> FTC Compliance Check
                    </h4>
                    <div className="space-y-4">
                       {[
                         { label: 'Clear Disclosure (AD)', done: true },
                         { label: 'Above the fold text', done: true },
                         { label: 'Video watermark included', done: false },
                         { label: 'Gifted disclosure (if applicable)', done: true },
                       ].map(c => (
                         <div key={c.label} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${c.done ? 'bg-emerald-500 border-emerald-500' : 'border-border'}`}>
                               {c.done && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className={`text-[11px] font-bold ${c.done ? 'text-foreground' : 'text-muted-foreground opacity-50'}`}>{c.label}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <button className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                    <RefreshCcw className="w-5 h-5" /> Generate Counter-Proposal
                 </button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

const Printer = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
);
