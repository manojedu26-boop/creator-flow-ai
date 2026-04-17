import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { FeedCard } from "./FeedCard";
import { FeedSkeleton } from "./FeedSkeleton";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

const PAGE_SIZE = 5;

export const DynamicFeed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLowerLoading, setIsLowerLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loaderRef = useRef<HTMLDivElement>(null);

  const calculateScore = (post: any) => {
    const likes = post.likes_count || 0;
    const comments = post.comments_count || 0;
    const created = new Date(post.created_at).getTime();
    const now = Date.now();
    const hoursOld = (now - created) / (1000 * 60 * 60);
    const recencyBoost = Math.max(0, 50 - (hoursOld * 1)); // 50 points max for brand new
    return (likes * 2) + (comments * 3) + recencyBoost;
  };

  const fetchPosts = useCallback(async (pageNum: number) => {
    if (!supabase) return;

    try {
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      // Primary fetch — naturally we'd use an RPC for score-based sorting if the DB is massive
      // For now, we fetch by recency and sort client-side for the page
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        // Sort current page by score
        const scoredPosts = data.sort((a, b) => calculateScore(b) - calculateScore(a));
        
        setPosts(prev => pageNum === 0 ? scoredPosts : [...prev, ...scoredPosts]);
        setHasMore(data.length === PAGE_SIZE);
      }
    } catch (error: any) {
      toast.error("Intelligence Failure", { description: error.message });
    } finally {
      setIsLoading(false);
      setIsLowerLoading(false);
    }
  }, []);

  // Real-time Subscriptions
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        async (payload) => {
          // Fetch the full post info (with profiles) for the new insert
          const { data, error } = await supabase
            .from('posts')
            .select('*, profiles(username, avatar_url)')
            .eq('id', payload.new.id)
            .single();

          if (!error && data) {
            toast.info("New Intel Inbound", { 
              description: "A new post has pulsed into your network.",
              icon: <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            });
            setPosts(prev => [data, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (isLoading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLowerLoading) {
          setIsLowerLoading(true);
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [isLoading, hasMore, isLowerLoading]);

  // Fetch when page changes
  useEffect(() => {
    if (page > 0) {
      fetchPosts(page);
    }
  }, [page, fetchPosts]);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0);
  }, [fetchPosts]);

  if (isLoading) return <FeedSkeleton />;

  return (
    <div className="max-w-[630px] mx-auto space-y-8 pb-32">
      <AnimatePresence mode="popLayout">
        <div className="flex items-center justify-between mb-8 px-4">
           <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter italic">The Intelligence Feed</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Neural Rank Weighted
              </p>
           </div>
        </div>

        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </AnimatePresence>

      {/* Loading Sentinel */}
      {hasMore && (
        <div ref={loaderRef} className="py-12 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-slate-200" />
           </div>
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">End of Intelligence Stream</p>
        </div>
      )}
    </div>
  );
};
