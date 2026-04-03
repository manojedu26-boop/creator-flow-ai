import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, TrendingUp, Clock, Calendar, BarChart3, PieChart, Calculator, FileText, Download, Send, CheckCircle2, AlertCircle, MoreHorizontal, ChevronDown, Sparkles, Plus, ArrowUpRight, ArrowDownRight, Printer, Share2, Trash2, Undo, RefreshCcw } from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { cn } from "../../lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../lib/db";
import { ConfirmationModal } from "../../components/shared/ConfirmationModal";
import { EmptyState } from "../../components/shared/EmptyState";
import { Briefcase } from "lucide-react";

const revenueData = [
  { month: 'Jan', brandDeals: 32000, affiliate: 8000, adsense: 2000 },
  { month: 'Feb', brandDeals: 45000, affiliate: 10000, adsense: 3000 },
  { month: 'Mar', brandDeals: 52000, affiliate: 11000, adsense: 5000 },
];

const RevenueChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <defs>
        <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF3CAC" stopOpacity={0.8}/>
          <stop offset="100%" stopColor="#FF3CAC" stopOpacity={0.4}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '20px', 
          border: '1px solid #e2e8f0', 
          backgroundColor: '#ffffff',
          fontWeight: 900,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }} 
      />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }} />
      <Bar dataKey="brandDeals" stackId="a" fill="#2563eb" name="Brand Deals" radius={[6, 6, 0, 0]} />
      <Bar dataKey="affiliate" stackId="a" fill="#4f46e5" name="Affiliate" />
      <Bar dataKey="adsense" stackId="a" fill="#94a3b8" name="AdSense" />
    </BarChart>
  </ResponsiveContainer>
));

export const Revenue = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = db.getAll('invoices');
      setInvoices(data);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkPaid = (id: string) => {
    const inv = invoices.find(i => i.id === id);
    if (inv?.status === 'Paid') return;

    db.update<any>('invoices', id, { status: 'Paid' });
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    toast.success("Payment Received!", {
      description: `Invoice for ${inv?.brand} marked as paid successfully.`
    });
  };

  const confirmDelete = () => {
    if (!isDeleting) return;
    db.delete('invoices', isDeleting);
    setInvoices(prev => prev.filter(inv => inv.id !== isDeleting));
    setIsDeleting(null);
    toast.success("Invoice Deleted", {
      description: "The invoice has been removed from your records."
    });
  };

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      <header className="space-y-2 flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            <IndianRupee className="w-3.5 h-3.5" />
            Strategic Finance
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9] text-slate-900 text-kinetic">
             Revenue <span className="text-blue-600">Command</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Revenue This Month', value: 68000, change: '+14%', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Outstanding Invoices', value: 60000, count: '2 Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'YTD Total', value: 168000, change: 'Jan-Mar', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Projected (30 Days)', value: 85000, subtitle: 'AI Estimate', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={staggerItem} className="premium-card bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all group">
               <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-inner`}>
                     <stat.icon className="w-6 h-6" />
                  </div>
                  {stat.change && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl tracking-widest">{stat.change}</span>}
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{stat.label}</p>
               <h3 className="text-3xl font-black tracking-tighter text-slate-900"><CountUp value={stat.value} prefix="₹ " /></h3>
               {stat.count && <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mt-3 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> {stat.count}</p>}
            </motion.div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 premium-card bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-10">Revenue <span className="text-blue-600">Dynamics</span></h3>
            <div className="h-[400px] w-full">
               <RevenueChart data={revenueData} />
            </div>
         </div>

         <div className="premium-card bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group hover:border-blue-200 transition-all">
            <div className="absolute top-0 right-0 p-10 text-blue-600/5 group-hover:text-blue-600/10 transition-colors">
               <Calculator className="w-40 h-40 rotate-12" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-3 relative z-10 text-slate-900">
               <Sparkles className="w-6 h-6 text-blue-600" />
               AI Rate Card
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 relative z-10">Algorithmic pricing for {user?.firstName}</p>
            
            <div className="space-y-4 relative z-10">
              {[
                { platform: 'IG Reel', range: '₹ 28K – ₹ 45K', up: true },
                { platform: 'IG Post', range: '₹ 18K – ₹ 28K' },
                { platform: 'IG Story (3x)', range: '₹ 9K – ₹ 15K' },
                { platform: 'YT Integration', range: '₹ 40K – ₹ 65K', up: true },
                { platform: 'TikTok Video', range: '₹ 18K – ₹ 30K' },
              ].map(r => (
                <div key={r.platform} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-white transition-all group/item shadow-inner hover:shadow-md">
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/item:text-slate-900 transition-colors">{r.platform}</span>
                      <div className="text-right">
                         <span className="text-sm font-black text-slate-900">{r.range}</span>
                         {r.up && <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mt-0.5">High Demand</span>}
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-[2rem] bg-blue-50 border border-blue-100 shadow-inner">
               <p className="text-[11px] font-bold leading-relaxed text-slate-600">
                 "Strategic Audit: Your Reels engagement is 18% above the benchmark. Recalibrate your pitch to maximize yield."
               </p>
            </div>
         </div>
      </div>

      <div className="premium-card bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden">
         <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4">
               <FileText className="w-6 h-6 text-blue-600" />
               Pending Invoices
            </h3>
            <button className="h-14 px-8 bg-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all active:scale-[0.98]">
               <Plus className="w-4 h-4 inline mr-2 text-blue-400" /> Create Narrative Invoice
            </button>
         </div>

         {!isMobile ? (
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Client / Project</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Deliverable</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Yield</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Mandatory Date</th>
                         <th className="px-10 py-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">Status</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center font-black text-xs text-blue-600">{inv.brand[0]}</div>
                                 <span className="font-black text-sm">{inv.brand}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase">{inv.type}</td>
                           <td className="px-8 py-6 text-sm font-black text-right">{inv.amount}</td>
                           <td className="px-8 py-6 text-[10px] font-black uppercase tracking-tighter">{inv.due}</td>
                            <td className="px-8 py-6 text-center">
                               <div className="flex items-center justify-center gap-3">
                                  <button onClick={() => handleMarkPaid(inv.id)} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all", inv.status === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 cursor-default' : 'bg-white border-slate-200 hover:border-blue-200 text-slate-600')}>
                                     {inv.status}
                                  </button>
                                  <button onClick={() => setIsDeleting(inv.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                               </div>
                            </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          ) : (
             <div className="grid grid-cols-1 gap-4 p-6 bg-slate-50">
                {invoices.map((inv) => (
                   <div key={inv.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-sm text-blue-600 shadow-sm">{inv.brand[0]}</div>
                            <div>
                               <span className="font-black text-sm block text-slate-900">{inv.brand}</span>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{inv.type}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <span className="font-black text-sm text-blue-600">{inv.amount}</span>
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                         <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> {inv.due}
                         </div>
                          <div className="flex items-center gap-3">
                             <button onClick={() => handleMarkPaid(inv.id)} className={cn(
                               "px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border transition-all shadow-sm",
                               inv.status === 'Paid' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
                             )}>
                                {inv.status}
                             </button>
                             <button onClick={() => setIsDeleting(inv.id)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                      </div>
                   </div>
                ))}
             </div>
          )}
      </div>
     {/* Confirmation for Rule #7 */}
      <ConfirmationModal 
        isOpen={!!isDeleting}
        title="Delete Invoice?"
        description="This action cannot be undone. This invoice will be permanently removed from your monetization hub."
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleting(null)}
      />
    </PageTransition>
  );
};
