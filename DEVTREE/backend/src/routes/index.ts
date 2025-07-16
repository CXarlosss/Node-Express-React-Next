import { Router } from 'express';
import nodeRoutes from './nodes';
import authRoutes from './auth';
import treeRoutes from './trees';
import userProgressRoutes from './userProgress';
import commentRoutes from './comment';
import badgeRoutes from './badge';
import searchRoutes from './search';

const router = Router();

router.get('/', (_req, res) => {
  res.send('¡Backend DEVTREE funcionando!');
});

router.use('/api/auth', authRoutes);
router.use('/api/nodes', nodeRoutes);
router.use('/api/trees', treeRoutes);
router.use('/api/progress', userProgressRoutes);
router.use('/api/comments', commentRoutes);
router.use('/api/badges', badgeRoutes);
router.use('/api/search', searchRoutes);
export default router;
