import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, FileText, Users, Database, Layout, Shield, Zap, Target } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const SECTION_ICONS = {
  'App Concept': Target,
  'Audience': Users,
  'Roles': Users,
  'Pages': Layout,
  'Data Entities': Database,
  'Workflows': Zap,
  'Integrations': Zap,
  'Admin Needs': Shield,
  'Automation Needs': Zap,
  'Security Needs': Shield,
  'Launch Priorities': Target,
};

function BlueprintSection({ title, items }) {
  const Icon = SECTION_ICONS[title] || FileText;
  if (!items || items.length === 0) return null;

  return (
    <BorderGlow>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-[#3B82F6]" />
          </div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
        </div>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-[#A1A1AA] flex items-start gap-2">
              <span className="text-[#3B82F6] mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </BorderGlow>
  );
}

export default function BlueprintView({ blueprint, onNext, onBack }) {
  if (!blueprint) return null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#3B82F6]/[0.05] to-transparent">
        <h3 className="text-lg font-bold text-white mb-2">App Blueprint</h3>
        <p className="text-[#A1A1AA] text-sm leading-relaxed">{blueprint.summary}</p>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(blueprint.sections || {}).map(([title, items]) => (
          <BlueprintSection key={title} title={title} items={items} />
        ))}
      </div>

      {/* Complexity + Build Mode */}
      {blueprint.complexity && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#71717A]">Estimated Complexity:</span>
          <span className={`px-2.5 py-0.5 rounded-full font-medium text-xs ${
            blueprint.complexity === 'Simple' ? 'bg-green-500/15 text-green-400' :
            blueprint.complexity === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' :
            'bg-red-500/15 text-red-400'
          }`}>
            {blueprint.complexity}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="border-white/[0.08]">
          <ArrowLeft className="w-4 h-4 mr-2" /> Edit Inputs
        </Button>
        <Button
          onClick={onNext}
          className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold shadow-lg shadow-[#3B82F6]/20"
        >
          Generate Phase Plan <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}