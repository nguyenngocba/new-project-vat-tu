export interface Structure {
  id: string;
  code: string;
  name: string;
  type: string;
  unit: string;
  quantity: number;
  cost: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  zone: string;
  positionY: number;
  layer: number;
  status: 'in_stock' | 'exported' | 'producing';
  projectId?: string;
  projectName?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StructureBOM {
  id: string;
  structureId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  cost: number;
  totalCost: number;
}

export interface StructureProduction {
  id: string;
  structureId: string;
  structureName: string;
  quantity: number;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  note?: string;
}

export interface StructureExport {
  id: string;
  structureId: string;
  structureName: string;
  projectId: string;
  projectName: string;
  quantity: number;
  date: string;
  note?: string;
}

export interface StructureStats {
  totalStructures: number;
  totalQuantity: number;
  totalValue: number;
  lowStockCount: number;
  producedThisMonth: number;
  exportedThisMonth: number;
}
