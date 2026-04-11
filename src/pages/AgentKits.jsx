import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import GradientSearchInput from '../components/GradientSearchInput';
import AgentKitCard from '../components/AgentKitCard';
import FilterSidebar from '../components/prompts/FilterSidebar';
import ShineBorder from '../components/ShineBorder';
import AnimatedText from '../components/AnimatedText';
import { useOutletContext } from 'react-router-dom';
import GuestLanding from '../components/GuestLanding';
import ResourceDetailModal from '../components/ResourceDetailModal';

export default function AgentKits() {
  const { user, hasPurchased } = useOutletContext();
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const PAGE_SIZE = 30;
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allKits = await base44.entities.AgentKit.list('-created_date', 2000);
        setKits(allKits);
      } catch (err) {
        console.error('Error loading Agent Kits:', err);
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
  }, [search, selectedCategory]);

  if (!user || !hasPurchased) {
    return (
      <GuestLanding
        pageTitle="Agent Kits"
        pageDescription="Discover pre-built agent kits and tools to power your AI workflows — from automation to intelligent assistants."
        highlightKey="kits"
        user={user}
      />
    );
  }

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-8">
          <AnimatedText text="Agent Kits" className="mb-2" />
          <p className="text-[#A1A1AA]">
            Browse {kits.length.toLocaleString()} agent kits and tools to power your AI workflows.
          </p>
        </div>

        <div className="mb-8">
          <GradientSearchInput
            placeholder="Search agent kits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <ShineBorder color={['#3B82F6', '#A855F7', '#38bdf8']}>
                <div className="p-4 rounded-xl bg-white/[0.02]">
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

            <p className="text-sm text-[#71717A] mb-4">
              {filtered.length.toLocaleString()} result{filtered.length !== 1 ? 's' : ''}
            </p>

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
                    <AgentKitCard key={kit.id} kit={kit} onClick={setSelectedItem} />
                  ))}
                </div>

                <ResourceDetailModal
                  item={selectedItem}
                  type="agent"
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