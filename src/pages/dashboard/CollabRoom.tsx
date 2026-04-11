import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Calendar, BrainCircuit, 
  FileText, BarChart3, ChevronLeft, Send, 
  Plus, Check, Sparkles, Clock, Globe
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/shared/MotionComponents';
import { usePulse } from '../../contexts/PulseContext';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

type TabType = 'CHAT' | 'BRAINSTORM' | 'PLANNER' | 'TERMS' | 'EDITOR' | 'ANALYTICS';

export const CollabRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collabRooms } = usePulse();
  const [activeTab, setActiveTab] = useState<TabType>('CHAT');
  const [isLoading, setIsLoading] = useState(true);

  const room = collabRooms.find(r => r.id === id) || collabRooms[0];

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const tabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'CHAT', label: 'Room Chat', icon: MessageSquare },
    { id: 'BRAINSTORM', label: 'AI Brainstorm', icon: BrainCircuit },
    { id: 'PLANNER', label: 'Calendar', icon: Calendar },
    { id: 'TERMS', label: 'Deal Terms', icon: FileText },
    { id: 'EDITOR', label: 'Drafting', icon: Send },
    { id: 'ANALYTICS', label: 'Unified Stats', icon: BarChart3 },
  ];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Collab Node...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="h-[100px] px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-slate-400" />
          </button>
          
          <div className="h-10 w-[1px] bg-slate-100" />

          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src={room.partnerAvatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm bg-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-950 uppercase tracking-tight">Project: {room.partnerName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active • Expires in 6 Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 h-12 bg-slate-950 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-lg">
            Complete Collab <Check className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sub-nav Sidebar */}
        <aside className="w-[280px] border-r border-slate-100 bg-white flex flex-col p-4 gap-2 shrink-0">
          <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Workspace Modules</p>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group",
                activeTab === tab.id 
                  ? "bg-slate-950 text-white shadow-xl shadow-slate-200" 
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-indigo-400" : "group-hover:text-indigo-600")} />
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}

          <div className="mt-auto p-6 bg-indigo-50 border border-indigo-100/50 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Strategist</span>
              </div>
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">
                "Based on your recent niches, a 'Day in the Life' swap would generate 2.4x more saves."
              </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-slate-50 p-10 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto h-full"
            >
              {activeTab === 'CHAT' && (
                <div className="h-full flex flex-col gap-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                         <Users className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="bg-white p-6 rounded-3xl rounded-tl-none border border-slate-100 shadow-sm max-w-lg">
                        <p className="text-sm font-bold text-slate-900">Hey! Just saw the AI brainstorm. I love the idea of a 4-part series.</p>
                        <span className="text-[9px] font-black text-slate-300 mt-2 block uppercase tracking-widest">12:31 PM</span>
                      </div>
                    </div>
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-200">
                         <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-indigo-600 p-6 rounded-3xl rounded-tr-none text-white shadow-xl shadow-indigo-100 max-w-lg">
                        <p className="text-sm font-bold">Awesome. Let's lock in the dates in the calendar module.</p>
                        <span className="text-[9px] font-black text-white/50 mt-2 block uppercase tracking-widest">12:34 PM</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-20 bg-white border border-slate-100 rounded-[2rem] px-8 flex items-center gap-6 shadow-premium relative z-10 shrink-0">
                    <Plus className="w-6 h-6 text-slate-300 hover:text-slate-950 transition-colors cursor-pointer" />
                    <input type="text" placeholder="Type your strategic response..." className="flex-1 bg-transparent text-sm font-bold text-slate-950 placeholder:text-slate-200 focus:outline-none" />
                    <button className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all active:scale-95 shadow-xl">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'BRAINSTORM' && (
                <div className="space-y-10">
                   <div className="grid grid-cols-2 gap-8">
                      {[
                        { title: 'The Niche Flip', idea: 'Swap morning routines for 24 hours. Minimalist vs Maximalist.', match: '98% audience match' },
                        { title: 'Unified Q&A', idea: 'A live split-screen session answering growth questions.', match: 'High engagement potential' },
                        { title: 'Creative Sprint', idea: 'One script, two very different editing styles.', match: 'Viral potential' },
                      ].map((item, i) => (
                        <div key={i} className="p-8 bg-white border border-slate-100 rounded-[3rem] hover:shadow-floating transition-all group">
                           <div className="flex items-center justify-between mb-4">
                              <h3 className="text-xl font-black text-slate-950 uppercase">{item.title}</h3>
                              <span className="text-[9px] font-black px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">{item.match}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-400 mb-6 group-hover:text-slate-600 transition-colors uppercase leading-relaxed">{item.idea}</p>
                           <button className="w-full py-4 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-600 hover:bg-indigo-50 transition-all">Select Concept</button>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'TERMS' && (
                <div className="bg-white border border-slate-100 rounded-[4rem] p-16 space-y-12 shadow-premium">
                   <div className="flex items-center justify-between">
                      <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Collaboration Deal Terms</h2>
                      <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
                         <Globe className="w-4 h-4 text-slate-300" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Legal Shield v1.2 Active</span>
                      </div>
                   </div>
                   
                   <div className="space-y-8">
                      {[
                        { label: 'Content Type', value: '4 Reels (Split 2/2)' },
                        { label: 'Revenue Split', value: '50% / 50% from AdSense' },
                        { label: 'Exclusivity', value: '14 Days (Fitness Niche)' },
                        { label: 'Posting Window', value: 'Oct 14 - Oct 21' },
                      ].map((term, i) => (
                        <div key={i} className="flex items-center border-b border-slate-50 pb-8 last:border-0">
                           <span className="w-48 text-[11px] font-black uppercase tracking-widest text-slate-400 shrink-0">{term.label}</span>
                           <span className="text-lg font-black text-slate-900 uppercase">{term.value}</span>
                           <button className="ml-auto text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest">Verify</button>
                        </div>
                      ))}
                   </div>

                   <div className="p-8 bg-slate-950 rounded-[2.5rem] flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-white" />
                         </div>
                         <p className="text-sm font-bold text-white uppercase tracking-tight">Both creators must sign to activate Legal Shield</p>
                      </div>
                      <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95">
                         Sign Terms
                      </button>
                   </div>
                </div>
              )}

              {/* Placeholder for other tabs */}
              {!['CHAT', 'BRAINSTORM', 'TERMS'].includes(activeTab) && (
                <div className="h-full flex items-center justify-center text-slate-300 text-[10px] font-black uppercase tracking-widest">
                   Module {activeTab} Intelligence Node Ready
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
};
