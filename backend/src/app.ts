import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';
import authRoutes from './routes/auth';
import { requireAuth } from './middleware/auth';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://serviceflow-2uvg-j2ut9cdd9-khalilhz55s-projects.vercel.app',
  ],
}));
app.use(express.json());

// Ruta pública — no necesita token
app.use('/api/auth', authRoutes);

// Rutas protegidas — requireAuth verifica el token antes de pasar al controller
app.use('/api/services',     requireAuth, serviceRoutes);
app.use('/api/appointments', requireAuth, appointmentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;