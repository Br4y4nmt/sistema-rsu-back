// index.js
require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/database');

require('./src/models'); 
const PORT = process.env.PORT || 3000;

// Probar conexión y sincronizar modelos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL con Sequelize');

    await sequelize.sync(); // ← esto crea las tablas si no existen
    console.log('✅ Modelos sincronizados');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
})();
