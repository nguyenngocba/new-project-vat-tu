import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { structureService } from '@/services/structure.service';
import { toast } from 'sonner';

export const useStructures = () => {
  return useQuery({
    queryKey: ['structures'],
    queryFn: () => structureService.getAll(),
    staleTime: 30000,
  });
};

export const useStructure = (id: string) => {
  return useQuery({
    queryKey: ['structures', id],
    queryFn: () => structureService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useStructureBOM = (id: string) => {
  return useQuery({
    queryKey: ['structures', id, 'bom'],
    queryFn: () => structureService.getBOM(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useStructureProductions = (id: string) => {
  return useQuery({
    queryKey: ['structures', id, 'productions'],
    queryFn: () => structureService.getProductions(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useStructureExports = (id: string) => {
  return useQuery({
    queryKey: ['structures', id, 'exports'],
    queryFn: () => structureService.getExports(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useStructureStats = () => {
  return useQuery({
    queryKey: ['structures-stats'],
    queryFn: () => structureService.getStats(),
    staleTime: 60000,
  });
};

export const useYardGrid = () => {
  return useQuery({
    queryKey: ['yard-grid'],
    queryFn: () => structureService.getYardGrid(),
    staleTime: 30000,
  });
};

export const useCreateStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: structureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures-stats'] });
      toast.success('Thêm cấu kiện thành công');
    },
    onError: () => toast.error('Thêm cấu kiện thất bại'),
  });
};

export const useUpdateStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Structure> }) =>
      structureService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['structures-stats'] });
      toast.success('Cập nhật cấu kiện thành công');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
};

export const useDeleteStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: structureService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures-stats'] });
      toast.success('Xóa cấu kiện thành công');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
};

export const useProduceStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity, note }: { id: string; quantity: number; note?: string }) =>
      structureService.produce(id, quantity, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['structures-stats'] });
      toast.success(`Sản xuất thành công ${variables.quantity} cấu kiện`);
    },
    onError: () => toast.error('Sản xuất thất bại'),
  });
};

export const useExportStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId, quantity, note }: { id: string; projectId: string; quantity: number; note?: string }) =>
      structureService.export(id, projectId, quantity, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures-stats'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Xuất cấu kiện thành công');
    },
    onError: () => toast.error('Xuất cấu kiện thất bại'),
  });
};
