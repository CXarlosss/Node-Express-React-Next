import { Router, Response } from 'express';
import Tree from '../models/Tree';
import { protect, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

// Crear árbol personalizado
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, nodes, isPublic } = req.body;
    const newTree = new Tree({
      name,
      description,
      nodes,
      isPublic,
      owner: req.user._id,
    });
    await newTree.save();
    res.status(201).json(newTree);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear árbol', error: err });
  }
});

// Obtener árboles propios
router.get('/mine', protect, async (req: AuthRequest, res: Response) => {
  try {
    const trees = await Tree.find({ owner: req.user._id });
    res.json(trees);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener árboles', error: err });
  }
});
// Actualizar árbol (solo dueño)
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const tree = await Tree.findById(req.params.id)
    if (!tree) return res.status(404).json({ message: 'Árbol no encontrado' })

    if (tree.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' })
    }

    tree.name = req.body.name
    tree.description = req.body.description
    tree.isPublic = req.body.isPublic
    await tree.save()

    res.json(tree)
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar árbol', error: err })
  }
})
// Obtener árbol privado solo si es dueño (para editar)
// Obtener árbol privado solo si es dueño (para editar o gestionar nodos)
router.get('/:id/private', protect, async (req: AuthRequest, res: Response) => {
  try {
    const tree = await Tree.findById(req.params.id).populate('nodes');
    if (!tree) return res.status(404).json({ message: 'Árbol no encontrado' });

    if (tree.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para ver este árbol' });
    }

    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener el árbol', error: err });
  }
});

// Obtener árbol público por ID
router.get('/:id', async (req, res: Response) => {
  try {
    const tree = await Tree.findById(req.params.id).populate('nodes');
    if (!tree) return res.status(404).json({ message: 'Árbol no encontrado' });
    if (!tree.isPublic) return res.status(403).json({ message: 'Este árbol es privado' });
    res.json(tree);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener árbol', error: err });
  }
});

// Eliminar árbol (solo dueño)
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Árbol no encontrado' });
    if (tree.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este árbol' });
    }
    await tree.deleteOne();
    res.json({ message: 'Árbol eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar árbol', error: err });
  }
});

export default router;