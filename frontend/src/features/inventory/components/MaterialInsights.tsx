import { Material } from '@/types/material.types';
import { TrendingUp, TrendingDown, Package, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/cn';

interface MaterialInsightsProps {
  material: Material;
  transactions: any[];
}

export function MaterialInsights({ material, transactions }: MaterialInsightsProps) {
  // Calculate insights
  const purchaseTransactions = transactions.filter(t => t.type === 'purchase');
  const usageTransactions = transactions.filter(t => t.type === 'usage');
  const returnTransactions = transactions.filter(t => t.type === 'return');
  
  const totalPurchased = purchaseTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalUsed = usageTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalReturned = returnTransactions.reduce((sum, t) => sum + t.quantity, 0);
  
  const avgPurchasePrice = purchaseTransactions.length > 0 
    ? purchaseTransactions.reduce((sum, t) => sum + t.unitPrice, 0) / purchaseTransactions.length 
    : material.cost;
  
  const turnoverRate = totalUsed / (material.quantity + totalUsed) || 0;
  const daysOfInventory = turnoverRate > 0 ? 30 / turnoverRate : 0;
  
  const lastPurchase = purchaseTransactions[0];
  const lastUsage = usageTransactions[0];
  
  const insights = [
    {
      label: 'Giá trị tồn kho',
      value: formatCurrency(material.quantity * material.cost),
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      label: 'Vòng quay tồn kho',
      value: turnoverRate.toFixed(2) + ' lần/tháng',
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      label: 'Số ngày dự trữ',
      value: daysOfInventory.toFixed(0) + ' ngày',
      icon: Clock,
      color: daysOfInventory < 30 ? 'text-warning' : 'text-info',
    },
    {
      label: 'Tỷ lệ trả hàng',
      value: totalReturned > 0 ? ((totalReturned / totalUsed) * 100).toFixed(1) + '%' : '0%',
      icon: AlertTriangle,
      color: 'text-warning',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {insights.map((item) => (
        <div key={item.label} className="bg-bg-tertiary rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted">{item.label}</span>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
