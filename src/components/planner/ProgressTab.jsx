import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const statusConfig = {
  pending: { label: 'Pending', icon: Circle, color: '#71717A' },
  in_progress: { label: 'In Progress', icon: Clock, color: '#3B82F6' },
  completed: { label: 'Completed', icon: CheckCircle2, color: '#10B981' },
  blocked: { label: 'Blocked', icon: AlertCircle, color: '#EF4444' },
};

export default function ProgressTab({ phases, setPhases, prompts }) {
  const handleStatusChange = async (phaseId, newStatus) => {
    await base44.entities.PromptPhase.update(phaseId, { status: newStatus });
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, status: newStatus } : p));
  };

  const completedCount = phases.filter(p => p.status === 'completed').length;
  const pct = phases.length > 0 ? Math.round((completedCount / phases.length) * 100) : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Build Progress</h3>

      {/* Progress Bar */}
      <BorderGlow>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A1A1AA]">Overall Progress</span>
            <span className="text-sm font-semibold text-white">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-[#71717A] mt-2">
            {completedCount} of {phases.length} phases completed
          </p>
        </div>
      </BorderGlow>

      {/* Phase List */}
      <div className="space-y-2 mt-4">
        {phases.sort((a, b) => a.orderNumber - b.orderNumber).map((phase, idx) => {
          const cfg = statusConfig[phase.status] || statusConfig.pending;
          const StatusIcon = cfg.icon;
          const phasePrompts = prompts.filter(p => p.phaseId === phase.id);
          return (
            <BorderGlow key={phase.id}>
              <div className="p-4 flex items-center gap-3">
                <StatusIcon className="w-5 h-5 flex-shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#71717A]">Phase {idx + 1}</span>
                    <h4 className="text-sm font-semibold truncate">{phase.phaseName}</h4>
                  </div>
                  <p className="text-xs text-[#71717A]">{phasePrompts.length} prompts</p>
                </div>
                <div className="flex gap-1">
                  {['pending', 'in_progress', 'completed', 'blocked'].map(s => {
                    const sc = statusConfig[s];
                    const Icon = sc.icon;
                    return (
                      <Button
                        key={s}
                        size="icon"
                        variant={phase.status === s ? 'default' : 'ghost'}
                        onClick={() => handleStatusChange(phase.id, s)}
                        className={`h-7 w-7 ${phase.status === s ? '' : 'opacity-30 hover:opacity-100'}`}
                        title={sc.label}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: phase.status === s ? undefined : sc.color }} />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </BorderGlow>
          );
        })}
      </div>

      {phases.length === 0 && (
        <p className="text-center py-12 text-[#71717A] text-sm">Generate prompts first to track progress.</p>
      )}
    </div>
  );
}