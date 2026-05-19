import { Router } from 'express';

const router = Router();

// Mock data
let mockCategories = [
  { id: '1', name: 'Thép hình', description: 'Thép hình H, I, U, V', createdAt: new Date().toISOString() },
  { id: '2', name: 'Thép hộp', description: 'Thép hộp vuông, chữ nhật', createdAt: new Date().toISOString() },
  { id: '3', name: 'Thép tấm', description: 'Thép tấm các loại', createdAt: new Date().toISOString() },
  { id: '4', name: 'Ống thép', description: 'Ống thép đen, mạ kẽm', createdAt: new Date().toISOString() },
  { id: '5', name: 'Bu lông - Ốc vít', description: 'Các loại bu lông, ốc vít', createdAt: new Date().toISOString() },
];

let mockUnits = [
  { id: '1', name: 'Mét', symbol: 'm', description: 'Đơn vị chiều dài', createdAt: new Date().toISOString() },
  { id: '2', name: 'Mét vuông', symbol: 'm²', description: 'Đơn vị diện tích', createdAt: new Date().toISOString() },
  { id: '3', name: 'Kilogram', symbol: 'kg', description: 'Đơn vị khối lượng', createdAt: new Date().toISOString() },
  { id: '4', name: 'Tấn', symbol: 't', description: 'Đơn vị khối lượng', createdAt: new Date().toISOString() },
  { id: '5', name: 'Cái', symbol: 'cái', description: 'Đơn vị số lượng', createdAt: new Date().toISOString() },
];

let mockUsers = [
  { id: '1', username: 'admin', email: 'admin@steeltrack.com', fullName: 'Admin User', role: 'admin', isActive: true, permissions: ['all'], createdAt: new Date().toISOString() },
  { id: '2', username: 'manager', email: 'manager@steeltrack.com', fullName: 'Manager User', role: 'manager', isActive: true, permissions: ['inventory', 'projects'], createdAt: new Date().toISOString() },
];

let systemSettings = {
  theme: 'dark',
  language: 'vi',
  currency: 'VND',
  dateFormat: 'DD/MM/YYYY',
  lowStockAlert: true,
  autoBackup: true,
  backupFrequency: 'daily',
};

// Categories
router.get('/categories', (_req, res) => {
  res.json(mockCategories);
});

router.post('/categories', (req, res) => {
  const newCategory = {
    id: String(Date.now()),
    name: req.body.name,
    createdAt: new Date().toISOString(),
  };
  mockCategories.push(newCategory);
  res.status(201).json(newCategory);
});

router.put('/categories/:id', (req, res) => {
  const index = mockCategories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  mockCategories[index] = { ...mockCategories[index], name: req.body.name };
  res.json(mockCategories[index]);
});

router.delete('/categories/:id', (req, res) => {
  const index = mockCategories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  mockCategories.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// Units
router.get('/units', (_req, res) => {
  res.json(mockUnits);
});

router.post('/units', (req, res) => {
  const newUnit = {
    id: String(Date.now()),
    name: req.body.name,
    symbol: req.body.symbol,
    createdAt: new Date().toISOString(),
  };
  mockUnits.push(newUnit);
  res.status(201).json(newUnit);
});

router.put('/units/:id', (req, res) => {
  const index = mockUnits.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Unit not found' });
  mockUnits[index] = { ...mockUnits[index], ...req.body };
  res.json(mockUnits[index]);
});

router.delete('/units/:id', (req, res) => {
  const index = mockUnits.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Unit not found' });
  mockUnits.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// Users
router.get('/users', (_req, res) => {
  res.json(mockUsers);
});

router.post('/users', (req, res) => {
  const newUser = {
    id: String(Date.now()),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  res.status(201).json(newUserr);
});

router.put('/users/:id', req, res) => {
  const index = mockUsers.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  mockUsers[index] = { ...mockUsers[index], ...req.body };
  res.json(mockUsers[index]);
});

router.delete('/users/:id', (req, res) => {
  const index = mockUsers.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  mockUsers.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// System Settings
router.get('/system', (_req, res) => {
  res.json(systemSettings);
});

router.put('/system', (req, res) => {
  systemSettings = { ...systemSettings, ...req.body };
  res.json(systemSettings);
});

export default router;
