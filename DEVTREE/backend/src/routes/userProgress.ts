import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import User from '../models/User';

const router = Router();

router.post('/favorites/:nodeId', protect, async (req: AuthRequest, res: Response) => {
  const { nodeId } = req.params;
  const user = req.user;

  if (!user.favorites.includes(nodeId)) {
    user.favorites.push(nodeId);
    await user.save();
  }

  res.json({ message: 'Nodo añadido a favoritos', favorites: user.favorites });
});

router.post('/completed/:nodeId', protect, async (req: AuthRequest, res: Response) => {
  const { nodeId } = req.params;
  const user = req.user;

  if (!user.completed.includes(nodeId)) {
    user.completed.push(nodeId);
    await user.save();
  }

  res.json({ message: 'Nodo marcado como completado', completed: user.completed });
});

router.get('/favorites', protect, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user?.favorites || []);
});

router.get('/completed', protect, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user._id).populate('completed');
  res.json(user?.completed || []);
});

export default router;