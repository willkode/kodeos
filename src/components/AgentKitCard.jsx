import { Bookmark } from 'lucide-react';
import BorderGlow from './BorderGlow';

export default function AgentKitCard({ kit, onClick, isSaved, onToggleSave }) {
  return (
    <BorderGlow>
      <div className="p-5 cursor-pointer" onClick={() => onClick?.(kit)}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold line-clamp-2">{kit.name}</h3>
          {onToggleSave && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
              className="shrink-0 mt-0.5"
            >
              <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? 'fill-[#3B82F6] text-[#3B82F6]' : 'text-[#71717A] hover:text-white'}`} />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {kit.description}
        </p>
        <span className="text-xs text-[#3B82F6] font-medium">View details →</span>
      </div>
    </BorderGlow>
  );
}