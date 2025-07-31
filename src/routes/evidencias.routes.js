// routes/evidencias.routes.js

const express = require('express');
const path = require('path');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const validarJWT = require('../middlewares/validarJWT');
const { registrarEvidencia, obtenerEvidenciasPorActividad  } = require('../controllers/evidenciasController');



router.post('/', validarJWT, upload.single('evidencia'), registrarEvidencia);
router.get('/actividad/:id_actividad', obtenerEvidenciasPorActividad);

module.exports = router;
