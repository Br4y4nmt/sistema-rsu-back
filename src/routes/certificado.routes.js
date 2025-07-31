const express = require('express');
const router = express.Router();
const validarJWT = require('../middlewares/validarJWT');
const upload = require('../middlewares/uploadCertificado');
const certificadoController = require('../controllers/certificadoController');

router.post('/subir', validarJWT, upload.single('certificado'), certificadoController.subirCertificado);

router.get('/mis-certificados', validarJWT, certificadoController.obtenerMisCertificados);

module.exports = router;
