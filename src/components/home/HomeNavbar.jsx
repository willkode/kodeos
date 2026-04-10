import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

export default function HomeNavbar({ user }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#09090B]" />
          </div>
          <span className="text-lg font-bold tracking-tight">KodeOS</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#A1A1AA]">
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/prompts')}>Library</span>
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/prompts?tab=saved')}>Saved</span>
          <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/pricing')}>Pricing</span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-[#A1A1AA] hidden sm:block">{user.email}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-[#A1A1AA] hover:text-white hover:bg-white/[0.06]"
                onClick={() => base44.auth.logout()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-white text-[#09090B] hover:bg-white/90 font-medium"
              onClick={() => base44.auth.redirectToLogin()}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}