import { useState } from 'react';
import { useCreateStructure, useUpdateStructure } from '@/hooks/useStructures';
import { Structure } from '@/types/structure.types';
import { X } from 'lucide-react';

interface StructureModalProps {
  mode: 'create' | 'edit';
  structure?: Structure;
  onClose: () => void;
  onSuccess: () => void;
}

export function StructureModal({ mode, structure, onClose, onSuccess }: StructureModalProps) {
  const [formData, setFormData] = useState({
    code: structure?.code || '',
    name: structure?.name || '',
    type: structure?.type || 'Cột',
    unit: structure?.unit || 'cái',
    quantity: structure?.quantity || 0,
    cost: structure?.cost || 0,
    weight: structure?.weight || 1000,
    length: structure?.length || 6,
    width: structure?.width || 0.5,
    height: structure?.height || 0.5,
    zone: structure?.zone || 'A',
    positionY: structure?.positionY || 1,
    layer: structure?.layer || 1,
    note: structure?.note || '',
  });

  const createStructure = useCreateStructure();
  const updateStructure = useUpdateStructure();

  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const types = ['Cột', 'Dầm', 'Kèo', 'Xà gồ', 'Giằng', 'Bản mã', 'Khác'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Vui lòng nhập mã và tên cấu kiện');
      return;
    }
    
    if (mode === 'create') {
      await createStructure.mutateAsync(formData);
    } else if (structure) {
      await updateStructure.mutateAsync({ id: structure.id, data: formData });
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'create' ? 'Thêm cấu kiện mới' : 'Sửa cấu kiện'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Mã cấu kiện *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tên cấu kiện *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Loại</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Đơn vị</label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Đơn giá</label>
              <input
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Dài (m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Rộng (m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Cao (m)</label>
              <input
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Trọng lượng (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Khu vực</label>
              <select
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>Khu {z}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Hàng</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.positionY}
                onChange={(e) => setFormData({ ...formData, positionY: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ghi chú</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg resize-none"
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
              disabled={createStructure.isPending || updateStructure.isPending}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
            >
              {createStructure.isPending || updateStructure.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
