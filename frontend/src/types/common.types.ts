export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material extends BaseEntity {
  code: string;
  name: string;
  category: string;
  unit: string;
  currentQuantity: number;
  unitCost: number;
  minStock: number;
  note?: string;
  supplierId?: string;
  status?: 'available' | 'low' | 'out';
}

export interface Project extends BaseEntity {
  code: string;
  name: string;
  customerName: string;
  contractValue: number;
  budget: number;
  spent: number;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  progress: number;
}

export interface Structure extends BaseEntity {
  code: string;
  name: string;
  type: string;
  unit: string;
  currentQuantity: number;
  cost: number;
  note?: string;
  // Yard fields
  zone?: string;
  positionY?: number;
  layer?: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  projectId?: string;
  status: 'in_stock' | 'exported' | 'producing';
}

export interface StructureBOM {
  id: string;
  structureId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface Transaction extends BaseEntity {
  code: string;
  type: 'purchase' | 'usage' | 'return' | 'produce' | 'structure_export' | 'structure_return' | 'transfer_sw' | 'return_from_sw';
  materialId?: string;
  structureId?: string;
  projectId?: string;
  supplierId?: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  vatRate: number;
  note?: string;
  attachment?: string;
  transactionDate: string;
}

export interface YardPosition {
  id: string;
  yardId: string;
  zone: string;
  row: number;
  col: number;
  layer: number;
  isOccupied: boolean;
  structureId?: string;
  structure?: Structure;
  weight: number;
  status: 'empty' | 'occupied' | 'reserved';
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  permissions: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortDirection = 'asc' | 'desc';

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  search?: string;
  filters?: Record<string, any>;
}
