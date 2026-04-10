import { ArrowRight, Zap, Code, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useState, useEffect } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (currentUser) {
          const purchases = await base44.entities.Purchase.filter({
            userEmail: currentUser.email,
            status: 'completed'
          });
          setHasPurchased(purchases.length > 0);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const handleGetStarted = async () => {
    if (!user) {
      await base44.auth.redirectToLogin('/prompts');
    } else if (hasPurchased) {
      navigate('/prompts');
    } else {
      navigate('/pricing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-grid-pattern" style={{
          backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(120, 255, 100, .05) 25%, rgba(120, 255, 100, .05) 26%, transparent 27%, transparent 74%, rgba(120, 255, 100, .05) 75%, rgba(120, 255, 100, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(120, 255, 100, .05) 25%, rgba(120, 255, 100, .05) 26%, transparent 27%, transparent 74%, rgba(120, 255, 100, .05) 75%, rgba(120, 255, 100, .05) 76%, transparent 77%, transparent)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <nav className="border-b border-border/30 backdrop-blur-md bg-background/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary neon-glow" />
              <span className="text-xl font-bold neon-glow font-mono">KodeOS</span>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => base44.auth.logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={() => base44.auth.redirectToLogin()}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-8 inline-block">
            <div className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono">
              &gt; The Ultimate Prompt Library for Vibecoders
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Build Faster with{' '}
            <span className="neon-glow">KodeOS</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Professional, production-ready prompts for Base44, Lovable, Bolt, and more. 
            Unlock 200+ prompts engineered for no-code platforms.
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
            >
              {hasPurchased ? 'Browse Prompts' : 'Get Started'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {!hasPurchased && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-primary/30"
              >
                View Pricing
              </Button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: <Code className="w-6 h-6 text-primary" />,
                title: '200+ Prompts',
                desc: 'Landing pages, dashboards, auth flows, and more'
              },
              {
                icon: <Sparkles className="w-6 h-6 text-secondary" />,
                title: 'Multi-Platform',
                desc: 'Works with Base44, Lovable, Bolt, Replit, and more'
              },
              {
                icon: <Zap className="w-6 h-6 text-primary" />,
                title: 'One-Time Payment',
                desc: '$25 lifetime access to all prompts'
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="p-8 rounded-lg border border-primary/30 bg-primary/5 text-center glow-border">
            <h2 className="text-3xl font-bold mb-4">
              Ready to level up?
            </h2>
            <p className="text-muted-foreground mb-6">
              Join vibecoders worldwide and access the most powerful prompt library.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
            >
              {hasPurchased ? 'Access Library' : 'Unlock Now'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
            <p>© 2026 KodeOS. Built for vibecoders.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}