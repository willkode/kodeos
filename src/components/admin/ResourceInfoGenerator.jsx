import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, Check } from 'lucide-react';

const ENTITY_TYPES = [
  { key: 'AIAgentKit', label: 'AI Model APIs', entity: 'AIAgentKit' },
  { key: 'AgentKit', label: 'Agent Kits', entity: 'AgentKit' },
  { key: 'MCPServer', label: 'MCP Servers', entity: 'MCPServer' },
];

export default function ResourceInfoGenerator() {
  const [running, setRunning] = useState(false);
  const [currentType, setCurrentType] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState({});

  const handleGenerate = async (entityType) => {
    setRunning(true);
    setCurrentType(entityType);
    setProgress({ current: 0, total: 0 });

    const entityName = ENTITY_TYPES.find(t => t.key === entityType).entity;

    const allItems = await base44.entities[entityName].list('-created_date', 2000);
    const needsInfo = allItems.filter(item => !item.detailed_info);

    if (needsInfo.length === 0) {
      setResults(prev => ({ ...prev, [entityType]: 'All items already have detailed info!' }));
      setRunning(false);
      setCurrentType('');
      return;
    }

    const batchSize = 5;
    const totalBatches = Math.ceil(needsInfo.length / batchSize);
    setProgress({ current: 0, total: totalBatches });
    let processed = 0;

    for (let i = 0; i < totalBatches; i++) {
      const batch = needsInfo.slice(i * batchSize, (i + 1) * batchSize);
      const batchIds = batch.map(item => item.id);

      await base44.functions.invoke('generateResourceInfo', {
        entityType,
        batchIds,
      });

      processed += batch.length;
      setProgress({ current: i + 1, total: totalBatches });
    }

    setResults(prev => ({ ...prev, [entityType]: `Generated info for ${processed} items` }));
    setRunning(false);
    setCurrentType('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1">Generate Detailed Info</h3>
        <p className="text-xs text-[#A1A1AA] mb-4">
          Use AI to generate detailed descriptions for resources that don't have them yet. This powers the detail modals.
        </p>
      </div>

      <div className="grid gap-3">
        {ENTITY_TYPES.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div>
              <span className="text-sm font-medium">{label}</span>
              {results[key] && (
                <p className="text-xs text-green-400 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3" /> {results[key]}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {running && currentType === key && progress.total > 0 && (
                <div className="w-32">
                  <Progress value={(progress.current / progress.total) * 100} className="h-2" />
                  <p className="text-[10px] text-[#71717A] text-center mt-0.5">
                    {progress.current}/{progress.total}
                  </p>
                </div>
              )}
              <Button
                size="sm"
                onClick={() => handleGenerate(key)}
                disabled={running}
                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] text-xs"
              >
                {running && currentType === key ? (
                  <><Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 mr-1" /> Generate</>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}