import apiClient from '@/lib/api/client';
import { Category, Unit, User, SystemSettings } from '@/types/settings.types';

export const settingsService = {
  // Categories
  getCategories: () => apiClient.get<Category[]>('/settings/categories'),
  createCategory: (name: string) => apiClient.post<Category>('/settings/categories', { name }),
  updateCategory: (id: string, name: string) => apiClient.put(`/settings/categories/${id}`, { name }),
  deleteCategory: (id: string) => apiClient.delete(`/settings/categories/${id}`),
  
  // Units
  getUnits: () => apiClient.get<Unit[]>('/settings/units'),
  createUnit: (data: { name: string; symbol: string }) => apiClient.post<Unit>('/settings/units', data),
  updateUnit: (id: string, data: Partial<Unit>) => apiClient.put(`/settings/units/${id}`, data),
  deleteUnit: (id: string) => apiClient.delete(`/settings/units/${id}`),
  
  // Users
  getUsers: () => apiClient.get<User[]>('/settings/users'),
  createUser: (data: Omit<User, 'id' | 'createdAt'>) => apiClient.post<User>('/settings/users', data),
  updateUser: (id: string, data: Partial<User>) => apiClient.put(`/settings/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/settings/users/${id}`),
  
  // System Settings
  getSettings: () => apiClient.get<SystemSettings>('/settings/system'),
  updateSettings: (data: Partial<SystemSettings>) => apiClient.put('/settings/system', data),
};
