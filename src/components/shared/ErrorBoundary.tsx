import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home, MessageCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 md:p-12">
          <div className="absolute inset-0 bg-mesh-primary opacity-20 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[4rem] p-12 md:p-20 shadow-premium text-center space-y-10 overflow-hidden"
          >
            <div className="relative w-32 h-32 mx-auto">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 bg-rose-500/10 rounded-full blur-2xl" 
               />
               <div className="relative w-full h-full bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-12 h-12 text-rose-500" />
               </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 bg-rose-50 border border-rose-100/50 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">System Deviation</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Code: INTERCEPT_500</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none">Intelligence <span className="text-rose-600">Interrupted</span></h2>
              <p className="text-slate-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                The Creative Engine encountered an unexpected sequence. Your data is safe—the logic just needs a hard calibration.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
              <button 
                onClick={this.handleReset}
                className="h-16 px-8 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-floating hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <RefreshCcw className="w-5 h-5" /> Reboot Session
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="h-16 px-8 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <Home className="w-5 h-5" /> Return Base
              </button>
            </div>

            <div className="pt-10 flex items-center justify-center gap-8">
               <a href="#" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Support Nexus
               </a>
               <div className="w-1 h-1 bg-slate-200 rounded-full" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">CreatorForge Analytics v4.2.0</p>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
