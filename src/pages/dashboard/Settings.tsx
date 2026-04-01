import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Globe, Palette, Shield, 
  Bell, CreditCard, Save, Camera, 
  Instagram, Youtube, Sparkles, Plus, X
} from "lucide-react";
import { PageTransition } from "../../components/shared/MotionComponents";
import { useAuth, User as UserType } from "../../contexts/AuthContext";
import { toast } from "sonner";

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
    toast.success("Settings saved successfully! ✨");
  };

  const updateFollowers = (platform: string, count: string) => {
    setFormData(prev => ({
      ...prev,
      followerCounts: { ...prev.followerCounts, [platform]: count }
    }));
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* SIDEBAR TABS */}
          <div className="w-full md:w-64 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold" 
                    : "text-muted-foreground hover:bg-muted/50 font-medium"
                }`}
              >
                <tab.icon className="w-4.5 h-4.5" />
                <span className="text-sm">{tab.id}</span>
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 space-y-8">
            {activeTab === "Profile" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8 space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                       <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-white overflow-hidden shadow-2xl">
                          {user?.photo ? (
                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user?.name[0]
                          )}
                       </div>
                       <button className="absolute -bottom-2 -right-2 p-2 bg-background border border-border/40 rounded-xl shadow-lg hover:text-primary transition-colors">
                          <Camera className="w-4 h-4" />
                       </button>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                       <h3 className="text-xl font-bold">{user?.name}</h3>
                       <p className="text-sm text-muted-foreground">{user?.handle}</p>
                       <p className="text-xs font-medium uppercase tracking-widest text-primary mt-1">{user?.niche} Creator</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                       <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 bg-muted/20 border border-border/40 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 bg-muted/20 border border-border/40 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Creator Handel</label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                          <input 
                            type="text" 
                            value={formData.handle?.replace('@', '')}
                            onChange={(e) => setFormData({ ...formData, handle: `@${e.target.value}` })}
                            className="w-full h-12 bg-muted/20 border border-border/40 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Niche</label>
                       <div className="relative">
                          <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <select 
                            value={formData.niche}
                            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                            className="w-full h-12 bg-muted/20 border border-border/40 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                          >
                             {["Fitness", "Lifestyle", "Beauty", "Tech", "Food", "Travel", "Finance", "Gaming", "Fashion", "Other"].map(n => (
                               <option key={n} value={n}>{n}</option>
                             ))}
                          </select>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Platforms" && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8 space-y-8">
                   <h3 className="text-xl font-bold">Connected Platforms</h3>
                   <div className="space-y-4">
                      {[
                        { name: "Instagram", icon: Instagram, color: "text-pink-500" },
                        { name: "YouTube", icon: Youtube, color: "text-red-500" },
                        { name: "TikTok", icon: Sparkles, color: "text-zinc-900 dark:text-white" },
                      ].map(p => (
                        <div key={p.name} className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-muted/10 border border-border/20">
                           <div className="flex items-center gap-4 flex-1">
                              <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm ${p.color}`}>
                                 <p.icon className="w-6 h-6" />
                              </div>
                              <div>
                                 <span className="font-bold">{p.name}</span>
                                 <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                                 </div>
                              </div>
                           </div>
                           <div className="w-full md:w-64 space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follower Count</label>
                              <input 
                                type="text"
                                value={formData.followerCounts?.[p.name] || ""}
                                onChange={(e) => updateFollowers(p.name, e.target.value)}
                                placeholder="e.g. 120K"
                                className="w-full h-10 bg-background border border-border/40 rounded-xl px-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                   <button className="w-full h-14 rounded-2xl border-2 border-dashed border-border/60 text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group text-xs font-black uppercase tracking-widest">
                      <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                      Add Another Platform
                   </button>
                </div>
              </motion.div>
            )}

            {activeTab === "Appearance" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8 space-y-8">
                   <h3 className="text-xl font-bold">App Appearance</h3>
                   <div className="grid grid-cols-2 gap-4">
                      {['Dark Mode', 'Glassmorphism', 'High Contrast', 'Minimalist'].map(mode => (
                        <button key={mode} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-3 hover:border-primary transition-all group">
                           <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Palette className="w-6 h-6 text-primary" />
                           </div>
                           <span className="text-xs font-black uppercase tracking-widest">{mode}</span>
                        </button>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Privacy" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8 space-y-8">
                   <h3 className="text-xl font-bold">Privacy & Exposure</h3>
                   <div className="space-y-4">
                      {[
                        { label: 'Public Profile Visibility', desc: 'Allow brands to find your media kit in the discovery feed.' },
                        { label: 'Direct Message Requests', desc: 'Filter incoming DMs from accounts you don\'t follow.' },
                        { label: 'Show Earning stats', desc: 'Display total revenue figures on your public media kit.' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                           <div className="max-w-md">
                              <p className="font-bold text-sm">{item.label}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                           </div>
                           <div className="w-12 h-6 rounded-full bg-primary/20 p-1 cursor-pointer">
                              <div className="w-4 h-4 rounded-full bg-primary" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Notifications" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8 space-y-8">
                   <h3 className="text-xl font-bold">Communication Prefs</h3>
                   <div className="space-y-4">
                      {[
                        { label: 'Deal Alerts', desc: 'Instant push notification when a brand contacts you.' },
                        { label: 'Weekly Growth Summary', desc: 'Monday morning AI performance report.' },
                        { label: 'Platform Sync Reminders', desc: 'Alerts when OAuth tokens are nearing expiration.' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                           <div>
                              <p className="font-bold text-sm">{item.label}</p>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                           </div>
                           <div className="w-12 h-6 rounded-full bg-emerald-500 p-1 cursor-pointer flex justify-end">
                              <div className="w-4 h-4 rounded-full bg-white" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === "Billing" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="premium-card bg-card border border-primary/20 rounded-3xl p-8 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16" />
                   <div className="flex items-center justify-between relative z-10">
                      <div>
                         <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-2">Current Plan</p>
                         <h3 className="text-3xl font-black">CreatorForge <span className="text-primary italic">Pro</span></h3>
                      </div>
                      <div className="text-right">
                         <p className="text-2xl font-black">$29/mo</p>
                         <p className="text-[10px] font-black text-muted-foreground uppercase">Next bill: April 22, 2026</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <button className="flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] transition-all">Manage Subscription</button>
                      <button className="px-8 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                         <CreditCard className="w-4 h-4" /> View Invoices
                      </button>
                   </div>
                </div>
                <div className="premium-card bg-card border border-border/40 rounded-3xl p-8">
                   <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Security & Password</h3>
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <input type="password" placeholder="Current Password" className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm" />
                         <input type="password" placeholder="New Password" className="h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm" />
                      </div>
                      <button className="w-full py-4 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all">Update Password</button>
                   </div>
                </div>
              </motion.div>
            )}

            {/* SAVE BUTTON */}
            <div className="flex justify-between items-center pt-4">
               {activeTab === "Privacy" && (
                 <button className="text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-all flex items-center gap-2">
                   <X className="w-4 h-4" /> Delete Account
                 </button>
               )}
               <div className="flex-1" />
               <button 
                onClick={handleSave}
                className="flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:shadow-[0_0_30px_-5px_hsl(var(--primary))] transition-all active:scale-95"
               >
                  <Save className="w-4 h-4" /> Save Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
