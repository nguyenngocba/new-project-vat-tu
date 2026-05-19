import { useState } from 'react';
import { useProduceStructure } from '@/hooks/useStructures';
import { Structure } from '@/types/structure.types';
import { X } from 'lucide-react';
import { formatNumber } from '@/lib/utils/cn';

interface ProduceModalProps {
  structure: Structure;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProduceModal({ structure, onClose, onSuccess }: ProduceModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const produce = useProduceStructure();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ');
      return;
    }
    await produce.mutateAsync({ id: structure.id, quantity, note });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Sản xuất cấu kiện</h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Cấu kiện</label>
            <input
              type="text"
              value={structure.name}
              disabled
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-muted"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng sản xuất</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
            <div className="text-xs text-text-muted mt-1">
              Tồn kho hiện tại: {formatNumber(structure.quantity)} {structure.unit}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              disabled={produce.isPending}
              className="flex-1 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50"
            >
              {produce.isPending ? 'Đang xử lý...' : 'Xác nhận sản xuất'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
