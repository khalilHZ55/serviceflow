import express from 'express';
import cors from 'cors';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://serviceflow-2uvg-ntexdvi7p-khalilhz55s-projects.vercel.app',
  ],
}));
app.use(express.json());

app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;