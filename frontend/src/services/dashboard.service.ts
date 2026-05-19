import apiClient from '@/lib/api/client';
import { DashboardStats, RecentTransaction, TopMaterial, MonthlyData } from '@/types/dashboard.types';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
  getRecentTransactions: (limit: number = 10) => 
    apiClient.get<RecentTransaction[]>(`/dashboard/recent?limit=${limit}`),
  getTopMaterials: (limit: number = 5) => 
    apiClient.get<TopMaterial[]>(`/dashboard/top-materials?limit=${limit}`),
  getMonthlyData: () => apiClient.get<MonthlyData[]>('/dashboard/monthly'),
  getInventoryTrend: () => apiClient.get('/dashboard/inventory-trend'),
};
