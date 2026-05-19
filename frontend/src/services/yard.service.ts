import apiClient from '@/lib/api/client';
import { YardCell, YardStats, YardPosition } from '@/types/yard.types';

export const yardService = {
  getGrid: () => apiClient.get<YardCell[]>('/yard/grid'),
  getStats: () => apiClient.get<YardStats>('/yard/stats'),
  getPositions: () => apiClient.get<YardPosition[]>('/yard/positions'),
  updatePosition: (id: string, data: Partial<YardPosition>) => 
    apiClient.put(`/yard/positions/${id}`, data),
  getStructurePosition: (structureId: string) => 
    apiClient.get<YardPosition>(`/yard/structure/${structureId}/position`),
  search: (query: string) => apiClient.get<YardCell[]>(`/yard/search?q=${query}`),
};
