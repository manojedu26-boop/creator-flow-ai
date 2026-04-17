import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface FeedCardProps {
  post: any;
  currentUserId?: string;
}

export const FeedCard = ({ post, currentUserId }: FeedCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = async () => {
    // Optimistic Update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    setIsLiked(!previousLiked);
    setLikesCount(prev => previousLiked ? prev - 1 : prev + 1);

    if (!supabase) return;

    try {
      // In a real app, you'd have a 'post_likes' table and an RPC to handle this
      // For this implementation, we'll simulate the DB sync
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: previousLiked ? previousCount - 1 : previousCount + 1 })
        .eq('id', post.id);

      if (error) throw error;
    } catch (error) {
      // Rollback on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error("Protocol Error", { description: "Synchronization failed." });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm group"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 p-0.5 shadow-md group-hover:scale-110 transition-transform">
            <img 
              src={post.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles?.username}`} 
              alt={post.profiles?.username}
              className="w-full h-full rounded-[0.9rem] object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-tight text-slate-950">{post.profiles?.username}</h4>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-950 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Content */}
      <div className="px-4 pb-4">
        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-50 border border-slate-100 group/media">
          {post.media_url ? (
            <img 
              src={post.media_url} 
              alt="Post content" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-950">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Intelligence Encrypted</span>
            </div>
          )}
          
          <AnimatePresence>
            {isLiked && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="w-32 h-32 text-white/50 fill-white/50 blur-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-all hover:scale-110 active:scale-95",
              isLiked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
            )}
          >
            <Heart className={cn("w-5 h-5", isLiked && "fill-rose-500")} />
            <span className="text-[11px] font-black">{likesCount}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-all hover:scale-110">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[11px] font-black">{post.comments_count}</span>
          </button>

          <button className="text-slate-400 hover:text-emerald-500 transition-all hover:scale-110">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <button className="text-slate-400 hover:text-slate-950 transition-all hover:scale-110">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Caption */}
      <div className="px-6 pb-6">
        <p className="text-[13px] font-medium text-slate-800 leading-relaxed">
          <span className="font-black text-slate-950 mr-2 uppercase text-[11px]">{post.profiles?.username}</span>
          {post.content}
        </p>
      </div>
    </motion.div>
  );
};
