import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IndianRupee, TrendingUp, Clock, Calendar, 
  BarChart3, PieChart, Calculator, FileText, 
  Download, Send, CheckCircle2, AlertCircle,
  MoreHorizontal, ChevronDown, Sparkles, Plus,
  ArrowUpRight, ArrowDownRight, Printer, Share2, Trash2, Undo
} from "lucide-react";
import { toast } from "../../components/ui/sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
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
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
      <Tooltip 
        contentStyle={{ 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.1)', 
          backgroundColor: '#0f172a',
          fontWeight: 900 
        }} 
      />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900 }} />
      <Bar dataKey="brandDeals" stackId="a" fill="url(#colorBrand)" name="Brand Deals" />
      <Bar dataKey="affiliate" stackId="a" fill="#3b82f6" name="Affiliate" />
      <Bar dataKey="adsense" stackId="a" fill="#10b981" name="AdSense" radius={[10, 10, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
));

export const Revenue = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([
    { id: 1, brand: 'MuscleBlaze', type: 'Sponsored Reel', amount: '₹ 35,000', due: '28 Mar 2025', status: 'Pending' },
    { id: 2, brand: 'Decathlon India', type: 'Ambassador (Advance)', amount: '₹ 25,000', due: '01 Apr 2025', status: 'Pending' },
    { id: 3, brand: 'Fittr App', type: 'YT Integration', amount: '₹ 42,000', due: '10 Mar 2025', status: 'Paid' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkPaid = (id: number) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    toast.success("Payment Received! Gold flash effect triggered.");
  };

  const handleDelete = (id: number) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
    toast.info("Invoice deleted with undo action.");
  };

  return (
    <PageTransition className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24 lg:pb-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
          <IndianRupee className="w-3 h-3" />
          Monetisation Hub
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.9]">
           Revenue <span className="text-primary italic">Command</span>
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Revenue This Month', value: 68000, change: '+14%', icon: IndianRupee, color: 'text-emerald-500' },
           { label: 'Outstanding Invoices', value: 60000, count: '2 Pending', icon: Clock, color: 'text-amber-500' },
           { label: 'YTD Total', value: 168000, change: 'Jan-Mar', icon: TrendingUp, color: 'text-indigo-500' },
           { label: 'Projected (30 Days)', value: 85000, subtitle: 'AI Estimate', icon: Sparkles, color: 'text-primary' },
         ].map((stat, i) => (
           <motion.div key={stat.label} variants={staggerItem} className="premium-card bg-black/40 backdrop-blur-3xl border border-white/5 p-6 rounded-[2rem] shadow-xl">
              <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                 </div>
                 {stat.change && <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg italic">{stat.change}</span>}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black tracking-tight"><CountUp value={stat.value} prefix="₹ " /></h3>
              {stat.count && <p className="text-[10px] font-bold text-amber-500 uppercase mt-2">{stat.count}</p>}
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 premium-card bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Revenue Momentum</h3>
            <div className="h-[400px] w-full">
               <RevenueChart data={revenueData} />
            </div>
         </div>

         <div className="premium-card bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-primary opacity-10">
               <Calculator className="w-32 h-32" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2 flex items-center gap-3 relative z-10">
               <Sparkles className="w-5 h-5 text-primary" />
               AI Rate Card
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed mb-8 relative z-10">Based on your 4.8% engagement rate</p>
            
            <div className="space-y-4 relative z-10">
              {[
                { platform: 'IG Reel', range: '₹ 28,000 – ₹ 45,000', up: true },
                { platform: 'IG Post', range: '₹ 18,000 – ₹ 28,000' },
                { platform: 'IG Story (3x)', range: '₹ 9,000 – ₹ 15,000' },
                { platform: 'YT Integration', range: '₹ 40,000 – ₹ 65,000', up: true },
                { platform: 'TikTok Video', range: '₹ 18,000 – ₹ 30,000' },
              ].map(r => (
                <div key={r.platform} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                   <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black uppercase tracking-widest">{r.platform}</span>
                      <div className="text-right">
                         <span className="text-xs font-black block">{r.range}</span>
                         {r.up && <span className="text-[8px] font-black text-emerald-500 uppercase">+18% vs Tier Avg</span>}
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-primary/10 border border-primary/20">
               <p className="text-[10px] font-bold leading-relaxed italic">
                 "Naveen, you are currently 18% below market rate for your fitness engagement tier. You could charge more for your Reels."
               </p>
            </div>
         </div>
      </div>

      <div className="premium-card bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden">
         <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
               <FileText className="w-5 h-5 text-primary" />
               Pending Invoices
            </h3>
            <button className="h-12 px-8 bg-primary rounded-2xl text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:scale-105 transition-all">
               <Plus className="w-4 h-4 inline mr-2" /> Create Invoice
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/[0.02]">
                     <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Brand</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Type</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Value</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Due Date</th>
                     <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-black text-xs text-primary">{inv.brand[0]}</div>
                             <span className="font-black text-sm">{inv.brand}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase">{inv.type}</td>
                       <td className="px-8 py-6 text-sm font-black text-right">{inv.amount}</td>
                       <td className="px-8 py-6 text-[10px] font-black uppercase tracking-tighter">{inv.due}</td>
                       <td className="px-8 py-6 text-center">
                          <button onClick={() => handleMarkPaid(inv.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${inv.status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 hover:border-primary'}`}>
                             {inv.status}
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </PageTransition>
  );
};
