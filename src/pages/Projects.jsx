import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useOutletContext } from 'react-router-dom';
import { Plus, FolderOpen, Clock, CheckCircle2, Hammer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedText from '../components/AnimatedText';
import BorderGlow from '../components/BorderGlow';

const statusConfig = {
  planning: { label: 'Planning', color: '#A78BFA', icon: FileText },
  mapping: { label: 'Mapping', color: '#3B82F6', icon: Clock },
  prompts_ready: { label: 'Prompts Ready', color: '#FBBF24', icon: Hammer },
  building: { label: 'Building', color: '#F97316', icon: Hammer },
  completed: { label: 'Completed', color: '#10B981', icon: CheckCircle2 },
};

export default function Projects() {
  const { user } = useOutletContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.Project.list('-created_date', 100);
      setProjects(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <AnimatedText text="Your Projects" className="mb-2" />
            <p className="text-[#A1A1AA]">Plan, map, and generate build prompts for your apps.</p>
          </div>
          <Link to="/projects/new">
            <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold gap-2">
              <Plus className="w-4 h-4" /> New Project
            </Button>
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 text-[#3B82F6]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-[#71717A] text-sm mb-6">Create your first project to start planning your app.</p>
            <Link to="/projects/new">
              <Button className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2">
                <Plus className="w-4 h-4" /> Create First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const cfg = statusConfig[project.status] || statusConfig.planning;
              const StatusIcon = cfg.icon;
              return (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <BorderGlow>
                    <div className="p-5 h-full">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                        >
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {cfg.label}
                        </span>
                        <span className="text-xs text-[#71717A]">
                          {new Date(project.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold mb-1.5 text-white">{project.name}</h3>
                      <p className="text-sm text-[#A1A1AA] line-clamp-2 mb-3">{project.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {project.appType && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-[#71717A]">
                            {project.appType}
                          </span>
                        )}
                        {project.targetPlatform && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                            {project.targetPlatform}
                          </span>
                        )}
                      </div>
                    </div>
                  </BorderGlow>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}