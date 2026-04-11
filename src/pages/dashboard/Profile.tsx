import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Grid, Play, Bookmark, UserCheck, 
  ChevronDown, MoreHorizontal, Heart, MessageSquare, 
  Link as LinkIcon, Lock, ArrowLeft, Check
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "@/lib/utils";

export const Profile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const isMe = id === 'me' || !id;
  const [activeTab, setActiveTab] = useState<'POSTS' | 'REELS' | 'SAVED' | 'TAGGED'>('POSTS');

  const creator = {
    name: isMe ? (user?.name || "Neural Operator") : "Maya Hills",
    handle: isMe ? (user?.handle || "operator_01") : "mayahills_vlog",
    category: "Digital Creator",
    bio: isMe ? `Strategic storytelling for the AI era. Building the future of ${user?.niche || 'creative'} nodes.` : "Cinematic travel & wellness routines. Partnered with 20+ global brands. 📍 Mumbai",
    website: "creatorforge.ai/nexus",
    stats: {
      posts: "128",
      followers: isMe ? "48.2K" : "24.5K",
      following: "425"
    },
    posts: Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i * 123456}?w=600&h=600&fit=crop`,
      likes: "1.2K",
      comments: "48",
      type: i % 3 === 0 ? 'REEL' : 'STATIC'
    }))
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav (Mobile) */}
      <div className="md:hidden sticky top-0 z-[100] bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Lock className="w-4 h-4" />
            <h1 className="text-lg font-black tracking-tight text-slate-900">{creator.handle}</h1>
            <ChevronDown className="w-4 h-4" />
         </div>
         <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-2 h-2 bg-rose-500 rounded-full absolute -top-1 -right-1 ring-2 ring-white" />
              <Settings className="w-6 h-6" />
            </div>
         </div>
      </div>

      <main className="max-w-4xl mx-auto pt-8 md:pt-12 px-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-8 md:gap-20 mb-12">
           {/* Avatar Area */}
           <div className="flex items-center justify-center md:block">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600">
                 <div className="w-20 h-20 md:w-40 md:h-40 rounded-full border-[3px] md:border-[5px] border-white overflow-hidden bg-slate-100">
                    <img 
                       src={isMe ? user?.photo : `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.handle}`} 
                       className="w-full h-full object-cover" 
                       alt="Profile" 
                    />
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                 <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">{creator.handle}</h2>
                 <div className="flex gap-2">
                    {isMe ? (
                       <>
                         <button className="flex-1 md:flex-none h-9 px-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-bold transition-colors">Edit Profile</button>
                         <button className="flex-1 md:flex-none h-9 px-6 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-bold transition-colors">View Archive</button>
                         <button className="hidden md:flex h-9 w-9 bg-slate-100 items-center justify-center rounded-lg"><Settings className="w-5 h-5" /></button>
                       </>
                    ) : (
                       <>
                         <button className="h-9 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[13px] font-bold transition-all">Follow</button>
                         <button className="h-9 px-8 bg-slate-100 hover:bg-slate-200 rounded-lg text-[13px] font-bold transition-all">Message</button>
                       </>
                    )}
                 </div>
              </div>

              {/* Stats - Desktop */}
              <div className="hidden md:flex gap-10">
                 <div className="text-[16px]"><span className="font-bold">{creator.stats.posts}</span> posts</div>
                 <div className="text-[16px]"><span className="font-bold">{creator.stats.followers}</span> followers</div>
                 <div className="text-[16px]"><span className="font-bold">{creator.stats.following}</span> following</div>
              </div>

              {/* Bio area */}
              <div className="space-y-1">
                 <p className="font-bold text-[14px] md:text-[15px]">{creator.name}</p>
                 <p className="text-slate-500 text-[14px]">{creator.category}</p>
                 <p className="text-[14px] md:text-[15px] leading-relaxed whitespace-pre-wrap">{creator.bio}</p>
                 <a href="#" className="flex items-center gap-1.5 text-indigo-900 font-bold text-[14px] hover:underline">
                    <LinkIcon className="w-4 h-4" /> {creator.website}
                 </a>
              </div>
           </div>
        </header>

        {/* Stats - Mobile */}
        <div className="md:hidden flex justify-around py-4 border-t border-slate-100 mb-4">
           <div className="text-center">
              <p className="font-bold leading-none">{creator.stats.posts}</p>
              <p className="text-[13px] text-slate-400 mt-1">posts</p>
           </div>
           <div className="text-center">
              <p className="font-bold leading-none">{creator.stats.followers}</p>
              <p className="text-[13px] text-slate-400 mt-1">followers</p>
           </div>
           <div className="text-center">
              <p className="font-bold leading-none">{creator.stats.following}</p>
              <p className="text-[13px] text-slate-400 mt-1">following</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-slate-200 flex justify-center gap-12 md:gap-16">
           {(['POSTS', 'REELS', 'SAVED', 'TAGGED'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "py-4 flex items-center gap-2 transition-all relative",
                  activeTab === tab ? "text-slate-900" : "text-slate-400"
                )}
              >
                 {activeTab === tab && <motion.div layoutId="tab-active" className="absolute top-0 inset-x-0 h-0.5 bg-slate-900" />}
                 {tab === 'POSTS' && <Grid className="w-4 h-4 md:w-3.5 md:h-3.5" />}
                 {tab === 'REELS' && <Play className="w-4 h-4 md:w-3.5 md:h-3.5" />}
                 {tab === 'SAVED' && <Bookmark className="w-4 h-4 md:w-3.5 md:h-3.5" />}
                 <span className="hidden md:inline text-[12px] font-bold tracking-widest uppercase">{tab}</span>
              </button>
           ))}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-3 gap-1 md:gap-8 pb-32">
           {creator.posts.map((post) => (
              <motion.div 
                key={post.id}
                whileHover={{ opacity: 0.9 }}
                className="aspect-square bg-slate-100 relative group cursor-pointer overflow-hidden md:rounded-xl"
              >
                 <img src={post.thumbnail} className="w-full h-full object-cover" alt="Post" />
                 {post.type === 'REEL' && (
                    <div className="absolute top-3 right-3 text-white drop-shadow-md">
                       <Play className="w-5 h-5 fill-current" />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                    <div className="flex items-center gap-2">
                       <Heart className="w-5 h-5 fill-current" /> {post.likes}
                    </div>
                    <div className="flex items-center gap-2">
                       <MessageSquare className="w-5 h-5 fill-current" /> {post.comments}
                    </div>
                 </div>
              </motion.div>
           ))}
        </div>
      </main>
    </div>
  );
};
