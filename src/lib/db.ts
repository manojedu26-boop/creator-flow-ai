// src/lib/db.ts
// Mock Database Engine using LocalStorage for persistence

export type CollectionName = 'users' | 'invoices' | 'contracts' | 'deals' | 'notifications' | 'messages' | 'content' | 'tasks' | 'cal_posts' | 'castings' | 'applications' | 'shortlists' | 'competitors' | 'growthTasks' | 'analyticsSnapshots' | 'aiChatHistory' | 'brands' | 'creator_rates';

class Database {
  private prefix = 'cf_db_';

  private getStorageKey(collection: CollectionName): string {
    return `${this.prefix}${collection}`;
  }

  // Generic Get All
  getAll<T>(collection: CollectionName): T[] {
    const data = localStorage.getItem(this.getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  }

  // Generic Get One
  getOne<T extends { id: string }>(collection: CollectionName, id: string): T | undefined {
    const items = this.getAll<T>(collection);
    return items.find(item => item.id === id);
  }

  // Generic Insert
  insert<T extends { id: string }>(collection: CollectionName, item: T): T {
    const items = this.getAll<T>(collection);
    const newItems = [...items, item];
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(newItems));
    return item;
  }

  // Generic Update
  update<T extends { id: string }>(collection: CollectionName, id: string, data: Partial<T>): T | undefined {
    const items = this.getAll<T>(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return undefined;

    const updatedItem = { ...items[index], ...data };
    items[index] = updatedItem;
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(items));
    return updatedItem;
  }

  // Generic Delete
  delete(collection: CollectionName, id: string): boolean {
    const items = this.getAll<{ id: string }>(collection);
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length === items.length) return false;
    
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(filtered));
    return true;
  }

  // Seed initial data if empty
  seed(collection: CollectionName, initialData: any[]) {
    if (this.getAll(collection).length === 0) {
      localStorage.setItem(this.getStorageKey(collection), JSON.stringify(initialData));
    }
  }

  // Clear all for testing
  reset() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const db = new Database();

// Seed Initial Data for Demo (Naveen)
export const initializeDB = () => {
  // 1. Invoices
  db.seed('invoices', [
    { id: 'inv_1', brand: 'MuscleBlaze', amount: 15500, date: '2025-03-22', status: 'Pending', type: 'Reel Collaboration' },
    { id: 'inv_2', brand: 'Fittr App', amount: 8200, date: '2025-03-20', status: 'Paid', type: 'Newsletter Spot' },
    { id: 'inv_3', brand: 'MyProtein India', amount: 45000, date: '2025-03-15', status: 'Pending', type: 'Monthly Ambassadorship' }
  ]);

  // 2. Contracts
  db.seed('contracts', [
    { 
      id: 'con_1', 
      brand: 'Decathlon India', 
      date: '15 Mar 2025', 
      value: '₹ 75,000', 
      risk: 'high', 
      content: 'Exclusivity clause 8.4...',
      flags: [{ level: 'red', title: 'Severe Exclusivity', desc: '12-month lock-in', clause: '8.4' }]
    },
    { 
      id: 'con_2', 
      brand: 'MuscleBlaze', 
      date: '10 Mar 2025', 
      value: '₹ 35,000', 
      risk: 'low', 
      content: 'Standard terms...',
      flags: [{ level: 'green', title: 'Creator Friendly', desc: 'Net-15 payment', clause: '4.1' }]
    }
  ]);

  // 3. Deals (Lifecycle: Offered -> Agreed -> Content Created -> Submitted -> Approved -> Paid)
  db.seed('deals', [
    { 
      id: 'deal_1', 
      brand: 'MuscleBlaze', 
      logo: 'https://logo.clearbit.com/muscleblaze.com', 
      type: 'Sponsored Reel', 
      platforms: ['IG', 'YT'], 
      value: 35000, 
      deadline: 'Mar 28', 
      status: 'content_created', 
      deadlineColor: 'red',
      notes: "AI Insight: Your last Reel for MuscleBlaze had 4.8% engagement. Use similar hook for this one."
    },
    { 
      id: 'deal_2', 
      brand: 'Decathlon India', 
      logo: 'https://logo.clearbit.com/decathlon.in', 
      type: 'Ambassador Program', 
      platforms: ['IG', 'YT', 'TT'], 
      value: 75000, 
      deadline: 'Apr 15', 
      status: 'agreed', 
      deadlineColor: 'green',
      notes: "Contract Shield: Exclusivity for 3 months. No gym-wear from competitors."
    },
    { 
      id: 'deal_3', 
      brand: 'Nike India', 
      logo: 'https://logo.clearbit.com/nike.com', 
      type: 'Marathon Campaign', 
      platforms: ['IG'], 
      value: 60000, 
      deadline: 'Apr 05', 
      status: 'offered', 
      deadlineColor: 'yellow',
      notes: "Action Required: Nike just posted. Confirm interest to initiate escrow."
    }
  ]);

  // 4. Notifications
  db.seed('notifications', [
    { id: 'not_1', title: 'New Deal Interest', body: 'Nike India wants to collaborate on your latest Reel. Respond now before the window closes.', type: 'deal', time: '2 mins ago', read: false, link: '/deals' },
    { id: 'not_2', title: 'Payment Received', body: 'Fittr App cleared invoice #INV-8200 — ₹8,200 is on its way to your account.', type: 'revenue', time: '1 hour ago', read: true, link: '/revenue' }
  ]);

  // 5. Saved Content (Content Studio)
  db.seed('content', [
    { id: 'c1', type: 'Caption', text: '5 Morning Habits that changed my life in Mumbai. 🌅💪 #FitnessMotivation #MumbaiLife', platform: 'Instagram', date: '2025-03-27' },
    { id: 'c2', type: 'Hook', text: 'You are training WRONG. Here is why...', platform: 'YouTube', date: '2025-03-26' }
  ]);

  // 6. Tasks
  db.seed('tasks', [
    { id: 't1', text: 'Post your Tuesday Reel by 7:00 PM — "3 exercises for desk workers"', time: '10 min', completed: false, category: 'Content' },
    { id: 't2', text: 'Reply to 12 unanswered comments on last post', time: '5 min', completed: true, category: 'Community' }
  ]);

  // 7. Calendar Posts
  db.seed('cal_posts', [
    { id: 'cp1', caption: 'Morning Mobility Flow ☀️', time: '08:30', platforms: ['IG'], status: 'Scheduled', day: 15, month: 2, year: 2026 },
    { id: 'cp2', caption: 'High Protein Dinner Idea 🥘', time: '19:00', platforms: ['IG', 'TT'], status: 'Draft', day: 18, month: 2, year: 2026 }
  ]);

  // 8. Brand Castings (Campaign Briefs)
  db.seed('castings', [
    { id: 'cast_1', brand: 'Adobe India', title: 'Creative Cloud Mastery', description: 'Seeking 5 visual creators for a series of tips & tricks Reels.', niche: 'Design', budget: '₹ 45k - 70k', status: 'Live', date: '2025-03-28' },
    { id: 'cast_2', brand: 'Samsung Bharat', title: 'Galaxy S26 Launch', description: 'Cinematic unboxing and low-light photography showcase.', niche: 'Tech', budget: '₹ 1.2L - 2L', status: 'Live', date: '2025-03-27' }
  ]);

  // 9. Brands (Profiles)
  db.seed('brands', [
    { id: 'b1', name: 'Nike India', logo: 'https://logo.clearbit.com/nike.com', industry: 'Sports', verified: true },
    { id: 'b2', name: 'Red Bull', logo: 'https://logo.clearbit.com/redbull.com', industry: 'Energy Drinks', verified: true },
    { id: 'b3', name: 'Samsung', logo: 'https://logo.clearbit.com/samsung.com', industry: 'Technology', verified: true }
  ]);

  // 10. Creator Rates
  db.seed('creator_rates', [
    { id: 'r1', userId: 'u1', story: 8000, reel: 25000, post: 15000, video: 50000 }
  ]);

  // 11. Applications (Creators applying to Brand Briefs)
  db.seed('applications', [
    { id: 'app_1', castingId: 'cast_1', creatorId: 'u1', creatorName: 'Naveen Kumar', status: 'Pending', match: 92, date: '2025-03-29' },
    { id: 'app_2', castingId: 'cast_2', creatorId: 'u1', creatorName: 'Naveen Kumar', status: 'Shortlisted', match: 88, date: '2025-03-30' }
  ]);
};
