import { Router } from 'express';
import nodeRoutes from './nodes';
import authRoutes from './auth';

const router = Router();

router.get('/', (_req, res) => {
  res.send('¡Backend DEVTREE funcionando!');
});

router.use('/api/auth', authRoutes);
router.use('/api/nodes', nodeRoutes);

export default router;
