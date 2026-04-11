import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import PromptForm from '../components/PromptForm';
import PromptList from '../components/PromptList';
import AIPromptGenerator from '../components/admin/AIPromptGenerator';
import CategoryManager from '../components/admin/CategoryManager';
import { Plus, Sparkles, List, FolderOpen } from 'lucide-react';
import AnimatedText from '../components/AnimatedText';

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (currentUser?.role !== 'admin') {
          navigate('/');
          return;
        }

        const allPrompts = await base44.entities.Prompt.list('-created_date', 500);
        setPrompts(allPrompts);
      } catch (err) {
        console.error('Auth error:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleCreatePrompt = async (promptData) => {
    try {
      await base44.entities.Prompt.create(promptData);
      const updated = await base44.entities.Prompt.list('-created_date', 500);
      setPrompts(updated);
      setShowForm(false);
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleUpdatePrompt = async (promptId, promptData) => {
    try {
      await base44.entities.Prompt.update(promptId, promptData);
      const updated = await base44.entities.Prompt.list('-created_date', 500);
      setPrompts(updated);
      setEditingPrompt(null);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDeletePrompt = async (promptId) => {
    if (!window.confirm('Delete this prompt?')) return;
    try {
      await base44.entities.Prompt.delete(promptId);
      setPrompts(prompts.filter(p => p.id !== promptId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = prompts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <AnimatedText text="Manage Prompts" className="mb-2" />
            <p className="text-muted-foreground">
              {filtered.length} prompts in library
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={activeTab === 'categories' ? 'default' : 'outline'}
              onClick={() => setActiveTab(activeTab === 'categories' ? 'list' : 'categories')}
              className={activeTab === 'categories' ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]' : 'border-border/50'}
            >
              <FolderOpen className="w-4 h-4 mr-2" /> Categories
            </Button>
            <Button
              variant={activeTab === 'generate' ? 'default' : 'outline'}
              onClick={() => setActiveTab(activeTab === 'generate' ? 'list' : 'generate')}
              className={activeTab === 'generate' ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB]' : 'border-border/50'}
            >
              <Sparkles className="w-4 h-4 mr-2" /> AI Generate
            </Button>
            <Button
              onClick={() => {
                setEditingPrompt(null);
                setShowForm(!showForm);
                setActiveTab('list');
              }}
              className="bg-[#3B82F6] text-white hover:bg-[#2563EB]"
            >
              <Plus className="w-4 h-4 mr-2" /> New Prompt
            </Button>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="mb-8 p-6 rounded-lg border border-[#3B82F6]/30 bg-card/50">
            <CategoryManager
              prompts={prompts}
              onPromptsCreated={async () => {
                const updated = await base44.entities.Prompt.list('-created_date', 500);
                setPrompts(updated);
              }}
            />
          </div>
        )}

        {/* AI Generator Tab */}
        {activeTab === 'generate' && (
          <div className="mb-8 p-6 rounded-lg border border-[#3B82F6]/30 bg-card/50">
            <AIPromptGenerator
              onPromptsCreated={async () => {
                const updated = await base44.entities.Prompt.list('-created_date', 500);
                setPrompts(updated);
              }}
            />
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8 p-6 rounded-lg border border-primary/30 bg-card/50 glow-border">
            <PromptForm
              initialPrompt={editingPrompt}
              onSubmit={editingPrompt ? 
                (data) => handleUpdatePrompt(editingPrompt.id, data) :
                handleCreatePrompt
              }
              onCancel={() => {
                setShowForm(false);
                setEditingPrompt(null);
              }}
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-border/30"
          />
        </div>

        {/* List */}
        <PromptList
          prompts={filtered}
          onEdit={(prompt) => {
            setEditingPrompt(prompt);
            setShowForm(true);
          }}
          onDelete={handleDeletePrompt}
        />
      </div>
    </div>
  );
}