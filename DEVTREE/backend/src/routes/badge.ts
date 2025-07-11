// src/routes/badges.ts
import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send('Rutas de badges funcionando ✅');
});

export default router;
