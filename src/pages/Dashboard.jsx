import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useOutletContext, useNavigate } from 'react-router-dom';
import PromptCard from '../components/PromptCard';
import AIAgentKitCard from '../components/AIAgentKitCard';
import AgentKitCard from '../components/AgentKitCard';
import MCPServerCard from '../components/MCPServerCard';
import ResourceDetailModal from '../components/ResourceDetailModal';
import SavedResourceSection from '../components/SavedResourceSection';
import { Sparkles } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';

export default function Dashboard() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [savedPromptIds, setSavedPromptIds] = useState([]);
  const [savedAPIIds, setSavedAPIIds] = useState([]);
  const [savedAgentIds, setSavedAgentIds] = useState([]);
  const [savedMCPIds, setSavedMCPIds] = useState([]);

  const [savedPrompts, setSavedPrompts] = useState([]);
  const [savedAPIs, setSavedAPIs] = useState([]);
  const [savedAgents, setSavedAgents] = useState([]);
  const [savedMCPs, setSavedMCPs] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }

      const promptIds = user.savedPrompts || [];
      const apiIds = user.savedAPIs || [];
      const agentIds = user.savedAgentKits || [];
      const mcpIds = user.savedMCPServers || [];

      setSavedPromptIds(promptIds);
      setSavedAPIIds(apiIds);
      setSavedAgentIds(agentIds);
      setSavedMCPIds(mcpIds);

      const [allPrompts, allAPIs, allAgents, allMCPs] = await Promise.all([
        promptIds.length > 0 ? base44.entities.Prompt.list('-created_date', 500) : Promise.resolve([]),
        apiIds.length > 0 ? base44.entities.AIAgentKit.list('-created_date', 2000) : Promise.resolve([]),
        agentIds.length > 0 ? base44.entities.AgentKit.list('-created_date', 2000) : Promise.resolve([]),
        mcpIds.length > 0 ? base44.entities.MCPServer.list('-created_date', 2000) : Promise.resolve([]),
      ]);

      setSavedPrompts(allPrompts.filter(p => promptIds.includes(p.id)));
      setSavedAPIs(allAPIs.filter(a => apiIds.includes(a.id)));
      setSavedAgents(allAgents.filter(a => agentIds.includes(a.id)));
      setSavedMCPs(allMCPs.filter(m => mcpIds.includes(m.id)));
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleSavePrompt = async (promptId) => {
    const updated = savedPromptIds.includes(promptId)
      ? savedPromptIds.filter(id => id !== promptId)
      : [...savedPromptIds, promptId];
    setSavedPromptIds(updated);
    setSavedPrompts(prev => prev.filter(p => updated.includes(p.id)));
    await base44.auth.updateMe({ savedPrompts: updated });
  };

  const toggleSaveAPI = async (id) => {
    const updated = savedAPIIds.includes(id)
      ? savedAPIIds.filter(i => i !== id)
      : [...savedAPIIds, id];
    setSavedAPIIds(updated);
    setSavedAPIs(prev => prev.filter(a => updated.includes(a.id)));
    await base44.auth.updateMe({ savedAPIs: updated });
  };

  const toggleSaveAgent = async (id) => {
    const updated = savedAgentIds.includes(id)
      ? savedAgentIds.filter(i => i !== id)
      : [...savedAgentIds, id];
    setSavedAgentIds(updated);
    setSavedAgents(prev => prev.filter(a => updated.includes(a.id)));
    await base44.auth.updateMe({ savedAgentKits: updated });
  };

  const toggleSaveMCP = async (id) => {
    const updated = savedMCPIds.includes(id)
      ? savedMCPIds.filter(i => i !== id)
      : [...savedMCPIds, id];
    setSavedMCPIds(updated);
    setSavedMCPs(prev => prev.filter(m => updated.includes(m.id)));
    await base44.auth.updateMe({ savedMCPServers: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <AnimatedText text="Your Dashboard" className="mb-2" />
            <p className="text-[#A1A1AA]">
              Welcome back{user?.full_name ? `, ${user.full_name}` : ''}. Here are your saved items.
            </p>
          </div>
          <button
            onClick={() => navigate('/recommender')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] text-white text-sm font-semibold hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/20 flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" /> AI Recommender
          </button>
        </div>

        <SavedResourceSection
          title="Saved Prompts"
          items={savedPrompts}
          emptyText="Browse the prompt library and bookmark your favorites."
          renderItem={(prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isSaved={true}
              onToggleSave={() => toggleSavePrompt(prompt.id)}
            />
          )}
        />

        <SavedResourceSection
          title="Saved AI Model APIs"
          items={savedAPIs}
          emptyText="Browse AI Model APIs and save your favorites."
          renderItem={(api) => (
            <AIAgentKitCard
              key={api.id}
              kit={api}
              isSaved={true}
              onToggleSave={() => toggleSaveAPI(api.id)}
              onClick={(item) => { setSelectedItem(item); setSelectedType('api'); }}
            />
          )}
        />

        <SavedResourceSection
          title="Saved Agent Kits"
          items={savedAgents}
          emptyText="Browse Agent Kits and save your favorites."
          renderItem={(kit) => (
            <AgentKitCard
              key={kit.id}
              kit={kit}
              isSaved={true}
              onToggleSave={() => toggleSaveAgent(kit.id)}
              onClick={(item) => { setSelectedItem(item); setSelectedType('agent'); }}
            />
          )}
        />

        <SavedResourceSection
          title="Saved MCP Servers"
          items={savedMCPs}
          emptyText="Browse MCP Servers and save your favorites."
          renderItem={(server) => (
            <MCPServerCard
              key={server.id}
              server={server}
              isSaved={true}
              onToggleSave={() => toggleSaveMCP(server.id)}
              onClick={(item) => { setSelectedItem(item); setSelectedType('mcp'); }}
            />
          )}
        />

        <ResourceDetailModal
          item={selectedItem}
          type={selectedType}
          open={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </div>
    </div>
  );
}