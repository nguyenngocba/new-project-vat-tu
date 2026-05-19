import { Router } from 'express';

const router = Router();

const mockSuppliers = [
  { id: '1', code: 'NCC001', name: 'Công ty Thép Hòa Phát', phone: '0988888001', email: 'sales@hoaphat.com', address: 'KCN Sóng Thần, Bình Dương', taxCode: '0301234567', contactPerson: 'Nguyễn Văn A', bankName: 'Vietcombank', bankAccount: '123456789', rating: 4.5, totalPurchases: 125000000, totalOrders: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'NCC002', name: 'Công ty Thép Nam Kim', phone: '0988888002', email: 'sales@namkim.com', address: 'KCN Phú Mỹ, Bà Rịa - Vũng Tàu', taxCode: '0301234568', contactPerson: 'Trần Thị B', bankName: 'Techcombank', bankAccount: '987654321', rating: 4.2, totalPurchases: 89000000, totalOrders: 5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'NCC003', name: 'Công ty Thép Pomina', phone: '0988888003', email: 'sales@pomina.com', address: 'KCN Mỹ Xuân, Bà Rịa - Vũng Tàu', taxCode: '0301234569', contactPerson: 'Lê Văn C', rating: 3.8, totalPurchases: 45000000, totalOrders: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockPurchases = {
  '1': [
    { id: 'p1', supplierId: '1', materialId: '1', materialName: 'H Beam 100x100', quantity: 25, unit: 'm', unitPrice: 1250000, totalAmount: 31250000, date: '2024-01-20', note: 'Nhập đợt 1' },
    { id: 'p2', supplierId: '1', materialId: '2', materialName: 'I Beam 150x150', quantity: 15, unit: 'm', unitPrice: 1850000, totalAmount: 27750000, date: '2024-02-15', note: 'Nhập đợt 2' },
  ],
  '2': [
    { id: 'p3', supplierId: '2', materialId: '3', materialName: 'Angle Bar 50x50', quantity: 80, unit: 'm', unitPrice: 450000, totalAmount: 36000000, date: '2024-03-10' },
  ],
};

router.get('/', (_req, res) => {
  res.json(mockSuppliers);
});

router.get('/stats', (_req, res) => {
  const stats = {
    totalSuppliers: mockSuppliers.length,
    totalPurchases: mockSuppliers.reduce((sum, s) => sum + (s.totalOrders || 0), 0),
    totalSpent: mockSuppliers.reduce((sum, s) => sum + (s.totalPurchases || 0), 0),
    averageRating: mockSuppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / mockSuppliers.length,
    activeSuppliers: mockSuppliers.filter(s => (s.totalOrders || 0) > 0).length,
  };
  res.json(stats);
});

router.get('/top', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 5;
  const top = [...mockSuppliers].sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0)).slice(0, limit);
  res.json(top);
});

router.get('/:id', (req, res) => {
  const supplier = mockSuppliers.find(s => s.id === req.params.id);
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  res.json(supplier);
});

router.get('/:id/purchases', (req, res) => {
  const purchases = mockPurchases[req.params.id as keyof typeof mockPurchases] || [];
  res.json(purchases);
});

router.post('/', (req, res) => {
  const newSupplier = {
    id: String(Date.now()),
    ...req.body,
    totalPurchases: 0,
    totalOrders: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockSuppliers.push(newSupplier);
  res.status(201).json(newSupplier);
});

router.put('/:id', (req, res) => {
  const index = mockSuppliers.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Supplier not found' });
  mockSuppliers[index] = { ...mockSuppliers[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(mockSuppliers[index]);
});

router.delete('/:id', (req, res) => {
  const index = mockSuppliers.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Supplier not found' });
  mockSuppliers.splice(index, 1);
  res.json({ message: 'Deleted' });
});

export default router;
