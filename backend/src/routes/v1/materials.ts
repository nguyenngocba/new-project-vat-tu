import { Router } from 'express';
import { pool } from '../../config/database';

const router = Router();

// Get all materials
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.*, c.name as category_name 
      FROM materials m
      LEFT JOIN categories c ON m.category = c.name
      WHERE m.deleted_at IS NULL
      ORDER BY m.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

// Get material stats
router.get('/stats', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(quantity * cost), 0) as totalValue,
        COALESCE(SUM(quantity), 0) as totalQuantity,
        COUNT(CASE WHEN quantity <= min_stock THEN 1 END) as lowStockCount,
        COUNT(DISTINCT category) as categoryCount
      FROM materials
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get categories
router.get('/categories', async (_req, res) => {
  try {
    const result = await pool.query('SELECT name FROM categories ORDER BY name');
    res.json(result.rows.map(r => r.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get units
router.get('/units', async (_req, res) => {
  try {
    const result = await pool.query('SELECT name, symbol FROM units ORDER BY name');
    res.json(result.rows.map(r => r.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// Create material
router.post('/', async (req, res) => {
  const { code, name, category, unit, quantity, cost, minStock, note } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO materials (code, name, category, unit, quantity, cost, min_stock, note)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [code, name, category, unit, quantity || 0, cost || 0, minStock || 5, note || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating material:', error);
    res.status(500).json({ error: 'Failed to create material' });
  }
});

// Update material
router.put('/:id', async (req, res) => {
  const { code, name, category, unit, quantity, cost, minStock, note } = req.body;
  try {
    const result = await pool.query(
      `UPDATE materials 
       SET code=$1, name=$2, category=$3, unit=$4, quantity=$5, cost=$6, min_stock=$7, note=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING *`,
      [code, name, category, unit, quantity, cost, minStock, note, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update material' });
  }
});

// Delete material
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM materials WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

export default router;
