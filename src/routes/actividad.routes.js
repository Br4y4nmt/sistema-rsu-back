const express = require('express');
const router = express.Router();

const { obtenerActividadesConDatosEstudiante, actualizarEstadoActividad, obtenerDetallesActividad, obtenerActividad, actualizarTipoResiduo, actualizarCantidadTotal } = require('../controllers/actividadesController');
const validarJWT = require('../middlewares/validarJWT');

// Ruta protegida: obtener todas las actividades con datos de estudiante
router.get('/', validarJWT, obtenerActividadesConDatosEstudiante);

router.put('/cantidad/:id_actividad', validarJWT, actualizarCantidadTotal);

router.put('/actividad/tipo', validarJWT, actualizarTipoResiduo);

router.get('/actividad', validarJWT, obtenerActividad);

router.get('/actividad/detalles', validarJWT, obtenerDetallesActividad);

router.put('/estado/:id_actividad', actualizarEstadoActividad);

module.exports = router;
