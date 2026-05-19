import { Router } from 'express';

const router = Router();

// Mock data
const mockMaterials = [
  { id: '1', code: 'HBEAM-100', name: 'H Beam 100x100', category: 'Thép hình', unit: 'm', quantity: 150, cost: 1250000, minStock: 20 },
  { id: '2', code: 'IBEAM-150', name: 'I Beam 150x150', category: 'Thép hình', unit: 'm', quantity: 80, cost: 1850000, minStock: 15 },
  { id: '3', code: 'ANGLE-50', name: 'Angle Bar 50x50', category: 'Thép góc', unit: 'm', quantity: 500, cost: 450000, minStock: 50 },
  { id: '4', code: 'PLATE-10', name: 'Steel Plate 10mm', category: 'Thép tấm', unit: 'm2', quantity: 200, cost: 890000, minStock: 30 },
  { id: '5', code: 'PIPE-2', name: 'Pipe D60', category: 'Ống thép', unit: 'm', quantity: 300, cost: 320000, minStock: 25 },
];

const mockProjects = [
  { id: '1', code: 'PRJ-001', name: 'Nhà máy A', budget: 2500000000, spent: 1250000000, status: 'active' },
  { id: '2', code: 'PRJ-002', name: 'Cầu đường B', budget: 5800000000, spent: 2100000000, status: 'active' },
  { id: '3', code: 'PRJ-003', name: 'Chung cư C', budget: 4200000000, spent: 4200000000, status: 'completed' },
];

const mockStructures = [
  { id: '1', code: 'CK-001', name: 'Cột chính', type: 'Cột', unit: 'cái', quantity: 25, cost: 8500000 },
  { id: '2', code: 'CK-002', name: 'Dầm phụ', type: 'Dầm', unit: 'cái', quantity: 40, cost: 6200000 },
];

const mockSuppliers = [
  { id: '1', name: 'Công ty Thép Hòa Phát' },
  { id: '2', name: 'Công ty Thép Nam Kim' },
];

router.get('/stats', (_req, res) => {
  const totalInventoryValue = mockMaterials.reduce((sum, m) => sum + m.quantity * m.cost, 0);
  const totalStockQuantity = mockMaterials.reduce((sum, m) => sum + m.quantity, 0);
  const lowStockCount = mockMaterials.filter(m => m.quantity <= m.minStock).length;
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const occupancyRate = 68; // Mock

  res.json({
    totalMaterials: mockMaterials.length,
    totalProjects: mockProjects.length,
    totalStructures: mockStructures.length,
    totalSuppliers: mockSuppliers.length,
    totalInventoryValue,
    totalStockQuantity,
    lowStockCount,
    activeProjects,
    monthlyImport: 125000000,
    monthlyExport: 98000000,
    occupancyRate,
  });
});

router.get('/recent', (_req, res) => {
  const transactions = [
    { id: '1', type: 'purchase', materialName: 'H Beam 100x100', quantity: 25, unit: 'm', totalAmount: 31250000, date: '2024-01-20', supplierName: 'Công ty Thép Hòa Phát' },
    { id: '2', type: 'usage', materialName: 'I Beam 150x150', quantity: 15, unit: 'm', totalAmount: 27750000, date: '2024-02-15', projectName: 'Nhà máy A' },
    { id: '3', type: 'produce', materialName: 'Cột chính', quantity: 10, unit: 'cái', totalAmount: 85000000, date: '2024-03-10' },
    { id: '4', type: 'structure_export', materialName: 'Cột chính', quantity: 5, unit: 'cái', totalAmount: 42500000, date: '2024-03-15', projectName: 'Cầu đường B' },
    { id: '5', type: 'return', materialName: 'Angle Bar 50x50', quantity: 50, unit: 'm', totalAmount: 22500000, date: '2024-03-20', projectName: 'Nhà máy A' },
  ];
  
  const limit = parseInt(req.query.limit as string) || 10;
  res.json(transactions.slice(0, limit));
});

router.get('/top-materials', (_req, res) => {
  const topMaterials = mockMaterials
    .map(m => ({ id: m.id, name: m.name, quantity: m.quantity, value: m.quantity * m.cost, unit: m.unit }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  res.json(topMaterials);
});

router.get('/monthly', (_req, res) => {
  const monthlyData = [
    { month: '2024-01', import: 125000000, export: 98000000, stock: 450000000 },
    { month: '2024-02', import: 142000000, export: 112000000, stock: 480000000 },
    { month: '2024-03', import: 138000000, export: 125000000, stock: 493000000 },
    { month: '2024-04', import: 156000000, export: 131000000, stock: 518000000 },
    { month: '2024-05', import: 148000000, export: 142000000, stock: 524000000 },
    { month: '2024-06', import: 165000000, export: 148000000, stock: 541000000 },
  ];
  res.json(monthlyData);
});

export default router;
