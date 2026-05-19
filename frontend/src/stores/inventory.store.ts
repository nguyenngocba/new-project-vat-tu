import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Material } from '@/types/material.types';

interface InventoryFilters {
  keyword: string;
  category: string;
  minStock: string;
  maxStock: string;
  status: 'all' | 'low' | 'out' | 'ok';
  showFavoritesOnly: boolean;
}

interface InventoryState {
  filters: InventoryFilters;
  selectedMaterial: Material | null;
  favorites: string[];
  density: 'compact' | 'comfortable' | 'spacious';
  
  // Actions
  setFilters: (filters: Partial<InventoryFilters>) => void;
  resetFilters: () => void;
  setSelectedMaterial: (material: Material | null) => void;
  toggleFavorite: (materialId: string) => void;
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
}

const defaultFilters: InventoryFilters = {
  keyword: '',
  category: '',
  minStock: '',
  maxStock: '',
  status: 'all',
  showFavoritesOnly: false,
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedMaterial: null,
      favorites: [],
      density: 'comfortable',
      
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      
      resetFilters: () => set({ filters: defaultFilters }),
      
      setSelectedMaterial: (material) => set({ selectedMaterial: material }),
      
      toggleFavorite: (materialId) =>
        set((state) => ({
          favorites: state.favorites.includes(materialId)
            ? state.favorites.filter((id) => id !== materialId)
            : [...state.favorites, materialId],
        })),
      
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'inventory-storage',
      partialize: (state) => ({ favorites: state.favorites, density: state.density }),
    }
  )
);
