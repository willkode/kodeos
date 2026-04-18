import { List, Cpu, Bot, Server, Package, Users, DollarSign } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const stats = [
  { key: 'prompts', label: 'Prompts', icon: List, color: '#3B82F6' },
  { key: 'apis', label: 'AI Model APIs', icon: Cpu, color: '#A855F7' },
  { key: 'agents', label: 'Agent Kits', icon: Bot, color: '#38BDF8' },
  { key: 'mcp', label: 'MCP Servers', icon: Server, color: '#FBBF24' },
  { key: 'starters', label: 'Starter Kits', icon: Package, color: '#F472B6' },
  { key: 'users', label: 'Users', icon: Users, color: '#10B981' },
  { key: 'purchases', label: 'Purchases', icon: DollarSign, color: '#F59E0B' },
];

export default function AdminOverview({ counts, onNavigate }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map(({ key, label, icon: Icon, color }) => (
          <BorderGlow key={key}>
            <button
              onClick={() => onNavigate(key === 'purchases' ? 'users' : key)}
              className="p-5 w-full text-left"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <span className="text-sm font-medium text-[#A1A1AA]">{label}</span>
              </div>
              <p className="text-2xl font-bold">
                {(counts?.[key] || 0).toLocaleString()}
              </p>
            </button>
          </BorderGlow>
        ))}
      </div>
    </div>
  );
}