const express = require('express');
const router = express.Router();
const moduloController = require('../controllers/moduloController');
const validarJWT = require('../middlewares/validarJWT');
const upload = require('../middlewares/upload');

// Crear módulo con archivo PDF
router.post('/', validarJWT, upload.single('archivo'), moduloController.crearModulo);

// Obtener todos los módulos
router.get('/', validarJWT, moduloController.obtenerModulos);

// Actualizar un módulo y permitir subir nuevo archivo PDF
router.put('/:id', validarJWT, upload.single('archivo'), moduloController.actualizarModulo);

// Eliminar un módulo
router.delete('/:id', validarJWT, moduloController.eliminarModulo);

module.exports = router;
