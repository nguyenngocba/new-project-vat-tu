import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://172.168.53.116:5173'],
  credentials: true,
}));
app.use(express.json());

// Mock data
const mockMaterials: any[] = [
  { id: '1', code: 'HBEAM-100', name: 'H Beam 100x100', category: 'Thép hình', unit: 'm', quantity: 150, cost: 1250000, minStock: 20, note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', code: 'IBEAM-150', name: 'I Beam 150x150', category: 'Thép hình', unit: 'm', quantity: 80, cost: 1850000, minStock: 15, note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', code: 'ANGLE-50', name: 'Angle Bar 50x50', category: 'Thép góc', unit: 'm', quantity: 500, cost: 450000, minStock: 50, note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', code: 'PLATE-10', name: 'Steel Plate 10mm', category: 'Thép tấm', unit: 'm2', quantity: 200, cost: 890000, minStock: 30, note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', code: 'PIPE-2', name: 'Pipe D60', category: 'Ống thép', unit: 'm', quantity: 300, cost: 320000, minStock: 25, note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// API endpoints
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (_req, res) => {
  res.json({ message: 'API is working!' });
});

app.get('/api/v1/materials', (_req, res) => {
  res.json(mockMaterials);
});

app.get('/api/v1/materials/stats', (_req, res) => {
  const stats = {
    totalValue: mockMaterials.reduce((sum, m) => sum + (m.quantity * m.cost), 0),
    totalQuantity: mockMaterials.reduce((sum, m) => sum + m.quantity, 0),
    lowStockCount: mockMaterials.filter(m => m.quantity <= m.minStock).length,
    categoryCount: [...new Set(mockMaterials.map(m => m.category))].length,
  };
  res.json(stats);
});

app.get('/api/v1/materials/categories', (_req, res) => {
  const categories = [...new Set(mockMaterials.map(m => m.category))];
  res.json(categories);
});

app.get('/api/v1/materials/units', (_req, res) => {
  const units = [...new Set(mockMaterials.map(m => m.unit))];
  res.json(units);
});

app.post('/api/v1/materials', (req, res) => {
  const { code, name, category, unit, quantity, cost, minStock, note } = req.body;
  const newMaterial = {
    id: String(Date.now()),
    code,
    name,
    category,
    unit,
    quantity: quantity || 0,
    cost: cost || 0,
    minStock: minStock || 5,
    note: note || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockMaterials.push(newMaterial);
  res.status(201).json(newMaterial);
});

app.put('/api/v1/materials/:id', (req, res) => {
  const { id } = req.params;
  const index = mockMaterials.findIndex(m => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Material not found' });
    return;
  }
  mockMaterials[index] = { ...mockMaterials[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(mockMaterials[index]);
});

app.delete('/api/v1/materials/:id', (req, res) => {
  const { id } = req.params;
  const index = mockMaterials.findIndex(m => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Material not found' });
    return;
  }
  mockMaterials.splice(index, 1);
  res.json({ message: 'Deleted' });
});

// Start server
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const HOST: string = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(`🚀 Mock backend running on http://${HOST}:${PORT}`);
  console.log(`📚 API available at http://${HOST}:${PORT}/api/v1/materials`);
});
