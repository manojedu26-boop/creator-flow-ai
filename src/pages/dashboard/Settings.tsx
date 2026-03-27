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

            {/* SAVE BUTTON */}
            <div className="flex justify-end pt-4">
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
