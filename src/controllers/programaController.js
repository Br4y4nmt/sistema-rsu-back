const { ProgramasAcademicos } = require('../models');

const obtenerProgramasAcademicos = async (req, res) => {
  try {
    const programas = await ProgramasAcademicos.findAll({
      attributes: ['id_programa', 'nombre_programa'],
      order: [['nombre_programa', 'ASC']],
    });

    res.status(200).json(programas);
  } catch (error) {
    console.error('❌ Error al obtener programas académicos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  obtenerProgramasAcademicos,
};
