import { useState, useEffect } from 'react';
import { Material } from '@/types/material.types';
import { X, Package, TrendingUp, Truck, Map, FileText, BarChart3, History } from 'lucide-react';
import { formatCurrency, formatNumber, formatDateTime } from '@/lib/utils/cn';
import { cn } from '@/lib/utils/cn';

interface InventoryWorkspaceProps {
  material: Material;
  onClose: () => void;
}

export function InventoryWorkspace({ material, onClose }: InventoryWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics' | 'suppliers' | 'yard' | 'documents'>('overview');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching transactions
    setTimeout(() => {
      setTransactions([
        { id: '1', type: 'purchase', quantity: 25, unitPrice: 1250000, totalAmount: 31250000, date: '2024-01-20', supplierName: 'Hòa Phát', note: 'Nhập đợt 1' },
        { id: '2', type: 'usage', quantity: 15, unitPrice: 1250000, totalAmount: 18750000, date: '2024-02-15', projectName: 'Nhà máy A', note: 'Xuất thi công' },
        { id: '3', type: 'usage', quantity: 10, unitPrice: 1250000, totalAmount: 12500000, date: '2024-03-10', projectName: 'Cầu đường B', note: '' },
      ]);
      setLoading(false);
    }, 500);
  }, [material.id]);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: Package },
    { id: 'transactions', label: 'Giao dịch', icon: History },
    { id: 'analytics', label: 'Phân tích', icon: BarChart3 },
    { id: 'suppliers', label: 'Nhà cung cấp', icon: Truck },
    { id: 'yard', label: 'Sân bãi', icon: Map },
    { id: 'documents', label: 'Tài liệu', icon: FileText },
  ];

  const totalValue = material.quantity * material.cost;
  const totalPurchased = transactions.filter(t => t.type === 'purchase').reduce((s, t) => s + t.quantity, 0);
  const totalUsed = transactions.filter(t => t.type === 'usage').reduce((s, t) => s + t.quantity, 0);
  const turnoverRate = totalUsed / (material.quantity + totalUsed) || 0;
  const daysOfInventory = turnoverRate > 0 ? 30 / turnoverRate : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">{material.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                {material.code}
              </span>
            </div>
            <p className="text-sm text-text-muted mt-1">
              Danh mục: {material.category} | Đơn vị: {material.unit}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 border-b border-border bg-bg-tertiary overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-accent text-white shadow-lg"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-accent/5 to-transparent rounded-xl p-4 border border-accent/20">
                  <p className="text-sm text-text-muted">Tồn kho hiện tại</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatNumber(material.quantity)} {material.unit}
                  </p>
                  <p className="text-xs text-text-muted mt-1">Giá trị: {formatCurrency(totalValue)}</p>
                </div>
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <p className="text-sm text-text-muted">Đơn giá</p>
                  <p className="text-2xl font-bold text-text-primary">{formatCurrency(material.cost)}</p>
                  <p className="text-xs text-text-muted mt-1">/ {material.unit}</p>
                </div>
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <p className="text-sm text-text-muted">Ngưỡng cảnh báo</p>
                  <p className="text-2xl font-bold text-warning">{formatNumber(material.minStock)} {material.unit}</p>
                  <p className="text-xs text-text-muted mt-1">
                    {material.quantity <= material.minStock ? '⚠️ Sắp hết hàng' : '✅ Còn đủ hàng'}
                  </p>
                </div>
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <p className="text-sm text-text-muted">Số ngày dự trữ</p>
                  <p className="text-2xl font-bold text-info">{daysOfInventory.toFixed(0)} ngày</p>
                  <p className="text-xs text-text-muted mt-1">Dựa trên nhu cầu 30 ngày</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="p-3 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors">
                  📥 Nhập kho
                </button>
                <button className="p-3 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors">
                  📤 Xuất kho
                </button>
                <button className="p-3 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors">
                  🔄 Chuyển kho
                </button>
                <button className="p-3 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors">
                  🔄 Trả hàng
                </button>
              </div>

              {/* Description */}
              {material.note && (
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Ghi chú</h3>
                  <p className="text-text-secondary">{material.note}</p>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-text-primary">Lịch sử giao dịch</h3>
                <div className="text-sm text-text-muted">Tổng số: {transactions.length} giao dịch</div>
              </div>
              
              {loading ? (
                <div className="text-center py-12 text-text-muted">Đang tải...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-text-muted">Chưa có giao dịch nào</div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t) => (
                    <div key={t.id} className="bg-bg-tertiary rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              t.type === 'purchase' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>
                              {t.type === 'purchase' ? 'Nhập kho' : 'Xuất kho'}
                            </span>
                            <span className="text-sm text-text-muted">{formatDateTime(t.date)}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-text-primary">
                              Số lượng: <strong>{formatNumber(t.quantity)} {material.unit}</strong>
                            </p>
                            <p className="text-sm text-text-muted">
                              Đơn giá: {formatCurrency(t.unitPrice)} | Thành tiền: {formatCurrency(t.totalAmount)}
                            </p>
                            {t.supplierName && (
                              <p className="text-sm text-text-muted">Nhà cung cấp: {t.supplierName}</p>
                            )}
                            {t.projectName && (
                              <p className="text-sm text-text-muted">Công trình: {t.projectName}</p>
                            )}
                            {t.note && <p className="text-sm text-text-muted mt-1">📝 {t.note}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Thống kê nhập xuất</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Tổng nhập:</span>
                      <span className="text-success font-medium">{formatNumber(totalPurchased)} {material.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Tổng xuất:</span>
                      <span className="text-warning font-medium">{formatNumber(totalUsed)} {material.unit}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-text-muted">Tồn kho:</span>
                      <span className="text-accent font-bold">{formatNumber(material.quantity)} {material.unit}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-bg-tertiary rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3">Dự báo</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Vòng quay/tháng:</span>
                      <span>{turnoverRate.toFixed(2)} lần</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Số ngày dự trữ:</span>
                      <span className="text-info">{daysOfInventory.toFixed(0)} ngày</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Đề xuất nhập:</span>
                      <span className="text-warning">
                        {Math.max(0, Math.ceil(material.minStock * 2 - material.quantity))} {material.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {(activeTab === 'suppliers' || activeTab === 'yard' || activeTab === 'documents') && (
            <div className="text-center py-12 text-text-muted">
              Tính năng đang phát triển...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80">
            Đóng
          </button>
          <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover">
            Xuất báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
