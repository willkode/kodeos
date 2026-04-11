import { Lightbulb, Clock, Puzzle, TrendingUp } from 'lucide-react';
import BorderGlow from '../BorderGlow';

const reasons = [
  {
    icon: Clock,
    title: 'Save hours of trial & error',
    desc: 'Stop guessing prompts. Every resource in KodeOS is tested, refined, and ready to paste — so you ship in minutes, not days.',
    color: '#3B82F6',
  },
  {
    icon: Puzzle,
    title: 'Connect AI tools together',
    desc: 'MCP servers, agent kits, and model APIs work together. Build complex workflows without deep technical knowledge.',
    color: '#A78BFA',
  },
  {
    icon: Lightbulb,
    title: 'Learn by example',
    desc: 'Every prompt shows you exactly how to talk to AI. Browse by category, copy, adapt, and build on top of proven patterns.',
    color: '#38BDF8',
  },
  {
    icon: TrendingUp,
    title: 'Stay ahead of the curve',
    desc: 'New AI tools launch daily. KodeOS curates the best — so you always know what\'s available and how to use it.',
    color: '#FBBF24',
  },
];

export default function WhySection() {
  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6">
            <span className="text-xs text-[#A1A1AA] font-medium uppercase tracking-wider">Why KodeOS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why vibecoders need this library
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto">
            Vibecoding is fast — but only if you have the right building blocks. 
            KodeOS is the toolkit that turns ideas into shipped products.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <BorderGlow key={i}>
              <div className="p-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${r.color}15` }}
                >
                  <r.icon className="w-5 h-5" style={{ color: r.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{r.title}</h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">{r.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </div>
    </section>
  );
}