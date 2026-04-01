import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Globe, Palette, Shield, 
  Bell, CreditCard, Save, Camera, 
  Instagram, Youtube, Sparkles, Plus, X,
  ChevronRight, Laptop, Moon, Sun, Monitor,
  ShieldCheck, Lock, Activity, Receipt, RefreshCcw
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { useAuth, User as UserType } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const [formData, setFormData] = useState<Partial<UserType>>({
    name: user?.name || "",
    handle: user?.handle || "",
    email: user?.email || "",
    niche: user?.niche || "",
    followerCounts: user?.followerCounts || {}
  });

  const tabs = [
    { id: "Profile", icon: User },
    { id: "Platforms", icon: Globe },
    { id: "Appearance", icon: Palette },
    { id: "Privacy", icon: Shield },
    { id: "Notifications", icon: Bell },
    { id: "Billing", icon: CreditCard },
  ];

  const handleSave = () => {
    updateUser(formData);
    toast.success("Settings synchronized! 🎉", {
      description: "Profile updates have been deployed globally."
    });
  };

  const updateFollowers = (platform: string, count: string) => {
    setFormData(prev => ({
      ...prev,
      followerCounts: { ...prev.followerCounts, [platform]: count }
    }));
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-10 pb-24">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">
               System Configuration
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              Control <span className="text-blue-600">Center</span>
            </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full lg:w-72 space-y-2 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                      "w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group",
                      activeTab === tab.id 
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-blue-400" : "text-slate-300 group-hover:text-blue-500")} />
                    <span className="text-[11px] font-black uppercase tracking-[0.15em]">{tab.id}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", activeTab === tab.id ? "opacity-100 translate-x-1" : "opacity-0")} />
                </button>
              ))}
            </div>

            <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 mt-8">
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Security Status</p>
               <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[11px] font-bold text-slate-600">Encrypted Session</span>
               </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "Profile" && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                      <div className="relative">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-5xl font-black text-white overflow-hidden shadow-2xl ring-8 ring-slate-50 transition-transform group-hover:scale-105">
                            {user?.photo ? (
                              <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user?.name[0]
                            )}
                         </div>
                         <button className="absolute -bottom-2 -right-2 p-3.5 bg-blue-600 text-white rounded-2xl shadow-xl hover:bg-slate-900 transition-all active:scale-90 border-4 border-white">
                            <Camera className="w-5 h-5" />
                         </button>
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-2">
                         <h3 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">{user?.name}</h3>
                         <p className="text-sm font-bold text-slate-400">@{user?.handle?.replace('@', '')}</p>
                         <div className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em]">
                            Verified {user?.niche} Authority
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: "Legal Identity", icon: User, key: "name", type: "text" },
                        { label: "Digital Address", icon: Mail, key: "email", type: "email" },
                        { label: "Creator Handle", icon: Sparkles, key: "handle", prefix: "@" },
                        { label: "Domain Focus", icon: Activity, key: "niche", type: "select", options: ["Fitness", "Lifestyle", "Beauty", "Tech", "Food", "Travel", "Finance", "Gaming", "Fashion", "Other"] }
                      ].map(field => (
                        <div key={field.key} className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{field.label}</label>
                          <div className="relative group/input">
                            {field.icon && <field.icon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within/input:text-blue-600 transition-colors" />}
                            {field.prefix && <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black group-focus-within/input:text-blue-600 transition-colors">{field.prefix}</span>}
                            
                            {field.type === "select" ? (
                              <select 
                                value={formData.niche}
                                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white appearance-none cursor-pointer shadow-inner"
                              >
                                {field.options?.map(n => (
                                  <option key={n} value={n}>{n}</option>
                                ))}
                              </select>
                            ) : (
                              <input 
                                type={field.type} 
                                value={field.key === "handle" ? formData.handle?.replace('@', '') : (formData as any)[field.key]}
                                onChange={(e) => setFormData({ ...formData, [field.key]: field.key === "handle" ? `@${e.target.value}` : e.target.value })}
                                className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all shadow-inner placeholder:text-slate-300"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Platforms" && (
                <motion.div 
                  key="platforms"
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                     <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 mb-10">Live Integrations</h3>
                     <div className="space-y-6">
                        {[
                          { name: "Instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-50" },
                          { name: "YouTube", icon: Youtube, color: "text-red-500", bg: "bg-red-50" },
                          { name: "TikTok", icon: Sparkles, color: "text-slate-900", bg: "bg-slate-50" },
                        ].map(p => (
                          <div key={p.name} className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                             <div className="flex items-center gap-6 flex-1">
                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner border border-slate-50", p.bg)}>
                                   <p.icon className={cn("w-8 h-8", p.color)} />
                                </div>
                                <div>
                                   <span className="text-lg font-black uppercase tracking-tight text-slate-900">{p.name}</span>
                                   <div className="flex items-center gap-2 mt-1">
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Data Stream</span>
                                   </div>
                                </div>
                             </div>
                             <div className="w-full md:w-72 space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 tracking-[0.2em]">Verified Reach</label>
                                <input 
                                  type="text"
                                  value={formData.followerCounts?.[p.name] || ""}
                                  onChange={(e) => updateFollowers(p.name, e.target.value)}
                                  placeholder="e.g. 120.5K"
                                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-[13px] font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white shadow-inner transition-all"
                                />
                             </div>
                          </div>
                        ))}
                     </div>
                     <button className="w-full h-16 rounded-[2rem] border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-4 group text-[11px] font-black uppercase tracking-[0.3em] mt-8">
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        Expand Network
                     </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "Appearance" && (
                <motion.div key="appearance" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                     <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 mb-10">Brand Esthetic</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                          { mode: 'Professional White', icon: Sun, desc: 'Corporate high-fidelity light interface' },
                          { mode: 'Cinematic Dark', icon: Moon, desc: 'Ultra-premium dark performance suite' },
                          { mode: 'Glass Prism', icon: Laptop, desc: 'Layered translucent surfaces' },
                          { mode: 'Dynamic Matrix', icon: Monitor, desc: 'Adaptive system intelligence' }
                        ].map(mode => (
                          <button key={mode.mode} className={cn(
                              "p-8 rounded-[2.5rem] border flex flex-col items-start gap-6 transition-all group relative overflow-hidden",
                              mode.mode === 'Professional White' ? "bg-slate-900 text-white border-slate-900 shadow-2xl" : "bg-white border-slate-100 text-slate-900 hover:border-blue-200 hover:bg-slate-50"
                          )}>
                             <div className={cn(
                                 "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                                 mode.mode === 'Professional White' ? "bg-white/10" : "bg-slate-50 border border-slate-100 shadow-inner"
                             )}>
                                <mode.icon className={cn("w-7 h-7", mode.mode === 'Professional White' ? "text-white" : "text-slate-400")} />
                             </div>
                             <div className="text-left">
                                <span className={cn("text-sm font-black uppercase tracking-widest block", mode.mode === 'Professional White' ? "text-white" : "text-slate-900")}>{mode.mode}</span>
                                <span className={cn("text-[10px] font-bold mt-1 block", mode.mode === 'Professional White' ? "text-white/40" : "text-slate-400")}>{mode.desc}</span>
                             </div>
                             {mode.mode === 'Professional White' && (
                                <div className="absolute top-6 right-6">
                                   <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#2563eb]" />
                                </div>
                             )}
                          </button>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Privacy" && (
                <motion.div key="privacy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                     <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 mb-10">Data Shield</h3>
                     <div className="space-y-4">
                        {[
                          { label: 'Public Profile Visibility', desc: 'Allow top-tier brands to discover your media kit.', icon: Globe },
                          { label: 'Smart Filtering', desc: 'AI-powered spam suppression for incoming inquiries.', icon: ShieldCheck },
                          { label: 'Revenue Obfuscation', desc: 'Conceal precise earning figures from non-partners.', icon: Lock }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
                             <div className="flex items-center gap-6 max-w-lg">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                   <item.icon className="w-6 h-6 text-slate-400" />
                                </div>
                                <div className="min-w-0">
                                   <p className="font-black text-sm text-slate-900 uppercase tracking-tight">{item.label}</p>
                                   <p className="text-[11px] text-slate-400 font-bold mt-1">{item.desc}</p>
                                </div>
                             </div>
                             <div className="w-14 h-7 rounded-full bg-slate-200 p-1 cursor-pointer transition-colors hover:bg-blue-600 relative">
                                <div className="w-5 h-5 rounded-full bg-white shadow-md absolute right-1 top-1" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Notifications" && (
                <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                     <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900 mb-10">Dispatch Prefs</h3>
                     <div className="space-y-4">
                        {[
                          { label: 'High-Value Deal Alerts', desc: 'Real-time synchronization for contract opportunities.', icon: Sparkles },
                          { label: 'Strategic Growth Recap', desc: 'Weekly AI-curated performance audit and roadmap.', icon: Activity },
                          { label: 'Compliance Sync', desc: 'Verification alerts for platform API credentials.', icon: RefreshCcw }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-blue-200 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                   <item.icon className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                   <p className="font-black text-sm text-slate-900 uppercase tracking-tight">{item.label}</p>
                                   <p className="text-[11px] text-slate-400 font-bold mt-1">{item.desc}</p>
                                </div>
                             </div>
                             <div className="w-14 h-7 rounded-full bg-blue-600 p-1 cursor-pointer transition-colors relative">
                                <div className="w-5 h-5 rounded-full bg-white shadow-md absolute right-1 top-1" />
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Billing" && (
                <motion.div key="billing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="bg-slate-900 border border-slate-900 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full -mr-32 -mt-32 animate-pulse" />
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -ml-16 -mb-16" />
                     
                     <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-8">
                        <div className="text-center md:text-left">
                           <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.4em] mb-4">Subscription Matrix</p>
                           <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">CreatorForge <span className="text-blue-500">Pro</span></h3>
                        </div>
                        <div className="text-center md:text-right">
                           <p className="text-4xl font-black text-white tracking-tight">$29<span className="text-sm font-bold text-white/40 uppercase">/month</span></p>
                           <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-2">Next Cycle: April 22, 2026</p>
                        </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-4 mt-12 relative z-10">
                        <button className="flex-1 h-16 rounded-[1.5rem] bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] transition-all">Sychronize Plan</button>
                        <button className="px-10 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                           <Receipt className="w-5 h-5 text-blue-400" /> Archive
                        </button>
                     </div>
                  </div>
                  <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 md:p-14 shadow-sm">
                     <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Access Protection</h3>
                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 tracking-[0.2em]">Current Access Token</label>
                              <input type="password" placeholder="••••••••••••" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white shadow-inner" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2 tracking-[0.2em]">New Access Token</label>
                              <input type="password" placeholder="New Secret" className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 text-sm font-black focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white shadow-inner" />
                           </div>
                        </div>
                        <button className="w-full py-5 rounded-[1.5rem] border border-slate-200 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all shadow-sm">Recalibrate Password</button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SAVE BUTTON */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-6">
               {activeTab === "Privacy" && (
                 <button className="text-[11px] font-black uppercase tracking-[0.3em] text-rose-500 hover:text-rose-600 transition-all flex items-center gap-3">
                   <X className="w-5 h-5" /> Terminate Account
                 </button>
               )}
               <div className="flex-1" />
               <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
               >
                  <Save className="w-5 h-5" /> Commit Changes
               </motion.button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
