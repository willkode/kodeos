import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2 } from 'lucide-react';
import GradientSearchInput from '../components/GradientSearchInput';
import AIAgentKitCard from '../components/AIAgentKitCard';
import FilterSidebar from '../components/prompts/FilterSidebar';
import { useOutletContext } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function AIAgentKits() {
  const { user } = useOutletContext();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categorizing, setCategorizing] = useState(false);
  const [catProgress, setCatProgress] = useState({ current: 0, total: 0 });
  const PAGE_SIZE = 30;

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

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            AI Agent <span className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">Kits</span>
          </h1>
          <p className="text-[#A1A1AA]">
            Browse {kits.length.toLocaleString()} AI model APIs and tools to power your applications.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-2xl">
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
                      <p className="text-[10px] text-[#71717A] text-center">
                        {catProgress.current}/{catProgress.total} batches
                      </p>
                    </div>
                  )}
                </>
              )}
              <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <FilterSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categoryCounts={categoryCounts}
              />
              </div>
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

            <p className="text-sm text-[#71717A] mb-4">
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-[#71717A]">No agent kits found.</div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginated.map(kit => (
                    <AIAgentKitCard key={kit.id} kit={kit} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="border-white/[0.1] text-white hover:bg-white/[0.04] bg-transparent"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-[#71717A] px-3">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="border-white/[0.1] text-white hover:bg-white/[0.04] bg-transparent"
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