import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import BorderGlow from '../BorderGlow';

export default function PhaseCard({ phase, index }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phase.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BorderGlow>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] text-sm font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <div>
              <h4 className="font-semibold text-white text-sm">{phase.title}</h4>
              <p className="text-xs text-[#71717A] mt-0.5">{phase.goal}</p>
            </div>
          </div>
          <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2 shrink-0">
            {copied ? <><Check className="w-3 h-3 mr-1 text-green-400" /> Copied</> : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
          </Button>
        </div>

        {/* Scope items */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {phase.scope?.map((item, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] text-[#A1A1AA]">
              {item}
            </span>
          ))}
        </div>

        {/* Expandable prompt */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide prompt' : 'View full prompt'}
        </button>

        {expanded && (
          <div className="mt-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <pre className="text-xs text-[#D4D4D8] whitespace-pre-wrap leading-relaxed font-sans">
              {phase.prompt}
            </pre>
          </div>
        )}
      </div>
    </BorderGlow>
  );
}