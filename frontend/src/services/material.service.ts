import apiClient from '@/lib/api/client';
import { Material, Transaction, MaterialStats } from '@/types/material.types';

export const materialService = {
  // Materials CRUD
  getAll: () => apiClient.get<Material[]>('/materials'),
  getById: (id: string) => apiClient.get<Material>(`/materials/${id}`),
  create: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Material>('/materials', data),
  update: (id: string, data: Partial<Material>) => 
    apiClient.put<Material>(`/materials/${id}`, data),
  delete: (id: string) => apiClient.delete(`/materials/${id}`),
  
  // Transactions
  getTransactions: (materialId?: string) => 
    apiClient.get<Transaction[]>('/transactions', { params: { materialId } }),
  purchase: (data: {
    materialId: string;
    supplierId: string;
    quantity: number;
    unitPrice: number;
    vatRate: number;
    note?: string;
    datetime: string;
  }) => apiClient.post<Transaction>('/transactions/purchase', data),
  usage: (data: {
    materialId: string;
    projectId: string;
    quantity: number;
    note?: string;
    datetime: string;
  }) => apiClient.post<Transaction>('/transactions/usage', data),
  return: (data: {
    materialId: string;
    projectId: string;
    quantity: number;
    note?: string;
    datetime: string;
  }) => apiClient.post<Transaction>('/transactions/return', data),
  
  // Import/Export
  import: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/materials/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  export: () => apiClient.get('/materials/export', { responseType: 'blob' }),
  
  // Stats
  getStats: () => apiClient.get<MaterialStats>('/materials/stats'),
  getCategories: () => apiClient.get<string[]>('/materials/categories'),
  getUnits: () => apiClient.get<string[]>('/materials/units'),
};
