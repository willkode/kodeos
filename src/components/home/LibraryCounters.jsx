import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { FileText, Cpu, Bot, Server, Boxes } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const categories = [
  { key: 'prompts', label: 'Prompts', subtitle: 'The systems your app needs', icon: FileText, color: '#3B82F6', path: '/prompts', entity: 'Prompt' },
  { key: 'apis', label: 'AI Model APIs', subtitle: 'The intelligence layer', icon: Cpu, color: '#A78BFA', path: '/ai-models-apis', entity: 'AIAgentKit' },
  { key: 'kits', label: 'Agent Kits', subtitle: 'The workflow layer', icon: Bot, color: '#38BDF8', path: '/agent-kits', entity: 'AgentKit' },
  { key: 'mcp', label: 'MCP Servers', subtitle: 'The connection layer', icon: Server, color: '#FBBF24', path: '/mcp-servers', entity: 'MCPServer' },
  { key: 'starters', label: 'Starter Kits', subtitle: 'Ready-to-build blueprints', icon: Boxes, color: '#F472B6', path: '/app-starter-kits', entity: 'AppStarterKit' },
];

export default function LibraryCounters() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      const results = {};
      for (const cat of categories) {
        try {
          const items = await base44.entities[cat.entity].list('-created_date', 1);
          // Use a filter with empty object to get all, but limit 1 to check
          const all = await base44.entities[cat.entity].list('-created_date', 2000);
          results[cat.key] = all.length;
        } catch {
          results[cat.key] = 0;
        }
      }
      setCounts(results);
    };
    load();
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {categories.map((cat) => (
          <BorderGlow key={cat.key}>
            <button
              onClick={() => navigate(cat.path)}
              className="w-full p-5 text-left"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${cat.color}15` }}
              >
                <cat.icon className="w-4.5 h-4.5" style={{ color: cat.color }} />
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: cat.color }}>
                {counts[cat.key] !== undefined ? counts[cat.key].toLocaleString() : '—'}
              </div>
              <div className="text-sm text-[#A1A1AA] group-hover:text-white transition-colors">
                {cat.label}
              </div>
              <div className="text-[11px] text-[#52525B] mt-1 leading-tight">
                {cat.subtitle}
              </div>
            </button>
          </BorderGlow>
        ))}
      </div>
      {total > 0 && (
        <p className="text-center text-sm text-[#71717A] mt-4">
          <span className="text-white font-semibold">{total.toLocaleString()}</span> resources and growing — updated weekly
        </p>
      )}
    </div>
  );
}