import { useMemo, useState } from 'react';
import { Material } from '@/types/material.types';
import { useInventoryStore } from '@/stores/inventory.store';
import { VirtualTable } from '@/components/ui/VirtualTable';
import { formatNumber, formatCurrency } from '@/lib/utils/cn';
import { Star, Edit2, Trash2, Package, AlertTriangle, TrendingDown } from 'lucide-react';

interface InventoryTableProps {
  materials: Material[];
  isLoading: boolean;
  onEdit: (material: Material) => void;
  onDelete: (material: Material) => void;
  onView: (material: Material) => void;
}

export function InventoryTable({ materials, isLoading, onEdit, onDelete, onView }: InventoryTableProps) {
  const { favorites, toggleFavorite, density } = useInventoryStore();
  const [sortField, setSortField] = useState<keyof Material>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedMaterials = useMemo(() => {
    const sorted = [...materials];
    sorted.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (sortField === 'quantity' || sortField === 'cost') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal || '').toLowerCase();
        bVal = String(bVal || '').toLowerCase();
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [materials, sortField, sortDirection]);

  const handleSort = (field: keyof Material) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatus = (material: Material) => {
    if (material.quantity <= 0) {
      return { label: 'Hết hàng', color: 'text-danger', bg: 'bg-danger/10', icon: TrendingDown };
    }
    if (material.quantity <= material.minStock) {
      return { label: 'Sắp hết', color: 'text-warning', bg: 'bg-warning/10', icon: AlertTriangle };
    }
    return { label: 'Tốt', color: 'text-success', bg: 'bg-success/10', icon: Package };
  };

  const densityClasses = {
    compact: 'p-2 text-sm',
    comfortable: 'p-3 text-sm',
    spacious: 'p-4 text-base',
  };

  const renderRow = (material: Material, idx: number) => {
    const status = getStatus(material);
    const StatusIcon = status.icon;
    const isFavorite = favorites.includes(material.id);
    const totalValue = material.quantity * material.cost;
    
    return (
      <tr
        key={material.id}
        className="border-b border-border hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
        onClick={() => onView(material)}
      >
        <td className={densityClasses[density]}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(material.id);
            }}
            className="text-text-muted hover:text-warning transition-colors"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-warning text-warning' : ''}`} />
          </button>
        </td>
        <td className={densityClasses[density]}>
          <span className="font-mono text-sm">{material.code}</span>
        </td>
        <td className={densityClasses[density]}>
          <div>
            <div className="font-medium text-text-primary">{material.name}</div>
            {material.note && (
              <div className="text-xs text-text-muted truncate max-w-xs">{material.note}</div>
            )}
          </div>
        </td>
        <td className={densityClasses[density]}>
          <span className="text-sm">{material.category || '—'}</span>
        </td>
        <td className={`${densityClasses[density]} text-right`}>
          <span className={material.quantity <= material.minStock ? 'text-warning font-semibold' : ''}>
            {formatNumber(material.quantity)} {material.unit}
          </span>
        </td>
        <td className={`${densityClasses[density]} text-right`}>
          {formatCurrency(material.cost)}
        </td>
        <td className={`${densityClasses[density]} text-right font-semibold text-accent`}>
          {formatCurrency(totalValue)}
        </td>
        <td className={`${densityClasses[density]} text-center`}>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${status.bg} ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </td>
        <td className={`${densityClasses[density]} text-center`}>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(material);
              }}
              className="p-1 hover:bg-bg-tertiary rounded transition-colors"
            >
              <Edit2 className="w-4 h-4 text-text-secondary" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(material);
              }}
              className="p-1 hover:bg-danger/10 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4 text-danger" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-text-secondary">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Không có dữ liệu vật tư
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-bg-tertiary border-b border-border sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-10"></th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('code')}
            >
              Mã {sortField === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('name')}
            >
              Tên vật tư {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
              Danh mục
            </th>
            <th 
              className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('quantity')}
            >
              Tồn kho {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:text-text-primary"
              onClick={() => handleSort('cost')}
            >
              Đơn giá {sortField === 'cost' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
              Thành tiền
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-text-secondary uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMaterials.map((material, idx) => renderRow(material, idx))}
        </tbody>
      </table>
    </div>
  );
}
