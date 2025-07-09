import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('¡Backend DEVTREE funcionando!');
});

export default router;
