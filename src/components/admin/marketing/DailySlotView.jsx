import { format } from 'date-fns';

const platformColors = {
  linkedin: '#0A66C2',
  reddit: '#FF4500',
  twitter: '#1DA1F2',
};

export default function DailySlotView({ posts }) {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Get today's scheduled + posted items mapped by slot hour
  const slotMap = {};
  posts.forEach(p => {
    if (p.slotHour !== undefined && p.scheduledTime) {
      const postDate = format(new Date(p.scheduledTime), 'yyyy-MM-dd');
      if (postDate === todayStr) {
        slotMap[p.slotHour] = p;
      }
    }
  });

  const currentHour = today.getHours();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">
        Today's Schedule — {format(today, 'EEEE, MMM d')}
      </h3>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-1.5">
        {Array.from({ length: 24 }, (_, hour) => {
          const post = slotMap[hour];
          const isPast = hour < currentHour;
          const isCurrent = hour === currentHour;

          return (
            <div
              key={hour}
              className={`relative rounded-lg p-2 text-center text-xs border transition-all ${
                post
                  ? 'border-[#3B82F6]/40 bg-[#3B82F6]/10'
                  : isPast
                    ? 'border-border/30 bg-surface-hover opacity-40'
                    : isCurrent
                      ? 'border-[#3B82F6]/60 bg-[#3B82F6]/5 ring-1 ring-[#3B82F6]/30'
                      : 'border-border/30 bg-surface-hover'
              }`}
              title={post ? `${post.platform}: ${post.topic}` : `${hour}:00 - Empty`}
            >
              <div className="font-mono font-medium text-text-secondary">
                {hour.toString().padStart(2, '0')}
              </div>
              {post && (
                <div
                  className="w-2 h-2 rounded-full mx-auto mt-1"
                  style={{ backgroundColor: platformColors[post.platform] || '#3B82F6' }}
                />
              )}
              {post && (
                <div className="text-[9px] text-text-tertiary mt-0.5 truncate">
                  {post.platform?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 text-[10px] text-text-tertiary mt-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#0A66C2] inline-block" /> LinkedIn</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FF4500] inline-block" /> Reddit</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1DA1F2] inline-block" /> Twitter</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3B82F6]/30 inline-block" /> Current hour</span>
      </div>
    </div>
  );
}