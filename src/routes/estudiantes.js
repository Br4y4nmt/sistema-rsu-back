const express = require('express');
const router = express.Router();
const { getEstudiantePorUsuario,obtenerNotaEstudianteLogueado, actualizarCelular, obtenerTodosLosEstudiantes} = require('../controllers/estudianteController');
const validarJWT = require('../middlewares/validarJWT');

// GET /api/estudiantes/perfil
router.get('/perfil', validarJWT, getEstudiantePorUsuario);
router.put('/actualizar-celular', validarJWT, actualizarCelular);
router.get('/', validarJWT, obtenerTodosLosEstudiantes);
router.get('/mi-nota', validarJWT, obtenerNotaEstudianteLogueado);
module.exports = router;
