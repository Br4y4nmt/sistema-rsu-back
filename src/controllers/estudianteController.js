// controllers/estudianteController.js

const Estudiantes = require('../models/Estudiantes');
const ProgramasAcademicos = require('../models/ProgramasAcademicos');
const Facultades = require('../models/Facultades');
const Usuario = require('../models/Usuario'); // Asegúrate de tener este modelo

const obtenerNotaEstudianteLogueado = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const usuario = await Usuario.findByPk(id_usuario, {
      include: {
        model: Estudiantes,
        as: 'estudiante',
        attributes: ['nota']
      }
    });

    if (!usuario || !usuario.estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.status(200).json({
      nota: usuario.estudiante.nota
    });

  } catch (error) {
    console.error('❌ Error al obtener la nota del estudiante:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const getEstudiantePorUsuario = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;

   const estudiante = await Estudiantes.findOne({
    where: { id_usuario: idUsuario },
    include: [
        {
        model: ProgramasAcademicos,
        as: 'programa',
        attributes: ['nombre_programa']
        },
        {
        model: Facultades,
        as: 'facultad',
        attributes: ['nombre_facultad']
        },
        {
        model: Usuario,
        as: 'usuario',
        attributes: [] 
        }
    ]
    });
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(estudiante);
  } catch (error) {
    console.error('❌ Error al obtener estudiante por usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


const actualizarCelular = async (req, res) => {
  try {
    const idUsuario = req.usuario.id;
    const { celular } = req.body;

    if (!celular) {
      return res.status(400).json({ message: 'Número de celular es requerido' });
    }

    // Actualizar en tabla estudiantes
    await Estudiantes.update(
      { celular },
      { where: { id_usuario: idUsuario } }
    );

    // Actualizar en tabla usuario
    await Usuario.update(
      { whatsapp: celular },
      { where: { id_usuario: idUsuario } } // ✅ corregido
    );

    res.json({ message: 'Número de celular actualizado correctamente' });

  } catch (error) {
    console.error('❌ Error al actualizar número de celular:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
// Obtener todos los estudiantes con relaciones necesarias
// Obtener todos los estudiantes con relaciones necesarias
const obtenerTodosLosEstudiantes = async (req, res) => {
  try {
    const estudiantes = await Estudiantes.findAll({
      include: [
        {
          model: ProgramasAcademicos,
          as: 'programa',
          attributes: ['nombre_programa']
        },
        {
          model: Facultades,
          as: 'facultad',
          attributes: ['nombre_facultad']
        }
      ]
    });

    // Formatear para el frontend (con facultad incluida)
    const estudiantesFormateados = estudiantes.map(est => ({
      id_estudiante: est.id_estudiante,
      nombre: est.nombre_estudiante,
      dni: est.dni,
      correo: est.email,
      celular: est.celular,
      programa_academico: est.programa?.nombre_programa || '',
      facultad: est.facultad?.nombre_facultad || '',
      fecha_modificacion: est.updatedAt
    }));

    res.json(estudiantesFormateados);
  } catch (error) {
    console.error('❌ Error al obtener todos los estudiantes:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


module.exports = {
  getEstudiantePorUsuario,
  actualizarCelular,
  obtenerTodosLosEstudiantes,
  obtenerNotaEstudianteLogueado
};
