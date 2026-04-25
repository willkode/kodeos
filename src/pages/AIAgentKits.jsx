import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2 } from 'lucide-react';
import GradientSearchInput from '../components/GradientSearchInput';
import AIAgentKitCard from '../components/AIAgentKitCard';
import FilterSidebar from '../components/prompts/FilterSidebar';
import ShineBorder from '../components/ShineBorder';
import AnimatedText from '../components/AnimatedText';
import { useOutletContext } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import GuestLanding from '../components/GuestLanding';
import ResourceDetailModal from '../components/ResourceDetailModal';

export default function AIAgentKits() {
  const { user, hasPurchased } = useOutletContext();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorizing, setCategorizing] = useState(false);
  const [catProgress, setCatProgress] = useState({ current: 0, total: 0 });
  const PAGE_SIZE = 30;
  const [selectedItem, setSelectedItem] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    if (user) setSavedIds(user.savedAPIs || []);
  }, [user]);

  const toggleSave = async (id) => {
    const updated = savedIds.includes(id)
      ? savedIds.filter(i => i !== id)
      : [...savedIds, id];
    setSavedIds(updated);
    await base44.auth.updateMe({ savedAPIs: updated });
  };

  const handleCategorize = async () => {
    setCategorizing(true);
    try {
      const allKits = await base44.entities.AIAgentKit.list('-created_date', 2000);
      const uncategorized = allKits.filter(k => !k.category || k.category === 'Uncategorized');
      const batchSize = 20;
      const totalBatches = Math.ceil(uncategorized.length / batchSize);
      setCatProgress({ current: 0, total: totalBatches });

      for (let i = 0; i < totalBatches; i++) {
        const batch = uncategorized.slice(i * batchSize, (i + 1) * batchSize);
        const ids = batch.map(k => k.id);
        await base44.functions.invoke('categorizeAgentKits', { batchIds: ids });
        setCatProgress({ current: i + 1, total: totalBatches });
      }

      const refreshed = await base44.entities.AIAgentKit.list('-created_date', 2000);
      setKits(refreshed);
    } catch (err) {
      console.error('Categorization error:', err);
    } finally {
      setCategorizing(false);
      setCatProgress({ current: 0, total: 0 });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const allKits = await base44.entities.AIAgentKit.list('-created_date', 2000);
        setKits(allKits);
      } catch (err) {
        console.error('Error loading AI Agent Kits:', err);
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
    const matchesSearch = k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || (k.category || 'Uncategorized') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="AI Models APIs"
        pageDescription="Browse hundreds of AI model APIs and tools to power your applications with cutting-edge intelligence."
        highlightKey="apis"
        user={user}
      />
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <AnimatedText text="AI Models APIs" className="mb-2" />
          <p className="text-text-secondary">
            Browse {kits.length.toLocaleString()} AI model APIs and tools to power your applications.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <GradientSearchInput
            placeholder="Search AI agent kits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sidebar + Grid Layout */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              {user?.role === 'admin' && (
                <>
                  <Button
                    onClick={handleCategorize}
                    disabled={categorizing}
                    className="w-full mb-3 bg-[#3B82F6] text-white hover:bg-[#2563EB] text-xs font-semibold"
                    size="sm"
                  >
                    {categorizing ? (
                      <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Categorizing...</>
                    ) : (
                      <><Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Categorize All</>
                    )}
                  </Button>
                  {categorizing && catProgress.total > 0 && (
                    <div className="w-full space-y-1 mb-3">
                      <Progress value={(catProgress.current / catProgress.total) * 100} className="h-2" />
                      <p className="text-[10px] text-text-tertiary text-center">
                        {catProgress.current}/{catProgress.total} batches
                      </p>
                    </div>
                  )}
                </>
              )}
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Active filter chip */}
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
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-text-tertiary">No agent kits found.</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map(kit => (
                    <AIAgentKitCard key={kit.id} kit={kit} onClick={setSelectedItem} isSaved={savedIds.includes(kit.id)} onToggleSave={() => toggleSave(kit.id)} />
                  ))}
                </div>

                <ResourceDetailModal
                  item={selectedItem}
                  type="api"
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