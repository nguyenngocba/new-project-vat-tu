import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services/project.service';
import { toast } from 'sonner';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
    staleTime: 30000,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useProjectMaterials = (id: string) => {
  return useQuery({
    queryKey: ['projects', id, 'materials'],
    queryFn: () => projectService.getMaterials(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useProjectTransactions = (id: string) => {
  return useQuery({
    queryKey: ['projects', id, 'transactions'],
    queryFn: () => projectService.getTransactions(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useProjectStats = () => {
  return useQuery({
    queryKey: ['projects-stats'],
    queryFn: () => projectService.getStats(),
    staleTime: 60000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
      toast.success('Thêm dự án thành công');
    },
    onError: () => toast.error('Thêm dự án thất bại'),
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      projectService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
      toast.success('Cập nhật dự án thành công');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-stats'] });
      toast.success('Xóa dự án thành công');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
};
