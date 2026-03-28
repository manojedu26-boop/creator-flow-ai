// src/components/shared/ConfirmationModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'text-red-500 bg-red-500/10 border-red-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    info: 'text-primary bg-primary/10 border-primary/20'
  };

  const btnColors = {
    danger: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-primary hover:bg-primary/80'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-[2rem] p-8 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${colors[variant]}`}>
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                {description}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={onCancel}
                className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                {cancelLabel}
              </button>
              <button 
                onClick={onConfirm}
                className={`flex-1 h-12 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${btnColors[variant]}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
