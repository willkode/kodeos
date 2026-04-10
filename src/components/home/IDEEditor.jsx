import { ArrowRight, Code, Sparkles, Star, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IDEEditor({ hasPurchased, onGetStarted, onViewPricing }) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0D1117] p-6 md:p-8 font-jetbrains">
      {/* Comment / breadcrumb line */}
      <div className="text-sm text-[#8B949E] mb-4">
        <span className="text-[#6E7681]">/</span>
        <span className="ml-2 text-[#8B949E]">&gt; The Ultimate Prompt Library for </span>
        <span className="text-[#00FF41] italic">Vibecoders</span>
      </div>

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#C9D1D9] mb-4">
        Build Faster with <span className="text-[#00FF41]">KodeOS</span>
      </h1>

      {/* Code-style description */}
      <div className="mb-2 text-sm">
        <span className="text-[#FF7B72]">const</span>
        <span className="text-[#79C0FF]"> header</span>
        <span className="text-[#C9D1D9]"> = </span>
        <span className="text-[#8B949E]">text:</span>
        <span className="text-[#00FF41]"> KodeOS</span>
      </div>
      <div className="mb-1 text-sm">
        <span className="ml-2 text-[#D2A8FF] underline decoration-[#D2A8FF]">highlight:</span>
        <span className="text-[#C9D1D9]">   / </span>
        <span className="text-[#00FF41]">glowing</span>
      </div>
      <div className="text-sm text-[#8B949E] mb-1 ml-2 max-w-xl leading-relaxed">
        Professional, production-ready prompts for Base44, Lovable, Bolt, and more.
        Unlock 200+ prompts engineered for no-code platforms.
      </div>
      <div className="text-sm text-[#6E7681] mb-6">{")"}</div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={onGetStarted}
          className="bg-[#00FF41] text-[#0D1117] hover:bg-[#00CC33] font-jetbrains font-semibold px-6"
        >
          {hasPurchased ? 'Browse Prompts' : 'Get Started'}
        </Button>
        <Button
          variant="outline"
          onClick={onViewPricing}
          className="border-[#30363D] text-[#C9D1D9] hover:bg-[#161B22] font-jetbrains px-6"
        >
          View Pricing <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Code comment for buttons */}
      <div className="text-sm mb-1">
        <span className="text-[#8B949E]">const </span>
        <span className="text-[#79C0FF]">cta_buttons</span>
        <span className="text-[#C9D1D9]"> = ( primary true ) →</span>
      </div>
      <div className="text-sm text-[#8B949E] mb-1 ml-2">( text_Graary_hue )  primary false )</div>
      <div className="text-sm text-[#6E7681] mb-8">{")"}</div>

      {/* Features heading */}
      <h2 className="text-xl font-bold text-[#C9D1D9] mb-4">features</h2>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-2xl">
        <FeatureCard
          icon={<Code className="w-5 h-5 text-[#00FF41]" />}
          title="200+ Prompts"
          desc="Landing pages, dashboards, auth flows, and more"
        />
        <FeatureCard
          icon={<Sparkles className="w-5 h-5 text-[#D2A8FF]" />}
          title="Multi-Platform"
          desc="Works with Base44, Lovable, Bolt, Replit, and more"
        />
        <FeatureCard
          icon={<Star className="w-5 h-5 text-[#D2A8FF]" />}
          title="Multi-Platform"
          desc="Works with Base44, Lovable, Bolt, and more"
        />
        <FeatureCard
          icon={<DollarSign className="w-5 h-5 text-[#00FF41]" />}
          title="One-Time Payment"
          desc="$25 lifetime access to all prompts"
        />
      </div>

      {/* CTA section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-md border border-[#30363D] bg-[#161B22] max-w-2xl">
        <div>
          <h3 className="text-base font-bold text-[#C9D1D9] mb-1">Ready to level up?</h3>
          <p className="text-sm text-[#8B949E] max-w-sm">
            Join vibecoders worldwide and access the most powerful prompt library.
          </p>
        </div>
        <Button
          onClick={onGetStarted}
          className="bg-[#00FF41] text-[#0D1117] hover:bg-[#00CC33] font-jetbrains font-semibold px-5 shrink-0"
        >
          {hasPurchased ? 'Access Library' : 'Unlock Now'} <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-md border border-[#30363D] bg-[#161B22] hover:border-[#484F58] transition-colors">
      <div className="mt-0.5">{icon}</div>
      <div>
        <div className="text-sm font-bold text-[#C9D1D9]">{title}</div>
        <div className="text-xs text-[#8B949E] mt-0.5">{desc}</div>
      </div>
    </div>
  );
}