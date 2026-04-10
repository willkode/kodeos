import { ChevronsLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useState, useEffect } from 'react';
import IDESidebar from '../components/home/IDESidebar';
import IDETabBar from '../components/home/IDETabBar';
import IDEStatusBar from '../components/home/IDEStatusBar';
import IDEEditor from '../components/home/IDEEditor';

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

  const handleViewPricing = () => navigate('/pricing');

  return (
    <div className="h-screen flex flex-col bg-[#0D1117]">
      {/* Top bar with logo and tabs */}
      <div className="flex items-center bg-[#161B22] border-b border-[#30363D] shrink-0">
        <div className="flex items-center gap-2 px-4 py-2.5 w-56 shrink-0 border-r border-[#30363D] hidden md:flex">
          <ChevronsLeft className="w-5 h-5 text-[#00FF41]" />
          <span className="text-[#00FF41] font-bold font-jetbrains text-sm">KodeOS</span>
        </div>
        <IDETabBar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <IDESidebar user={user} />
        <IDEEditor
          hasPurchased={hasPurchased}
          onGetStarted={handleGetStarted}
          onViewPricing={handleViewPricing}
        />
      </div>

      {/* Status bar */}
      <IDEStatusBar />
    </div>
  );
}