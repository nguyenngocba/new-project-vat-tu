import apiClient from '@/lib/api/client';
import { Structure, StructureBOM, StructureProduction, StructureExport, StructureStats } from '@/types/structure.types';

export const structureService = {
  getAll: () => apiClient.get<Structure[]>('/structures'),
  getById: (id: string) => apiClient.get<Structure>(`/structures/${id}`),
  create: (data: Omit<Structure, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Structure>('/structures', data),
  update: (id: string, data: Partial<Structure>) => 
    apiClient.put<Structure>(`/structures/${id}`, data),
  delete: (id: string) => apiClient.delete(`/structures/${id}`),
  
  getBOM: (id: string) => apiClient.get<StructureBOM[]>(`/structures/${id}/bom`),
  getProductions: (id: string) => apiClient.get<StructureProduction[]>(`/structures/${id}/productions`),
  getExports: (id: string) => apiClient.get<StructureExport[]>(`/structures/${id}/exports`),
  
  produce: (id: string, quantity: number, note?: string) => 
    apiClient.post<StructureProduction>(`/structures/${id}/produce`, { quantity, note }),
  export: (id: string, projectId: string, quantity: number, note?: string) => 
    apiClient.post<StructureExport>(`/structures/${id}/export`, { projectId, quantity, note }),
  return: (id: string, projectId: string, quantity: number, note?: string) => 
    apiClient.post(`/structures/${id}/return`, { projectId, quantity, note }),
  
  getStats: () => apiClient.get<StructureStats>('/structures/stats'),
  getYardGrid: () => apiClient.get('/structures/yard-grid'),
};
