import { RecentTransaction } from '@/types/dashboard.types';
import { formatCurrency, formatDate } from '@/lib/utils/cn';

interface RecentTransactionsProps {
  transactions: RecentTransaction[];
  isLoading: boolean;
}

export function RecentTransactions({ transactions, isLoading }: RecentTransactionsProps) {
  const getTypeLabel = (type: string) => {
    const types: Record<string, { label: string; color: string }> = {
      purchase: { label: 'Nhập kho', color: 'text-success' },
      usage: { label: 'Xuất kho', color: 'text-warning' },
      return: { label: 'Trả hàng', color: 'text-info' },
      produce: { label: 'Sản xuất', color: 'text-accent' },
      structure_export: { label: 'Xuất CK', color: 'text-warning' },
      structure_return: { label: 'Trả CK', color: 'text-info' },
    };
    return types[type] || { label: type, color: 'text-text-muted' };
  };

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

  if (transactions.length === 0) {
    return (
      <div className="bg-bg-secondary border border-border rounded-xl p-8 text-center text-text-muted">
        Chưa có giao dịch nào
      </div>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-text-primary">Giao dịch gần đây</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-bg-tertiary">
            <tr>
              <th className="px-4 py-3 text-left text-sm">Thời gian</th>
              <th className="px-4 py-3 text-left text-sm">Loại</th>
              <th className="px-4 py-3 text-left text-sm">Vật tư/Cấu kiện</th>
              <th className="px-4 py-3 text-right text-sm">Số lượng</th>
              <th className="px-4 py-3 text-right text-sm">Giá trị</th>
              <th className="px-4 py-3 text-left text-sm">Đối tượng</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const type = getTypeLabel(t.type);
              return (
                <tr key={t.id} className="border-b border-border hover:bg-bg-tertiary/50">
                  <td className="px-4 py-3 text-sm">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${type.color} bg-${type.color}/10`}>
                      {type.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{t.materialName}</td>
                  <td className="px-4 py-3 text-right text-sm">
                    {t.quantity.toLocaleString('vi-VN')} {t.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-accent">
                    {formatCurrency(t.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {t.projectName || t.supplierName || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
