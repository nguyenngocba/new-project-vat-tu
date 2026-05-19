import { useState } from 'react';
import { useSuppliers, useSupplierStats, useDeleteSupplier } from '@/hooks/useSuppliers';
import { SupplierCard } from './components/SupplierCard';
import { SupplierDetail } from './components/SupplierDetail';
import { SupplierModal } from './components/SupplierModal';
import { Plus, Search, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

export function SuppliersPage() {
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [search, setSearch] = useState('');
  
  const { data: suppliers, isLoading } = useSuppliers();
  const { data: stats } = useSupplierStats();
  const deleteSupplier = useDeleteSupplier();

  const filteredSuppliers = suppliers?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.phone?.includes(search)
  );

  const statsCards = [
    { label: 'Tổng NCC', value: stats?.totalSuppliers || 0, color: 'text-accent' },
    { label: 'Tổng chi', value: formatCurrency(stats?.totalSpent || 0), color: 'text-warning' },
    { label: 'Đánh giá TB', value: stats?.averageRating?.toFixed(1) || '0', color: 'text-success', suffix: '/5' },
    { label: 'Đang hợp tác', value: stats?.activeSuppliers || 0, color: 'text-info' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quản lý nhà cung cấp</h1>
          <p className="text-text-secondary mt-1">Quản lý danh sách nhà cung cấp và lịch sử mua hàng</p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm nhà cung cấp
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-bg-secondary border border-border rounded-xl p-4">
            <p className="text-sm text-text-muted">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {card.value}{card.suffix || ''}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-text-muted">Đang tải...</div>
      ) : !filteredSuppliers?.length ? (
        <div className="text-center py-12 text-text-muted">Không có nhà cung cấp nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onClick={() => {
                setSelectedSupplier(supplier);
                setShowDetail(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <SupplierModal
          mode={modalMode}
          supplier={modalMode === 'edit' ? selectedSupplier : undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedSupplier(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedSupplier(null);
          }}
        />
      )}

      {showDetail && selectedSupplier && (
        <SupplierDetail
          supplier={selectedSupplier}
          onClose={() => {
            setShowDetail(false);
            setSelectedSupplier(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            setModalMode('edit');
            setShowModal(true);
          }}
        />
      )}
    </div>
  );
}
