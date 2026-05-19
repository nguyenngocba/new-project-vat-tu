import { YardStats as YardStatsType } from '@/types/yard.types';
import { MapPin, Package, AlertTriangle, TrendingUp } from 'lucide-react';

interface YardStatsProps {
  stats: YardStatsType;
}

export function YardStats({ stats }: YardStatsProps) {
  const cards = [
    {
      label: 'Tổng số ô',
      value: stats.totalCells,
      icon: MapPin,
      color: 'text-accent',
    },
    {
      label: 'Ô đã sử dụng',
      value: stats.occupiedCells,
      icon: Package,
      color: 'text-success',
    },
    {
      label: 'Tỷ lệ lấp đầy',
      value: `${stats.occupancyRate}%`,
      icon: TrendingUp,
      color: 'text-warning',
    },
    {
      label: 'Cảnh báo',
      value: stats.warningCells,
      icon: AlertTriangle,
      color: stats.warningCells > 0 ? 'text-danger' : 'text-text-muted',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-bg-secondary border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <card.icon className={`w-8 h-8 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
