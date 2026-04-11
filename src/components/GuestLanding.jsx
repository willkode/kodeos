import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ArrowRight, FileText, Cpu, Bot, Server, Clock, Puzzle, Lightbulb, TrendingUp, Lock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BorderGlow from './BorderGlow';

const categories = [
  { key: 'prompts', label: 'Prompts', icon: FileText, color: '#3B82F6', entity: 'Prompt' },
  { key: 'apis', label: 'AI Model APIs', icon: Cpu, color: '#A78BFA', entity: 'AIAgentKit' },
  { key: 'kits', label: 'Agent Kits', icon: Bot, color: '#38BDF8', entity: 'AgentKit' },
  { key: 'mcp', label: 'MCP Servers', icon: Server, color: '#FBBF24', entity: 'MCPServer' },
];

const benefits = [
  { icon: Clock, title: 'Save hours of trial & error', desc: 'Every resource is tested, refined, and ready to paste — ship in minutes, not days.', color: '#3B82F6' },
  { icon: Puzzle, title: 'Connect AI tools together', desc: 'MCP servers, agent kits, and model APIs work together for complex workflows.', color: '#A78BFA' },
  { icon: Lightbulb, title: 'Learn by example', desc: 'Browse by category, copy, adapt, and build on top of proven patterns.', color: '#38BDF8' },
  { icon: TrendingUp, title: 'Always up to date', desc: 'New AI tools launch daily. KodeOS curates the best so you stay ahead.', color: '#FBBF24' },
];

const steps = [
  { num: '01', title: 'Browse', desc: 'Explore prompts, APIs, agent kits, and MCP servers organized by category.' },
  { num: '02', title: 'Copy & Customize', desc: 'Grab what you need and adapt it to your specific project requirements.' },
  { num: '03', title: 'Ship Faster', desc: 'Spend less time on setup and more time building what matters.' },
];

export default function GuestLanding({ pageTitle, pageDescription, highlightKey, user }) {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      const results = {};
      for (const cat of categories) {
        try {
          const all = await base44.entities[cat.entity].list('-created_date', 2000);
          results[cat.key] = all.length;
        } catch {
          results[cat.key] = 0;
        }
      }
      setCounts(results);
    };
    load();
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const highlighted = categories.find(c => c.key === highlightKey);
  const highlightCount = counts[highlightKey] || 0;

  return (
    <div className="pt-16">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#3B82F6]/[0.04] rounded-full blur-[120px] pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] mb-6">
              {user ? (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span className="text-sm text-[#A1A1AA] font-medium">Upgrade to access the full library</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  <span className="text-sm text-[#A1A1AA] font-medium">Sign in to access the full library</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
              {pageTitle}
            </h1>
            <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-4">
              {pageDescription}
            </p>
            {highlighted && highlightCount > 0 && (
              <p className="text-2xl font-bold mb-8" style={{ color: highlighted.color }}>
                {highlightCount.toLocaleString()} {highlighted.label} available
              </p>
            )}
            <Button
              size="lg"
              onClick={() => user ? navigate('/pricing') : base44.auth.redirectToLogin()}
              className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20"
            >
              {user ? 'View Pricing' : 'Sign In to Access'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          {categories.map((cat) => {
            const isHighlighted = cat.key === highlightKey;
            return (
              <BorderGlow key={cat.key}>
                <div className={`p-5 ${isHighlighted ? 'ring-1 rounded-xl' : ''}`} style={isHighlighted ? { ringColor: cat.color + '40' } : {}}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${cat.color}15` }}>
                    <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: cat.color }}>
                    {counts[cat.key] !== undefined ? counts[cat.key].toLocaleString() : '—'}
                  </div>
                  <div className="text-sm text-[#A1A1AA]">{cat.label}</div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
        {total > 0 && (
          <p className="text-center text-sm text-[#71717A] -mt-16 mb-20">
            <span className="text-white font-semibold">{total.toLocaleString()}</span> resources and growing — updated weekly
          </p>
        )}

        {/* Why section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Why vibecoders need this library</h2>
            <p className="text-[#A1A1AA] max-w-xl mx-auto">
              Vibecoding is fast — but only if you have the right building blocks.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <BorderGlow key={i}>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${b.color}15` }}>
                    <b.icon className="w-5 h-5" style={{ color: b.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{b.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>

        {/* How to use */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <BorderGlow key={i}>
                <div className="p-6">
                  <div className="text-3xl font-bold text-[#3B82F6]/30 mb-3">{s.num}</div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{s.desc}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-10 md:p-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Ready to start building?</h2>
            <p className="text-[#A1A1AA] text-lg mb-8 max-w-md mx-auto">
              Sign in to access the full library of curated AI resources.
            </p>
            <Button
              size="lg"
              onClick={() => user ? navigate('/pricing') : base44.auth.redirectToLogin()}
              className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-8 h-12 text-base shadow-lg shadow-[#3B82F6]/20"
            >
              {user ? 'Unlock Full Access' : 'Get Started'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}