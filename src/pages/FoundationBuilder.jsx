import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import StepIndicator from '../components/foundation/StepIndicator';
import IntakeForm from '../components/foundation/IntakeForm';
import BlueprintView from '../components/foundation/BlueprintView';
import BuildModeSelector from '../components/foundation/BuildModeSelector';
import PhasePlanView from '../components/foundation/PhasePlanView';
import GuestLanding from '../components/GuestLanding';

export default function FoundationBuilder() {
  const { user, hasPurchased } = useOutletContext();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('');
  const [intake, setIntake] = useState(null);
  const [blueprint, setBlueprint] = useState(null);
  const [buildMode, setBuildMode] = useState('safe');
  const [phases, setPhases] = useState([]);
  const [addOns, setAddOns] = useState([]);

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="Foundation Builder"
        pageDescription="Turn your app idea into clean phased Base44 prompts that build in the right order."
        highlightKey="prompts"
        user={user}
      />
    );
  }

  const generateBlueprint = async (formData) => {
    setIntake(formData);
    setLoading(true);
    setLoadingLabel('Analyzing your app idea...');

    const featureLabels = {
      auth: 'User login', payments: 'Payments', admin: 'Admin panel', fileUploads: 'File uploads',
      emailSms: 'Email/SMS', dashboards: 'Dashboards', messaging: 'Messaging',
      scheduling: 'Scheduling', search: 'Search', api: 'API integrations', ai: 'AI features', realtime: 'Real-time updates',
    };

    const prompt = `You are an expert app architect. Analyze this app idea and create a structured blueprint.

APP DETAILS:
- Name: ${formData.appName}
- App Type: ${formData.appType || 'Not specified'}
- What it does: ${formData.whatItDoes || 'Not specified'}
- Target Audience: ${formData.audience?.join(', ') || 'Not specified'}
- User Roles: ${formData.roles?.join(', ') || 'Not specified'}
- Core Features: ${formData.coreFeatures?.join(', ') || 'Not specified'}
- Pages Needed: ${formData.pages?.join(', ') || 'Not specified'}
- Capabilities needed: ${formData.features.map(f => featureLabels[f]).join(', ') || 'None selected'}
- Design style: ${formData.designStyle}
- Platform: ${formData.platform}
- MVP Goal: ${formData.mvpGoal || 'Not specified'}
- Additional details: ${formData.freeDescription || 'None'}

Return a JSON object with:
- summary: A 2-3 sentence overview of the app concept and strategy
- complexity: "Simple" or "Medium" or "Complex"
- sections: An object where each key is a section name and value is an array of strings. Include these sections:
  - "App Concept": what the app is in clear terms
  - "Audience": who will use it
  - "Roles": user roles needed
  - "Pages": list of pages/screens needed
  - "Data Entities": database collections/tables needed
  - "Workflows": key user flows and actions
  - "Integrations": external services or APIs needed
  - "Admin Needs": admin tools and controls
  - "Automation Needs": scheduled tasks, triggers, notifications
  - "Security Needs": auth, permissions, data protection
  - "Launch Priorities": what to build first for MVP

Only include sections that are relevant. If a section has nothing, omit it.
Be specific and practical — these will drive the actual build prompts.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          complexity: { type: 'string', enum: ['Simple', 'Medium', 'Complex'] },
          sections: {
            type: 'object',
            additionalProperties: { type: 'array', items: { type: 'string' } },
          },
        },
        required: ['summary', 'complexity', 'sections'],
      },
    });

    setBlueprint(response);
    setStep(2);
    setLoading(false);
  };

  const generatePhases = async () => {
    setLoading(true);
    setLoadingLabel('Creating your phased build plan...');

    const blueprintText = Object.entries(blueprint.sections)
      .map(([k, v]) => `${k}:\n${v.map(i => `  - ${i}`).join('\n')}`)
      .join('\n\n');

    const prompt = `You are an expert Base44 phased prompt generation engine.

APP BLUEPRINT:
${blueprint.summary}

${blueprintText}

Complexity: ${blueprint.complexity}
Build Mode: ${buildMode} (${buildMode === 'fast' ? 'fewer phases, bigger scope each' : buildMode === 'safe' ? 'standard phases, controlled scope' : 'detailed phases with architecture, security, and edge cases'})

Generate phased build prompts for Base44. Return a JSON object with:
- phases: Array of phase objects, each with:
  - title: Phase name (e.g. "Foundation & Navigation")
  - goal: One sentence describing the phase goal
  - scope: Array of 3-6 short scope items (what gets built)
  - prompt: The FULL Base44-ready prompt for this phase. Each prompt MUST follow this exact structure:
    1. Role: "You are helping build a Base44 web application in a phased and controlled way."
    2. Context: App summary and what has been planned
    3. Current Phase: Exact scope
    4. Requirements: What to build now
    5. Guardrails: What NOT to change
    6. Output format: How to respond
    7. Review checks: Verification steps

    The prompt must be detailed, practical, and directly usable in Base44. It should:
    - Tell the AI to inspect current app structure before making changes
    - Preserve all existing working functionality
    - Include specific pages, entities, components, and workflows to create
    - Include validation, loading states, error handling, and mobile responsiveness
    - End with a review checklist

- addOns: Array of optional add-on objects, each with:
  - title: Add-on name
  - description: One sentence description
  - prompt: The full add-on prompt

Include 3-6 relevant add-ons based on the app type (e.g. admin system, onboarding flow, CRM, notifications, etc.)

Rules:
- ${buildMode === 'fast' ? '3-5 phases max, broader scope per phase' : buildMode === 'safe' ? '5-8 phases, controlled scope' : '6-10 phases, include architecture, security review, and edge cases'}
- Each phase must be self-contained and buildable independently
- Phases must be in logical dependency order
- Every prompt must be specific to THIS app, not generic`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          phases: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                goal: { type: 'string' },
                scope: { type: 'array', items: { type: 'string' } },
                prompt: { type: 'string' },
              },
              required: ['title', 'goal', 'scope', 'prompt'],
            },
          },
          addOns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                prompt: { type: 'string' },
              },
              required: ['title', 'description', 'prompt'],
            },
          },
        },
        required: ['phases', 'addOns'],
      },
      model: 'claude_sonnet_4_6',
    });

    setPhases(response.phases);
    setAddOns(response.addOns || []);
    setStep(3);
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-6">
          <AnimatedText text="Foundation Builder" className="mb-3" />
          <p className="text-[#A1A1AA]">
            Turn your app idea into clean phased Base44 prompts that build in the right order.
          </p>
        </div>

        <StepIndicator currentStep={step} />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
            <p className="text-[#A1A1AA] text-sm">{loadingLabel}</p>
          </div>
        ) : (
          <>
            {step === 1 && <IntakeForm onSubmit={generateBlueprint} />}
            {step === 2 && (
              <>
                <BlueprintView
                  blueprint={blueprint}
                  onNext={generatePhases}
                  onBack={() => setStep(1)}
                />
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-3">Choose Build Mode</h3>
                  <BuildModeSelector selected={buildMode} onSelect={setBuildMode} />
                </div>
              </>
            )}
            {step === 3 && (
              <PhasePlanView
                phases={phases}
                addOns={addOns}
                onBack={() => setStep(2)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}