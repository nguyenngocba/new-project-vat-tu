import apiClient from '@/lib/api/client';
import { Project, ProjectStats, ProjectMaterial, ProjectTransaction } from '@/types/project.types';

export const projectService = {
  getAll: () => apiClient.get<Project[]>('/projects'),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'spent'>) => 
    apiClient.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => 
    apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  
  getMaterials: (id: string) => apiClient.get<ProjectMaterial[]>(`/projects/${id}/materials`),
  getTransactions: (id: string) => apiClient.get<ProjectTransaction[]>(`/projects/${id}/transactions`),
  getStats: () => apiClient.get<ProjectStats>('/projects/stats'),
  export: (id: string) => apiClient.get(`/projects/${id}/export`, { responseType: 'blob' }),
};
