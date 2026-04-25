import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import PostGenerator from './PostGenerator';
import ScheduleManager from './ScheduleManager';
import DailySlotView from './DailySlotView';

export default function MarketingTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    const data = await base44.entities.MarketingPost.list('-created_date', 200);
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const stats = {
    total: posts.length,
    drafts: posts.filter(p => p.status === 'draft').length,
    scheduled: posts.filter(p => p.status === 'scheduled').length,
    posted: posts.filter(p => p.status === 'posted').length,
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Drafts', value: stats.drafts, color: 'text-text-secondary' },
          { label: 'Scheduled', value: stats.scheduled, color: 'text-[#3B82F6]' },
          { label: 'Posted', value: stats.posted, color: 'text-green-500' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-lg border border-surface-border bg-card text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-tertiary">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Slot View */}
      <div className="p-5 rounded-xl border border-surface-border bg-card">
        <DailySlotView posts={posts} />
      </div>

      {/* Post Generator */}
      <div className="p-5 rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
          Generate New Post
        </h3>
        <PostGenerator onPostSaved={loadPosts} />
      </div>

      {/* Schedule Manager */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-4">All Posts</h3>
        <ScheduleManager posts={posts} onRefresh={loadPosts} />
      </div>
    </div>
  );
}