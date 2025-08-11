const express = require('express');
const cors = require('cors');
const path = require('path');

const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const modulosRoutes = require('./routes/modulos');
const estudiantesRoutes = require('./routes/estudiantes');
const actividadesRoutes = require('./routes/actividad.routes');
const evidenciaRoutes = require('./routes/evidencias.routes');
const examenRoutes = require('./routes/examenRoutes');
const programasRoutes = require('./routes/programas');
const certificadoRoutes = require('./routes/certificado.routes');

const app = express();

/* ===================== CORS ===================== */
const ORIGINS_PERMITIDOS = [
  'https://rsu.sistemasudh.com', // Frontend prod
  // 'http://localhost:5173',     // (opcional) dev local
];

const corsOptions = {
  origin: ORIGINS_PERMITIDOS,
  credentials: true, // si usas cookies/sesiones
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
// Responder preflight para cualquier ruta
app.options('*', cors(corsOptions));
/* ================================================= */

app.use(express.json());

console.log('STATIC PATH:', path.join(__dirname, '..', 'uploads'));
// Servir archivos estáticos desde /uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

/* ===================== Rutas API ===================== */
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/evidencias', evidenciaRoutes);
app.use('/api/examen', examenRoutes);
app.use('/api/programas', programasRoutes);
/* ===================================================== */

module.exports = app;
