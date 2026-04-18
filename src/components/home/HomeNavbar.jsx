import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import GlitchLogo from './GlitchLogo';
import NavExpandedTabs from '../NavExpandedTabs';

export default function HomeNavbar({ user, hasPurchased }) {
  const navigate = useNavigate();
  const hasAccess = user && hasPurchased;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => navigate('/')}>
          <GlitchLogo text="KODEOS" />
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#A1A1AA]">
          {hasAccess ? (
            <>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/prompts')}>Prompts</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/ai-models-apis')}>AI Models APIs</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/agent-kits')}>Agent Kits</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/mcp-servers')}>MCP Servers</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/app-starter-kits')}>Starter Kits</span>
              <span className="hover:text-white cursor-pointer transition-colors text-[#3B82F6]" onClick={() => navigate('/recommender')}>AI Recommender</span>
              <span className="hover:text-white cursor-pointer transition-colors font-medium text-[#A78BFA]" onClick={() => navigate('/projects')}>Planner</span>
            </>
          ) : (
            <>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/prompts')}>Prompts</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/ai-models-apis')}>AI Models APIs</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/agent-kits')}>Agent Kits</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/mcp-servers')}>MCP Servers</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/app-starter-kits')}>Starter Kits</span>
              <span className="hover:text-white cursor-pointer transition-colors text-[#3B82F6]" onClick={() => navigate('/recommender')}>AI Recommender</span>
              <span className="hover:text-white cursor-pointer transition-colors font-medium text-[#A78BFA]" onClick={() => navigate('/projects')}>Planner</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate('/pricing')}>Pricing</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <NavExpandedTabs user={user} />
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