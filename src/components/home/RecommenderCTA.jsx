import { ArrowRight, Sparkles, Cpu, Bot, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BorderGlow from '../BorderGlow';
import { PixelCanvas } from '../ui/pixel-canvas';

const features = [
  { icon: Cpu, label: 'AI Model APIs', color: '#A78BFA' },
  { icon: Bot, label: 'Agent Kits', color: '#38BDF8' },
  { icon: Server, label: 'MCP Servers', color: '#FBBF24' },
];

export default function RecommenderCTA({ hasPurchased }) {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#3B82F6]/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto relative">
        <BorderGlow>
          <div className="relative overflow-hidden p-10 md:p-14 text-center rounded-xl">
            <PixelCanvas
              gap={10}
              speed={30}
              colors={["#1e3a5f", "#3B82F6", "#60A5FA"]}
            />
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#3B82F6]/10 mb-6">
              <Sparkles className="w-7 h-7 text-[#3B82F6]" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              AI Stack Recommender
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              Tell us about your app — its purpose, industry, and audience — and our AI will recommend the perfect combination of APIs, agent kits, and MCP servers to supercharge it.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03]"
                >
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                  <span className="text-sm text-[#E4E4E7] font-medium">{f.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {hasPurchased ? (
              <Button
                size="lg"
                onClick={() => navigate('/recommender')}
                className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20"
              >
                Try the Recommender <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/pricing')}
                  className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20"
                >
                  Subscribe to Unlock <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-[#71717A]">
                  Available with KodeOS Pro — one-time payment, lifetime access.
                </p>
              </div>
            )}
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}