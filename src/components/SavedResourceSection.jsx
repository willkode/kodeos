import { Bookmark } from 'lucide-react';

export default function SavedResourceSection({ title, items, emptyText, renderItem }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Bookmark className="w-5 h-5 text-[#3B82F6]" />
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-[#71717A]">({items.length})</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 border border-white/[0.06] rounded-xl bg-white/[0.02]">
          <Bookmark className="w-8 h-8 text-[#71717A] mx-auto mb-2" />
          <p className="text-sm text-[#71717A]">{emptyText}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map(item => renderItem(item))}
        </div>
      )}
    </div>
  );
}