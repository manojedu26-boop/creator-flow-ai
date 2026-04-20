
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, X, Send, Wand2, 
  Target, ShieldCheck, 
  Loader2, RefreshCcw, Zap, AlertTriangle, TrendingUp, Brain
} from 'lucide-react';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PitchArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: any;
}

export const PitchArchitectModal = ({ isOpen, onClose, brand }: PitchArchitectModalProps) => {
  const { user } = useAuth();
  const [pitch, setPitch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brandInsight, setBrandInsight] = useState<any>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [activeTab, setActiveTab] = useState<'pitch' | 'intel'>('pitch');

  // Auto-load brand analysis when modal opens
  useEffect(() => {
    if (isOpen && brand && !brandInsight) {
      loadBrandInsight();
      // Auto-generate pitch on open
      handleGenerate();
    }
  }, [isOpen, brand]);

  const loadBrandInsight = async () => {
    setIsLoadingInsight(true);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: {
          action: "BRAND_ANALYSIS",
          brandName: brand.name,
          niche: brand.niches[0],
          inputData: brand.campaignType,
        },
      });
      if (!error && data?.output) {
        setBrandInsight(data.output);
      }
    } catch (e) {
      // Fail silently — pitch still works
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: { 
          action: "BRAND_PITCH", 
          brandName: brand.name,
          niche: brand.niches[0],
          creatorName: (user as any)?.name || "Naveen Kumar"
        },
      });

      if (error) throw error;

      if (data?.output) {
        setPitch(data.output);
        toast.success("AI Pitch Constructed!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error: any) {
      if (String(error).includes("429")) {
        toast.error("API Quota Exceeded — using fallback pitch");
      }
      setPitch(`Hi ${brand.name} team! I'm a creator in the ${brand.niches.join(', ')} space and I'd love to collaborate on your ${brand.campaignType}. My audience matches your target demographics perfectly, and I'm confident we can drive outstanding ROI together.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!pitch.trim()) { toast.error("Generate a pitch first"); return; }
    setIsRefining(true);
    try {
      const { data, error } = await supabase.functions.invoke("studio-engine", {
        body: {
          action: "PITCH_REFINER",
          inputData: pitch,
          brandName: brand.name,
          niche: brand.niches[0],
        },
      });
      if (error) throw error;
      if (data?.output) {
        setPitch(data.output);
        toast.success("Pitch Refined by AI!");
      }
    } catch (error: any) {
      if (String(error).includes("429")) toast.error("API Quota Exceeded");
      else toast.error("Refinement failed");
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmit = () => {
    if (!pitch) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newApplication = {
        id: `app_${Date.now()}`,
        castingId: brand.id,
        creatorId: 'u1',
        creatorName: (user as any)?.name || 'Naveen Kumar',
        status: 'Pending',
        match: brandInsight?.matchScore || 92,
        date: new Date().toISOString().split('T')[0],
        pitch_message: pitch
      };
      db.insert('applications', newApplication);

      const newDeal = {
        id: `deal_${Date.now()}`,
        brand: brand.name,
        logo: brand.logo,
        type: brand.campaignType,
        platforms: ['IG', 'YT'],
        value: brand.budget,
        deadline: brand.deadline,
        status: 'outreach',
        deadlineColor: 'yellow',
        notes: brandInsight?.pitchAngle || `AI Pitch: ${pitch.substring(0, 100)}...`
      };
      db.insert('deals', newDeal);

      setIsSubmitting(false);
      toast.success("MISSION DISPATCHED 🚀", {
        description: "Your pitch is now in the brand's neural queue."
      });
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30 sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-2 shadow-sm">
                  <img src={brand.logo} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">{brand.name} Partnership</h2>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mt-1">AI Pitch Architect v3.0</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-8 pt-4">
              {[
                { id: 'pitch', label: 'Pitch Builder', icon: Wand2 },
                { id: 'intel', label: 'Brand Intel', icon: Brain },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all",
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-8 space-y-8">
              {/* Brand Brief Summary */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Campaign Goal</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{brand.campaignType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-900 tracking-tighter">{brand.budget}</p>
                  <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">
                    {brandInsight?.brandPersonality ? `"${brandInsight.brandPersonality}" Brand` : 'AI Analyzing...'}
                  </p>
                </div>
              </div>

              {/* ── PITCH TAB ─────────────────────────────────── */}
              {activeTab === 'pitch' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Neural Pitch</label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleRefine}
                        disabled={isRefining || !pitch}
                        className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-all disabled:opacity-30"
                      >
                        {isRefining ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                        AI Refine
                      </button>
                      <span className="text-slate-200">|</span>
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-all disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
                        Re-Generate
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <textarea
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="AI is crafting your pitch..."
                      className="w-full h-48 bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600/20 transition-all resize-none shadow-inner"
                    />
                    {(isGenerating || isRefining) && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 rounded-[2rem]">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full"
                        />
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">
                          {isRefining ? "Refining Language Nodes..." : "Analyzing Brand DNA..."}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex gap-4">
                    <button 
                      onClick={onClose}
                      className="flex-1 h-16 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-slate-950 hover:border-slate-300 transition-all"
                    >
                      Abort Sync
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!pitch || isSubmitting}
                      className="flex-[2] h-16 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-indigo-600/30 hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                    >
                      {isSubmitting ? (
                        <>Dispatching Nodes... <Loader2 className="w-4 h-4 animate-spin" /></>
                      ) : (
                        <>Transmit Proposal Hub <Send className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest">
                    <ShieldCheck className="w-3 h-3" /> Encrypted Transmission via CreatorForge Neural Mesh
                  </div>
                </div>
              )}

              {/* ── BRAND INTEL TAB ─────────────────────────── */}
              {activeTab === 'intel' && (
                <div className="space-y-6">
                  {isLoadingInsight ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full"
                      />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Brand Intelligence...</p>
                    </div>
                  ) : brandInsight ? (
                    <div className="space-y-6">
                      {/* Overview */}
                      <div className="p-6 bg-slate-950 text-white rounded-3xl">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Brand Overview</p>
                        <p className="text-sm font-medium text-slate-200 leading-relaxed">{brandInsight.overview}</p>
                      </div>

                      {/* Key Metrics Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Pitch Angle</p>
                          <p className="text-xs font-bold text-slate-900">{brandInsight.pitchAngle}</p>
                        </div>
                        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Negotiation Leverage</p>
                          <p className="text-xs font-bold text-slate-900">{brandInsight.negotiationLeverage}</p>
                        </div>
                      </div>

                      {/* Campaign Goals */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Campaign Goals</p>
                        {brandInsight.campaignGoals?.map((goal: string, i: number) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl">
                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-black">{i + 1}</div>
                            <p className="text-xs font-bold text-slate-700">{goal}</p>
                          </div>
                        ))}
                      </div>

                      {/* Red Flags */}
                      {brandInsight.redFlags?.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest px-2 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" /> Watch Out
                          </p>
                          {brandInsight.redFlags.map((flag: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                              <p className="text-xs font-bold text-rose-700">{flag}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Ideal Content Formats */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Ideal Content Formats</p>
                        <div className="flex flex-wrap gap-2">
                          {brandInsight.idealContentFormats?.map((fmt: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">{fmt}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-400 text-sm">Brand intelligence unavailable</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
