import { Structure } from '@/types/structure.types';
import { formatCurrency, formatNumber } from '@/lib/utils/cn';
import { Box, TrendingUp, AlertTriangle, MapPin } from 'lucide-react';

interface StructureCardProps {
  structure: Structure;
  onClick: () => void;
}

export function StructureCard({ structure, onClick }: StructureCardProps) {
  const getStatusColor = () => {
    if (structure.status === 'exported') return 'bg-warning/10 text-warning border-warning/20';
    if (structure.status === 'producing') return 'bg-info/10 text-info border-info/20';
    return 'bg-success/10 text-success border-success/20';
  };

  const getStatusText = () => {
    if (structure.status === 'exported') return 'Đã xuất';
    if (structure.status === 'producing') return 'Đang sản xuất';
    return 'Trong kho';
  };

  const isLowStock = structure.quantity < 5;

  return (
    <div
      onClick={onClick}
      className="bg-bg-secondary border border-border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all hover:border-accent/30"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-text-muted" />
          <div>
            <h3 className="font-semibold text-text-primary">{structure.name}</h3>
            <p className="text-xs text-text-muted">{structure.code}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Loại:</span>
          <span className="text-text-primary">{structure.type}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Số lượng:</span>
          <span className={`font-medium ${isLowStock ? 'text-warning' : 'text-text-primary'}`}>
            {formatNumber(structure.quantity)} {structure.unit}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Trọng lượng:</span>
          <span>{formatNumber(structure.weight)} kg</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Vị trí:</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {structure.zone}{structure.positionY}
          </span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-border">
          <span className="text-text-secondary">Giá trị:</span>
          <span className="font-medium text-accent">{formatCurrency(structure.cost * structure.quantity)}</span>
        </div>
      </div>
    </div>
  );
}
