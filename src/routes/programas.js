const express = require('express');
const router = express.Router();
const { obtenerProgramasAcademicos } = require('../controllers/programaController');

// Puedes proteger la ruta si quieres con middleware JWT
router.get('/', obtenerProgramasAcademicos);

module.exports = router;
