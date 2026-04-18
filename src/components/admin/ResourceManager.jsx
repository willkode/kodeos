import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

export default function ResourceManager({ entityName, label, fields }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loadItems = async () => {
    setLoading(true);
    const data = await base44.entities[entityName].list('-created_date', 2000);
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [entityName]);

  useEffect(() => { setPage(1); }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;
    await base44.entities[entityName].delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return fields.some(f => (item[f] || '').toString().toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {label} <span className="text-sm font-normal text-[#71717A]">({items.length})</span>
        </h2>
      </div>

      <Input
        placeholder={`Search ${label.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-card border-border/30 mb-4"
      />

      <div className="border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-center font-semibold w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((item) => (
                <tr key={item.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] transition">
                  <td className="px-4 py-3 text-[#E4E4E7] font-medium max-w-[200px] truncate">
                    {item.name || item.title || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A1A1AA]">
                      {item.category || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#71717A] max-w-[300px] truncate hidden md:table-cell">
                    {item.description || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-[#71717A] hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </a>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="h-7 w-7 text-[#71717A] hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-8 text-[#71717A] text-sm">No {label.toLowerCase()} found.</p>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button
            size="sm"
            variant="ghost"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-[#71717A]">
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}