import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: '50vh' | '70vh' | '90vh' | 'auto';
  showCloseButton?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  height = '50vh',
  showCloseButton = true
}) => {
  const y = useSpring(0, { damping: 20, stiffness: 200 });
  const [isDragDismissing, setIsDragDismissing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      y.set(0);
      setIsDragDismissing(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, y]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[8px] lg:left-[var(--sidebar-w)]"
          />
          
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isDragDismissing ? "100%" : "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            style={{ y, maxHeight: '90vh', height: height === 'auto' ? 'auto' : height }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                setIsDragDismissing(true);
                onClose();
              } else {
                y.set(0);
              }
            }}
            className={`absolute bottom-0 left-0 right-0 lg:left-[var(--sidebar-w)] bg-background border-t border-white/10 rounded-t-[2rem] shadow-2xl flex flex-col`}
          >
            <div className="flex-shrink-0 w-full flex flex-col items-center pt-4 pb-2 z-10 bg-background rounded-t-[2rem] cursor-grab active:cursor-grabbing">
              <div className="w-8 h-1 rounded-full bg-white/20 mb-4" />
              
              <div className="w-full flex items-center justify-between px-6 relative">
                 {title && <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>}
                 {showCloseButton && (
                   <button 
                     onClick={onClose} 
                     className={`p-2 rounded-xl hover:bg-white/5 transition-colors ${!title ? 'ml-auto' : ''}`}
                   >
                     <X className="w-5 h-5 text-zinc-400" />
                   </button>
                 )}
              </div>
            </div>

            <div className={`flex-1 overflow-y-auto no-scrollbar px-6 pb-safe-offset ${!title ? 'pt-2' : 'pt-4'}`}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
