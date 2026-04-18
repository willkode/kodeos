import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Check, Download } from 'lucide-react';
import PhaseCard from './PhaseCard';

export default function PhasePlanView({ phases, addOns, onBack }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const copyAllPrompts = () => {
    const allText = phases.map((p, i) =>
      `=== PHASE ${i + 1}: ${p.title} ===\n\n${p.prompt}`
    ).join('\n\n\n');
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Your Build Phases</h3>
          <p className="text-sm text-[#71717A]">{phases.length} phases generated — copy and use in Base44</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack} className="border-white/[0.08]">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
          </Button>
          <Button size="sm" onClick={copyAllPrompts} className="bg-[#3B82F6] text-white hover:bg-[#2563EB]">
            {copiedAll ? <><Check className="w-3.5 h-3.5 mr-1" /> Copied All</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy All Prompts</>}
          </Button>
        </div>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {phases.map((phase, i) => (
          <PhaseCard key={i} phase={phase} index={i} />
        ))}
      </div>

      {/* Add-Ons */}
      {addOns && addOns.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-2">Suggested Add-On Prompts</h3>
          <p className="text-sm text-[#71717A] mb-4">Optional extras based on your app type</p>
          <div className="grid md:grid-cols-2 gap-3">
            {addOns.map((addon, i) => (
              <AddOnCard key={i} addon={addon} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AddOnCard({ addon }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(addon.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold text-white">{addon.title}</h4>
          <p className="text-xs text-[#71717A] mt-0.5">{addon.description}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2 shrink-0">
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  );
}