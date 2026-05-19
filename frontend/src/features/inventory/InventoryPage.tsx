import { useState, useDeferredValue } from 'react';
import { useMaterials, useDeleteMaterial } from '@/hooks/useMaterials';
import { useInventoryStore } from '@/stores/inventory.store';
import { InventoryTable } from './components/InventoryTable';
import { FilterBar } from './components/FilterBar';
import { StatsCards } from './components/StatsCards';
import { MaterialModal } from './components/MaterialModal';
import { PurchaseModal } from './components/PurchaseModal';
import { UsageModal } from './components/UsageModal';
import { ReturnModal } from './components/ReturnModal';
import { ImportModal } from './components/ImportModal';
import { Plus, Upload, Download, Loader2 } from 'lucide-react';
import { Material } from '@/types/material.types';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { excelService } from '@/services/excel.service';
import { toast } from 'sonner';

export function InventoryPage() {
  const [activeModal, setActiveModal] = useState<'create' | 'edit' | 'purchase' | 'usage' | 'return' | 'import' | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: materials, isLoading, isFetching } = useMaterials();
  const deleteMaterial = useDeleteMaterial();
  const { setSelectedMaterial: setStoreSelectedMaterial, density, setDensity } = useInventoryStore();

  const isLoadingDeferred = useDeferredValue(isLoading);

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setActiveModal('edit');
  };

  const handleDelete = (material: Material) => {
    if (confirm(`Xóa vật tư "${material.name}"?`)) {
      deleteMaterial.mutate(material.id);
    }
  };

  const handleView = (material: Material) => {
    setStoreSelectedMaterial(material);
  };

  const handleExport = async () => {
    if (!materials?.length) {
      toast.error('Không có dữ liệu để xuất');
      return;
    }
    setIsExporting(true);
    try {
      excelService.exportMaterials(materials);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      toast.error('Xuất Excel thất bại');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Quản lý vật tư</h1>
          <p className="text-text-secondary mt-1">Quản lý danh sách vật tư, nhập xuất tồn kho</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveModal('import')}
            className="px-4 py-2 bg-bg-tertiary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary/80 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 bg-bg-tertiary text-text-primary border border-border rounded-lg hover:bg-bg-tertiary/80 transition-colors flex items-center gap-2"
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export Excel
          </button>
          <button
            onClick={() => setActiveModal('purchase')}
            className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
          >
            Nhập kho
          </button>
          <button
            onClick={() => setActiveModal('usage')}
            className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-colors"
          >
            Xuất kho
          </button>
          <button
            onClick={() => setActiveModal('return')}
            className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition-colors"
          >
            Trả hàng
          </button>
          <button
            onClick={() => setActiveModal('create')}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm vật tư
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Filter Bar */}
      <FilterBar />

      {/* Density Toggle */}
      <div className="flex justify-end gap-2">
        <span className="text-sm text-text-secondary mr-2">Mật độ:</span>
        {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDensity(d)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              density === d
                ? 'bg-accent text-white'
                : 'bg-bg-tertiary text-text-secondary hover:text-text-primary'
            }`}
          >
            {d === 'compact' ? 'Nhỏ' : d === 'comfortable' ? 'Vừa' : 'Lớn'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {isLoadingDeferred ? (
          <TableSkeleton rows={10} columns={7} />
        ) : (
          <InventoryTable
            materials={materials || []}
            isLoading={isFetching && !materials}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </div>

      {/* Modals */}
      {activeModal === 'create' && (
        <MaterialModal
          mode="create"
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'edit' && selectedMaterial && (
        <MaterialModal
          mode="edit"
          material={selectedMaterial}
          onClose={() => {
            setActiveModal(null);
            setSelectedMaterial(null);
          }}
          onSuccess={() => {
            setActiveModal(null);
            setSelectedMaterial(null);
          }}
        />
      )}
      {activeModal === 'purchase' && (
        <PurchaseModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'usage' && (
        <UsageModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'return' && (
        <ReturnModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'import' && (
        <ImportModal
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
