import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Layers, Wand2, FileText, GitBranch, Download } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const steps = [
  { icon: Layers, title: 'Map Your App', desc: 'Define pages, features, roles, data entities, user flows, and integrations in a guided workspace.' },
  { icon: Wand2, title: 'AI Generates Prompts', desc: 'Our AI analyzes your app map and produces phased, copy-paste-ready build prompts tailored to your platform.' },
  { icon: FileText, title: 'Build Phase by Phase', desc: 'Follow the generated plan step by step — paste each prompt into Base44, Lovable, Bolt, or any AI builder.' },
  { icon: Download, title: 'Export & Share', desc: 'Download your full build plan as Markdown or copy it to clipboard — ready for your team or client.' },
];

export default function PlannerCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A855F7]/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#A855F7]/20 bg-[#A855F7]/[0.06] mb-6">
            <GitBranch className="w-3.5 h-3.5 text-[#A855F7]" />
            <span className="text-sm text-[#A855F7] font-medium">App Planner + Prompt Engine</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Plan your app. Generate build prompts.
            <br />
            <span className="text-[#A855F7]">Ship with confidence.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop guessing what to build next. The Planner maps your entire app architecture, then AI writes the exact prompts you need — phase by phase, ready to paste.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {steps.map((step, i) => (
            <BorderGlow key={i}>
              <div className="p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#A855F7]/10">
                  <step.icon className="w-5 h-5 text-[#A855F7]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </BorderGlow>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate('/projects')}
            className="bg-[#A855F7] text-white hover:bg-[#9333EA] font-semibold px-8 h-12 text-base shadow-lg shadow-[#A855F7]/20"
          >
            Open the Planner <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-text-tertiary mt-3">Free for all users — no purchase required.</p>
        </div>
      </div>
    </section>
  );
}