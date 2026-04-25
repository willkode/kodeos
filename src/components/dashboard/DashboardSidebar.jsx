import { FileText, Cpu, Bot, Server, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'prompts', label: 'Saved Prompts', icon: FileText, color: '#3B82F6' },
  { key: 'apis', label: 'AI Model APIs', icon: Cpu, color: '#A78BFA' },
  { key: 'agents', label: 'Agent Kits', icon: Bot, color: '#38BDF8' },
  { key: 'mcp', label: 'MCP Servers', icon: Server, color: '#FBBF24' },
  { key: 'starters', label: 'Starter Kits', icon: Boxes, color: '#F472B6' },
];

export default function DashboardSidebar({ activeTab, onTabChange, counts }) {
  return (
    <div className="w-56 flex-shrink-0">
      <div className="sticky top-24 space-y-1">
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider px-3 mb-3">
          Saved Resources
        </h3>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key] || 0;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                isActive
                  ? 'bg-surface-hover text-foreground'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-foreground'
              )}
            >
              <tab.icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: isActive ? tab.color : undefined }}
              />
              <span className="truncate flex-1 text-left">{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                    isActive ? 'bg-surface-hover text-foreground' : 'text-text-tertiary'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}