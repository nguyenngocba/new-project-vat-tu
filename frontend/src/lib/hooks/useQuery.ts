import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { materialsApi, projectsApi, structuresApi, transactionsApi } from '@/lib/api/endpoints';
import { Material, Project, Structure, Transaction } from '@/types/common.types';

// Materials hooks
export const useMaterials = (params?: any) => {
  return useQuery({
    queryKey: ['materials', params],
    queryFn: () => materialsApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: () => materialsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Material>) => materialsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Material> }) => 
      materialsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['materials', variables.id] });
    },
  });
};

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => materialsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
};

// Projects hooks
export const useProjects = (params?: any) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectsApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Project>) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) => 
      projectsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.id] });
    },
  });
};

// Structures hooks
export const useStructures = (params?: any) => {
  return useQuery({
    queryKey: ['structures', params],
    queryFn: () => structuresApi.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useStructure = (id: string) => {
  return useQuery({
    queryKey: ['structures', id],
    queryFn: () => structuresApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduceStructure = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => 
      structuresApi.produce(id, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['structures'] });
      queryClient.invalidateQueries({ queryKey: ['structures', variables.id] });
    },
  });
};

// Transactions hooks
export const useTransactions = (params?: any) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsApi.getAll(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Transaction>) => transactionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
