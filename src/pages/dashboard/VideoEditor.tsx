import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Film, Sparkles, Upload, Brain, HelpCircle, 
  ChevronRight, PlayCircle, Settings, Scissors, 
  Wand2, Zap, ArrowRight, MessageSquare, Plus,
  FileVideo, Library, History
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const cardTransition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] };

export const VideoEditor = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleStartAI = () => {
    toast.success("Intelligence Core Initialized", {
      description: "Analyzing current project frames for optimal cuts."
    });
  };

  return (
    <div className="p-8 pb-32 max-w-[1600px] mx-auto space-y-12">
      {/* Neural Production Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
            <Zap className="w-3 h-3 fill-blue-500" /> Neural Production Suite
          </div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">
            Creative <span className="text-blue-600">Engine</span>
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-2xl italic leading-relaxed">
            Distilling raw footage into high-fidelity narratives using the industry's most advanced neural synchronization core.
          </p>
        </div>

        <div className="flex gap-4">
          <button className="h-16 px-8 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-slate-800 transition-all active:scale-95 group shadow-xl shadow-slate-200">
            <History className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
             Archive
          </button>
          <button 
            onClick={() => setIsUploading(true)}
            className="h-16 px-10 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[11px] flex items-center gap-4 hover:bg-blue-500 transition-all active:scale-95 shadow-xl shadow-blue-200"
          >
             New Project <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Master Assistant (2/3 width) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={cardTransition}
          className="lg:col-span-2 relative h-[500px] bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
          
          <div className="relative h-full flex flex-col p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-950 uppercase">Neural Assistant</h3>
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Core OS v4.2 Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
              </div>
            </div>

            <div className="flex-1 bg-slate-50/50 rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-center items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border border-slate-100 shadow-sm">
                <Wand2 className="w-8 h-8 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-slate-900 uppercase">Ready for Directives</h4>
                <p className="text-sm text-slate-500 font-medium max-w-sm">"I can perform automated b-roll syncing, kinetic typography overlays, and cinematic color grading."</p>
              </div>
            </div>

            <div className="mt-8 relative">
              <input 
                type="text"
                placeholder="Instruct the engine (e.g., 'Apply cinematic high-contrast grade and add trendy transitions')"
                className="w-full h-18 bg-white border border-slate-200 rounded-2xl pl-6 pr-20 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm"
              />
              <button 
                onClick={handleStartAI}
                className="absolute right-3 top-2 bottom-2 px-6 rounded-xl bg-slate-950 text-white font-black uppercase tracking-widest text-[9px] hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                Execute <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Action Quicklinks */}
        <div className="space-y-8">
          {/* Upload Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...cardTransition, delay: 0.1 }}
            className="p-10 bg-slate-950 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all">
                <Upload className="w-24 h-24 text-blue-500 rotate-12" />
             </div>
             <div className="relative space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tight">Vault Upload</h3>
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Secure Media Ingestion</p>
             </div>
             <p className="text-sm text-slate-400 font-bold leading-relaxed relative">Drop raw files here. The engine supports 4K Pro-Res/HEVC sync.</p>
             <button className="w-full h-16 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-blue-400 hover:text-white transition-all">
                Select Files <ChevronRight className="w-4 h-4" />
             </button>
          </motion.div>

          {/* Tutorial Helper */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...cardTransition, delay: 0.2 }}
            className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-xl space-y-6 group"
          >
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                   <HelpCircle className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-950 uppercase">Mastery</h3>
             </div>
             <p className="text-sm text-slate-500 font-bold">New to Neural Editing? Check our deployment guides.</p>
             <div className="space-y-3">
               {[
                 { label: "Optimal Frame Sync", active: true },
                 { label: "AI B-Roll Mapping", active: false }
               ].map(item => (
                 <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors cursor-pointer">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                 </div>
               ))}
             </div>
          </motion.div>
        </div>
      </div>

      {/* Style Reference Gallery */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
           <div>
              <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Reference Library</h3>
              <p className="text-sm text-slate-500 font-bold">Sync your edit mood with trending obsidian styles.</p>
           </div>
           <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Browse All Protocols</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Cyber-Punk Glow", duration: "1.2s", tech: "Glow + Chromatic" },
            { title: "Minimalist Mono", duration: "0.8s", tech: "Desat + Grain" },
            { title: "Hype Beast", duration: "2.4s", tech: "Speed Ramping" },
            { title: "Obsidian Core", duration: "1.4s", tech: "Glassmorphic" }
          ].map((style, i) => (
            <motion.div
              key={style.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group cursor-pointer"
            >
               <div className="relative aspect-video rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden mb-5">
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                     <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-slate-950 fill-slate-950 ml-1" />
                     </div>
                  </div>
               </div>
               <h4 className="text-sm font-black text-slate-950 uppercase tracking-wide mb-1 transition-colors group-hover:text-blue-600">{style.title}</h4>
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{style.tech}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">v4.2</span>
               </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
