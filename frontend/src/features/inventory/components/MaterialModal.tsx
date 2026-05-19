import { useState } from 'react';
import { useCreateMaterial, useUpdateMaterial, useCategories, useUnits } from '@/hooks/useMaterials';
import { Material } from '@/types/material.types';
import { X } from 'lucide-react';

interface MaterialModalProps {
  mode: 'create' | 'edit';
  material?: Material;
  onClose: () => void;
  onSuccess: () => void;
}

export function MaterialModal({ mode, material, onClose, onSuccess }: MaterialModalProps) {
  const [formData, setFormData] = useState({
    code: material?.code || '',
    name: material?.name || '',
    category: material?.category || '',
    unit: material?.unit || 'cái',
    quantity: material?.quantity || 0,
    cost: material?.cost || 0,
    minStock: material?.minStock || 5,
    note: material?.note || '',
  });

  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const { data: categories } = useCategories();
  const { data: units } = useUnits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      await createMaterial.mutateAsync(formData);
    } else if (material) {
      await updateMaterial.mutateAsync({ id: material.id, data: formData });
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'create' ? 'Thêm vật tư mới' : 'Sửa vật tư'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Mã vật tư *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tên vật tư *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Đơn vị</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
              >
                {units?.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng</label>
              <input
                type="number"
                step="0.001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Đơn giá (VNĐ)</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ngưỡng cảnh báo</label>
            <input
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData({ ...formData, minStock: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ghi chú</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary resize-none"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-tertiary/80"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMaterial.isPending || updateMaterial.isPending}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
            >
              {createMaterial.isPending || updateMaterial.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
