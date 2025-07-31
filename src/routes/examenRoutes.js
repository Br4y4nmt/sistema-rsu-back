const express = require('express');
const router = express.Router();
const { crearPregunta, verificarSiYaRindioExamen, corregirExamen, obtenerPreguntasConAlternativas, listarPreguntas,verificarAccesoExamen, editarPregunta, eliminarPregunta } = require('../controllers/examenController');
const validarJWT = require('../middlewares/validarJWT');

router.post('/preguntas',validarJWT, crearPregunta);
router.get('/preguntas',validarJWT, listarPreguntas);
router.put('/preguntas/:id', editarPregunta);
router.delete('/preguntas/:id', eliminarPregunta);
router.get('/verificar-acceso', validarJWT, verificarAccesoExamen);
router.get('/examen/preguntas',validarJWT, obtenerPreguntasConAlternativas);
router.post('/corregir', validarJWT, corregirExamen);
router.get('/examen/verificar-respondido', validarJWT, verificarSiYaRindioExamen);
module.exports = router;
