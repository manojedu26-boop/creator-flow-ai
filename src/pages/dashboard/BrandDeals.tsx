
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Filter, Plus, MoreVertical, Calendar, 
  DollarSign, Briefcase, MessageSquare, FileText, 
  Phone, AlertCircle, ChevronRight, ChevronDown, X, Sparkles,
  Instagram, Youtube, Twitter, Facebook, CheckCircle2,
  Zap, Trash2, Mail, Download, History, ArrowRight
} from "lucide-react";
import { PageTransition } from "@/components/shared/MotionComponents";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { BottomSheet } from "@/components/ui/BottomSheet";

type DealStatus = 'applied' | 'reviewing' | 'active' | 'completed';

const columns: { id: DealStatus; label: string; icon: any; color: string }[] = [
  { id: 'applied', label: 'In Queue', icon: Mail, color: "text-slate-400" },
  { id: 'reviewing', label: 'Reviewing', icon: Search, color: "text-blue-500" },
  { id: 'active', label: 'Direct Deployment', icon: Zap, color: "text-indigo-500" },
  { id: 'completed', label: 'Revenue Handover', icon: CheckCircle2, color: "text-emerald-600" },
];

export const BrandDeals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);

  // Fetch applications joined with listings
  const { data: applications, isLoading } = useQuery({
    queryKey: ['creator_applications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          brand_listings (*)
        `)
        .eq('creator_id', user?.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: DealStatus }) => {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator_applications'] });
      toast.success("State Updated");
    }
  });

  const finalizeDealMutation = useMutation({
    mutationFn: async (app: any) => {
      // Create a deal record
      const { error: dealError } = await supabase
        .from('deals')
        .insert({
          application_id: app.id,
          listing_id: app.listing_id,
          creator_id: user?.id,
          agreed_amount: app.brand_listings.budget_max, // Mocking max for now
          payment_status: 'completed',
          completion_date: new Date().toISOString()
        });
      
      if (dealError) throw dealError;

      // Update application to converted
      const { error: appError } = await supabase
        .from('applications')
        .update({ status: 'converted' })
        .eq('id', app.id);
      
      if (appError) throw appError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator_applications'] });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#6366f1']
      });
      toast.success("REVENUE HANDOVER COMPLETE 💸", {
        description: "88% has been dispatched to your account."
      });
      setSelectedApplication(null);
    }
  });

  if (isLoading) return null;

  return (
    <PageTransition className="space-y-12 max-w-[1700px] mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase leading-none text-slate-900">
            Partnership <span className="text-blue-600 italic">Command.</span>
          </h2>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Pipeline: <span className="text-slate-900">₹ {(applications?.length || 0) * 80}K</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {columns.map(col => {
          const colApps = applications?.filter(a => a.status === col.id) || [];
          return (
            <div key={col.id} className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-4">
                  <col.icon className={cn("w-5 h-5", col.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{col.label}</span>
                </div>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  {colApps.length}
                </span>
              </div>

              <div className={cn(
                "flex flex-col gap-6 min-h-[400px] p-2 rounded-[3rem] transition-colors",
                colApps.length === 0 ? "bg-slate-50/50 border-2 border-dashed border-slate-100" : ""
              )}>
                <AnimatePresence mode="popLayout">
                  {colApps.map((app: any) => (
                    <motion.div
                      key={app.id}
                      layoutId={app.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group relative bg-white border border-slate-100 p-8 rounded-[3rem] shadow-sm hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 p-2 border border-slate-100">
                          <img src={app.brand_listings?.logo_url} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs uppercase tracking-tight">{app.brand_listings?.brand_name}</h4>
                          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1 italic">
                            ₹{(app.brand_listings?.budget_max / 1000).toFixed(0)}K Potential
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 font-medium italic line-clamp-2 mb-6">
                        "{app.pitch_message}"
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                         <div className="flex -space-x-2">
                            {[1,2].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=brand${i}`} alt="" />
                              </div>
                            ))}
                         </div>
                         <button className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2">
                           View Brief <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedApplication && (
          <BottomSheet isOpen={true} onClose={() => setSelectedApplication(null)} title="Partnership Workspace" height="85vh">
            <div className="space-y-12 py-10 pb-32">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-50 p-4 border border-slate-100">
                   <img src={selectedApplication.brand_listings?.logo_url} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                   <h3 className="text-4xl font-black uppercase tracking-tighter mb-2">{selectedApplication.brand_listings?.brand_name}</h3>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Deployment Session</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedApplication.status}</span>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Split (Simulated)</p>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-500">Gross Budget</span>
                          <span className="text-slate-900">₹{selectedApplication.brand_listings?.budget_max}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-blue-500">CreatorForge Fee (12%)</span>
                          <span className="text-blue-600">₹{selectedApplication.brand_listings?.budget_max * 0.12}</span>
                       </div>
                       <div className="h-px bg-slate-200" />
                       <div className="flex justify-between items-center text-lg font-black pt-2">
                          <span className="text-slate-900 uppercase tracking-tighter">Your Dispatched Net</span>
                          <span className="text-emerald-600">₹{selectedApplication.brand_listings?.budget_max * 0.88}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Deployment Actions</p>
                    <div className="grid grid-cols-1 gap-4">
                       {selectedApplication.status === 'reviewing' && (
                         <button 
                           onClick={() => updateStatusMutation.mutate({ id: selectedApplication.id, status: 'active' })}
                           className="w-full h-16 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3"
                         >
                           <Zap className="w-4 h-4" /> Move to Active Deployment
                         </button>
                       )}
                       {selectedApplication.status === 'active' && (
                         <button 
                           onClick={() => finalizeDealMutation.mutate(selectedApplication)}
                           className="w-full h-16 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3"
                         >
                           <CheckCircle2 className="w-4 h-4" /> Trigger Revenue Handover
                         </button>
                       )}
                       <button className="w-full h-16 rounded-2xl bg-white border border-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] shadow-sm hover:border-slate-300 transition-all flex items-center justify-center gap-3">
                          <MessageSquare className="w-4 h-4" /> Open Brand Comms
                       </button>
                    </div>
                 </div>
              </div>

              {/* Pitch Context */}
              <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText className="w-20 h-20" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 mb-6">Your Transmitted Pitch</h4>
                 <p className="text-xl font-medium leading-relaxed italic relative z-10 text-slate-300">
                    "{selectedApplication.pitch_message}"
                 </p>
              </div>
            </div>
          </BottomSheet>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BrandDeals;
