import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialService } from '@/services/material.service';
import { useInventoryStore } from '@/stores/inventory.store';
import { toast } from 'sonner';

// Get all materials with filters
export const useMaterials = () => {
  const { filters } = useInventoryStore();
  
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: () => materialService.getAll(),
    select: (data) => {
      let filtered = [...data];
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        filtered = filtered.filter(
          (m) => m.name.toLowerCase().includes(kw) || m.code.toLowerCase().includes(kw)
        );
      }
      if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter((m) => m.category === filters.category);
      }
      if (filters.minStock) {
        filtered = filtered.filter((m) => m.quantity >= Number(filters.minStock));
      }
      if (filters.maxStock) {
        filtered = filtered.filter((m) => m.quantity <= Number(filters.maxStock));
      }
      if (filters.status === 'low') {
        filtered = filtered.filter((m) => m.quantity <= m.minStock);
      } else if (filters.status === 'out') {
        filtered = filtered.filter((m) => m.quantity <= 0);
      } else if (filters.status === 'ok') {
        filtered = filtered.filter((m) => m.quantity > m.minStock);
      }
      if (filters.showFavoritesOnly) {
        const { favorites } = useInventoryStore.getState();
        filtered = filtered.filter((m) => favorites.includes(m.id));
      }
      return filtered;
    },
    staleTime: 1000 * 60,
    placeholderData: (previousData) => previousData,
  });
};

// Get single material
export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: () => materialService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60,
  });
};

// Get material stats
export const useMaterialStats = () => {
  return useQuery({
    queryKey: ['materials-stats'],
    queryFn: () => materialService.getStats(),
    staleTime: 1000 * 60,
  });
};

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['material-categories'],
    queryFn: () => materialService.getCategories(),
    staleTime: 1000 * 60 * 60,
  });
};

// Get units
export const useUnits = () => {
  return useQuery({
    queryKey: ['material-units'],
    queryFn: () => materialService.getUnits(),
    staleTime: 1000 * 60 * 60,
  });
};

// Create material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: materialService.create,
    onMutate: async (newMaterial) => {
      await queryClient.cancelQueries({ queryKey: ['materials'] });
      const previousMaterials = queryClient.getQueryData(['materials']);
      
      queryClient.setQueryData(['materials'], (old: any) => {
        return [newMaterial, ...(old || [])];
      });
      
      return { previousMaterials };
    },
    onError: (err, newMaterial, context) => {
      queryClient.setQueryData(['materials'], context?.previousMaterials);
      toast.error('Thêm vật tư thất bại');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-stats'] });
      toast.success('Thêm vật tư thành công');
    },
  });
};

// Update material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => materialService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['materials'] });
      const previousMaterials = queryClient.getQueryData(['materials']);
      
      queryClient.setQueryData(['materials'], (old: any) => {
        return old?.map((m: any) => m.id === id ? { ...m, ...data } : m);
      });
      
      return { previousMaterials };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['materials'], context?.previousMaterials);
      toast.error('Cập nhật thất bại');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', 'stats'] });
      toast.success('Cập nhật vật tư thành công');
    },
  });
};

// Delete material
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: materialService.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['materials'] });
      const previousMaterials = queryClient.getQueryData(['materials']);
      
      queryClient.setQueryData(['materials'], (old: any) => {
        return old?.filter((m: any) => m.id !== id);
      });
      
      return { previousMaterials };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['materials'], context?.previousMaterials);
      toast.error('Xóa thất bại');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-stats'] });
      toast.success('Xóa vật tư thành công');
    },
  });
};

// Purchase transaction
export const usePurchase = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: materialService.purchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-stats'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Nhập kho thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Nhập kho thất bại');
    },
  });
};

// Usage transaction (export)
export const useUsage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: materialService.usage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-stats'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Xuất kho thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Xuất kho thất bại');
    },
  });
};

// Return transaction
export const useReturn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: materialService.return,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials-stats'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Trả hàng thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Trả hàng thất bại');
    },
  });
};
