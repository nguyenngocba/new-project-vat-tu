import { useState } from 'react';
import { useMaterials, usePurchase } from '@/hooks/useMaterials';
import { useSuppliers } from '@/hooks/useSuppliers';
import { X, Plus, Minus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/cn';
import { toast } from 'sonner';

interface PurchaseModalProps {
  onClose: () => void;
  onSuccess: () => void;
  preselectedMaterialId?: string;
}

export function PurchaseModal({ onClose, onSuccess, preselectedMaterialId }: PurchaseModalProps) {
  const { data: materials, isLoading: materialsLoading } = useMaterials();
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const purchase = usePurchase();

  const [formData, setFormData] = useState({
    materialId: preselectedMaterialId || '',
    supplierId: '',
    quantity: 1,
    unitPrice: 0,
    vatRate: 10,
    note: '',
    datetime: new Date().toISOString().slice(0, 16),
  });

  const selectedMaterial = materials?.find(m => m.id === formData.materialId);
  const subtotal = formData.quantity * formData.unitPrice;
  const vatAmount = subtotal * formData.vatRate / 100;
  const total = subtotal + vatAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.materialId) {
      toast.error('Vui lòng chọn vật tư');
      return;
    }
    if (!formData.supplierId) {
      toast.error('Vui lòng chọn nhà cung cấp');
      return;
    }
    if (formData.quantity <= 0) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }
    if (formData.unitPrice <= 0) {
      toast.error('Đơn giá phải lớn hơn 0');
      return;
    }
    
    await purchase.mutateAsync(formData);
    onSuccess();
  };

  if (materialsLoading || suppliersLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-bg-secondary rounded-xl p-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-bg-secondary">
          <h2 className="text-lg font-semibold text-text-primary">Nhập kho</h2>
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
                  {m.code} - {m.name} (Tồn: {m.quantity} {m.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Nhà cung cấp */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Nhà cung cấp *</label>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            >
              <option value="">Chọn nhà cung cấp</option>
              {suppliers?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Số lượng */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng *</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, quantity: Math.max(0.001, formData.quantity - 1) })}
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
                onClick={() => setFormData({ ...formData, quantity: formData.quantity + 1 })}
                className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-text-muted mt-1">
              Đơn vị: {selectedMaterial?.unit || '—'}
            </div>
          </div>

          {/* Đơn giá */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Đơn giá (VNĐ) *</label>
            <input
              type="number"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
          </div>

          {/* VAT */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">VAT (%)</label>
            <input
              type="number"
              step="0.1"
              value={formData.vatRate}
              onChange={(e) => setFormData({ ...formData, vatRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary"
            />
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

          {/* Tổng tiền */}
          <div className="bg-accent/10 rounded-lg p-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Thành tiền:</span>
              <span className="text-text-primary">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Tiền VAT ({formData.vatRate}%):</span>
              <span className="text-text-primary">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-bold pt-1 border-t border-border">
              <span className="text-text-primary">Tổng cộng:</span>
              <span className="text-accent">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-bg-secondary">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-tertiary/80"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={purchase.isPending}
              className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50"
            >
              {purchase.isPending ? 'Đang xử lý...' : 'Nhập kho'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
