import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROMPT_CATEGORIES } from '../../lib/promptCategories';

const categories = PROMPT_CATEGORIES;



export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  promptCounts,
}) {
  const hasFilters = selectedCategory;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h3>
        {hasFilters && (
          <button
            onClick={() => { setSelectedCategory(''); }}
            className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-1.5">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            const count = promptCounts.category[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isActive ? '' : cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <span>{cat}</span>
                <span className="text-xs text-[#71717A]">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}