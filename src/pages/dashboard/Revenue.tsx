import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IndianRupee, TrendingUp, Clock, Calendar, 
  BarChart3, PieChart, Calculator, FileText, 
  Download, Send, CheckCircle2, AlertCircle,
  MoreHorizontal, ChevronDown, Sparkles, Plus,
  ArrowUpRight, ArrowDownRight, Printer, Share2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";
import { useAuth } from "../../contexts/AuthContext";
import { EmptyState } from "../../components/shared/EmptyState";
import { Briefcase } from "lucide-react";

const revenueData = [
  { month: 'Oct', brandDeals: 45000, affiliate: 12000, products: 5000, other: 3000 },
  { month: 'Nov', brandDeals: 52000, affiliate: 15000, products: 8000, other: 4000 },
  { month: 'Dec', brandDeals: 85000, affiliate: 22000, products: 12000, other: 5000 },
  { month: 'Jan', brandDeals: 60000, affiliate: 18000, products: 9000, other: 4500 },
  { month: 'Feb', brandDeals: 72000, affiliate: 25000, products: 15000, other: 6000 },
  { month: 'Mar', brandDeals: 95000, affiliate: 32000, products: 22000, other: 8000 },
];

const RevenueChart = memo(({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <defs>
        <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="colorBrand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.1} />
      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }} />
      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: 'hsl(var(--muted-foreground))' }} />
      <Tooltip 
        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
        contentStyle={{ 
          borderRadius: '20px', 
          border: '1px solid rgba(255,255,255,0.1)', 
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
          fontWeight: 900 
        }} 
      />
      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
      <Bar dataKey="brandDeals" stackId="a" fill="url(#colorBrand)" radius={[0, 0, 0, 0]} name="Brand Deals" isAnimationActive={true} animationDuration={1000} filter="url(#barGlow)" />
      <Bar dataKey="affiliate" stackId="a" fill="#3b82f6" name="Affiliate" opacity={0.8} filter="url(#barGlow)" />
      <Bar dataKey="products" stackId="a" fill="#10b981" name="Products" opacity={0.8} filter="url(#barGlow)" />
      <Bar dataKey="other" stackId="a" fill="#f59e0b" radius={[10, 10, 0, 0]} name="Other" opacity={0.8} filter="url(#barGlow)" />
    </BarChart>
  </ResponsiveContainer>
));

export const Revenue = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'monthly' | 'quarterly'>('monthly');
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);
  const [invoices, setInvoices] = useState([
    { brand: 'Nike', type: 'Sponsored Reel', amount: '₹ 45,000', due: '24 Mar 2026', status: 'Paid', color: 'bg-emerald-500/10 text-emerald-500' },
    { brand: 'Adobe', type: 'UGC Content', amount: '₹ 15,000', due: '28 Mar 2026', status: 'Pending', color: 'bg-amber-500/10 text-amber-500' },
    { brand: 'Samsung', type: 'Product Reveal', amount: '₹ 85,000', due: '15 Mar 2026', status: 'Overdue', color: 'bg-rose-500/10 text-rose-500' },
    { brand: 'GoPro', type: 'App Integration', amount: '₹ 32,000', due: '05 Apr 2026', status: 'Pending', color: 'bg-amber-500/10 text-amber-500' },
  ]);

  return (
    <PageTransition>
      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-10 pb-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'Revenue This Month', numericValue: 157000, change: '+24%', icon: IndianRupee, color: 'text-emerald-500' },
             { label: 'Outstanding Invoices', numericValue: 45000, count: '3 Pending', icon: Clock, color: 'text-amber-500', clickable: true },
             { label: 'Revenue This Year', numericValue: 842000, change: '+12%', icon: TrendingUp, color: 'text-indigo-500' },
             { label: 'Projected (30 Days)', numericValue: 185000, subtitle: 'AI Estimate', icon: Sparkles, color: 'text-primary' },
           ].map((stat, i) => (
             <motion.div 
              key={stat.label} 
              variants={staggerItem}
              className={`premium-card bg-card border border-border/40 p-6 rounded-[2rem] shadow-sm transition-all group ${stat.clickable ? 'cursor-pointer hover:border-primary/40' : ''}`}
              onClick={stat.clickable ? () => setShowInvoiceDrawer(true) : undefined}
            >
                <div className="flex justify-between items-start mb-4">
                   <div className={`p-3 rounded-2xl bg-muted/10 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   {stat.change && (
                     <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> {stat.change}
                     </span>
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                   <h3 className="text-2xl font-black tracking-tight">
                     <CountUp value={stat.numericValue} prefix="₹ " />
                   </h3>
                   {stat.count && <p className="text-[10px] font-bold text-amber-500 uppercase mt-2">{stat.count}</p>}
                   {stat.subtitle && <p className="text-[10px] font-bold text-primary uppercase mt-2 italic">{stat.subtitle}</p>}
                </div>
                {stat.label === 'Revenue This Month' && (
                  <div className="mt-4 h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500" />
                  </div>
                )}
             </motion.div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <motion.div variants={staggerItem} className="premium-card lg:col-span-2 bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div>
                    <h3 className="text-xl font-black uppercase tracking-tight">Revenue Breakdown</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Income Streams by Category</p>
                 </div>
                 <div className="flex bg-muted/10 p-1 rounded-xl border border-border/40">
                    <button onClick={() => setView('monthly')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'monthly' ? 'bg-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Monthly</button>
                    <button onClick={() => setView('quarterly')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'quarterly' ? 'bg-background shadow-md' : 'text-muted-foreground hover:text-foreground'}`}>Quarterly</button>
                 </div>
              </div>
              <div className="h-[400px] w-full relative z-10">
                 <RevenueChart data={revenueData} />
              </div>
           </motion.div>

           {/* RIGHT — AI RATE CALCULATOR */}
           <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-2xl space-y-8 flex flex-col">
              <div className="space-y-2">
                 <div className="inline-flex items-center gap-2 text-primary">
                    <Calculator className="w-5 h-5" />
                    <h3 className="text-lg font-black uppercase tracking-tight">AI Rate Calculator</h3>
                 </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">Based on your live engagement (4.8%) and audience niche ({user?.niche || 'Digital'})</p>
              </div>

              <div className="space-y-4 flex-1">
                 {[
                   { platform: 'IG Post', range: '₹ 25k – ₹ 40k' },
                   { platform: 'IG Reel', range: '₹ 35k – ₹ 55k', primary: true },
                   { platform: 'IG Story (3x)', range: '₹ 12k – ₹ 20k' },
                   { platform: 'YT Integration', range: '₹ 60k – ₹ 1.1L' },
                   { platform: 'TikTok Video', range: '₹ 20k – ₹ 35k' },
                 ].map(r => (
                   <div key={r.platform} className={`p-4 rounded-2xl border transition-all ${r.primary ? 'bg-primary/5 border-primary/30' : 'bg-muted/10 border-border/40 hover:bg-muted/20'}`}>
                      <div className="flex justify-between items-center">
                         <span className="text-[11px] font-black uppercase tracking-widest">{r.platform}</span>
                         <span className={`text-xs font-black ${r.primary ? 'text-primary' : 'text-foreground'}`}>{r.range}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4">
                 <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                 <p className="text-[10px] font-bold text-foreground leading-[1.6]">
                    <span className="text-amber-500 font-black">MARKET INSIGHT:</span><br/>
                    You are currently 22% below market rate for your engagement tier.
                 </p>
              </div>

              <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95">
                 <FileText className="w-4 h-4" /> Update Rate Card
              </button>
           </motion.div>
        </div>

        {/* ROW 3 — INVOICE MANAGER */}
        <motion.div variants={staggerItem} className="premium-card bg-card border border-border/40 rounded-[2.5rem] shadow-2xl overflow-hidden">
           <div className="p-8 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/10">
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tight">Invoice Manager</h3>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase">Track and manage your earnings</p>
              </div>
              <button 
                onClick={() => setShowInvoiceDrawer(true)}
                className="h-12 px-8 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95"
              >
                 <Plus className="w-4 h-4" /> Create New Invoice
              </button>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-muted/5">
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Brand</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Deal Type</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-right">Amount</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Due Date</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                       <th className="px-8 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/20">
                    {[
                      { brand: 'Nike', type: 'Sponsored Reel', amount: '₹ 45,000', due: '24 Mar 2026', status: 'Paid', color: 'bg-emerald-500/10 text-emerald-500' },
                      { brand: 'Adobe', type: 'UGC Content', amount: '₹ 15,000', due: '28 Mar 2026', status: 'Pending', color: 'bg-amber-500/10 text-amber-500' },
                      { brand: 'Samsung', type: 'Product Reveal', amount: '₹ 85,000', due: '15 Mar 2026', status: 'Overdue', color: 'bg-rose-500/10 text-rose-500' },
                      { brand: 'GoPro', type: 'App Integration', amount: '₹ 32,000', due: '05 Apr 2026', status: 'Pending', color: 'bg-amber-500/10 text-amber-500' },
                    ].map((inv, i) => (
                      <tr key={i} className="group hover:bg-muted/5 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-black text-[10px]">{inv.brand[0]}</div>
                               <span className="font-black text-sm">{inv.brand}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase">{inv.type}</td>
                         <td className="px-8 py-6 text-sm font-black text-right">{inv.amount}</td>
                         <td className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{inv.due}</td>
                         <td className="px-8 py-6">
                            <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-current/20 ${inv.color}`}>
                               {inv.status}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button title="Download" className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"><Download className="w-4 h-4" /></button>
                               <button title="Send Reminder" className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"><Send className="w-4 h-4" /></button>
                               <button title="Options" className="p-2 hover:bg-muted rounded-lg transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </motion.div>

        {/* INVOICE DRAWER (MOCKED) */}
        <AnimatePresence>
           {showInvoiceDrawer && (
              <div className="fixed inset-0 z-[200] flex justify-end">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInvoiceDrawer(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                 <motion.div 
                  initial={{ x: '100%' }} 
                  animate={{ x: 0 }} 
                  exit={{ x: '100%' }} 
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-full max-w-xl bg-card border-l border-border/40 shadow-2xl h-screen flex flex-col p-10 overflow-y-auto no-scrollbar"
                >
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-3xl font-black uppercase tracking-tight">Create Invoice</h2>
                       <button onClick={() => setShowInvoiceDrawer(false)} className="p-2 hover:bg-muted rounded-full transition-all">
                          <Plus className="w-6 h-6 rotate-45" />
                       </button>
                    </div>

                    <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl mb-8">
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Billing From</span>
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xs uppercase">
                             {user?.firstName?.[0] || user?.name?.[0]}
                          </div>
                          <div>
                             <p className="text-sm font-black">{user?.name}</p>
                             <p className="text-[10px] text-muted-foreground font-bold uppercase">{user?.handle}</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Active Deal</label>
                          <select className="w-full h-14 px-6 bg-muted/10 border border-border/40 rounded-[1.5rem] text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary">
                             <option>Nike — Sponsored Reel (₹ 45k)</option>
                             <option>Adobe — UGC Pack (₹ 15k)</option>
                             <option>New Custom Invoice...</option>
                          </select>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Due Date</label>
                             <input type="date" className="w-full h-14 px-6 bg-muted/10 border border-border/40 rounded-[1.5rem] text-sm focus:outline-none" />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</label>
                             <select className="w-full h-14 px-6 bg-muted/10 border border-border/40 rounded-[1.5rem] text-sm font-bold focus:outline-none">
                                <option>UPI / Bank Transfer</option>
                                <option>Stripe / PayPal</option>
                                <option>Crypto (USDT)</option>
                             </select>
                          </div>
                       </div>

                       <div className="bg-primary/5 border border-dashed border-primary/30 p-8 rounded-[2rem] space-y-4">
                          <div className="flex justify-between items-center text-xs font-black uppercase">
                             <span>Base Amount</span>
                             <span>₹ 45,000</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-black uppercase text-muted-foreground">
                             <span>Tax (GST 18%)</span>
                             <span>₹ 8,100</span>
                          </div>
                          <div className="h-px bg-border/40 my-4" />
                          <div className="flex justify-between items-center text-lg font-black uppercase">
                             <span>Total Payable</span>
                             <span className="text-primary">₹ 53,100</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4 pt-10">
                          <button className="h-16 rounded-[1.5rem] border border-border/40 font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">Save Draft</button>
                          <button className="h-16 rounded-[1.5rem] bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-2xl transition-all active:scale-95">Send Invoice</button>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </motion.div>
    </PageTransition>
  );
};
