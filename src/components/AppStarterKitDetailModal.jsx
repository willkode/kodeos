import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, Cpu, Bot, Server } from 'lucide-react';

const categoryColors = {
  'Growth & Marketing': '#10B981',
  'Product, Support & Content': '#A78BFA',
  'Builder & Developer': '#3B82F6',
  'Ops & Internal Tools': '#F59E0B',
  'Finance, Ecommerce & Trends': '#F472B6',
};

function ResourceList({ icon: Icon, label, items, color }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color }}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.06] bg-white/[0.02] text-[#D4D4D8]">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AppStarterKitDetailModal({ item, open, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const color = categoryColors[item.category] || '#3B82F6';

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0A0A0B] border-white/[0.08]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: `${color}15`, color }}
            >
              {item.category}
            </span>
          </div>
          <DialogTitle className="text-xl font-bold">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Description if exists */}
          {item.description && (
            <p className="text-sm text-[#A1A1AA] leading-relaxed">{item.description}</p>
          )}

          {/* Resources */}
          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-4">
            <h4 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Included Resources</h4>
            <ResourceList icon={Cpu} label="AI / APIs" items={item.ai_apis} color="#A78BFA" />
            <ResourceList icon={Bot} label="Agents" items={item.agents} color="#38BDF8" />
            <ResourceList icon={Server} label="MCP Servers" items={item.mcp_servers} color="#FBBF24" />
          </div>

          {/* Prompt */}
          <div className="p-4 rounded-xl border border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">Starter Prompt</h4>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopyPrompt}
                className="h-7 px-2 text-xs"
              >
                {copied ? <><Check className="w-3 h-3 mr-1" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
              </Button>
            </div>
            <p className="text-sm text-[#D4D4D8] leading-relaxed italic">
              "{item.prompt}"
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}