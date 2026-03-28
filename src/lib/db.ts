// src/lib/db.ts
// Mock Database Engine using LocalStorage for persistence

export type CollectionName = 'users' | 'invoices' | 'contracts' | 'deals' | 'notifications' | 'messages' | 'content' | 'tasks';

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

  // 3. Deals (Kanban)
  db.seed('deals', [
    { 
      id: 'deal_1', 
      brand: 'MuscleBlaze', 
      logo: 'https://logo.clearbit.com/muscleblaze.com', 
      type: 'Sponsored Reel', 
      platforms: ['IG', 'YT'], 
      value: '₹ 35,000', 
      deadline: 'Mar 28', 
      status: 'live', 
      deadlineColor: 'red',
      notes: "AI Insight: Your last Reel for MuscleBlaze had 4.8% engagement. Use similar hook for this one."
    },
    { 
      id: 'deal_2', 
      brand: 'Decathlon India', 
      logo: 'https://logo.clearbit.com/decathlon.in', 
      type: 'Ambassador Program', 
      platforms: ['IG', 'YT', 'TT'], 
      value: '₹ 75,000', 
      deadline: 'Apr 15', 
      status: 'signed', 
      deadlineColor: 'green',
      notes: "Contract Shield: Exclusivity for 3 months. No gym-wear from competitors."
    },
    { 
      id: 'deal_3', 
      brand: 'Nike India', 
      logo: 'https://logo.clearbit.com/nike.com', 
      type: 'Marathon Campaign', 
      platforms: ['IG'], 
      value: '₹ 60,000', 
      deadline: 'Apr 05', 
      status: 'outreach', 
      deadlineColor: 'yellow',
      notes: "Follow up needed: No reply in 5 days."
    }
  ]);

  // 4. Notifications
  db.seed('notifications', [
    { id: 'not_1', title: 'New Deal Interest', body: 'Nike India wants to collaborate on your latest Reel. Respond now before the window closes.', type: 'deal', time: '2 mins ago', read: false, link: '/deals' },
    { id: 'not_2', title: 'Payment Received', body: 'Fittr App cleared invoice #INV-8200 — ₹8,200 is on its way to your account.', type: 'revenue', time: '1 hour ago', read: true, link: '/revenue' },
    { id: 'not_3', title: 'Contract Expiring Soon', body: 'Your MuscleBlaze deal expires in 3 days. Review the renewal terms in Contract Shield.', type: 'warning', time: '5 hours ago', read: false, link: '/contracts' },
    { id: 'not_4', title: 'Trending Post 🔥', body: 'Your "Desk Setup Minimal" Reel is 3.2x above your average reach. Boost it now?', type: 'trending', time: '20 mins ago', read: false, link: '/analytics' },
    { id: 'not_5', title: 'New Message from Nike PR', body: 'Nike PR Team replied to your brief submission. Open your inbox to respond.', type: 'message', time: '45 mins ago', read: false, link: '/messages' },
    { id: 'not_6', title: 'New Connection Request', body: 'Sarah Chen (@sarahdesigns) wants to connect. She collabed with 3 fitness creators this month.', type: 'connection', time: '2 hours ago', read: true, link: '/network' },
    { id: 'not_7', title: 'Posting Gap Detected', body: 'You have no content scheduled for Thursday. Your audience peaks on Thursdays at 7–9 PM.', type: 'reminder', time: '3 hours ago', read: false, link: '/calendar' },
    { id: 'not_8', title: 'AI Weekly Insight', body: 'No-equipment workout content is peaking in your niche this week. Best time to post: Friday 8 PM.', type: 'ai', time: '6 hours ago', read: true, link: '/growth' },
  ]);

  // 5. Saved Content (Content Studio)
  db.seed('content', [
    { id: 'c1', type: 'Caption', text: '5 Morning Habits that changed my life in Mumbai. 🌅💪 #FitnessMotivation #MumbaiLife', platform: 'Instagram', date: '2025-03-27' },
    { id: 'c2', type: 'Hook', text: 'You are training WRONG. Here is why...', platform: 'YouTube', date: '2025-03-26' }
  ]);

  // 6. Tasks
  db.seed('tasks', [
    { id: 't1', text: 'Post your Tuesday Reel by 7:00 PM — "3 exercises for desk workers"', time: '10 min', completed: false, category: 'Content' },
    { id: 't2', text: 'Reply to 12 unanswered comments on last post', time: '5 min', completed: true, category: 'Community' },
    { id: 't3', text: 'Follow up with Nike Brand Partnership — no reply in 5 days', time: '3 min', completed: false, category: 'Deals' },
    { id: 't4', text: 'Generate captions for Thursday\'s carousel post', time: '2 min', completed: false, category: 'Content' },
  ]);
};
