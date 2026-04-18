import { FileText, Puzzle, Users, Database, GitBranch, Plug, Wand2 } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const stats = [
  { key: 'pages', label: 'Pages', icon: FileText, color: '#3B82F6' },
  { key: 'features', label: 'Features', icon: Puzzle, color: '#A78BFA' },
  { key: 'roles', label: 'Roles', icon: Users, color: '#38BDF8' },
  { key: 'data', label: 'Data Entities', icon: Database, color: '#FBBF24' },
  { key: 'flows', label: 'User Flows', icon: GitBranch, color: '#10B981' },
  { key: 'integrations', label: 'Integrations', icon: Plug, color: '#F472B6' },
  { key: 'prompts', label: 'Prompts', icon: Wand2, color: '#F97316' },
];

export default function OverviewTab({ project, counts, onNavigate }) {
  return (
    <div className="space-y-6">
      {/* Project Info */}
      <BorderGlow>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{project.name}</h2>
          <p className="text-[#A1A1AA] text-sm mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.appType && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-[#A1A1AA]">{project.appType}</span>
            )}
            {project.targetPlatform && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">{project.targetPlatform}</span>
            )}
            {project.buildGoal && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981]">{project.buildGoal}</span>
            )}
            {project.targetUsers && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#A78BFA]/10 text-[#A78BFA]">{project.targetUsers}</span>
            )}
          </div>
        </div>
      </BorderGlow>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(({ key, label, icon: Icon, color }) => (
          <BorderGlow key={key}>
            <button onClick={() => onNavigate(key)} className="p-4 w-full text-left">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-xl font-bold">{counts?.[key] || 0}</div>
              <div className="text-xs text-[#71717A]">{label}</div>
            </button>
          </BorderGlow>
        ))}
      </div>

      {/* Quick Tip */}
      <div className="p-4 rounded-lg border border-[#3B82F6]/20 bg-[#3B82F6]/[0.03]">
        <p className="text-sm text-[#A1A1AA]">
          <span className="text-white font-medium">Next step:</span>{' '}
          {(counts?.pages || 0) === 0
            ? 'Start by adding the pages your app needs.'
            : (counts?.features || 0) === 0
            ? 'Now define the features your app will have.'
            : (counts?.roles || 0) === 0
            ? 'Define the user roles for your app.'
            : (counts?.data || 0) === 0
            ? 'Map out your data structure.'
            : (counts?.prompts || 0) === 0
            ? 'Generate your build prompts!'
            : 'Your project is mapped. Review your prompts and start building!'
          }
        </p>
      </div>
    </div>
  );
}