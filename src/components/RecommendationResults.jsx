import { ExternalLink, Cpu, Bot, Server } from 'lucide-react';
import BorderGlow from './BorderGlow';

const sectionConfig = {
  apis: { label: 'AI Models & APIs', icon: Cpu, color: '#A78BFA' },
  kits: { label: 'Agent Kits', icon: Bot, color: '#38BDF8' },
  mcp: { label: 'MCP Servers', icon: Server, color: '#FBBF24' },
};

function ResultCard({ item }) {
  return (
    <BorderGlow>
      <div className="p-5">
        <h4 className="text-base font-semibold mb-1">{item.name}</h4>
        <p className="text-sm text-text-secondary mb-3 line-clamp-3">{item.reason}</p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors"
          >
            View Resource <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </BorderGlow>
  );
}

export default function RecommendationResults({ results }) {
  const sections = ['apis', 'kits', 'mcp'];

  return (
    <div className="space-y-10">
      {results.summary && (
        <div className="p-5 rounded-xl border border-surface-border bg-surface-hover">
          <p className="text-sm text-text-secondary leading-relaxed">{results.summary}</p>
        </div>
      )}

      {sections.map(key => {
        const items = results[key];
        if (!items || items.length === 0) return null;
        const config = sectionConfig[key];
        const Icon = config.icon;

        return (
          <div key={key}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${config.color}15` }}>
                <Icon className="w-4 h-4" style={{ color: config.color }} />
              </div>
              <h3 className="text-lg font-semibold">{config.label}</h3>
              <span className="text-xs text-text-tertiary ml-1">({items.length})</span>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <ResultCard key={i} item={item} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}