import { Router } from 'express';
import { pool } from '../../config/database';

const router = Router();

router.get('/', async (req, res) => {
  const { limit = 100 } = req.query;
  
  try {
    const result = await pool.query(`
      SELECT t.*,
        m.name as material_name
      FROM transactions t
      LEFT JOIN materials m ON t.material_id = m.id
      ORDER BY t.transaction_date DESC
      LIMIT $1
    `, [limit]);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
