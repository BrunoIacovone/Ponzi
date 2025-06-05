import { Router } from 'express';
import { transfer } from '../service/debinService.js';

const router = Router();

router.post('/transfer', (req, res) => {
  const { email, amount } = req.body;

  if (!email || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Invalid parameters' });
  }

  const result = transfer(email, amount);

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(200).json(result);
});

export default router;
