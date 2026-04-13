import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import AnimatedAIInput from '../components/ui/animated-ai-input';
import AnimatedText from '../components/AnimatedText';
import RecommendationResults from '../components/RecommendationResults';
import GuestLanding from '../components/GuestLanding';

const INDUSTRIES = [
  'E-commerce', 'SaaS', 'Healthcare', 'Education', 'Finance & Fintech',
  'Real Estate', 'Marketing & Advertising', 'Social Media', 'Logistics & Supply Chain',
  'Travel & Hospitality', 'Food & Restaurant', 'Legal', 'HR & Recruitment',
  'Gaming', 'Media & Entertainment', 'Productivity & Tools', 'Other'
];

export default function Recommender() {
  const { user, hasPurchased } = useOutletContext();
  const navigate = useNavigate();
  const [appDescription, setAppDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Library data for matching
  const [libraryData, setLibraryData] = useState({ apis: [], kits: [], mcp: [] });

  useEffect(() => {
    const loadLibrary = async () => {
      const [apis, kits, mcp] = await Promise.all([
        base44.entities.AIAgentKit.list('-created_date', 2000),
        base44.entities.AgentKit.list('-created_date', 2000),
        base44.entities.MCPServer.list('-created_date', 2000),
      ]);
      setLibraryData({ apis, kits, mcp });
    };
    if (user && hasPurchased) loadLibrary();
  }, [user, hasPurchased]);

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="AI Stack Recommender"
        pageDescription="Tell us about your app and get personalized recommendations for AI APIs, agent kits, and MCP servers."
        highlightKey="apis"
        user={user}
      />
    );
  }

  const handleRecommend = async () => {
    if (!appDescription.trim()) return;
    setLoading(true);
    setResults(null);

    const apiNames = libraryData.apis.map(a => `${a.name}: ${a.description}`).join('\n');
    const kitNames = libraryData.kits.map(k => `${k.name}: ${k.description}`).join('\n');
    const mcpNames = libraryData.mcp.map(m => `${m.name}: ${m.description}`).join('\n');

    const prompt = `You are an expert AI solutions architect. A user is building an app and needs recommendations from our curated library.

APP DETAILS:
- Description: ${appDescription}


AVAILABLE AI MODEL APIs:
${apiNames}

AVAILABLE AGENT KITS:
${kitNames}

AVAILABLE MCP SERVERS:
${mcpNames}

Based on the app details, recommend the MOST RELEVANT resources from each category. For each recommendation, explain WHY it's useful for this specific app. Only recommend items that genuinely fit — don't pad the list. Aim for 3-6 per category, fewer if not many fit.

Return a JSON object with:
- summary: A 2-3 sentence overview of the recommended AI stack strategy
- apis: Array of {name: exact name from list, reason: why it fits}
- kits: Array of {name: exact name from list, reason: why it fits}  
- mcp: Array of {name: exact name from list, reason: why it fits}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          apis: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, reason: { type: 'string' } }, required: ['name', 'reason'] } },
          kits: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, reason: { type: 'string' } }, required: ['name', 'reason'] } },
          mcp: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, reason: { type: 'string' } }, required: ['name', 'reason'] } },
        },
        required: ['summary', 'apis', 'kits', 'mcp'],
      },
    });

    // Match recommendations back to actual library items for URLs
    const matchUrl = (name, items) => {
      const match = items.find(i => i.name.toLowerCase() === name.toLowerCase());
      return match?.url || null;
    };

    const enriched = {
      summary: response.summary,
      apis: response.apis.map(r => ({ ...r, url: matchUrl(r.name, libraryData.apis) })),
      kits: response.kits.map(r => ({ ...r, url: matchUrl(r.name, libraryData.kits) })),
      mcp: response.mcp.map(r => ({ ...r, url: matchUrl(r.name, libraryData.mcp) })),
    };

    setResults(enriched);
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <AnimatedText text="AI Stack Recommender" className="mb-3" />
          <p className="text-[#A1A1AA]">
            Describe your app and we'll recommend the best AI APIs, agent kits, and MCP servers from our library.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5 mb-10">
          <div>
            <label className="block text-sm font-medium mb-2">What does your app do? *</label>
            <AnimatedAIInput
              value={appDescription}
              onChange={(val) => setAppDescription(typeof val === 'string' ? val : val?.target?.value || '')}
              onSubmit={handleRecommend}
              loading={loading}
              placeholder="e.g. A project management tool that helps remote teams track tasks, set deadlines, and collaborate in real-time..."
            />
          </div>

          <Button
            onClick={handleRecommend}
            disabled={loading || !appDescription.trim()}
            className="bg-[#3B82F6] text-white hover:bg-[#2563EB] font-semibold px-6 h-11 shadow-lg shadow-[#3B82F6]/20"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing your app...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> Get Recommendations</>
            )}
          </Button>
        </div>

        {/* Results */}
        {results && <RecommendationResults results={results} />}
      </div>
    </div>
  );
}