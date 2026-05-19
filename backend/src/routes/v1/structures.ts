import { Router } from 'express';
import { pool } from '../../config/database';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*
      FROM structures s
      WHERE s.deleted_at IS NULL
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch structures' });
  }
});

export default router;
