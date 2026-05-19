import { Router } from 'express';
import materialRoutes from './materials';
import projectRoutes from './projects';
import structureRoutes from './structures';
import supplierRoutes from './suppliers';
import yardRoutes from './yard';
import dashboardRoutes from './dashboard';
import settingsRoutes from './settings';

const router = Router();

router.use('/materials', materialRoutes);
router.use('/projects', projectRoutes);
router.use('/structures', structureRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/yard', yardRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/settings', settingsRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
