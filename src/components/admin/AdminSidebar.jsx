import { 
  Users, FileText, Sparkles, FolderOpen, List,
  Cpu, Bot, Server, Package, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections = [
  {
    label: 'Overview',
    items: [
      { key: 'overview', label: 'Dashboard', icon: BarChart3 },
      { key: 'users', label: 'Users', icon: Users },
    ],
  },
  {
    label: 'Content',
    items: [
      { key: 'prompts', label: 'Prompts', icon: List },
      { key: 'apis', label: 'AI Model APIs', icon: Cpu },
      { key: 'agents', label: 'Agent Kits', icon: Bot },
      { key: 'mcp', label: 'MCP Servers', icon: Server },
      { key: 'starters', label: 'Starter Kits', icon: Package },
    ],
  },
  {
    label: 'Tools',
    items: [
      { key: 'generate', label: 'AI Generate', icon: Sparkles },
      { key: 'categories', label: 'Categories', icon: FolderOpen },
      { key: 'resourceInfo', label: 'Resource Info', icon: FileText },
    ],
  },
];

export default function AdminSidebar({ activeTab, onTabChange, counts }) {
  return (
    <div className="w-56 flex-shrink-0 space-y-6">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#71717A] mb-2 px-3">
            {section.label}
          </p>
          <div className="space-y-0.5">
            {section.items.map(({ key, label, icon: Icon }) => {
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
                  {count !== undefined && count > 0 && (
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
        </div>
      ))}
    </div>
  );
}