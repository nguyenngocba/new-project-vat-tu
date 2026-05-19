import { useState } from 'react';
import { useMaterials } from '@/hooks/useMaterials';
import { InventoryTable } from './components/InventoryTable';
import { FilterBar } from './components/FilterBar';
import { StatsCards } from './components/StatsCards';
import { Material } from '@/types/material.types';
import { InventoryWorkspace } from './InventoryWorkspace';

export function InventoryPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const { data: materials, isLoading } = useMaterials();

  const handleView = (material: Material) => {
    setSelectedMaterial(material);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Quản lý vật tư</h1>
        <p className="text-text-secondary mt-1">Quản lý danh sách vật tư, nhập xuất tồn kho</p>
      </div>

      <StatsCards />
      <FilterBar />

      <div className="card">
        <InventoryTable
          materials={materials || []}
          isLoading={isLoading}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={handleView}
        />
      </div>

      {selectedMaterial && (
        <InventoryWorkspace
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
}
