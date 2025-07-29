// src/routes/categorias.ts
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json([
    { id: 1, nombre: 'Frontend' },
    { id: 2, nombre: 'Backend' },
    { id: 3, nombre: 'Fullstack' }
  ]);
});

export default router;
