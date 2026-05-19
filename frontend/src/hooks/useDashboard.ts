import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 60000,
  });
};

export const useRecentTransactions = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-transactions', limit],
    queryFn: () => dashboardService.getRecentTransactions(limit),
    staleTime: 30000,
  });
};

export const useTopMaterials = (limit: number = 5) => {
  return useQuery({
    queryKey: ['top-materials', limit],
    queryFn: () => dashboardService.getTopMaterials(limit),
    staleTime: 60000,
  });
};

export const useMonthlyData = () => {
  return useQuery({
    queryKey: ['monthly-data'],
    queryFn: () => dashboardService.getMonthlyData(),
    staleTime: 60000,
  });
};
