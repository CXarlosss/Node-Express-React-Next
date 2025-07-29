// routes/categorias.ts
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json([
    { id: 1, nombre: 'JavaScript' },
    { id: 2, nombre: 'React' },
    { id: 3, nombre: 'Node.js' },
  ]);
});

export default router;
