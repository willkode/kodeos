import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useState } from 'react';
import AnimatedText from '../components/AnimatedText';

export default function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const features = [
    'Access to 200+ production-ready prompts',
    'All platforms supported (Base44, Lovable, Bolt, etc.)',
    'Monthly updates with new prompts',
    'Email support',
    'Lifetime license',
    'Prompt version history'
  ];

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const isAuth = await base44.auth.isAuthenticated();
      if (!isAuth) {
        base44.auth.redirectToLogin('/pricing');
        return;
      }
      const user = await base44.auth.me();
      
      const response = await base44.functions.invoke('createCheckoutSession', {
        email: user.email
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <AnimatedText
            text="One Price. Lifetime Access."
            className="mb-4 items-center"
            textClassName="text-5xl"
          />
          <p className="text-xl text-muted-foreground">
            Everything you need to build faster, forever.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          <div className="p-8 rounded-lg border border-primary/30 bg-card backdrop-blur-sm glow-border">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">KodeOS Pro</h2>
              <p className="text-muted-foreground text-sm">Lifetime access</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold text-primary mb-2">
                $10
              </div>
              <p className="text-muted-foreground">One-time payment</p>
            </div>

            <Button
              size="lg"
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow mb-8"
            >
              {loading ? 'Processing...' : 'Unlock Full Access'} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-muted-foreground text-sm">
          <p>Secure checkout powered by Square. 30-day money-back guarantee.</p>
        </div>
      </div>
    </div>
  );
}