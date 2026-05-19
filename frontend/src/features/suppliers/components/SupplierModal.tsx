import { useState } from 'react';
import { useCreateSupplier, useUpdateSupplier } from '@/hooks/useSuppliers';
import { Supplier } from '@/types/supplier.types';
import { X } from 'lucide-react';

interface SupplierModalProps {
  mode: 'create' | 'edit';
  supplier?: Supplier;
  onClose: () => void;
  onSuccess: () => void;
}

export function SupplierModal({ mode, supplier, onClose, onSuccess }: SupplierModalProps) {
  const [formData, setFormData] = useState({
    code: supplier?.code || '',
    name: supplier?.name || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    taxCode: supplier?.taxCode || '',
    contactPerson: supplier?.contactPerson || '',
    rating: supplier?.rating || 0,
  });

  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Vui lòng nhập mã và tên nhà cung cấp');
      return;
    }
    
    if (mode === 'create') {
      await createSupplier.mutateAsync(formData);
    } else if (supplier) {
      await updateSupplier.mutateAsync({ id: supplier.id, data: formData });
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-bg-secondary rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">
            {mode === 'create' ? 'Thêm nhà cung cấp mới' : 'Sửa nhà cung cấp'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-bg-tertiary rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Mã NCC *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Đánh giá</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              >
                <option value={0}>Chưa đánh giá</option>
                <option value={1}>★ 1 sao</option>
                <option value={2}>★ 2 sao</option>
                <option value={3}>★ 3 sao</option>
                <option value={4}>★ 4 sao</option>
                <option value={5}>★ 5 sao</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Tên NCC *</label>
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
              <label className="block text-sm font-medium text-text-secondary mb-1">Số điện thoại</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">MST</label>
            <input
              type="text"
              value={formData.taxCode}
              onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Người liên hệ</label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg"
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
              disabled={createSupplier.isPending || updateSupplier.isPending}
              className="flex-1 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover disabled:opacity-50"
            >
              {createSupplier.isPending || updateSupplier.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
