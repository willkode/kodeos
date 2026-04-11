import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PromptCard from '../components/PromptCard';
import { Bookmark, X } from 'lucide-react';
import GradientSearchInput from '../components/GradientSearchInput';
import FilterSidebar from '../components/prompts/FilterSidebar';
import ShineBorder from '../components/ShineBorder';
import AnimatedText from '../components/AnimatedText';
import { useOutletContext } from 'react-router-dom';
import GuestLanding from '../components/GuestLanding';



export default function Prompts() {
  const { user, hasPurchased } = useOutletContext();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [savedPromptIds, setSavedPromptIds] = useState([]);
  const urlParams = new URLSearchParams(window.location.search);
  const [showSaved, setShowSaved] = useState(urlParams.get('tab') === 'saved');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          setSavedPromptIds(user?.savedPrompts || []);
        }
        const allPrompts = await base44.entities.Prompt.list('-created_date', 200);
        setPrompts(allPrompts);
      } catch (err) {
        console.error('Error loading prompts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const toggleSave = async (promptId) => {
    const updated = savedPromptIds.includes(promptId)
      ? savedPromptIds.filter(id => id !== promptId)
      : [...savedPromptIds, promptId];
    setSavedPromptIds(updated);
    await base44.auth.updateMe({ savedPrompts: updated });
  };

  const filtered = prompts.filter(p => {
    if (showSaved && !savedPromptIds.includes(p.id)) return false;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="Prompt Library"
        pageDescription="Curated, copy-paste prompts for every stage of vibecoding — from idea validation to production deployment."
        highlightKey="prompts"
        user={user}
      />
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText text="Prompt Library" className="mb-4" />
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setShowSaved(false)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                !showSaved ? 'border-[#3B82F6] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              All Prompts ({prompts.length})
            </button>
            <button
              onClick={() => setShowSaved(true)}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                showSaved ? 'border-[#3B82F6] text-white' : 'border-transparent text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved ({savedPromptIds.length})
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <GradientSearchInput
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sidebar + Grid Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <ShineBorder color={['#3B82F6', '#A855F7', '#38bdf8']}>
              <div className="p-4 rounded-xl bg-white/[0.02]">
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categoryCounts={prompts.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {})}
                />
              </div>
            </ShineBorder>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active filters on mobile */}
            {selectedCategory && (
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory('')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-medium"
                >
                  {selectedCategory}
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-[#71717A] mb-4">{filtered.length} prompt{filtered.length !== 1 ? 's' : ''}</p>

            {/* Prompts Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No prompts found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(prompt => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    isSaved={savedPromptIds.includes(prompt.id)}
                    onToggleSave={() => toggleSave(prompt.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}