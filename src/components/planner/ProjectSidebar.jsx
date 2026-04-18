import { cn } from '@/lib/utils';
import {
  LayoutDashboard, FileText, Puzzle, Users, Database,
  GitBranch, Plug, Wand2, ListChecks, StickyNote, Download
} from 'lucide-react';

const tabs = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'pages', label: 'Pages', icon: FileText },
  { key: 'features', label: 'Features', icon: Puzzle },
  { key: 'roles', label: 'Roles', icon: Users },
  { key: 'data', label: 'Data', icon: Database },
  { key: 'flows', label: 'Flows', icon: GitBranch },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'prompts', label: 'Prompts', icon: Wand2 },
  { key: 'progress', label: 'Progress', icon: ListChecks },
  { key: 'notes', label: 'Notes', icon: StickyNote },
  { key: 'export', label: 'Export', icon: Download },
];

export default function ProjectSidebar({ activeTab, onTabChange, counts }) {
  return (
    <div className="w-52 flex-shrink-0 space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-2 px-3">
        Project
      </p>
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        const count = counts?.[key];
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
              isActive
                ? 'bg-[#3B82F6]/10 text-[#3B82F6] font-medium'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1 text-left truncate">{label}</span>
            {count > 0 && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                isActive ? 'bg-[#3B82F6]/20 text-[#3B82F6]' : 'bg-white/[0.06] text-[#71717A]'
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}