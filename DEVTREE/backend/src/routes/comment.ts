import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { createCommentValidator } from '../validators/commentValidator';
import Comment from '../models/Comment';
import Node from '../models/Node';
import Tree from '../models/Tree';

const router = Router();

// 👉 Crear comentario
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

      const tree = await Tree.findById(node.tree);
      if (!tree || !tree.isPublic) {
        return res.status(403).json({ message: 'No se puede comentar en este nodo' });
      }

      const comment = await Comment.create({
        text,
        author: req.user._id,
        node: node._id,
      });

      const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'name');

      res.status(201).json(populatedComment);
    } catch (err) {
      res.status(500).json({ message: 'Error al crear comentario', error: err });
    }
  }
);

// 👉 Obtener comentarios de un nodo
router.get('/:nodeId/comments', async (req, res: Response) => {
  try {
    const comments = await Comment.find({ node: req.params.nodeId })
      .sort({ createdAt: -1 })
      .populate('author', 'name');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener comentarios', error: err });
  }
});

export default router;
