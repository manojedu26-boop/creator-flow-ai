import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Camera, Video, BarChart3, 
  Handshake, Megaphone, Sparkles, X, 
  ArrowRight, Image as ImageIcon, CheckCircle2, Zap 
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { usePulse, StoryType } from '@/contexts/PulseContext';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

interface StoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorCard = ({ icon: Icon, title, subtitle, onClick, color }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full p-8 rounded-[3rem] bg-slate-50 border border-slate-100 flex items-center gap-8 group hover:border-indigo-600 transition-all text-left relative overflow-hidden"
  >
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg", color)}>
      <Icon className="w-8 h-8 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight">{title}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtitle}</p>
    </div>
    <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" />
  </motion.button>
);

export const StoryCreator: React.FC<StoryCreatorProps> = ({ isOpen, onClose }) => {
  const { addStory } = usePulse();
  const [step, setStep] = useState<'select' | 'details'>('select');
  const [selectedType, setSelectedType] = useState<StoryType | null>(null);
  const [milestone, setMilestone] = useState('');

  const handlePost = () => {
    if (!selectedType) return;
    
    addStory({
      creatorId: 'me',
      creatorName: 'Naveen',
      creatorHandle: 'naveenfitlife',
      creatorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Naveen',
      platform: 'IG',
      niche: 'Fitness',
      type: selectedType,
      content: { milestone: milestone || 'Hit a new goal!', message: 'Strategic progress made.' },
    });

    toast.success("Story Synchronized 🚀", {
      description: "Your network has been notified of the update."
    });
    
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('select');
      setSelectedType(null);
      setMilestone('');
    }, 300);
  };

  const creatorOptions = [
    { type: 'WIN', title: 'Win Story', subtitle: 'Share a milestone', icon: Trophy, color: 'bg-indigo-600 shadow-indigo-600/20' },
    { type: 'BTS', title: 'Behind Scenes', subtitle: 'Capture your day', icon: Camera, color: 'bg-emerald-600 shadow-emerald-600/20' },
    { type: 'TREND', title: 'Trend Alert', subtitle: 'Jump on what\'s hot', icon: Zap, color: 'bg-primary shadow-primary/20' },
    { type: 'POLL', title: 'Poll Network', subtitle: 'Ask a question', icon: BarChart3, color: 'bg-amber-600 shadow-amber-600/20' },
    { type: 'COLLAB', title: 'Open Collab', subtitle: 'Find partners', icon: Handshake, color: 'bg-slate-900 shadow-slate-900/20' },
    { type: 'BRAND', title: 'Brand Update', subtitle: 'Share a deal', icon: Megaphone, color: 'bg-rose-600 shadow-rose-600/20' },
  ];

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title="The Pulse Architecture" height="90vh">
      <div className="p-8 md:p-12 space-y-12">
        <AnimatePresence mode="wait">
          {step === 'select' ? (
            <motion.div 
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {creatorOptions.map(opt => (
                  <CreatorCard 
                    key={opt.type} 
                    {...opt} 
                    onClick={() => {
                        setSelectedType(opt.type as StoryType);
                        setStep('details');
                    }} 
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="space-y-12"
            >
              <div className="p-12 rounded-[4rem] bg-slate-50 border border-indigo-100 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8">
                   <Sparkles className="w-12 h-12 text-indigo-100 group-hover:text-indigo-200 transition-colors" />
                </div>
                <div className="space-y-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600">Template: {selectedType} Mode</span>
                  <input 
                    autoFocus
                    placeholder="Describe your achievement..." 
                    className="w-full bg-transparent text-3xl font-black text-slate-950 placeholder:text-slate-200 focus:outline-none"
                    value={milestone}
                    onChange={(e) => setMilestone(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4">
                  <button className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-3 hover:border-indigo-600 transition-all shadow-sm">
                    <Sparkles className="w-4 h-4" /> AI Generate Caption
                  </button>
                  <button className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                    <ImageIcon className="w-4 h-4" /> Add Asset
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                 <button 
                  onClick={() => setStep('select')}
                  className="flex-1 h-20 rounded-[2rem] bg-white border border-slate-200 text-slate-950 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-slate-50 transition-all"
                 >
                   Back to Node
                 </button>
                 <button 
                  onClick={handlePost}
                  disabled={!milestone}
                  className="flex-[2] h-20 rounded-[2rem] bg-indigo-600 text-white font-black text-[12px] uppercase tracking-[0.3em] shadow-floating-blue hover:bg-indigo-700 transition-all disabled:opacity-50"
                 >
                   Synchronise to Pulse
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  );
};
