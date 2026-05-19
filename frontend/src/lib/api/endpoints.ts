import apiClient from './client';
import { Material, Project, Structure, Transaction, ApiResponse, PaginatedResponse } from '@/types/common.types';

export const materialsApi = {
  getAll: (params?: any) => apiClient.get<Material[]>('/materials', { params }),
  getById: (id: string) => apiClient.get<Material>(`/materials/${id}`),
  create: (data: Partial<Material>) => apiClient.post<Material>('/materials', data),
  update: (id: string, data: Partial<Material>) => apiClient.put<Material>(`/materials/${id}`, data),
  delete: (id: string) => apiClient.delete(`/materials/${id}`),
  import: (file: File, onProgress?: (progress: number) => void) => 
    apiClient.upload('/materials/import', file, onProgress),
  export: () => apiClient.get('/materials/export', { responseType: 'blob' }),
};

export const projectsApi = {
  getAll: (params?: any) => apiClient.get<Project[]>('/projects', { params }),
  getById: (id: string) => apiClient.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => apiClient.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => apiClient.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  getMaterials: (id: string) => apiClient.get(`/projects/${id}/materials`),
  getSchedule: (id: string) => apiClient.get(`/projects/${id}/schedule`),
  updateSchedule: (id: string, data: any) => apiClient.put(`/projects/${id}/schedule`, data),
};

export const structuresApi = {
  getAll: (params?: any) => apiClient.get<Structure[]>('/structures', { params }),
  getById: (id: string) => apiClient.get<Structure>(`/structures/${id}`),
  create: (data: Partial<Structure>) => apiClient.post<Structure>('/structures', data),
  update: (id: string, data: Partial<Structure>) => apiClient.put<Structure>(`/structures/${id}`, data),
  delete: (id: string) => apiClient.delete(`/structures/${id}`),
  getBOM: (id: string) => apiClient.get(`/structures/${id}/bom`),
  produce: (id: string, quantity: number) => apiClient.post(`/structures/${id}/produce`, { quantity }),
  export: (id: string, projectId: string, quantity: number) => 
    apiClient.post(`/structures/${id}/export`, { projectId, quantity }),
  return: (id: string, projectId: string, quantity: number) => 
    apiClient.post(`/structures/${id}/return`, { projectId, quantity }),
};

export const transactionsApi = {
  getAll: (params?: any) => apiClient.get<Transaction[]>('/transactions', { params }),
  getById: (id: string) => apiClient.get<Transaction>(`/transactions/${id}`),
  create: (data: Partial<Transaction>) => apiClient.post<Transaction>('/transactions', data),
};

export const yardApi = {
  getGrid: (yardId: string) => apiClient.get(`/yard/${yardId}/grid`),
  getOccupancy: (yardId: string) => apiClient.get(`/yard/${yardId}/occupancy`),
  updatePosition: (positionId: string, data: any) => apiClient.put(`/yard/positions/${positionId}`, data),
};

export const dashboardApi = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentTransactions: (limit: number = 10) => apiClient.get('/dashboard/recent', { params: { limit } }),
  getInventoryValue: () => apiClient.get('/dashboard/inventory-value'),
  getProjectProgress: () => apiClient.get('/dashboard/project-progress'),
};
