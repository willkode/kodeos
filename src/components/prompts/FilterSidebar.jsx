export default function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  categoryCounts,
}) {
  const categories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Categories</h3>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory('')}
            className="text-xs text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category list */}
      <div className="space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(isActive ? '' : cat)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                  : 'text-[#A1A1AA] hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <span className="truncate text-left">{cat}</span>
              <span className="text-xs text-[#71717A] ml-2 flex-shrink-0">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}