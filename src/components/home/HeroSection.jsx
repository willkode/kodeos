import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LibraryCounters from './LibraryCounters';

export default function HeroSection({ hasPurchased, onGetStarted, onViewPricing }) {


  return (
    <section className="relative pt-32 pb-24 px-6">
      {/* Gradient orb backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B82F6]/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          <span className="text-sm text-[#A1A1AA] font-medium">The ultimate toolkit for vibecoders</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Ship apps faster with
          <br />
          <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#A78BFA] bg-clip-text text-transparent">
            KodeOS
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed">
          Prompts, AI model APIs, agent kits, and MCP servers — all in one place.
          The curated toolkit that turns vibecoding into shipping.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20"
          >
            {hasPurchased ? 'Browse Prompts' : 'Get Started'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          {!hasPurchased && (
            <Button
              size="lg"
              variant="outline"
              onClick={onViewPricing}
              className="border-white/[0.1] text-white hover:bg-white/[0.04] px-8 h-12 text-base bg-transparent"
            >
              View Pricing
            </Button>
          )}
        </div>

        {/* Counters */}
        <div className="mt-16">
          <LibraryCounters />
        </div>
      </div>
    </section>
  );
}