import { useState } from 'react';
import { useMaterials, useReturn } from '@/hooks/useMaterials';
import { useProjects } from '@/hooks/useProjects';
import { X, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';

interface ReturnModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedMaterialId?: string;
  preselectedProjectId?: string;
}

export function ReturnModal({ onClose, onSuccess, preselectedMaterialId, preselectedProjectId }: ReturnModalProps) {
  const { data: materials } = useMaterials();
  const { data: projects } = useProjects();
  const returnMutation = useReturn();

  const [formData, setFormData] = useState({
    materialId: preselectedMaterialId || '',
    projectId: preselectedProjectId || '',
    quantity: 1,
    note: '',
    datetime: new Date().toISOString().slice(0, 16),
  });

  const selectedMaterial = materials?.find(m => m.id === formData.materialId);
  const total = (selectedMaterial?.cost || 0) * formData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialId || !formData.projectId || formData.quantity <= 0) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    await returnMutation.mutateAsync(formData);
    onSuccess();
  };

  const adjustQuantity = (delta: number) => {
    setFormData({ ...formData, quantity: Math.max(0.001, formData.quantity + delta) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Trả hàng</h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Vật tư */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Vật tư *</label>
            <select
              value={formData.materialId}
              onChange={(e) => setFormData({ ...formData, materialId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            >
              <option value="">Chọn vật tư</option>
              {materials?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Công trình */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Công trình *</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            >
              <option value="">Chọn công trình</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Số lượng */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng *</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                step="0.001"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                className="flex-1 px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary text-center"
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Thời gian */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Thời gian</label>
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ghi chú</label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary resize-none"
            />
          </div>

          {/* Thành tiền */}
          <div className="bg-accent/10 rounded-lg p-3">
            <div className="flex justify-between text-base font-bold">
              <span className="text-text-primary">Thành tiền:</span>
              <span className="text-accent">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Buttons */}
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
              disabled={returnMutation.isPending}
              className="flex-1 px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 disabled:opacity-50"
            >
              {returnMutation.isPending ? 'Đang xử lý...' : 'Trả hàng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
