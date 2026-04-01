import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, AlertCircle, FileText, CheckCircle2, Zap, ArrowRight, Gavel, FileSearch } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";
import { toast } from "../ui/sonner";

interface AuditFlag {
  level: 'red' | 'yellow' | 'green';
  title: string;
  desc: string;
  clause: string;
  recommendation: string;
}

interface ContractAuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  riskScore: number;
  flags: AuditFlag[];
}

export const ContractAuditDrawer = ({ isOpen, onClose, brandName, riskScore, flags }: ContractAuditDrawerProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Deep AI Audit Report" height="90vh">
      <div className="space-y-8 pt-4 pb-12">
        {/* Header / Score */}
        <div className="flex flex-col md:flex-row gap-6 items-center bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
           <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full -rotate-90">
                 <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                 <motion.circle 
                    cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                    className={riskScore > 60 ? "text-rose-500" : riskScore > 30 ? "text-amber-500" : "text-emerald-500"}
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - riskScore / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                 />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl italic text-white">{riskScore}%</div>
           </div>
           <div className="text-center md:text-left space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tight italic">{brandName} Shield Report</h3>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                 Our AI scanned 14 pages and identified <span className="text-white">{flags.length} potential friction points</span>. 
                 Overall risk is <span className={riskScore > 60 ? "text-rose-500" : riskScore > 30 ? "text-amber-500" : "text-emerald-500"}>
                    {riskScore > 60 ? "HIGH" : riskScore > 30 ? "MEDIUM" : "LOW"}
                 </span>.
              </p>
           </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-primary" /> Clause-by-Clause Analysis
           </h4>
           
           <div className="space-y-4">
              {flags.map((f, i) => (
                <div key={i} className={`p-6 rounded-[2rem] border transition-all ${
                  f.level === 'red' ? 'bg-rose-500/5 border-rose-500/20' : 
                  f.level === 'yellow' ? 'bg-amber-500/5 border-amber-500/20' : 
                  'bg-emerald-500/5 border-emerald-500/20'
                }`}>
                   <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${
                           f.level === 'red' ? 'bg-rose-500' : 
                           f.level === 'yellow' ? 'bg-amber-500' : 
                           'bg-emerald-500'
                         }`} />
                         <span className="text-xs font-black uppercase italic text-white">{f.title}</span>
                      </div>
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Sec {f.clause}</span>
                   </div>
                   <p className="text-[11px] font-medium text-white/60 leading-relaxed mb-4">{f.desc}</p>
                   
                   <div className="bg-black/40 rounded-2xl p-4 border border-white/5 space-y-2">
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                         <Zap className="w-3 h-3" /> AI Recommendation
                      </span>
                      <p className="text-[11px] font-bold text-white italic">"{f.recommendation}"</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Final Action */}
        <div className="p-8 rounded-[2.5rem] bg-primary/10 border border-primary/20 text-center space-y-6">
           <ShieldCheck className="w-10 h-10 text-primary mx-auto" />
           <div className="space-y-2">
              <h5 className="text-xl font-black uppercase italic tracking-tight italic">Ready to Sign?</h5>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-xs mx-auto">
                 We recommend negotiating the <span className="text-rose-400">Section 8.4 exclusivity</span> before final signature.
              </p>
           </div>
           <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  toast.success("Audit Exported", { description: "Report shared to your email." });
                  onClose();
                }}
                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                 Export Report
              </button>
              <button 
                onClick={() => {
                  toast.success("Ready to Sign!", { description: "Opening signature module..." });
                  onClose();
                }}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                 Approve & Sign
              </button>
           </div>
        </div>
      </div>
    </BottomSheet>
  );
};
