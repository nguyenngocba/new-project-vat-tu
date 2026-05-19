export interface Project {
  id: string;
  code: string;
  name: string;
  budget: number;
  spent: number;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  customerName?: string;
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMaterial {
  projectId: string;
  materialId: string;
  materialName: string;
  unit: string;
  usedQuantity: number;
  returnedQuantity: number;
  remainingQuantity: number;
  totalCost: number;
}

export interface ProjectTransaction {
  id: string;
  projectId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  type: 'usage' | 'return' | 'structure_export' | 'structure_return';
  date: string;
  note?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  completionRate: number;
}
