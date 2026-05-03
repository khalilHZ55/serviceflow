import express from 'express';
import cors from 'cors';
import serviceRoutes from './routes/services';
import appointmentRoutes from './routes/appointments';

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globales ──────────────────────────────────────────────────
// Un middleware es código que se ejecuta en TODAS las peticiones, antes del controller

app.use(cors()); // permite peticiones desde el frontend (diferente puerto)
app.use(express.json()); // permite leer el body de las peticiones como JSON

// ─── Rutas ────────────────────────────────────────────────────────────────
app.use('/api/services',      serviceRoutes);
app.use('/api/appointments',  appointmentRoutes);

// ─── Ruta de salud ────────────────────────────────────────────────────────
// Útil para verificar que el servidor está vivo (Railway/Render la usa)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Arrancar ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});