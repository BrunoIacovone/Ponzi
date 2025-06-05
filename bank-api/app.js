import express from 'express';
import debinRoutes from './routes/debin.js';
import homebankingRoutes from './routes/homeBanking.js';

const app = express();
const PORT = 3005;

app.use(express.json());

app.use('/debin', debinRoutes);
app.use('/homebanking', homebankingRoutes);

app.listen(PORT, () => {
  console.log(`Simulador de banco escuchando en http://localhost:${PORT}`);
});
