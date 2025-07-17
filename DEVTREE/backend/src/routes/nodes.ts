import { Router, Response } from 'express';
import Node from '../models/Node';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import Tree from '../models/Tree';

const router = Router();
// Crear nodo (protegido)
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, type, parent, tags, tree } = req.body;

    if (!tree) {
      return res.status(400).json({ message: 'Falta el campo tree' });
    }

    const newNode = new Node({
      title,
      description,
      type,
      parent,
      tags,
      tree,
      createdBy: req.user._id,
    });

    await newNode.save();

    // ✅ Este bloque debe ir DENTRO del try, justo después del save
    await Tree.findByIdAndUpdate(tree, {
      $push: { nodes: newNode._id },
    });

    res.status(201).json(newNode);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear nodo', error: err });
  }
});
// Obtener todos los nodos (pública)
router.get('/', async (_req, res: Response) => {
  try {
    const nodes = await Node.find();
    res.json(nodes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener nodos', error: err });
  }
});
// Obtener un nodo por ID (pública)
router.get('/:id', async (req, res: Response) => {
  try {
    const node = await Node.findById(req.params.id)
      .populate('tree')
      .populate('createdBy');

    if (!node) return res.status(404).json({ message: 'Nodo no encontrado' });
    res.json(node);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener nodo', error: err });
  }
});
// Eliminar nodo (protegido)
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const node = await Node.findById(req.params.id);
    if (!node) return res.status(404).json({ message: 'Nodo no encontrado' });
    // Solo el creador o admin puede eliminar
    if (node.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este nodo' });
    }
    await node.deleteOne();
    res.json({ message: 'Nodo eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar nodo', error: err });
  }
});
// Obtener todos los nodos de un árbol específico (protegido)
router.get('/tree/:treeId', protect, async (req: AuthRequest, res: Response) => {
  try {
    const nodes = await Node.find({
      tree: req.params.treeId,
      createdBy: req.user._id,
    }).sort({ createdAt: 1 }) // o por parent si usas jerarquía
    res.json(nodes)
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener nodos del árbol', error: err })
  }
})
// Editar nodo (protegido)
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const node = await Node.findById(req.params.id)
    if (!node) return res.status(404).json({ message: 'Nodo no encontrado' })

    if (node.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este nodo' })
    }

    node.title = req.body.title
    node.description = req.body.description
    node.type = req.body.type
    node.tags = req.body.tags

    await node.save()

    res.json(node)
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el nodo', error: err })
  }
})


export default router;