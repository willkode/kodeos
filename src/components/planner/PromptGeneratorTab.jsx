import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const DEFAULT_PHASES = [
  'Foundation & Layout',
  'User State & Permissions',
  'Database & Core Data',
  'Main Dashboard',
  'Core Features',
  'Admin System',
  'Integrations & Automation',
  'Polish & Launch Prep',
];

export default function PromptGeneratorTab({ project, allItems, phases, setPhases, prompts, setPrompts }) {
  const [generating, setGenerating] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);

    // Build context from all mapping data
    const context = {
      pages: (allItems.pages || []).map(p => ({ name: p.pageName, purpose: p.purpose })),
      features: (allItems.features || []).map(f => ({ name: f.featureName, description: f.description })),
      roles: (allItems.roles || []).map(r => ({ name: r.roleName })),
      data: (allItems.data || []).map(d => ({ name: d.entityName, fields: d.fields })),
      flows: (allItems.flows || []).map(f => ({ name: f.flowName, trigger: f.trigger, steps: f.steps })),
      integrations: (allItems.integrations || []).map(i => ({ name: i.integrationName, purpose: i.purpose })),
    };

    // Generate phases
    const phaseResult = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert AI app architect specializing in phased build plans for ${project.targetPlatform || 'Base44'}.

Project: ${project.name}
Description: ${project.description}
App Type: ${project.appType}
Target Users: ${project.targetUsers || 'general'}
Builder: ${project.targetPlatform || 'Base44'}

App Map:
- Pages: ${JSON.stringify(context.pages)}
- Features: ${JSON.stringify(context.features)}
- Roles: ${JSON.stringify(context.roles)}
- Data: ${JSON.stringify(context.data)}
- Flows: ${JSON.stringify(context.flows)}
- Integrations: ${JSON.stringify(context.integrations)}

Create a phased build plan. Each phase should be a logical grouping of work. Return 5-8 phases in order. For each phase, generate 1-3 detailed prompts that a user can paste into ${project.targetPlatform || 'Base44'} to build that phase.

${project.targetPlatform === 'Base44' ? 'IMPORTANT: Base44 already provides authentication, database, file uploads, and email. Do not recreate these. Use Base44 entities, pages, and components patterns. Keep prompts focused on what to build, not infrastructure.' : ''}

Each prompt should include:
- Clear scope of what to build
- Pages affected
- Data involved
- Rules and permissions
- What NOT to touch
- Completion checks

Return JSON.`,
      response_json_schema: {
        type: 'object',
        properties: {
          phases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                phaseName: { type: 'string' },
                prompts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      promptBody: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (phaseResult?.phases) {
      // Clear old phases and prompts
      for (const p of phases) await base44.entities.PromptPhase.delete(p.id);
      for (const p of prompts) await base44.entities.BuildPrompt.delete(p.id);

      const newPhases = [];
      const newPrompts = [];

      for (let i = 0; i < phaseResult.phases.length; i++) {
        const ph = phaseResult.phases[i];
        const phase = await base44.entities.PromptPhase.create({
          projectId: project.id,
          phaseName: ph.phaseName,
          orderNumber: i + 1,
          status: 'pending',
        });
        newPhases.push(phase);

        for (let j = 0; j < (ph.prompts || []).length; j++) {
          const pr = ph.prompts[j];
          const prompt = await base44.entities.BuildPrompt.create({
            projectId: project.id,
            phaseId: phase.id,
            title: pr.title,
            promptBody: pr.promptBody,
            orderNumber: j + 1,
            status: 'ready',
            version: 1,
          });
          newPrompts.push(prompt);
        }
      }

      setPhases(newPhases);
      setPrompts(newPrompts);

      // Update project status
      await base44.entities.Project.update(project.id, { status: 'prompts_ready' });
    }

    setGenerating(false);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const phasePrompts = (phaseId) => prompts.filter(p => p.phaseId === phaseId).sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[#F97316]" />
            Build Prompts
          </h3>
          <p className="text-xs text-[#71717A] mt-1">Generate phased prompts from your app map. Uses higher-quality AI model for better results.</p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white gap-2"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {generating ? 'Generating...' : phases.length > 0 ? 'Regenerate' : 'Generate Prompts'}
        </Button>
      </div>

      {phases.length === 0 && !generating ? (
        <div className="text-center py-16 text-[#71717A] text-sm">
          <Wand2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p>Map your app first, then generate prompts.</p>
          <p className="text-xs mt-1">Add pages, features, roles, and data before generating.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {phases.sort((a, b) => a.orderNumber - b.orderNumber).map((phase, idx) => {
            const pPrompts = phasePrompts(phase.id);
            const isExpanded = expandedPhase === phase.id;
            return (
              <BorderGlow key={phase.id}>
                <div>
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-[#3B82F6]" /> : <ChevronRight className="w-4 h-4 text-[#71717A]" />}
                    <span className="text-xs font-mono text-[#3B82F6]">Phase {idx + 1}</span>
                    <span className="text-sm font-semibold flex-1">{phase.phaseName}</span>
                    <span className="text-xs text-[#71717A]">{pPrompts.length} prompt{pPrompts.length !== 1 ? 's' : ''}</span>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3">
                      {pPrompts.map(prompt => (
                        <div key={prompt.id} className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h5 className="text-sm font-semibold text-white">{prompt.title}</h5>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(prompt.promptBody, prompt.id)}
                              className="text-xs gap-1 flex-shrink-0"
                            >
                              {copiedId === prompt.id ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </Button>
                          </div>
                          <pre className="text-xs text-[#A1A1AA] whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans">
                            {prompt.promptBody}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </BorderGlow>
            );
          })}
        </div>
      )}
    </div>
  );
}