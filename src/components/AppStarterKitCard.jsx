import { Bookmark, Cpu, Bot, Server } from 'lucide-react';
import BorderGlow from './BorderGlow';

const categoryColors = {
  'Growth & Marketing': '#10B981',
  'Product, Support & Content': '#A78BFA',
  'Builder & Developer': '#3B82F6',
  'Ops & Internal Tools': '#F59E0B',
  'Finance, Ecommerce & Trends': '#F472B6',
};

export default function AppStarterKitCard({ kit, onClick, isSaved, onToggleSave }) {
  const color = categoryColors[kit.category] || '#3B82F6';

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
              <Bookmark className={`w-4 h-4 transition-colors ${isSaved ? 'fill-[#3B82F6] text-[#3B82F6]' : 'text-text-tertiary hover:text-foreground'}`} />
            </button>
          )}
        </div>

        {/* Category pill */}
        <div className="mb-3">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {kit.category}
          </span>
        </div>

        {/* Resource pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {kit.ai_apis?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
              <Cpu className="w-2.5 h-2.5" /> {kit.ai_apis.length} API{kit.ai_apis.length > 1 ? 's' : ''}
            </span>
          )}
          {kit.agents?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
              <Bot className="w-2.5 h-2.5" /> {kit.agents.length} Agent{kit.agents.length > 1 ? 's' : ''}
            </span>
          )}
          {kit.mcp_servers?.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-text-secondary">
              <Server className="w-2.5 h-2.5" /> {kit.mcp_servers.length} MCP{kit.mcp_servers.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Prompt preview */}
        <p className="text-xs text-text-tertiary line-clamp-2 mb-3">{kit.prompt}</p>

        <span className="text-xs text-[#3B82F6] font-medium">View kit details →</span>
      </div>
    </BorderGlow>
  );
}