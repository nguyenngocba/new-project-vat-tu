import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

interface ForecastData {
  materialId: string;
  materialName: string;
  currentStock: number;
  avgMonthlyUsage: number;
  estimatedDays: number;
  status: 'good' | 'warning' | 'danger';
}

export function Forecast() {
  const [data, setData] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate forecast data
    setTimeout(() => {
      setData([
        { materialId: '1', materialName: 'H Beam 100x100', currentStock: 150, avgMonthlyUsage: 45, estimatedDays: 100, status: 'good' },
        { materialId: '2', materialName: 'I Beam 150x150', currentStock: 80, avgMonthlyUsage: 50, estimatedDays: 48, status: 'warning' },
        { materialId: '3', materialName: 'Angle Bar 50x50', currentStock: 500, avgMonthlyUsage: 120, estimatedDays: 125, status: 'good' },
        { materialId: '4', materialName: 'Steel Plate 10mm', currentStock: 200, avgMonthlyUsage: 80, estimatedDays: 75, status: 'warning' },
        { materialId: '5', materialName: 'Pipe D60', currentStock: 30, avgMonthlyUsage: 40, estimatedDays: 22, status: 'danger' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return 'bg-danger/10 text-danger border-danger/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-success/10 text-success border-success/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <TrendingDown className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-bg-tertiary rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Dự báo vật tư sắp hết</h3>
        <span className="text-xs text-text-muted">Dựa trên 3 tháng gần nhất</span>
      </div>
      
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.materialId} className={`p-3 rounded-lg border ${getStatusColor(item.status)}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{item.materialName}</div>
                <div className="text-sm mt-1">
                  Tồn: <strong>{item.currentStock}</strong> | TB tháng: {item.avgMonthlyUsage}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className="text-sm font-medium">
                  {item.estimatedDays < 30 ? 'Cần nhập ngay' : item.estimatedDays < 60 ? 'Sắp hết' : 'Ổn'}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-bg-tertiary rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all ${
                    item.status === 'danger' ? 'bg-danger' : item.status === 'warning' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(100, (item.estimatedDays / 90) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Còn khoảng</span>
                <span className="font-medium">{item.estimatedDays} ngày</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
