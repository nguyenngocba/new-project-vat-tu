import { useState, useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventory.store';
import { useCategories } from '@/hooks/useMaterials';
import { Search, X, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useInventoryStore();
  const { data: categories } = useCategories();
  
  const [keyword, setKeyword] = useState(filters.keyword);
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    setFilters({ keyword: debouncedKeyword });
  }, [debouncedKeyword, setFilters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
        </div>

        {/* Category filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <option value="">Tất cả danh mục</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Stock range */}
        <input
          type="number"
          placeholder="Tồn ≥"
          value={filters.minStock}
          onChange={(e) => setFilters({ minStock: e.target.value })}
          className="w-28 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-muted"
        />
        <input
          type="number"
          placeholder="Tồn ≤"
          value={filters.maxStock}
          onChange={(e) => setFilters({ maxStock: e.target.value })}
          className="w-28 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-muted"
        />

        {/* Status filter */}
        <div className="flex gap-1 bg-bg-tertiary rounded-lg p-1">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'low', label: 'Sắp hết' },
            { value: 'out', label: 'Hết hàng' },
            { value: 'ok', label: 'Tốt' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters({ status: opt.value as any })}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filters.status === opt.value
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Favorites filter */}
        <button
          onClick={() => setFilters({ showFavoritesOnly: !filters.showFavoritesOnly })}
          className={`px-3 py-2 rounded-lg transition-colors ${
            filters.showFavoritesOnly
              ? 'bg-warning/20 text-warning border border-warning/30'
              : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <Star className={`w-4 h-4 ${filters.showFavoritesOnly ? 'fill-warning' : ''}`} />
        </button>

        {/* Reset button */}
        <button
          onClick={resetFilters}
          className="px-3 py-2 bg-bg-tertiary text-text-secondary hover:text-text-primary rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
