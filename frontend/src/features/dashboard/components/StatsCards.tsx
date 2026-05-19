import { DashboardStats } from '@/types/dashboard.types';
import { Package, Building2, Box, Truck, TrendingUp, AlertTriangle, Map } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/cn';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Tổng giá trị tồn kho',
      value: formatCurrency(stats.totalInventoryValue),
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Vật tư',
      value: formatNumber(stats.totalMaterials),
      icon: Package,
      color: 'text-success',
      bg: 'bg-success/10',
      sub: `${formatNumber(stats.totalStockQuantity)} đơn vị tồn`,
    },
    {
      label: 'Dự án',
      value: formatNumber(stats.totalProjects),
      icon: Building2,
      color: 'text-warning',
      bg: 'bg-warning/10',
      sub: `${stats.activeProjects} đang thi công`,
    },
    {
      label: 'Cấu kiện',
      value: formatNumber(stats.totalStructures),
      icon: Box,
      color: 'text-info',
      bg: 'bg-info/10',
    },
    {
      label: 'Nhà cung cấp',
      value: formatNumber(stats.totalSuppliers),
      icon: Truck,
      color: 'text-purple',
      bg: 'bg-purple/10',
    },
    {
      label: 'Sân bãi',
      value: `${stats.occupancyRate}%`,
      icon: Map,
      color: 'text-cyan',
      bg: 'bg-cyan/10',
      sub: 'tỷ lệ lấp đầy',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-bg-secondary border border-border rounded-xl p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary">{card.value}</p>
          <p className="text-sm text-text-muted mt-1">{card.label}</p>
          {card.sub && <p className="text-xs text-text-muted mt-1">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}
