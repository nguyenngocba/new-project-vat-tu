import apiClient from '@/lib/api/client';
import { Supplier, SupplierPurchase, SupplierStats } from '@/types/supplier.types';

export const supplierService = {
  getAll: () => apiClient.get<Supplier[]>('/suppliers'),
  getById: (id: string) => apiClient.get<Supplier>(`/suppliers/${id}`),
  create: (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<Supplier>('/suppliers', data),
  update: (id: string, data: Partial<Supplier>) => 
    apiClient.put<Supplier>(`/suppliers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/suppliers/${id}`),
  
  getPurchases: (id: string) => apiClient.get<SupplierPurchase[]>(`/suppliers/${id}/purchases`),
  getStats: () => apiClient.get<SupplierStats>('/suppliers/stats'),
  getTopSuppliers: (limit: number = 5) => 
    apiClient.get<Supplier[]>(`/suppliers/top?limit=${limit}`),
};
