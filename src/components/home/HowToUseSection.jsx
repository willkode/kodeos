import { Search, Copy, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Browse & discover',
    desc: 'Search across prompts, AI model APIs, agent kits, and MCP servers. Filter by category to find exactly what you need.',
    color: '#3B82F6',
  },
  {
    num: '02',
    icon: Copy,
    title: 'Copy & customize',
    desc: 'One-click copy any prompt. Plug API endpoints into your app. Connect MCP servers to your AI tools.',
    color: '#A78BFA',
  },
  {
    num: '03',
    icon: Rocket,
    title: 'Ship & iterate',
    desc: 'Paste into Base44, Lovable, Bolt, or any AI-powered platform. Watch your app come to life in seconds.',
    color: '#38BDF8',
  },
];

export default function HowToUseSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6">
            <span className="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider">How it works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Three steps to shipping faster
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
            No setup. No installation. Just find, copy, and build.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[#3B82F6]/30 via-[#A78BFA]/30 to-[#38BDF8]/30" />
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10"
                  style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                >
                  <step.icon className="w-6 h-6" style={{ color: step.color }} />
                </div>
                <div className="text-xs font-mono text-[#71717A] mb-2">{step.num}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}