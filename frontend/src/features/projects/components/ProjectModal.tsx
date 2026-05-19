import { useState } from 'react';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { Project } from '@/types/project.types';
import { X } from 'lucide-react';

interface ProjectModalProps {
  mode: 'create' | 'edit';
  project?: Project;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProjectModal({ mode, project, onClose, onSuccess }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    code: project?.code || '',
    name: project?.name || '',
    budget: project?.budget || 0,
    status: project?.status || 'planning',
    customerName: project?.customerName || '',
    startDate: project?.startDate || '',
    expectedEndDate: project?.expectedEndDate || '',
    description: project?.description || '',
  });

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Vui lòng nhập mã và tên dự án');
      return;
    }
    
    if (mode === 'create') {
      await createProject.mutateAsync(formData);
    } else if (project) {
      await updateProject.mutateAsync({ id: project.id, data: formData });
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'create' ? 'Thêm dự án mới' : 'Sửa dự án'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Mã dự án *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tên dự án *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Ngân sách (VNĐ)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            >
              <option value="planning">Lên kế hoạch</option>
              <option value="active">Đang thi công</option>
              <option value="completed">Hoàn thành</option>
              <option value="on_hold">Tạm dừng</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Khách hàng</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Ngày kết thúc dự kiến</label>
              <input
                type="date"
                value={formData.expectedEndDate}
                onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
              disabled={createProject.isPending || updateProject.isPending}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
            >
              {createProject.isPending || updateProject.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
