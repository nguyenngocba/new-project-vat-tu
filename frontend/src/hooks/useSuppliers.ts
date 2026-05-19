import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '@/services/supplier.service';
import { toast } from 'sonner';

export const useSuppliers = () => {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => supplierService.getAll(),
    staleTime: 30000,
  });
};

export const useSupplier = (id: string) => {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => supplierService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useSupplierPurchases = (id: string) => {
  return useQuery({
    queryKey: ['suppliers', id, 'purchases'],
    queryFn: () => supplierService.getPurchases(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useSupplierStats = () => {
  return useQuery({
    queryKey: ['suppliers-stats'],
    queryFn: () => supplierService.getStats(),
    staleTime: 60000,
  });
};

export const useTopSuppliers = (limit: number = 5) => {
  return useQuery({
    queryKey: ['top-suppliers', limit],
    queryFn: () => supplierService.getTopSuppliers(limit),
    staleTime: 60000,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers-stats'] });
      toast.success('Thêm nhà cung cấp thành công');
    },
    onError: () => toast.error('Thêm nhà cung cấp thất bại'),
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      supplierService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['suppliers-stats'] });
      toast.success('Cập nhật nhà cung cấp thành công');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: supplierService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers-stats'] });
      toast.success('Xóa nhà cung cấp thành công');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
};
