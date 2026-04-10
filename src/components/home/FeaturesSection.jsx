import { Code, Sparkles, Zap, Layers } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: '200+ Prompts',
    desc: 'Landing pages, dashboards, auth flows, e-commerce, admin panels, and more.',
    color: '#3B82F6',
  },
  {
    icon: Layers,
    title: 'Multi-Platform',
    desc: 'Works with Base44, Lovable, Bolt, Replit, V0 by Vercel, and more.',
    color: '#A78BFA',
  },
  {
    icon: Sparkles,
    title: 'Production-Ready',
    desc: 'Every prompt is tested and refined for real-world, shipping-quality output.',
    color: '#38BDF8',
  },
  {
    icon: Zap,
    title: 'One-Time Payment',
    desc: '$25 for lifetime access. No subscriptions. Monthly updates with new prompts.',
    color: '#FBBF24',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to ship faster
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
            Professionally crafted prompts, organized by use case and platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${f.color}15` }}
              >
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}