import { useMaterialStats } from '@/hooks/useMaterials';
import { Package, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

export function StatsCards() {
  const { data: stats, isLoading } = useMaterialStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-16 bg-bg-tertiary rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Tổng giá trị tồn kho',
      value: formatCurrency(stats?.totalValue || 0),
      icon: TrendingUp,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Tổng số lượng vật tư',
      value: (stats?.totalQuantity || 0).toLocaleString('vi-VN'),
      icon: Package,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Vật tư sắp hết',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      title: 'Danh mục vật tư',
      value: stats?.categoryCount || 0,
      icon: Layers,
      color: 'text-info',
      bg: 'bg-info/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">{card.title}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{card.value}</p>
            </div>
            <div className={`p-3 rounded-full ${card.bg}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
