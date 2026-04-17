import { PageTransition } from "@/components/shared/MotionComponents";
import { DynamicFeed } from "@/components/feed/DynamicFeed";

export const SocialFeed = () => {
  return (
    <PageTransition className="min-h-screen bg-white md:bg-slate-50/30">
      <main className="pt-4 md:pt-12">
        <DynamicFeed />
      </main>
    </PageTransition>
  );
};
