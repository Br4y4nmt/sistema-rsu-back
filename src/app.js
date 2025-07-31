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
const certificadoRoutes = require('./routes/certificado.routes'); 
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
console.log('STATIC PATH:', path.join(__dirname, 'uploads'));
// ⚠️ Servir archivos estáticos desde la carpeta 'src/uploads'
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));



// Rutas de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/certificados', certificadoRoutes); 
app.use('/api/evidencias', evidenciaRoutes);
app.use('/api/examen', examenRoutes);

module.exports = app;
