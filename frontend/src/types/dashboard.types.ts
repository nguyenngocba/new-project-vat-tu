export interface DashboardStats {
  totalMaterials: number;
  totalProjects: number;
  totalStructures: number;
  totalSuppliers: number;
  totalInventoryValue: number;
  totalStockQuantity: number;
  lowStockCount: number;
  activeProjects: number;
  monthlyImport: number;
  monthlyExport: number;
  occupancyRate: number;
}

export interface RecentTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'return' | 'produce' | 'structure_export' | 'structure_return';
  materialName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  date: string;
  projectName?: string;
  supplierName?: string;
}

export interface TopMaterial {
  id: string;
  name: string;
  quantity: number;
  value: number;
  unit: string;
}

export interface MonthlyData {
  month: string;
  import: number;
  export: number;
  stock: number;
}
