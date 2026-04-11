import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { FileText, Cpu, Bot, Server } from 'lucide-react';

const categories = [
  { key: 'prompts', label: 'Prompts', icon: FileText, color: '#3B82F6', path: '/prompts', entity: 'Prompt' },
  { key: 'apis', label: 'AI Model APIs', icon: Cpu, color: '#A78BFA', path: '/ai-models-apis', entity: 'AIAgentKit' },
  { key: 'kits', label: 'Agent Kits', icon: Bot, color: '#38BDF8', path: '/agent-kits', entity: 'AgentKit' },
  { key: 'mcp', label: 'MCP Servers', icon: Server, color: '#FBBF24', path: '/mcp-servers', entity: 'MCPServer' },
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => navigate(cat.path)}
            className="group relative p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 text-left"
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
          </button>
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