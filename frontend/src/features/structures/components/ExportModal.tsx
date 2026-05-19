import { useState } from 'react';
import { useExportStructure } from '@/hooks/useStructures';
import { useProjects } from '@/hooks/useProjects';
import { Structure } from '@/types/structure.types';
import { X } from 'lucide-react';
import { formatNumber } from '@/lib/utils/cn';

interface ExportModalProps {
  structure: Structure;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExportModal({ structure, onClose, onSuccess }: ExportModalProps) {
  const [projectId, setProjectId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const exportStructure = useExportStructure();
  const { data: projects } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      alert('Vui lòng chọn công trình');
      return;
    }
    if (quantity <= 0 || quantity > structure.quantity) {
      alert(`Số lượng không hợp lệ. Tồn kho: ${formatNumber(structure.quantity)} ${structure.unit}`);
      return;
    }
    await exportStructure.mutateAsync({ id: structure.id, projectId, quantity, note });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Xuất cấu kiện</h2>
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
            <label className="block text-sm font-medium text-text-secondary mb-1">Công trình</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            >
              <option value="">Chọn công trình</option>
              {projects?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Số lượng xuất</label>
            <input
              type="number"
              min="1"
              max={structure.quantity}
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
              disabled={exportStructure.isPending}
              className="flex-1 px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 disabled:opacity-50"
            >
              {exportStructure.isPending ? 'Đang xử lý...' : 'Xác nhận xuất'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
