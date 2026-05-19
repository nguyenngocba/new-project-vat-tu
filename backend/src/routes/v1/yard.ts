import { Router } from 'express';

const router = Router();

// Generate mock yard cells (A-K x 1-50)
const generateMockCells = () => {
  const zones = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
  const cells = [];
  
  for (let i = 0; i < zones.length; i++) {
    for (let row = 1; row <= 50; row++) {
      // Randomly mark some cells as occupied
      const isOccupied = Math.random() > 0.85;
      const hasWarning = Math.random() > 0.95;
      
      cells.push({
        id: `${zones[i]}${row}`,
        zone: zones[i],
        row: row,
        col: i + 1,
        layer: isOccupied ? Math.floor(Math.random() * 3) + 1 : 0,
        isOccupied: isOccupied,
        structureId: isOccupied ? `STR-${Math.floor(Math.random() * 10) + 1}` : undefined,
        structure: isOccupied ? {
          id: `STR-${Math.floor(Math.random() * 10) + 1}`,
          name: ['Cột chính', 'Dầm phụ', 'Kèo mái', 'Xà gồ', 'Giằng cột'][Math.floor(Math.random() * 5)],
          code: `CK-${Math.floor(Math.random() * 100)}`,
          type: ['Cột', 'Dầm', 'Kèo', 'Xà gồ', 'Giằng'][Math.floor(Math.random() * 5)],
          weight: Math.floor(Math.random() * 5000) + 500,
          quantity: Math.floor(Math.random() * 10) + 1,
        } : undefined,
        weight: isOccupied ? Math.floor(Math.random() * 5000) + 500 : 0,
        status: hasWarning ? 'warning' : (isOccupied ? 'occupied' : 'empty'),
      });
    }
  }
  return cells;
};

router.get('/grid', (_req, res) => {
  const cells = generateMockCells();
  res.json(cells);
});

router.get('/stats', (_req, res) => {
  const cells = generateMockCells();
  const totalCells = cells.length;
  const occupiedCells = cells.filter(c => c.isOccupied).length;
  const warningCells = cells.filter(c => c.status === 'warning').length;
  
  res.json({
    totalCells,
    occupiedCells,
    emptyCells: totalCells - occupiedCells,
    occupancyRate: Math.round((occupiedCells / totalCells) * 100),
    totalWeight: cells.reduce((sum, c) => sum + c.weight, 0),
    warningCells,
  });
});

router.get('/positions', (_req, res) => {
  const cells = generateMockCells();
  const positions = cells.map(c => ({
    id: c.id,
    zone: c.zone,
    row: c.row,
    col: c.col,
    layer: c.layer,
    structureId: c.structureId,
    status: c.status,
  }));
  res.json(positions);
});

router.get('/search', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const cells = generateMockCells();
  
  const filtered = cells.filter(c => 
    c.zone.toLowerCase().includes(query) ||
    c.row.toString().includes(query) ||
    c.structure?.name?.toLowerCase().includes(query) ||
    c.structure?.code?.toLowerCase().includes(query)
  );
  res.json(filtered);
});

export default router;
