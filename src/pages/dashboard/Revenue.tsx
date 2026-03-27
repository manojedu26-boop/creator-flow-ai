import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IndianRupee, TrendingUp, Clock, Calendar, 
  BarChart3, PieChart, Calculator, FileText, 
  Download, Send, CheckCircle2, AlertCircle, ShieldCheck,
  MoreHorizontal, ChevronDown, Sparkles, Plus,
  ArrowUpRight, ArrowDownRight, Printer, Share2
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, Cell 
} from 'recharts';
import { PageTransition, CountUp, staggerContainer, staggerItem } from "../../components/shared/MotionComponents";

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
  const [view, setView] = useState<'monthly' | 'quarterly'>('monthly');
  const [showInvoiceDrawer, setShowInvoiceDrawer] = useState(false);

  return (
    <PageTransition>
      <div className="max-w-[1600px] mx-auto space-y-12 pb-32">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
           <div>
              <h1 className="text-7xl font-bebas tracking-[4px] text-white leading-none">Capital & Payouts</h1>
              <p className="font-mono text-[10px] font-bold text-primary uppercase tracking-[0.5em] mt-4">Revenue Intelligence • FY 2026</p>
           </div>
           <div className="flex gap-4">
              <button 
                onClick={() => setShowInvoiceDrawer(true)}
                className="h-14 px-10 bg-primary text-white rounded-2xl font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_30px_-5px_hsl(var(--primary))] hover:shadow-primary/40 transition-all flex items-center gap-3 active:scale-95"
              >
                 <Plus className="w-4 h-4" /> Create Invoice
              </button>
           </div>
        </div>

        {/* TOP METRICS BENTO ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {[
             { label: 'GROSS EARNINGS', value: 157240, change: '+18.4%', icon: IndianRupee, glow: 'bg-emerald-500/20' },
             { label: 'PENDING PAYOUTS', value: 12400, count: '3 Active Labels', icon: Clock, glow: 'bg-amber-500/20' },
             { label: 'PROJECTED (Q3)', value: 245000, change: '+4.2%', icon: TrendingUp, glow: 'bg-indigo-500/20' },
             { label: 'TAX RESERVE (18%)', value: 28300, subtitle: 'Saves Automatically', icon: ShieldCheck, glow: 'bg-rose-500/20' },
           ].map((stat, i) => (
             <motion.div 
               key={stat.label} 
               variants={staggerItem}
               className="glass-card p-8 group relative overflow-hidden"
             >
                <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.glow} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3.5 rounded-2xl glass-elevated border border-white/5 text-primary">
                      <stat.icon className="w-5 h-5" />
                   </div>
                   {stat.change && (
                     <span className="font-mono text-[10px] font-bold text-success bg-success/10 px-3 py-1.5 rounded-xl border border-success/20">
                        {stat.change}
                     </span>
                   )}
                </div>
                <div>
                   <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                   <h3 className="text-4xl font-mono font-bold text-white tracking-tighter">
                     <CountUp value={stat.value} prefix="$" />
                   </h3>
                   {stat.count && <p className="font-syne text-[10px] font-bold text-amber-400 uppercase mt-3 tracking-wider">{stat.count}</p>}
                   {stat.subtitle && <p className="font-syne text-[10px] font-bold text-muted-foreground uppercase mt-3 tracking-wider opacity-60">{stat.subtitle}</p>}
                </div>
             </motion.div>
           ))}
        </div>

        {/* MAIN BENTO GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
           {/* REVENUE CHART — LARGE PIECE */}
           <motion.div variants={staggerItem} className="lg:col-span-8 glass-card p-10 flex flex-col relative overflow-hidden group">
              <div className="flex items-center justify-between mb-12 relative z-10">
                 <div>
                    <h3 className="text-2xl font-bebas tracking-[2px] text-white">Revenue Velocity</h3>
                    <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Multi-platform Income Stream</p>
                 </div>
                 <div className="flex glass-elevated p-1 rounded-xl border border-white/5">
                    <button onClick={() => setView('monthly')} className={`px-5 py-2 rounded-lg text-[9px] font-mono font-bold uppercase transition-all ${view === 'monthly' ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}>Monthly</button>
                    <button onClick={() => setView('quarterly')} className={`px-5 py-2 rounded-lg text-[9px] font-mono font-bold uppercase transition-all ${view === 'quarterly' ? 'bg-primary text-white shadow-xl' : 'text-muted-foreground hover:text-white'}`}>Quarterly</button>
                 </div>
              </div>
              <div className="flex-1 w-full min-h-[350px]">
                 <RevenueChart data={revenueData} />
              </div>
           </motion.div>

           {/* AI RATE CALCULATOR — TALL PIECE */}
           <motion.div variants={staggerItem} className="lg:col-span-4 glass-card p-10 flex flex-col bg-primary/5 relative overflow-hidden border-primary/20">
              <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
              <div className="relative z-10 space-y-10">
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 text-primary">
                       <Sparkles className="w-6 h-6" />
                       <h3 className="text-2xl font-bebas tracking-[2px]">Rate Intelligence</h3>
                    </div>
                    <p className="font-syne text-[11px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wide">Dynamic pricing recommendations based on your current engagement velocity (5.2%)</p>
                 </div>

                 <div className="space-y-3">
                    {[
                      { platform: 'YouTube Integration', range: '$1,200 – $2.4k', trend: 'up' },
                      { platform: 'Instagram Reel + Story', range: '$850 – $1.2k', trend: 'up' },
                      { platform: 'TikTok Sequence', range: '$400 – $750', trend: 'stable' },
                      { platform: 'Exclusive UGC (Pack)', range: '$500 – $900', trend: 'up' },
                    ].map(r => (
                      <div key={r.platform} className="p-5 rounded-2xl glass-elevated border border-white/5 hover:border-primary/30 transition-all group">
                         <div className="flex justify-between items-center">
                            <span className="font-syne text-[11px] font-bold text-white/70 group-hover:text-white transition-colors">{r.platform}</span>
                            <span className="font-mono text-[13px] font-bold text-primary">{r.range}</span>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="font-syne text-[10px] font-bold text-white/80 leading-relaxed uppercase">
                       <span className="text-amber-500">Benchmark Alert:</span> Creators in your niche have raised rates by 15% this quarter. You are technically "Low".
                    </p>
                 </div>

                 <button className="w-full h-14 glass-elevated border border-white/10 rounded-2xl font-mono text-[10px] font-bold uppercase tracking-[2px] text-white hover:bg-primary transition-all active:scale-95">Update Rate Card</button>
              </div>
           </motion.div>
        </div>

        {/* RECENT INVOICES — FULL WIDTH BENTO PIECE */}
        <motion.div variants={staggerItem} className="glass-card overflow-hidden">
           <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                 <h3 className="text-2xl font-bebas tracking-[2px] text-white">Invoice Records</h3>
                 <p className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Transaction History & Settlement Status</p>
              </div>
              <div className="flex gap-4">
                 <button className="h-11 px-6 glass-elevated border border-white/5 rounded-xl font-mono text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Export Report</button>
              </div>
           </div>

           <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-white/[0.01]">
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Partner</th>
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Asset Type</th>
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em] text-right">Settlement</th>
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Maturity Date</th>
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Status</th>
                       <th className="px-10 py-5 font-mono text-[9px] font-bold uppercase text-muted-foreground tracking-[0.2em] text-center">Protocol</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.03]">
                    {[
                      { brand: 'NIKE LABS', type: 'Sponsored Sequence', amount: '$4,200', due: '24 MARCH', status: 'PAID', color: 'success' },
                      { brand: 'ADOBE INC', type: 'UGC Asset Pack', amount: '$1,500', due: '28 MARCH', status: 'PENDING', color: 'amber' },
                      { brand: 'REVOLUT', type: 'Platform Intro', amount: '$8,500', due: '12 MARCH', status: 'OVERDUE', color: 'rose' },
                      { brand: 'PELOTON', type: 'Integration (Q1)', amount: '$3,200', due: '05 APRIL', status: 'PENDING', color: 'amber' },
                    ].map((inv, i) => (
                      <tr key={i} className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl glass-elevated border border-white/5 flex items-center justify-center font-bebas text-lg text-primary">{inv.brand[0]}</div>
                               <span className="font-syne font-bold text-[13px] text-white tracking-tight">{inv.brand}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8 font-syne text-[11px] font-bold text-muted-foreground uppercase">{inv.type}</td>
                         <td className="px-10 py-8 font-mono text-[14px] font-bold text-white text-right">{inv.amount}</td>
                         <td className="px-10 py-8 font-mono text-[10px] font-bold text-muted-foreground uppercase">{inv.due}</td>
                         <td className="px-10 py-8">
                            <span className={`px-4 py-1.5 rounded-full text-[8px] font-mono font-bold border ${
                              inv.color === 'success' ? 'bg-success/10 text-success border-success/20' : 
                              inv.color === 'amber' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-500 border-rose-500/20'
                            }`}>
                               {inv.status}
                            </span>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                               <button className="p-2.5 glass-elevated rounded-xl hover:text-primary border border-white/5"><Download className="w-4 h-4" /></button>
                               <button className="p-2.5 glass-elevated rounded-xl hover:text-primary border border-white/5"><Share2 className="w-4 h-4" /></button>
                               <button className="p-2.5 glass-elevated rounded-xl hover:text-white border border-white/5"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </motion.div>

        {/* DRAWER REMAINS LARGELY SAME BUT WITH THEMED CLASSES */}
        <AnimatePresence>
           {showInvoiceDrawer && (
              <div className="fixed inset-0 z-[200] flex justify-end">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInvoiceDrawer(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
                 <motion.div 
                  initial={{ x: '100%' }} 
                  animate={{ x: 0 }} 
                  exit={{ x: '100%' }} 
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                  className="relative w-full max-w-xl bg-[#07071A] border-l border-white/10 shadow-2xl h-screen flex flex-col p-12 overflow-y-auto no-scrollbar"
                >
                    <div className="flex items-center justify-between mb-16">
                       <h2 className="text-5xl font-bebas tracking-[2px] text-white">Issue Protocol</h2>
                       <button onClick={() => setShowInvoiceDrawer(false)} className="w-12 h-12 glass-elevated rounded-full flex items-center justify-center hover:bg-rose-500/20 hover:text-rose-500 transition-all border border-white/5">
                          <Plus className="w-6 h-6 rotate-45" />
                       </button>
                    </div>
                    
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <label className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Select Counterparty</label>
                          <select className="w-full h-16 px-6 bg-white/[0.02] border border-white/10 rounded-2xl font-syne text-sm font-bold text-white focus:outline-none focus:border-primary">
                             <option className="bg-[#07071A]">Nike Labs — Active Contract ($4,200)</option>
                             <option className="bg-[#07071A]">Adobe Inc — Digital License ($1,500)</option>
                             <option className="bg-[#07071A]">New Counterparty Protocol...</option>
                          </select>
                       </div>

                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Effective Date</label>
                             <input type="date" className="w-full h-16 px-6 bg-white/[0.02] border border-white/10 rounded-2xl text-white focus:outline-none" />
                          </div>
                          <div className="space-y-4">
                             <label className="font-mono text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Clearing Method</label>
                             <select className="w-full h-16 px-6 bg-white/[0.02] border border-white/10 rounded-2xl font-syne text-sm font-bold text-white focus:outline-none">
                                <option className="bg-[#07071A]">Direct Settlement</option>
                                <option className="bg-[#07071A]">Digital Escrow (Stripe)</option>
                                <option className="bg-[#07071A]">Crypto Proof (USDT)</option>
                             </select>
                          </div>
                       </div>

                       <div className="glass-card bg-primary/5 p-10 space-y-6 border-primary/20">
                          <div className="flex justify-between items-center font-mono text-[10px] font-bold text-white uppercase tracking-widest">
                             <span>Base Liquidity</span>
                             <span>$4,200.00</span>
                          </div>
                          <div className="flex justify-between items-center font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                             <span>Platform Protocol (2.5%)</span>
                             <span>- $105.00</span>
                          </div>
                          <div className="h-px bg-white/5 my-4" />
                          <div className="flex justify-between items-center">
                             <span className="font-bebas text-2xl text-white tracking-[1px]">Final Settlement</span>
                             <span className="font-mono text-2xl font-bold text-primary">$4,095.00</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6 pt-12">
                          <button className="h-16 rounded-2xl glass-elevated border border-white/5 font-mono text-[10px] font-bold uppercase tracking-[2px] text-white hover:bg-white/5 transition-all">Store Draft</button>
                          <button className="h-16 rounded-2xl bg-primary text-white font-mono text-[10px] font-bold uppercase tracking-[2px] shadow-2xl hover:shadow-primary/40 transition-all active:scale-95">Initiate Request</button>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
