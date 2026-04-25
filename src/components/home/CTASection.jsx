import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection({ hasPurchased, onGetStarted }) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto relative">
        <div className="rounded-2xl border border-surface-border bg-gradient-to-br from-surface-hover to-transparent p-10 md:p-14 text-center relative overflow-hidden">
          {/* Glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#3B82F6]/[0.06] rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 relative">
            Ready to level up?
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto relative">
            Join vibecoders worldwide and access the most powerful prompt library.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20 relative"
          >
            {hasPurchased ? 'Access Library' : 'Unlock Now'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}