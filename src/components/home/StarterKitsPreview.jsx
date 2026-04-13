import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Cpu, Bot, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BorderGlow from '../BorderGlow';

const categoryColors = {
  'Growth & Marketing': '#10B981',
  'Product, Support & Content': '#A78BFA',
  'Builder & Developer': '#3B82F6',
  'Ops & Internal Tools': '#F59E0B',
  'Finance, Ecommerce & Trends': '#F472B6',
};

function MiniKitCard({ kit }) {
  const color = categoryColors[kit.category] || '#3B82F6';
  const resourceCount = (kit.ai_apis?.length || 0) + (kit.agents?.length || 0) + (kit.mcp_servers?.length || 0);

  return (
    <BorderGlow>
      <div className="p-5 h-full">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}15`, color }}>
          {kit.category}
        </span>
        <h3 className="text-sm font-semibold mt-2.5 mb-2 line-clamp-1">{kit.name}</h3>
        <p className="text-xs text-[#71717A] line-clamp-2 mb-3">{kit.prompt}</p>
        <div className="flex items-center gap-3 text-[10px] text-[#71717A]">
          {kit.ai_apis?.length > 0 && (
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-[#A78BFA]" />{kit.ai_apis.length}</span>
          )}
          {kit.agents?.length > 0 && (
            <span className="flex items-center gap-1"><Bot className="w-3 h-3 text-[#38BDF8]" />{kit.agents.length}</span>
          )}
          {kit.mcp_servers?.length > 0 && (
            <span className="flex items-center gap-1"><Server className="w-3 h-3 text-[#FBBF24]" />{kit.mcp_servers.length}</span>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}

export default function StarterKitsPreview() {
  const navigate = useNavigate();
  const [kits, setKits] = useState([]);

  useEffect(() => {
    base44.entities.AppStarterKit.list('-created_date', 6).then(setKits).catch(() => {});
  }, []);

  if (kits.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">App Starter Kits</h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto">
            Pre-built combinations of AI APIs, agents, and MCP servers — pick one and start building.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {kits.map(kit => (
            <MiniKitCard key={kit.id} kit={kit} />
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/app-starter-kits')}
            className="border-white/[0.1] text-white hover:bg-white/[0.04] bg-transparent font-semibold px-8 h-12 text-base"
          >
            Browse All Starter Kits <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}