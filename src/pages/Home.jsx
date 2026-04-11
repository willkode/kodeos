import { ArrowRight, Code, Sparkles, Zap, Terminal, ChevronRight, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CTASection from '../components/home/CTASection';
import HomeFooter from '../components/home/HomeFooter';

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
    <div className="overflow-x-hidden pt-16">
      <HeroSection hasPurchased={hasPurchased} onGetStarted={handleGetStarted} onViewPricing={() => navigate('/pricing')} />
      <FeaturesSection />
      <CTASection hasPurchased={hasPurchased} onGetStarted={handleGetStarted} />
      <HomeFooter />
    </div>
  );
}