import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import GradientSearchInput from '../components/GradientSearchInput';
import AppStarterKitCard from '../components/AppStarterKitCard';
import FilterSidebar from '../components/prompts/FilterSidebar';
import ShineBorder from '../components/ShineBorder';
import AnimatedText from '../components/AnimatedText';
import { useOutletContext } from 'react-router-dom';
import GuestLanding from '../components/GuestLanding';
import AppStarterKitDetailModal from '../components/AppStarterKitDetailModal';

export default function AppStarterKits() {
  const { user, hasPurchased } = useOutletContext();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const PAGE_SIZE = 30;
  const [selectedItem, setSelectedItem] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (user) setSavedIds(user.savedStarterKits || []);
  }, [user]);

  const toggleSave = async (id) => {
    const updated = savedIds.includes(id)
      ? savedIds.filter(i => i !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    await base44.auth.updateMe({ savedStarterKits: updated });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const allKits = await base44.entities.AppStarterKit.list('-created_date', 2000);
        setKits(allKits);
      } catch (err) {
        console.error('Error loading App Starter Kits:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categoryCounts = kits.reduce((acc, k) => {
    const cat = k.category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const filtered = kits.filter(k => {
    const q = search.toLowerCase();
    const matchesSearch = k.name.toLowerCase().includes(q) ||
      (k.prompt || '').toLowerCase().includes(q) ||
      (k.ai_apis || []).some(a => a.toLowerCase().includes(q)) ||
      (k.agents || []).some(a => a.toLowerCase().includes(q)) ||
      (k.mcp_servers || []).some(m => m.toLowerCase().includes(q));
    const matchesCategory = !selectedCategory || (k.category || 'Uncategorized') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="App Starter Kits"
        pageDescription="Pre-built combinations of AI APIs, agents, and MCP servers — ready to copy and start building."
        highlightKey="starters"
        user={user}
      />
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText text="App Starter Kits" className="mb-2" />
          <p className="text-text-secondary">
            {kits.length} pre-built kits combining AI APIs, agents, and MCP servers — pick one and start building.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <GradientSearchInput
            placeholder="Search kits, APIs, agents, MCP servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sidebar + Grid */}
        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <ShineBorder color={['#3B82F6', '#A855F7', '#38bdf8']}>
                <div className="p-4 rounded-xl bg-surface-hover">
                  <FilterSidebar
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categoryCounts={categoryCounts}
                  />
                </div>
              </ShineBorder>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
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

            <p className="text-sm text-text-tertiary mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-text-tertiary">No starter kits found.</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map(kit => (
                    <AppStarterKitCard
                      key={kit.id}
                      kit={kit}
                      onClick={setSelectedItem}
                      isSaved={savedIds.includes(kit.id)}
                      onToggleSave={() => toggleSave(kit.id)}
                    />
                  ))}
                </div>

                <AppStarterKitDetailModal
                  item={selectedItem}
                  open={!!selectedItem}
                  onClose={() => setSelectedItem(null)}
                />

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="border-surface-border text-foreground hover:bg-surface-hover bg-transparent"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-text-tertiary px-3">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="border-surface-border text-foreground hover:bg-surface-hover bg-transparent"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}