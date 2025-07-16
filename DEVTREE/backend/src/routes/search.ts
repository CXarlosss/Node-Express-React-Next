// src/routes/search.ts
import { Router, Request, Response } from 'express';
import Tree from '../models/Tree';
import Node from '../models/Node';

const router = Router();

// Buscar árboles y nodos públicos por término
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q?.toString().trim();
    if (!query) {
      return res.status(400).json({ message: 'Se requiere un término de búsqueda (q)' });
    }

    const regex = new RegExp(query, 'i'); // búsqueda insensible a mayúsculas

    // Buscar árboles públicos por nombre o descripción
    const trees = await Tree.find({
      isPublic: true,
      $or: [{ name: regex }, { description: regex }],
    }).select('_id name description'); // opcional: selecciona solo los campos necesarios

    // Buscar nodos por título o descripción
    const nodes = await Node.find({
      $or: [{ title: regex }, { description: regex }],
    }).select('_id title description');

    // Normaliza los resultados (puedes incluir el tipo si quieres mostrarlo en frontend)
    const results = [
      ...trees.map(t => ({
        _id: t._id,
        title: t.name,
        description: t.description,
        type: 'tree',
      })),
      ...nodes.map(n => ({
        _id: n._id,
        title: n.title,
        description: n.description,
        type: 'node',
      })),
    ];

    res.json(results);
  } catch (err) {
    console.error('Error en /api/search:', err);
    res.status(500).json({ message: 'Error en la búsqueda', error: err });
  }
});
// ⚠️ Solo para pruebas, luego elimínalo
router.post('/mock-data', async (_req, res) => {
  try {
    const ownerId = '6875251dc2121e43306cc73f'; // reemplaza por tu ID real

    const mockTrees = [
      {
        name: 'Guía de React Hooks',
        description: 'Ejemplos y explicaciones de los hooks más comunes en React.',
        nodes: [],
        isPublic: true,
        owner: ownerId
      },
      {
        name: 'React y TypeScript',
        description: 'Aprende a usar React con tipado fuerte y mejores prácticas.',
        nodes: [],
        isPublic: true,
        owner: ownerId
      },
      {
        name: 'Fundamentos de UX',
        description: 'Diseña experiencias de usuario que enamoran.',
        nodes: [],
        isPublic: true,
        owner: ownerId
      }
    ];

    await Tree.insertMany(mockTrees);
    res.status(201).json({ message: 'Datos insertados correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al insertar datos', error: err });
  }
});

export default router;
