export interface Supplier {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  contactPerson?: string;
  bankName?: string;
  bankAccount?: string;
  rating?: number;
  totalPurchases?: number;
  totalOrders?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPurchase {
  id: string;
  supplierId: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  date: string;
  note?: string;
}

export interface SupplierStats {
  totalSuppliers: number;
  totalPurchases: number;
  totalSpent: number;
  averageRating: number;
  activeSuppliers: number;
}
