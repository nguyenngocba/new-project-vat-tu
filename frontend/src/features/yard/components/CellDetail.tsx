import { YardCell } from '@/types/yard.types';
import { X, Package, MapPin, AlertTriangle, Weight } from 'lucide-react';
import { formatNumber } from '@/lib/utils/cn';

interface CellDetailProps {
  cell: YardCell;
  onClose: () => void;
  onViewStructure: (structureId: string) => void;
}

export function CellDetail({ cell, onClose, onViewStructure }: CellDetailProps) {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-text-primary">
          Ô {cell.zone}{cell.row}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Vị trí: {cell.zone}{cell.row}</span>
        </div>

        <div className="flex items-center gap-2 text-text-secondary">
          <Package className="w-4 h-4" />
          <span className="text-sm">
            Trạng thái: {cell.isOccupied ? 'Đã sử dụng' : 'Trống'}
          </span>
        </div>

        {cell.isOccupied && cell.structure && (
          <>
            <div className="flex items-center gap-2 text-text-secondary">
              <Weight className="w-4 h-4" />
              <span className="text-sm">
                Tải trọng: {formatNumber(cell.weight)} kg
              </span>
            </div>

            <div className="pt-3 border-t border-border">
              <button
                onClick={() => onViewStructure(cell.structure!.id)}
                className="w-full px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
              >
                Xem chi tiết cấu kiện
              </button>
            </div>
          </>
        )}

        {cell.status === 'warning' && (
          <div className="flex items-center gap-2 text-danger">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Cảnh báo: Quá tải hoặc xếp chồng sai quy định</span>
          </div>
        )}
      </div>
    </div>
  );
}
