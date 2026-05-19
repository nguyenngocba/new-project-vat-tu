import { Router } from 'express';

const router = Router();

const mockProjects = [
  { 
    id: '1', 
    code: 'PRJ-001', 
    name: 'Nhà máy A', 
    budget: 2500000000, 
    spent: 1250000000, 
    status: 'active',
    customerName: 'Công ty A',
    startDate: '2024-01-15',
    expectedEndDate: '2024-12-30',
    description: 'Xây dựng nhà máy sản xuất thép',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: '2', 
    code: 'PRJ-002', 
    name: 'Cầu đường B', 
    budget: 5800000000, 
    spent: 2100000000, 
    status: 'active',
    customerName: 'Công ty B',
    startDate: '2024-02-01',
    expectedEndDate: '2025-06-30',
    description: 'Xây dựng cầu vượt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: '3', 
    code: 'PRJ-003', 
    name: 'Chung cư C', 
    budget: 4200000000, 
    spent: 4200000000, 
    status: 'completed',
    customerName: 'Công ty C',
    startDate: '2023-01-10',
    expectedEndDate: '2024-03-20',
    actualEndDate: '2024-03-15',
    description: 'Xây dựng chung cư cao cấp',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock materials for projects
const mockProjectMaterials = {
  '1': [
    { materialId: '1', materialName: 'H Beam 100x100', unit: 'm', usedQuantity: 45, returnedQuantity: 0, remainingQuantity: 45, totalCost: 56250000 },
    { materialId: '2', materialName: 'I Beam 150x150', unit: 'm', usedQuantity: 28, returnedQuantity: 0, remainingQuantity: 28, totalCost: 51800000 },
  ],
  '2': [
    { materialId: '3', materialName: 'Angle Bar 50x50', unit: 'm', usedQuantity: 120, returnedQuantity: 5, remainingQuantity: 115, totalCost: 51750000 },
  ],
  '3': [
    { materialId: '4', materialName: 'Steel Plate 10mm', unit: 'm2', usedQuantity: 180, returnedQuantity: 10, remainingQuantity: 170, totalCost: 151300000 },
  ],
};

// Mock transactions for projects
const mockProjectTransactions = {
  '1': [
    { id: 't1', projectId: '1', materialId: '1', materialName: 'H Beam 100x100', quantity: 25, unit: 'm', unitPrice: 1250000, totalAmount: 31250000, type: 'usage', date: '2024-01-20', note: 'Xuất đợt 1' },
    { id: 't2', projectId: '1', materialId: '2', materialName: 'I Beam 150x150', quantity: 15, unit: 'm', unitPrice: 1850000, totalAmount: 27750000, type: 'usage', date: '2024-02-15', note: 'Xuất đợt 2' },
  ],
  '2': [
    { id: 't3', projectId: '2', materialId: '3', materialName: 'Angle Bar 50x50', quantity: 80, unit: 'm', unitPrice: 450000, totalAmount: 36000000, type: 'usage', date: '2024-03-10', note: 'Xuất đợt 1' },
    { id: 't4', projectId: '2', materialId: '3', materialName: 'Angle Bar 50x50', quantity: 5, unit: 'm', unitPrice: 450000, totalAmount: 2250000, type: 'return', date: '2024-04-05', note: 'Trả hàng dư' },
  ],
  '3': [
    { id: 't5', projectId: '3', materialId: '4', materialName: 'Steel Plate 10mm', quantity: 120, unit: 'm2', unitPrice: 890000, totalAmount: 106800000, type: 'usage', date: '2023-05-20', note: 'Xuất đợt 1' },
    { id: 't6', projectId: '3', materialId: '4', materialName: 'Steel Plate 10mm', quantity: 60, unit: 'm2', unitPrice: 890000, totalAmount: 53400000, type: 'usage', date: '2023-08-15', note: 'Xuất đợt 2' },
    { id: 't7', projectId: '3', materialId: '4', materialName: 'Steel Plate 10mm', quantity: 10, unit: 'm2', unitPrice: 890000, totalAmount: 8900000, type: 'return', date: '2024-02-28', note: 'Trả hàng tồn' },
  ],
};

router.get('/', (_req, res) => {
  res.json(mockProjects);
});

router.get('/stats', (_req, res) => {
  const stats = {
    totalProjects: mockProjects.length,
    activeProjects: mockProjects.filter(p => p.status === 'active').length,
    totalBudget: mockProjects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: mockProjects.reduce((sum, p) => sum + p.spent, 0),
    remainingBudget: mockProjects.reduce((sum, p) => sum + (p.budget - p.spent), 0),
    completionRate: (mockProjects.reduce((sum, p) => sum + p.spent, 0) / mockProjects.reduce((sum, p) => sum + p.budget, 0)) * 100,
  };
  res.json(stats);
});

router.get('/:id', (req, res) => {
  const project = mockProjects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.get('/:id/materials', (req, res) => {
  const materials = mockProjectMaterials[req.params.id as keyof typeof mockProjectMaterials] || [];
  res.json(materials);
});

router.get('/:id/transactions', (req, res) => {
  const transactions = mockProjectTransactions[req.params.id as keyof typeof mockProjectTransactions] || [];
  res.json(transactions);
});

router.post('/', (req, res) => {
  const newProject = {
    id: String(Date.now()),
    ...req.body,
    spent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

router.put('/:id', (req, res) => {
  const index = mockProjects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  mockProjects[index] = { ...mockProjects[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(mockProjects[index]);
});

router.delete('/:id', (req, res) => {
  const index = mockProjects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  mockProjects.splice(index, 1);
  res.json({ message: 'Deleted' });
});

export default router;
