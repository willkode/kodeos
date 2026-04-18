import { Zap, Shield, Brain } from 'lucide-react';

const MODES = [
  {
    id: 'fast',
    label: 'Fast Build',
    desc: 'Fewer phases, bigger prompts. Good for simple apps.',
    icon: Zap,
    color: '#10B981',
  },
  {
    id: 'safe',
    label: 'Safe Build',
    desc: 'More phases, more controlled. Best for most apps.',
    icon: Shield,
    color: '#3B82F6',
  },
  {
    id: 'expert',
    label: 'Expert Build',
    desc: 'Full architecture: admin, security, validation, reporting.',
    icon: Brain,
    color: '#A78BFA',
  },
];

export default function BuildModeSelector({ selected, onSelect }) {
  return (
    <div className="grid md:grid-cols-3 gap-3 mb-6">
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`p-4 rounded-xl border text-left transition-all ${
            selected === mode.id
              ? 'border-white/20 bg-white/[0.06]'
              : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mode.color}20` }}
            >
              <mode.icon className="w-4 h-4" style={{ color: mode.color }} />
            </div>
            <span className="font-semibold text-white text-sm">{mode.label}</span>
          </div>
          <p className="text-xs text-[#71717A] leading-relaxed">{mode.desc}</p>
          {selected === mode.id && (
            <div className="mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block" style={{ backgroundColor: `${mode.color}20`, color: mode.color }}>
              Selected
            </div>
          )}
        </button>
      ))}
    </div>
  );
}