import { Router, Response } from 'express';
import Tree from '../models/Tree';
import { protect, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();

// Crear árbol personalizado
router.post('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, nodes, isPublic, tags } = req.body; // ⬅️ Añadido tags

    const newTree = new Tree({
      name,
      description,
      nodes,
      isPublic,
      tags, // ⬅️ Incluye tags aquí
      owner: req.user._id,
    });

    await newTree.save();
    res.status(201).json(newTree);
  } catch (err) {
    res.status(400).json({ message: 'Error al crear árbol', error: err });
  }
});

router.get('/trending', async (_req, res: Response) => {
  try {
    const trendingTrees = await Tree.find({ isPublic: true })
      .sort({ updatedAt: -1 })
      .limit(9)
      .select('_id name description updatedAt');

    res.json(trendingTrees);
  } catch (err) {
    console.error('🔥 Error al obtener árboles en tendencia:', err);
    res.status(500).json({
      message: 'Error al obtener árboles en tendencia',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
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
// Obtener árboles públicos por categoría (usando tags, name o description)
router.get('/category/:category', async (req, res: Response) => {
  try {
    const category = req.params.category;
    const regex = new RegExp(category, 'i'); // Búsqueda insensible a mayúsculas

    const trees = await Tree.find({
      isPublic: true,
      $or: [
        { tags: { $in: [regex] } },   // ✅ búsqueda correcta en arrays
        { name: regex },
        { description: regex },
      ]
    }).select('_id name description tags');

    res.json(trees);
  } catch (err) {
    console.error('Error al buscar árboles por categoría:', err);
    res.status(500).json({ message: 'Error al buscar árboles por categoría', error: err });
  }
});

// Obtener todas las categorías únicas (tags)
router.get('/tags/all', async (_req, res) => {
  try {
    const tags = await Tree.distinct('tags', { isPublic: true });
    res.json(tags.filter(Boolean)); // elimina null/undefined
  } catch (err) {
    console.error('Error al obtener tags:', err);
    res.status(500).json({ message: 'Error al obtener categorías', error: err });
  }
});

// Obtener TODOS los árboles públicos (NUEVA RUTA Y POSICIÓN IMPORTANTE)
router.get('/public', async (_req, res: Response) => { // No necesita 'protect' si es público
  try {
    const publicTrees = await Tree.find({ isPublic: true }).select('_id name description');
    res.json(publicTrees);
  } catch (err) {
    console.error('Error al obtener árboles públicos:', err);
    res.status(500).json({ message: 'Error al obtener árboles públicos', error: err });
  }
});

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

// Obtener árbol público por ID (esta ruta ahora se ejecutará DESPUÉS de /public)
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

// Actualizar árbol (solo dueño)
// Actualizar árbol (solo dueño) - CORRECTED
router.put('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const tree = await Tree.findById(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Árbol no encontrado' });

    if (tree.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    tree.name = req.body.name;
    tree.description = req.body.description;
    tree.isPublic = req.body.isPublic;
    tree.tags = req.body.tags; // ✅ FIX: Add this line to update the tags array

    await tree.save(); // Save the updated tree document

    res.json(tree); // Respond with the updated tree
  } catch (err) {
    // Improved error response for clarity
    console.error('Error al actualizar árbol:', err);
    res.status(500).json({ message: 'Error al actualizar árbol', error: err instanceof Error ? err.message : 'Unknown error' });
  }
});



// ... (rest of your existing routes and export default router)
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