import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminOverview from '../components/admin/AdminOverview';
import UserManager from '../components/admin/UserManager';
import ResourceManager from '../components/admin/ResourceManager';
import PromptForm from '../components/PromptForm';
import PromptList from '../components/PromptList';
import AIPromptGenerator from '../components/admin/AIPromptGenerator';
import CategoryManager from '../components/admin/CategoryManager';
import ResourceInfoGenerator from '../components/admin/ResourceInfoGenerator';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [counts, setCounts] = useState({});

  // Prompt-specific state
  const [prompts, setPrompts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        if (currentUser?.role !== 'admin') { navigate('/'); return; }

        // Load all counts in parallel
        const [allPrompts, apis, agents, mcps, starters, users, purchases] = await Promise.all([
          base44.entities.Prompt.list('-created_date', 500),
          base44.entities.AIAgentKit.list('-created_date', 2000),
          base44.entities.AgentKit.list('-created_date', 2000),
          base44.entities.MCPServer.list('-created_date', 2000),
          base44.entities.AppStarterKit.list('-created_date', 2000),
          base44.entities.User.list('-created_date', 1000),
          base44.entities.Purchase.filter({ status: 'completed' }, '-created_date', 2000),
        ]);

        setPrompts(allPrompts);
        setCounts({
          prompts: allPrompts.length,
          apis: apis.length,
          agents: agents.length,
          mcp: mcps.length,
          starters: starters.length,
          users: users.length,
          purchases: purchases.length,
        });
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const refreshPrompts = async () => {
    const updated = await base44.entities.Prompt.list('-created_date', 500);
    setPrompts(updated);
    setCounts(prev => ({ ...prev, prompts: updated.length }));
  };

  const handleCreatePrompt = async (data) => {
    await base44.entities.Prompt.create(data);
    await refreshPrompts();
    setShowForm(false);
  };

  const handleUpdatePrompt = async (id, data) => {
    await base44.entities.Prompt.update(id, data);
    await refreshPrompts();
    setEditingPrompt(null);
  };

  const handleDeletePrompt = async (id) => {
    if (!window.confirm('Delete this prompt?')) return;
    await base44.entities.Prompt.delete(id);
    setPrompts(prev => prev.filter(p => p.id !== id));
    setCounts(prev => ({ ...prev, prompts: prev.prompts - 1 }));
  };

  const filtered = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const tabTitles = {
    overview: 'Admin Dashboard',
    users: 'User Management',
    prompts: 'Manage Prompts',
    apis: 'AI Model APIs',
    agents: 'Agent Kits',
    mcp: 'MCP Servers',
    starters: 'Starter Kits',
    generate: 'AI Prompt Generator',
    categories: 'Category Manager',
    resourceInfo: 'Resource Info Generator',
  };

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText text={tabTitles[activeTab] || 'Admin'} className="mb-1" />
          <p className="text-[#A1A1AA] text-sm">
            Manage all KodeOS resources and users from one place.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block sticky top-24 self-start">
            <AdminSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              counts={counts}
            />
          </aside>

          {/* Mobile tab selector */}
          <div className="lg:hidden mb-4 w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-card border border-border/30 text-sm"
            >
              {Object.entries(tabTitles).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Overview */}
            {activeTab === 'overview' && (
              <AdminOverview counts={counts} onNavigate={setActiveTab} />
            )}

            {/* Users */}
            {activeTab === 'users' && <UserManager />}

            {/* Prompts */}
            {activeTab === 'prompts' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    Prompts <span className="text-sm font-normal text-[#71717A]">({prompts.length})</span>
                  </h2>
                  <Button
                    onClick={() => { setEditingPrompt(null); setShowForm(!showForm); }}
                    className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" /> New Prompt
                  </Button>
                </div>

                {showForm && (
                  <div className="mb-6 p-5 rounded-lg border border-primary/30 bg-card/50">
                    <PromptForm
                      initialPrompt={editingPrompt}
                      onSubmit={editingPrompt
                        ? (data) => handleUpdatePrompt(editingPrompt.id, data)
                        : handleCreatePrompt
                      }
                      onCancel={() => { setShowForm(false); setEditingPrompt(null); }}
                    />
                  </div>
                )}

                <Input
                  placeholder="Search prompts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-card border-border/30 mb-4"
                />

                <PromptList
                  prompts={filtered}
                  onEdit={(p) => { setEditingPrompt(p); setShowForm(true); }}
                  onDelete={handleDeletePrompt}
                />
              </div>
            )}

            {/* AI Model APIs */}
            {activeTab === 'apis' && (
              <ResourceManager
                entityName="AIAgentKit"
                label="AI Model APIs"
                fields={['name', 'description', 'category']}
              />
            )}

            {/* Agent Kits */}
            {activeTab === 'agents' && (
              <ResourceManager
                entityName="AgentKit"
                label="Agent Kits"
                fields={['name', 'description', 'category']}
              />
            )}

            {/* MCP Servers */}
            {activeTab === 'mcp' && (
              <ResourceManager
                entityName="MCPServer"
                label="MCP Servers"
                fields={['name', 'description', 'category']}
              />
            )}

            {/* Starter Kits */}
            {activeTab === 'starters' && (
              <ResourceManager
                entityName="AppStarterKit"
                label="Starter Kits"
                fields={['name', 'prompt', 'category']}
              />
            )}

            {/* AI Generate */}
            {activeTab === 'generate' && (
              <div className="p-6 rounded-lg border border-[#3B82F6]/30 bg-card/50">
                <AIPromptGenerator onPromptsCreated={refreshPrompts} />
              </div>
            )}

            {/* Categories */}
            {activeTab === 'categories' && (
              <div className="p-6 rounded-lg border border-[#3B82F6]/30 bg-card/50">
                <CategoryManager prompts={prompts} onPromptsCreated={refreshPrompts} />
              </div>
            )}

            {/* Resource Info */}
            {activeTab === 'resourceInfo' && (
              <div className="p-6 rounded-lg border border-[#3B82F6]/30 bg-card/50">
                <ResourceInfoGenerator />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}