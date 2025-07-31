const express = require('express');
const router = express.Router();
const { googleLogin } = require('../controllers/auth.controller');
const validarJWT = require('../middlewares/validarJWT');
const { obtenerUsuarioAutenticado } = require('../controllers/auth.controller');

router.post('/google', googleLogin);
router.get('/me', validarJWT, obtenerUsuarioAutenticado);

module.exports = router;
