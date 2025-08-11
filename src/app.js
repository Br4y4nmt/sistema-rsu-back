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
const certificadoRoutes = require('./routes/certificado.routes'); // 👈 asegúrate del nombre exacto del archivo


const app = express();

/* --- Básicos --- */
app.set('trust proxy', 1);                  // estás detrás de Nginx
app.use(express.json({ limit: '2mb' }));

/* --- CORS ---
   - En prod, como ya lo maneja Nginx, NO envíes cabeceras CORS.
   - En dev, permite localhost.
*/
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: [/^http:\/\/localhost(:\d+)?$/],
    credentials: true,
    methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Authorization','Content-Type','X-Requested-With'],
  }));
}

/* --- Static uploads por /api/uploads (para que pase por el proxy) --- */
const uploadsPath = path.join(__dirname, '..', 'uploads'); // si app.js está en /src
console.log('STATIC PATH:', uploadsPath);
// ahora la URL pública será https://rsuback.sistemasudh.com/api/uploads/...
app.use('/api/uploads', express.static(uploadsPath));

/* --- Healthcheck --- */
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

/* --- Rutas de API --- */
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/evidencias', evidenciaRoutes);
app.use('/api/examen', examenRoutes);
app.use('/api/programas', programasRoutes);

/* --- 404 API --- */
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not Found' }));

module.exports = app;
