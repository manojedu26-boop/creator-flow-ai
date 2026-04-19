
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Calendar, DollarSign, Briefcase, 
  ChevronRight, Sparkles, Zap, Tag, Clock,
  MapPin, Globe, ExternalLink, ShieldCheck,
  CheckCircle2, Send, FileText, Image, PenTool
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/shared/MotionComponents";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export const MarketplaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pitch, setPitch] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['brand_listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_listings')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Authentication required");
      
      const { error } = await supabase
        .from('applications')
        .insert({
          listing_id: id,
          creator_id: user.id,
          pitch_message: pitch,
          status: 'applied'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("APPLICATION TRANSMITTED", {
        description: "Your pitch is now in the brand review queue.",
        className: "bg-blue-600 text-white border-blue-500"
      });
      setIsApplying(false);
      navigate("/deals"); // Navigate to the pipeline
    },
    onError: (err: any) => {
      toast.error("Deployment Failed", { description: err.message });
    }
  });

  if (isLoading || !listing) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
      <Navbar />
      
      <main className="pt-32 pb-40 px-6">
        <div className="container max-w-7xl">
          <button 
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all mb-20"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Market
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-16">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-32 h-32 rounded-[3rem] bg-slate-950 border border-white/10 p-5 shadow-2xl relative group overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src={listing.logo_url} alt={listing.brand_name} className="w-full h-full object-contain relative z-10" />
                </div>
                <div className="text-center md:text-left">
                   <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">{listing.brand_name}</h1>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      {listing.niche_tags.map((tag: string) => (
                        <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400">{tag}</span>
                      ))}
                   </div>
                </div>
              </div>

              <div className="p-12 rounded-[3.5rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <Sparkles className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500 mb-10">Campaign Brief</h2>
                <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic mb-12">
                   "{listing.campaign_brief}"
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   {listing.platform_requirements.map((req: string) => (
                      <div key={req} className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/10">
                         <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                            <CheckCircle2 className="w-6 h-6 text-blue-500" />
                         </div>
                         <p className="text-[11px] font-black uppercase tracking-widest text-white">{req}</p>
                      </div>
                   ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Budget Alpha</p>
                    <p className="text-3xl font-black text-white">₹{(listing.budget_min / 1000).toFixed(0)}K</p>
                 </div>
                 <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Budget Max</p>
                    <p className="text-3xl font-black text-white">₹{(listing.budget_max / 1000).toFixed(0)}K</p>
                 </div>
                 <div className="p-10 rounded-[2.5rem] bg-blue-600/5 border border-blue-500/10">
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Deadline</p>
                    <p className="text-3xl font-black text-white">{new Date(listing.deadline).toLocaleDateString()}</p>
                 </div>
              </div>
            </div>

            {/* Right Sidebar - Action Panel */}
            <div className="space-y-10">
              <div className="sticky top-32 p-12 rounded-[3.5rem] bg-blue-600 border border-blue-500 shadow-2xl shadow-blue-500/20">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-8">Initiate Deployment</h3>
                {!user ? (
                  <button 
                    onClick={() => navigate("/login")}
                    className="w-full h-16 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-xl"
                  >
                    Login to Apply
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsApplying(true)}
                    className="w-full h-16 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    Apply Now <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <div className="mt-8 flex items-center gap-3 text-white/60 text-[9px] font-black uppercase tracking-widest italic justify-center">
                   <Zap className="w-4 h-4 text-white" /> Professional Scale v4.2
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-8 text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Platform Authority</p>
                 <div className="flex justify-center -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-800 overflow-hidden shadow-2xl">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=creator${i}`} alt="" />
                      </div>
                    ))}
                 </div>
                 <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                   Join 14 other titans applying <br /> for this deployment.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isApplying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6"
          >
             <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                className="w-full max-w-2xl bg-slate-900 rounded-[3.5rem] border border-white/10 p-12 md:p-20 shadow-2xl relative overflow-hidden"
             >
                <button 
                  onClick={() => setIsApplying(false)}
                  className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-500 mb-10">Application Terminal</h2>
                <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-12">Pitch to {listing.brand_name}</h3>
                
                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">The Narrative Pitch</label>
                      <textarea 
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                        placeholder="Why are you the alpha choice for this campaign?"
                        className="w-full h-40 bg-white/5 border border-white/10 rounded-[2rem] p-8 text-sm font-medium text-white focus:outline-none focus:border-blue-500 transition-all resize-none"
                      />
                   </div>

                   <button 
                      onClick={() => applyMutation.mutate()}
                      disabled={!pitch || applyMutation.isPending}
                      className="w-full h-20 bg-blue-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-4"
                   >
                      {applyMutation.isPending ? "Transmitting..." : <>Deploy Application <Send className="w-5 h-5" /></>}
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MarketplaceDetail;
