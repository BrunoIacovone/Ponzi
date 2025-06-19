import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/transfer', async (req, res) => {
  const { emailWallet, amount } = req.body;

  if (!emailWallet || typeof amount !== 'number') {
    return res.status(400).json({ success: false, message: 'Parámetros inválidos' });
  }

  if (amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  try {
    const response = await axios.post('http://localhost:3000/api/bank', {
      bankEmail: emailWallet,
      amount,
    });

    return res.status(200).json({
      success: true,
      message: 'Transferencia realizada correctamente',
      backendResponse: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message || 'Error en la transferencia',
    });
  }
});

export default router;
