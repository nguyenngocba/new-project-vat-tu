import apiClient from '@/lib/api/client';
import { Transaction } from '@/types/material.types';

export const transactionService = {
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
  
  getByMaterial: (materialId: string) => 
    apiClient.get<Transaction[]>(`/transactions/material/${materialId}`),
  
  getByProject: (projectId: string) => 
    apiClient.get<Transaction[]>(`/transactions/project/${projectId}`),
};
