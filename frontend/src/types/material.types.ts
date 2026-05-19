export interface Material {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  cost: number;
  minStock: number;
  note?: string;
  supplierId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Transaction {
  id: string;
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
  createdAt: string;
}

export interface MaterialStats {
  totalValue: number;
  totalQuantity: number;
  lowStockCount: number;
  categoryCount: number;
}
