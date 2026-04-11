import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useOutletContext } from 'react-router-dom';
import PromptCard from '../components/PromptCard';
import AIAgentKitCard from '../components/AIAgentKitCard';
import { Bookmark, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedText from '../components/AnimatedText';

export default function Dashboard() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPromptIds, setSavedPromptIds] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }
      const ids = user.savedPrompts || [];
      setSavedPromptIds(ids);
      if (ids.length > 0) {
        const allPrompts = await base44.entities.Prompt.list('-created_date', 500);
        setSavedPrompts(allPrompts.filter(p => ids.includes(p.id)));
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const toggleSave = async (promptId) => {
    const updated = savedPromptIds.includes(promptId)
      ? savedPromptIds.filter(id => id !== promptId)
      : [...savedPromptIds, promptId];
    setSavedPromptIds(updated);
    setSavedPrompts(prev => prev.filter(p => updated.includes(p.id)));
    await base44.auth.updateMe({ savedPrompts: updated });
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

        {/* Saved Prompts */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Bookmark className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-xl font-semibold">Saved Prompts</h2>
            <span className="text-sm text-[#71717A]">({savedPrompts.length})</span>
          </div>

          {savedPrompts.length === 0 ? (
            <div className="text-center py-16 border border-white/[0.06] rounded-xl bg-white/[0.02]">
              <Bookmark className="w-10 h-10 text-[#71717A] mx-auto mb-3" />
              <p className="text-[#A1A1AA] mb-1">No saved prompts yet</p>
              <p className="text-sm text-[#71717A]">Browse the prompt library and bookmark your favorites.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  isSaved={true}
                  onToggleSave={() => toggleSave(prompt.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}