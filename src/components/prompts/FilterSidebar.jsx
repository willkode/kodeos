import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROMPT_CATEGORIES } from '../../lib/promptCategories';

const categories = PROMPT_CATEGORIES;

const difficulties = [
  { label: 'Beginner', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { label: 'Intermediate', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { label: 'Advanced', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
];

export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  promptCounts,
}) {
  const hasFilters = selectedCategory || selectedDifficulty;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Filters</h3>
        {hasFilters && (
          <button
            onClick={() => { setSelectedCategory(''); setSelectedDifficulty(''); }}
            className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Difficulty */}
      <div>
        <h4 className="text-xs font-medium text-[#A1A1AA] uppercase tracking-wider mb-3">Difficulty</h4>
        <div className="space-y-1.5">
          {difficulties.map(({ label, color }) => {
            const isActive = selectedDifficulty === label;
            const count = promptCounts.difficulty[label] || 0;
            return (
              <button
                key={label}
                onClick={() => setSelectedDifficulty(isActive ? '' : label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${
                    label === 'Beginner' ? 'bg-green-400' :
                    label === 'Intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span>{label}</span>
                </div>
                <span className="text-xs text-[#71717A]">{count}</span>
              </button>
            );
          })}
        </div>
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