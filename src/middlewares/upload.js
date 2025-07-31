const path = require('path');
const fs = require('fs');
const multer = require('multer');

const dynamicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Definir carpeta según la ruta
    let folder = 'evidencias'; // default

    if (req.baseUrl.includes('modulos')) {
      folder = 'modulos';
    }

    const dir = path.join(process.cwd(), 'uploads', folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage: dynamicStorage });

module.exports = upload;
