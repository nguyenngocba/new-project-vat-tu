import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yardService } from '@/services/yard.service';
import { toast } from 'sonner';

export const useYardGrid = () => {
  return useQuery({
    queryKey: ['yard-grid'],
    queryFn: () => yardService.getGrid(),
    staleTime: 10000,
    refetchInterval: 30000,
  });
};

export const useYardStats = () => {
  return useQuery({
    queryKey: ['yard-stats'],
    queryFn: () => yardService.getStats(),
    staleTime: 30000,
  });
};

export const useYardPositions = () => {
  return useQuery({
    queryKey: ['yard-positions'],
    queryFn: () => yardService.getPositions(),
    staleTime: 30000,
  });
};

export const useSearchYard = (query: string) => {
  return useQuery({
    queryKey: ['yard-search', query],
    queryFn: () => yardService.search(query),
    enabled: query.length > 0,
    staleTime: 5000,
  });
};
