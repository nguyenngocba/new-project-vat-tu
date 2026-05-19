import { TopMaterial } from '@/types/dashboard.types';
import { formatCurrency, formatNumber } from '@/lib/utils/cn';

interface TopMaterialsProps {
  materials: TopMaterial[];
  isLoading: boolean;
}

export function TopMaterials({ materials, isLoading }: TopMaterialsProps) {
  const maxValue = Math.max(...materials.map(m => m.value), 1);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-bg-tertiary rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center text-text-muted">
        Chưa có dữ liệu vật tư
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-4">
      <h3 className="font-semibold text-text-primary mb-4">Top vật tư giá trị cao nhất</h3>
      <div className="space-y-4">
        {materials.map((m, idx) => {
          const percent = (m.value / maxValue) * 100;
          return (
            <div key={m.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-primary">
                  {idx + 1}. {m.name}
                </span>
                <span className="text-accent font-medium">{formatCurrency(m.value)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-bg-tertiary rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {formatNumber(m.quantity)} {m.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
