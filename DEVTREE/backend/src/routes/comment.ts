import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCommentValidator } from '../validators/commentValidator';
import Comment from '../models/Comment';
import Node from '../models/Node';

const router = Router();

// Crear comentario con validación
router.post(
  '/:nodeId',
  protect,
  createCommentValidator,
  validateRequest,
  async (req: AuthRequest, res: Response) => {
    try {
      const { nodeId } = req.params;
      const { text } = req.body;

      const node = await Node.findById(nodeId);
      if (!node) return res.status(404).json({ message: 'Nodo no encontrado' });

      const comment = await Comment.create({
        text,
        author: req.user._id,
        node: node._id,
      });

      res.status(201).json(comment);
    } catch (err) {
      res.status(500).json({ message: 'Error al crear comentario', error: err });
    }
  }
);

export default router;