export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff';
  isActive: boolean;
  permissions: string[];
  createdAt: string;
}

export interface SystemSettings {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  currency: string;
  dateFormat: string;
  lowStockAlert: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}
