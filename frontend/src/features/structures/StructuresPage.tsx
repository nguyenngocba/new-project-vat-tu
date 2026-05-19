import { useState } from 'react';
import { useStructures, useStructureStats, useDeleteStructure } from '@/hooks/useStructures';
import { StructureCard } from './components/StructureCard';
import { StructureDetail } from './components/StructureDetail';
import { StructureModal } from './components/StructureModal';
import { ProduceModal } from './components/ProduceModal';
import { ExportModal } from './components/ExportModal';
import { Plus, Search } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils/cn';

export function StructuresPage() {
  const [selectedStructure, setSelectedStructure] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProduceModal, setShowProduceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { data: structures, isLoading } = useStructures();
  const { data: stats } = useStructureStats();
  const deleteStructure = useDeleteStructure();

  const filteredStructures = structures?.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && s.type !== typeFilter) return false;
    return true;
  });

  const types = [...new Set(structures?.map(s => s.type) || [])];

  const statsCards = [
    { label: 'Tổng cấu kiện', value: stats?.totalStructures || 0, color: 'text-accent' },
    { label: 'Tổng số lượng', value: formatNumber(stats?.totalQuantity || 0), color: 'text-success' },
    { label: 'Tổng giá trị', value: formatCurrency(stats?.totalValue || 0), color: 'text-warning' },
    { label: 'Tồn thấp', value: stats?.lowStockCount || 0, color: stats?.lowStockCount ? 'text-danger' : 'text-text-muted' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quản lý cấu kiện</h1>
          <p className="text-text-secondary mt-1">Quản lý cấu kiện thép, BOM, sản xuất</p>
        </div>
        <button
          onClick={() => {
            setModalMode('create');
            setShowModal(true);
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Thêm cấu kiện
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div key={card.label} className="bg-bg-secondary border border-border rounded-xl p-4">
            <p className="text-sm text-text-muted">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-bg-secondary border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Tìm kiếm cấu kiện..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
          >
            <option value="all">Tất cả loại</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Structures Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-text-muted">Đang tải...</div>
      ) : !filteredStructures?.length ? (
        <div className="text-center py-12 text-text-muted">Không có cấu kiện nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStructures.map((structure) => (
            <StructureCard
              key={structure.id}
              structure={structure}
              onClick={() => {
                setSelectedStructure(structure);
                setShowDetail(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <StructureModal
          mode={modalMode}
          structure={modalMode === 'edit' ? selectedStructure : undefined}
          onClose={() => {
            setShowModal(false);
            setSelectedStructure(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setSelectedStructure(null);
          }}
        />
      )}

      {showDetail && selectedStructure && (
        <StructureDetail
          structure={selectedStructure}
          onClose={() => {
            setShowDetail(false);
            setSelectedStructure(null);
          }}
          onEdit={() => {
            setShowDetail(false);
            setModalMode('edit');
            setShowModal(true);
          }}
          onProduce={() => {
            setShowDetail(false);
            setShowProduceModal(true);
          }}
          onExport={() => {
            setShowDetail(false);
            setShowExportModal(true);
          }}
        />
      )}

      {showProduceModal && selectedStructure && (
        <ProduceModal
          structure={selectedStructure}
          onClose={() => {
            setShowProduceModal(false);
            setShowDetail(true);
          }}
          onSuccess={() => {
            setShowProduceModal(false);
            setShowDetail(false);
            setSelectedStructure(null);
          }}
        />
      )}

      {showExportModal && selectedStructure && (
        <ExportModal
          structure={selectedStructure}
          onClose={() => {
            setShowExportModal(false);
            setShowDetail(true);
          }}
          onSuccess={() => {
            setShowExportModal(false);
            setShowDetail(false);
            setSelectedStructure(null);
          }}
        />
      )}
    </div>
  );
}
