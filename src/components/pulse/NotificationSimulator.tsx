import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Briefcase, TrendingUp, DollarSign, Users, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export interface PulseNotification {
  id: string;
  type: 'BRAND' | 'TREND' | 'REVENUE' | 'COLLAB';
  title: string;
  message: string;
  link: string;
  time: string;
}

export const NotificationSimulator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeNotification, setActiveNotification] = useState<PulseNotification | null>(null);

  const mockNotifications: PulseNotification[] = [
    {
      id: '1',
      type: 'BRAND',
      title: 'Brand Opportunity',
      message: "🔴 3 brand opportunities match your profile today. Nike just posted. ₹60K.",
      link: '/explore?tab=casting',
      time: '8:01 AM'
    },
    {
      id: '2',
      type: 'TREND',
      title: 'Trend Alert',
      message: "🔥 #HomeWorkout is trending in your niche. 2,400 creators are on it. Beat them to it.",
      link: '/studio?mode=generator',
      time: '8:05 AM'
    },
    {
      id: '3',
      type: 'REVENUE',
      title: 'Revenue Milestone',
      message: `💰 ${user?.firstName}, you're ₹18,000 away from your monthly goal. 2 brand deals left.`,
      link: '/revenue',
      time: '8:12 AM'
    },
    {
      id: '4',
      type: 'COLLAB',
      title: 'Collab Match',
      message: "✨ 3 creators in fitness are looking for a collab this week. One is a 94% match.",
      link: '/explore?tab=collab',
      time: '8:20 AM'
    }
  ];

  const triggerRandom = () => {
    const notif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
    setActiveNotification(notif);
    
    // Also use system toast for secondary visibility
    toast.custom((t) => (
      <div className="bg-slate-950 text-white p-6 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col gap-4 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
             <Bell className="w-4 h-4 text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Daily Pulse</span>
        </div>
        <p className="text-sm font-bold leading-relaxed">{notif.message}</p>
        <button 
          onClick={() => {
            navigate(notif.link);
            toast.dismiss(t);
          }}
          className="text-[10px] font-black uppercase tracking-widest bg-white text-slate-950 py-2 rounded-xl"
        >
          Open Pulse Node →
        </button>
      </div>
    ));
  };

  // Simulate 8:00 AM trigger logic (Demo mode: triggers 5s after mount once)
  useEffect(() => {
    const timer = setTimeout(triggerRandom, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {activeNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 right-8 z-[1000] w-[350px] bg-white border border-slate-100 rounded-[3rem] shadow-floating overflow-hidden"
        >
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  activeNotification.type === 'BRAND' ? 'bg-indigo-50 text-indigo-600' :
                  activeNotification.type === 'TREND' ? 'bg-rose-50 text-rose-600' :
                  activeNotification.type === 'REVENUE' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                )}>
                  {activeNotification.type === 'BRAND' && <Briefcase className="w-5 h-5" />}
                  {activeNotification.type === 'TREND' && <TrendingUp className="w-5 h-5" />}
                  {activeNotification.type === 'REVENUE' && <DollarSign className="w-5 h-5" />}
                  {activeNotification.type === 'COLLAB' && <Users className="w-5 h-5" />}
                </div>
                <div>
                   <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-950">{activeNotification.title}</h5>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeNotification.time}</p>
                </div>
              </div>
              <button onClick={() => setActiveNotification(null)} className="p-2 hover:bg-slate-50 rounded-full">
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>

            <p className="text-sm font-bold text-slate-900 leading-relaxed">
              {activeNotification.message}
            </p>

            <button
              onClick={() => {
                navigate(activeNotification.link);
                setActiveNotification(null);
              }}
              className="w-full h-14 bg-slate-950 text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 group"
            >
              Action Required <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
