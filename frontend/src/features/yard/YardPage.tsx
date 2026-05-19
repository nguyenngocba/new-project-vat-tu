import { useState } from 'react';
import { useYardGrid, useYardStats } from '@/hooks/useYard';
import { PixiYard } from '@/engine/PixiYard';
import { YardStats as YardStatsComponent } from './components/YardStats';
import { CellDetail } from './components/CellDetail';
import { YardCell } from '@/types/yard.types';
import { Search } from 'lucide-react';

export function YardPage() {
  const { data: cells, isLoading: cellsLoading } = useYardGrid();
  const { data: stats, isLoading: statsLoading } = useYardStats();
  const [selectedCell, setSelectedCell] = useState<YardCell | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCells = cells?.filter((cell) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cell.zone.toLowerCase().includes(query) ||
      cell.row.toString().includes(query) ||
      cell.structure?.name?.toLowerCase().includes(query) ||
      cell.structure?.code?.toLowerCase().includes(query)
    );
  });

  const handleViewStructure = (structureId: string) => {
    window.location.href = `/structures?id=${structureId}`;
  };

  if (cellsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-pulse text-text-muted">Đang tải sân bãi...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Sơ đồ sân bãi (PixiJS)</h1>
        <p className="text-text-secondary mt-1">
          Quản lý vị trí và sắp xếp cấu kiện - Hỗ trợ zoom, pan, drag
        </p>
      </div>

      {/* Stats */}
      {stats && <YardStatsComponent stats={stats} />}

      {/* Search */}
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm theo khu vực (A, B, C...), hàng (1-50), tên cấu kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg"
          />
        </div>
      </div>

      {/* PixiJS Canvas */}
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        {filteredCells && (
          <PixiYard
            cells={filteredCells}
            onCellClick={setSelectedCell}
            selectedCell={selectedCell}
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-success/50 border border-success rounded"></div>
          <span className="text-text-secondary">Có cấu kiện</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-bg-tertiary border border-border rounded"></div>
          <span className="text-text-secondary">Trống</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-warning/50 border border-warning rounded"></div>
          <span className="text-text-secondary">Đã đặt trước</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-danger/50 border border-danger rounded"></div>
          <span className="text-text-secondary">Cảnh báo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent border border-accent rounded"></div>
          <span className="text-text-secondary">Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">💡 Mẹo: Kéo để di chuyển, Cuộn để zoom</span>
        </div>
      </div>

      {/* Cell Detail Panel */}
      {selectedCell && (
        <CellDetail
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
          onViewStructure={handleViewStructure}
        />
      )}
    </div>
  );
}
