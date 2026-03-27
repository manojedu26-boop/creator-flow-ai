import { AlertTriangle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ 
  title = "Couldn't load your data", 
  description = "We're having trouble connecting to the server. Please check your connection and try again.",
  onRetry 
}: ErrorStateProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/20">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
      </div>
      <h3 className="text-xl font-black tracking-tight mb-2 uppercase">{title}</h3>
      <p className="text-muted-foreground max-w-[300px] mb-8 font-bold text-sm leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-3 px-8 py-3 bg-card border border-border/40 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </button>
      )}
    </motion.div>
  );
};
