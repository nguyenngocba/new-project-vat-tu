import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';
import { toast } from 'sonner';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => settingsService.getCategories(),
    staleTime: 60000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => settingsService.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Thêm danh mục thành công');
    },
    onError: () => toast.error('Thêm danh mục thất bại'),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Xóa danh mục thành công');
    },
    onError: () => toast.error('Xóa danh mục thất bại'),
  });
};

// Units
export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => settingsService.getUnits(),
    staleTime: 60000,
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; symbol: string }) => settingsService.createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Thêm đơn vị thành công');
    },
    onError: () => toast.error('Thêm đơn vị thất bại'),
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      toast.success('Xóa đơn vị thành công');
    },
    onError: () => toast.error('Xóa đơn vị thất bại'),
  });
};

// Users
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => settingsService.getUsers(),
    staleTime: 60000,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Thêm người dùng thành công');
    },
    onError: () => toast.error('Thêm người dùng thất bại'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      settingsService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Cập nhật người dùng thành công');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Xóa người dùng thành công');
    },
    onError: () => toast.error('Xóa thất bại'),
  });
};

// System Settings
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 60000,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success('Cập nhật cài đặt thành công');
    },
    onError: () => toast.error('Cập nhật thất bại'),
  });
};
