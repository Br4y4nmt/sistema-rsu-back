const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ruta absoluta correcta a uploads/certificados (fuera de src)
const certificadosDir = path.resolve(__dirname, '..', '..', 'uploads', 'certificados');

// Verificar si la carpeta existe, si no, crearla
if (!fs.existsSync(certificadosDir)) {
  fs.mkdirSync(certificadosDir, { recursive: true });
}

// Configurar el almacenamiento con multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certificadosDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${sanitizedOriginalName}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
