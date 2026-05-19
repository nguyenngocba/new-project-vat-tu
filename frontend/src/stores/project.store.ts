import { create } from 'zustand';

interface ProjectFilters {
  search: string;
  status: 'all' | 'planning' | 'active' | 'completed' | 'on_hold';
  minBudget?: number;
  maxBudget?: number;
}

interface ProjectState {
  filters: ProjectFilters;
  setFilters: (filters: Partial<ProjectFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProjectFilters = {
  search: '',
  status: 'all',
  minBudget: undefined,
  maxBudget: undefined,
};

export const useProjectStore = create<ProjectState>((set) => ({
  filters: defaultFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
