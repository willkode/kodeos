import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  FileText, Puzzle, Users, Database, GitBranch, Plug
} from 'lucide-react';
import ProjectSidebar from '../components/planner/ProjectSidebar';
import OverviewTab from '../components/planner/OverviewTab';
import PlannerItemList from '../components/planner/PlannerItemList';
import PromptGeneratorTab from '../components/planner/PromptGeneratorTab';
import ProgressTab from '../components/planner/ProgressTab';
import NotesTab from '../components/planner/NotesTab';
import ExportTab from '../components/planner/ExportTab';

export default function ProjectDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = window.location.pathname.split('/projects/')[1]?.split('/')[0];
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // All mapping data
  const [pages, setPages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState([]);
  const [flows, setFlows] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [phases, setPhases] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!projectId) { navigate('/projects'); return; }
    const load = async () => {
      const [proj, pg, ft, rl, dt, fl, ig, ph, pr, nt] = await Promise.all([
        base44.entities.Project.filter({ id: projectId }),
        base44.entities.ProjectPage.filter({ projectId }, '-created_date', 200),
        base44.entities.ProjectFeature.filter({ projectId }, '-created_date', 200),
        base44.entities.ProjectRole.filter({ projectId }, '-created_date', 200),
        base44.entities.DataEntity.filter({ projectId }, '-created_date', 200),
        base44.entities.UserFlow.filter({ projectId }, '-created_date', 200),
        base44.entities.ProjectIntegration.filter({ projectId }, '-created_date', 200),
        base44.entities.PromptPhase.filter({ projectId }, '-created_date', 200),
        base44.entities.BuildPrompt.filter({ projectId }, '-created_date', 500),
        base44.entities.ProjectNote.filter({ projectId }, '-created_date', 200),
      ]);

      if (!proj.length) { navigate('/projects'); return; }
      setProject(proj[0]);
      setPages(pg);
      setFeatures(ft);
      setRoles(rl);
      setData(dt);
      setFlows(fl);
      setIntegrations(ig);
      setPhases(ph);
      setPrompts(pr);
      setNotes(nt);
      setLoading(false);
    };
    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const counts = {
    pages: pages.length,
    features: features.length,
    roles: roles.length,
    data: data.length,
    flows: flows.length,
    integrations: integrations.length,
    prompts: prompts.length,
    progress: phases.filter(p => p.status === 'completed').length,
    notes: notes.length,
  };

  const allItems = { pages, features, roles, data, flows, integrations };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button onClick={() => navigate('/projects')} className="flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Projects
        </button>

        <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
        <p className="text-sm text-[#A1A1AA] mb-6">{project.description}</p>

        <div className="flex gap-8">
          <aside className="hidden lg:block">
            <ProjectSidebar activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
          </aside>

          {/* Mobile tabs */}
          <div className="lg:hidden mb-4 w-full">
            <select
              value={activeTab}
              onChange={e => setActiveTab(e.target.value)}
              className="w-full bg-card border border-border/30 rounded-lg px-3 py-2 text-sm"
            >
              {['overview','pages','features','roles','data','flows','integrations','prompts','progress','notes','export'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-0">
            {activeTab === 'overview' && <OverviewTab project={project} counts={counts} onNavigate={setActiveTab} />}

            {activeTab === 'pages' && (
              <PlannerItemList projectId={projectId} project={project} entityName="ProjectPage" items={pages} setItems={setPages}
                label="Pages" nameField="pageName" descField="purpose" icon={FileText} color="#3B82F6" allItems={allItems} />
            )}
            {activeTab === 'features' && (
              <PlannerItemList projectId={projectId} project={project} entityName="ProjectFeature" items={features} setItems={setFeatures}
                label="Features" nameField="featureName" descField="description" icon={Puzzle} color="#A78BFA" allItems={allItems} />
            )}
            {activeTab === 'roles' && (
              <PlannerItemList projectId={projectId} project={project} entityName="ProjectRole" items={roles} setItems={setRoles}
                label="Roles" nameField="roleName" descField="restrictions" icon={Users} color="#38BDF8" allItems={allItems} />
            )}
            {activeTab === 'data' && (
              <PlannerItemList projectId={projectId} project={project} entityName="DataEntity" items={data} setItems={setData}
                label="Data Entities" nameField="entityName" descField="relations" icon={Database} color="#FBBF24" allItems={allItems} />
            )}
            {activeTab === 'flows' && (
              <PlannerItemList projectId={projectId} project={project} entityName="UserFlow" items={flows} setItems={setFlows}
                label="User Flows" nameField="flowName" descField="trigger" icon={GitBranch} color="#10B981" allItems={allItems} />
            )}
            {activeTab === 'integrations' && (
              <PlannerItemList projectId={projectId} project={project} entityName="ProjectIntegration" items={integrations} setItems={setIntegrations}
                label="Integrations" nameField="integrationName" descField="purpose" icon={Plug} color="#F472B6" allItems={allItems} />
            )}
            {activeTab === 'prompts' && (
              <PromptGeneratorTab project={project} allItems={allItems} phases={phases} setPhases={setPhases} prompts={prompts} setPrompts={setPrompts} />
            )}
            {activeTab === 'progress' && (
              <ProgressTab phases={phases} setPhases={setPhases} prompts={prompts} />
            )}
            {activeTab === 'notes' && (
              <NotesTab projectId={projectId} notes={notes} setNotes={setNotes} />
            )}
            {activeTab === 'export' && (
              <ExportTab project={project} allItems={allItems} phases={phases} prompts={prompts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}