import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Send, Trash2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

const platformColors = {
  linkedin: { bg: 'bg-[#0A66C2]/10', text: 'text-[#0A66C2]', label: 'LinkedIn' },
  reddit: { bg: 'bg-[#FF4500]/10', text: 'text-[#FF4500]', label: 'Reddit' },
  twitter: { bg: 'bg-[#1DA1F2]/10', text: 'text-[#1DA1F2]', label: 'Twitter / X' },
};

const statusStyles = {
  draft: 'bg-muted text-muted-foreground',
  scheduled: 'bg-[#3B82F6]/10 text-[#3B82F6]',
  posted: 'bg-green-500/10 text-green-500',
  failed: 'bg-red-500/10 text-red-500',
};

export default function ScheduleManager({ posts, onRefresh }) {
  const [scheduling, setScheduling] = useState({});
  const [selectedHours, setSelectedHours] = useState({});
  const [copied, setCopied] = useState('');
  const [posting, setPosting] = useState({});

  const handleSchedule = async (post) => {
    const hour = selectedHours[post.id];
    if (hour === undefined) return;

    setScheduling(prev => ({ ...prev, [post.id]: true }));
    
    const now = new Date();
    const scheduled = new Date(now);
    scheduled.setHours(parseInt(hour), 0, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    await base44.entities.MarketingPost.update(post.id, {
      status: 'scheduled',
      scheduledTime: scheduled.toISOString(),
      slotHour: parseInt(hour),
    });

    setScheduling(prev => ({ ...prev, [post.id]: false }));
    onRefresh?.();
  };

  const handlePostNow = async (post) => {
    if (post.platform !== 'linkedin') {
      handleCopy(`${post.content}\n\n${post.hashtags || ''}`, post.id);
      return;
    }
    setPosting(prev => ({ ...prev, [post.id]: true }));
    await base44.functions.invoke('postToLinkedIn', { postId: post.id });
    setPosting(prev => ({ ...prev, [post.id]: false }));
    onRefresh?.();
  };

  const handleDelete = async (post) => {
    if (!window.confirm('Delete this post?')) return;
    await base44.entities.MarketingPost.delete(post.id);
    onRefresh?.();
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  // Group by status
  const drafts = posts.filter(p => p.status === 'draft');
  const scheduled = posts.filter(p => p.status === 'scheduled').sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  const posted = posts.filter(p => p.status === 'posted');
  const failed = posts.filter(p => p.status === 'failed');

  const groups = [
    { label: 'Scheduled', items: scheduled, icon: Calendar },
    { label: 'Drafts', items: drafts, icon: Clock },
    { label: 'Posted', items: posted, icon: Send },
    { label: 'Failed', items: failed, icon: Send },
  ].filter(g => g.items.length > 0);

  const usedSlots = scheduled.map(p => p.slotHour).filter(h => h !== undefined);

  if (posts.length === 0) {
    return <p className="text-text-tertiary text-sm py-8 text-center">No posts yet. Generate your first post above.</p>;
  }

  return (
    <div className="space-y-6">
      {groups.map(group => (
        <div key={group.label}>
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <group.icon className="w-4 h-4" />
            {group.label} ({group.items.length})
          </h3>
          <div className="space-y-3">
            {group.items.map(post => {
              const pStyle = platformColors[post.platform] || platformColors.linkedin;
              const sStyle = statusStyles[post.status] || statusStyles.draft;

              return (
                <div key={post.id} className="p-4 rounded-xl border border-surface-border bg-card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pStyle.bg} ${pStyle.text}`}>
                        {pStyle.label}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sStyle}`}>
                        {post.status}
                      </span>
                      {post.scheduledTime && post.status === 'scheduled' && (
                        <span className="text-xs text-text-tertiary">
                          {format(new Date(post.scheduledTime), 'MMM d, h:mm a')}
                        </span>
                      )}
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(post)} className="h-7 w-7 text-text-tertiary hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <p className="text-xs font-medium text-text-tertiary mb-1">{post.topic}</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4 mb-2">{post.content}</p>
                  {post.hashtags && <p className="text-xs text-[#3B82F6] mb-2">{post.hashtags}</p>}

                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="" className="rounded-lg h-24 w-full object-cover mb-3" />
                  )}

                  {post.postResult && (
                    <p className={`text-xs mb-2 ${post.status === 'failed' ? 'text-red-400' : 'text-green-400'}`}>
                      {post.postResult}
                    </p>
                  )}

                  {/* Actions for drafts */}
                  {post.status === 'draft' && (
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Select
                        value={selectedHours[post.id]?.toString() || ''}
                        onValueChange={(v) => setSelectedHours(prev => ({ ...prev, [post.id]: v }))}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs bg-background border-border">
                          <SelectValue placeholder="Pick hour slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()} disabled={usedSlots.includes(i)}>
                              {i.toString().padStart(2, '0')}:00 {usedSlots.includes(i) ? '(taken)' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        onClick={() => handleSchedule(post)}
                        disabled={scheduling[post.id] || selectedHours[post.id] === undefined}
                        className="h-8 text-xs bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                      >
                        {scheduling[post.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Calendar className="w-3 h-3 mr-1" />}
                        Schedule
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePostNow(post)}
                        disabled={posting[post.id]}
                        className="h-8 text-xs border-surface-border"
                      >
                        {posting[post.id] ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> :
                          post.platform === 'linkedin' ? <Send className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {post.platform === 'linkedin' ? 'Post Now' : 'Copy to Post'}
                      </Button>
                    </div>
                  )}

                  {/* Copy for non-linkedin scheduled posts */}
                  {post.status === 'scheduled' && post.platform !== 'linkedin' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(`${post.content}\n\n${post.hashtags || ''}`, post.id)}
                      className="h-7 text-xs mt-2"
                    >
                      {copied === post.id ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                      {copied === post.id ? 'Copied!' : 'Copy Content'}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}