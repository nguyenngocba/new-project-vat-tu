import { useState } from 'react';
import { Supplier } from '@/types/supplier.types';
import { useSupplierPurchases } from '@/hooks/useSuppliers';
import { X, Phone, Mail, MapPin, Star, Package, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate, formatNumber } from '@/lib/utils/cn';

interface SupplierDetailProps {
  supplier: Supplier;
  onClose: () => void;
  onEdit: () => void;
}

export function SupplierDetail({ supplier, onClose, onEdit }: SupplierDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'purchases'>('overview');
  const { data: purchases, isLoading: purchasesLoading } = useSupplierPurchases(supplier.id);

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: TrendingUp },
    { id: 'purchases', label: 'Lịch sử nhập', icon: Package, count: purchases?.length },
  ];

  const rating = supplier.rating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.floor(rating));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{supplier.name}</h2>
            <p className="text-sm text-text-muted">Mã: {supplier.code}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent-hover"
            >
              Sửa
            </button>
            <button onClick={onClose} className="p-2 hover:bg-bg-tertiary rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-4 border-b border-border bg-bg-tertiary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/20">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Rating */}
              <div className="bg-bg-secondary border border-border rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-2">Đánh giá</h3>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {stars.map((filled, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${filled ? 'fill-warning text-warning' : 'text-text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-text-primary">{rating.toFixed(1)}/5</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-bg-secondary border border-border rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-3">Thông tin liên hệ</h3>
                <div className="space-y-2">
                  {supplier.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <span>{supplier.phone}</span>
                    </div>
                  )}
                  {supplier.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      <span>{supplier.email}</span>
                    </div>
                  )}
                  {supplier.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Tổng chi</p>
                  <p className="text-2xl font-bold text-accent">
                    {formatCurrency(supplier.totalPurchases || 0)}
                  </p>
                </div>
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <p className="text-sm text-text-muted">Số lần nhập</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {supplier.totalOrders || 0}
                  </p>
                </div>
              </div>

              {supplier.taxCode && (
                <div className="bg-bg-secondary border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Thông tin thuế</h3>
                  <p className="text-text-secondary">MST: {supplier.taxCode}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-3">
              {purchasesLoading ? (
                <div className="text-center py-8 text-text-muted">Đang tải...</div>
              ) : !purchases?.length ? (
                <div className="text-center py-8 text-text-muted">Chưa có lịch sử nhập hàng</div>
              ) : (
                purchases.map((p) => (
                  <div key={p.id} className="bg-bg-secondary border border-border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                            Nhập kho
                          </span>
                          <span className="text-sm text-text-muted">{formatDate(p.date)}</span>
                        </div>
                        <p className="font-medium text-text-primary mt-2">{p.materialName}</p>
                      </div>
                      <p className="text-lg font-bold text-accent">{formatCurrency(p.totalAmount)}</p>
                    </div>
                    <div className="flex justify-between text-sm text-text-muted">
                      <span>Số lượng: {formatNumber(p.quantity)} {p.unit}</span>
                      <span>Đơn giá: {formatCurrency(p.unitPrice)}</span>
                    </div>
                    {p.note && <p className="text-sm text-text-muted mt-2">📝 {p.note}</p>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => window.location.href = `/inventory?supplier=${supplier.id}`}
            className="w-full px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
          >
            Nhập kho từ nhà cung cấp này
          </button>
        </div>
      </div>
    </div>
  );
}
