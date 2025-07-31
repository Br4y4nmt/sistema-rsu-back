const { Actividad, Usuario, Estudiantes, ProgramasAcademicos, Facultades } = require('../models');

// Obtener todas las actividades junto con datos del estudiante
const obtenerActividadesConDatosEstudiante = async (req, res) => {
  try {
    const actividades = await Actividad.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['dni', 'whatsapp'],
          include: [
            {
              model: Estudiantes,
              as: 'estudiante',
              attributes: ['nombre_estudiante', 'codigo', 'email'], // ← incluimos email desde Estudiantes
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
            }
          ]
        }
      ]
    });

   const formateado = actividades.map((act) => ({
  id_actividad: act.id_actividad,
  tipo: act.tipo || null,
  cantidad_total: act.cantidad_total,
  cantidad_ingresada: act.cantidad_ingresada,
  nombre: act.usuario?.estudiante?.nombre_estudiante || '',
  dni: act.usuario?.dni || '',
  correo: act.usuario?.estudiante?.email || '',
  celular: act.usuario?.whatsapp || '',
  programa_academico: act.usuario?.estudiante?.programa?.nombre_programa || '',
  facultad: act.usuario?.estudiante?.facultad?.nombre_facultad || '',
  fecha_modificacion: act.fecha_modificacion || '',
  estado: act.estado || '' // ✅ NUEVO CAMPO
}));

    res.json(formateado);
  } catch (error) {
    console.error('❌ Error al obtener actividades con datos del estudiante:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const actualizarCantidadTotal = async (req, res) => {
  const { id_actividad } = req.params;
  const { cantidad_total } = req.body;

  const cantidadesValidas = ['5 KILOS', '10 KILOS', '15 KILOS', '20 KILOS'];

  if (!cantidadesValidas.includes(cantidad_total)) {
    return res.status(400).json({ message: 'Cantidad total no válida.' });
  }

  try {
    const actividad = await Actividad.findByPk(id_actividad);
    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    actividad.cantidad_total = cantidad_total;
    await actividad.save();

    res.json({ message: 'Cantidad total actualizada correctamente.', actividad });
  } catch (error) {
    console.error('❌ Error al actualizar cantidad_total:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar.' });
  }
};

const actualizarTipoResiduo = async (req, res) => {
  const id_usuario = req.usuario.id; // 👈 desde el token
  const { tipo } = req.body;

  const tiposValidos = ['RESIDUOS ORGÁNICOS', 'RESIDUOS INORGÁNICOS'];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({ message: 'Tipo de residuo no válido.' });
  }

  try {
    const actividad = await Actividad.findOne({ where: { id_usuario } });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada para este usuario.' });
    }

    actividad.tipo = tipo;
    await actividad.save();

    res.json({ message: 'Tipo de residuo actualizado correctamente.', actividad });
  } catch (error) {
    console.error('❌ Error al actualizar el tipo de residuo:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el tipo.' });
  }
};
const obtenerActividad = async (req, res) => {
  const id_usuario = req.usuario.id; // viene desde el token JWT

  try {
    const actividad = await Actividad.findOne({ where: { id_usuario } });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada para este usuario.' });
    }

    res.status(200).json({
      id: actividad.id,
      tipo: actividad.tipo, // importante para decidir el case
      descripcion: actividad.descripcion, // opcional si ya estás planeando case 2
      evidencia: actividad.evidencia,     // opcional
      estado: actividad.estado            // opcional
    });
  } catch (error) {
    console.error('❌ Error al obtener actividad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};
const obtenerDetallesActividad = async (req, res) => {
  const id_usuario = req.usuario.id; // Extraído del token

  try {
    const actividad = await Actividad.findOne({ where: { id_usuario } });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada para este usuario.' });
    }

    res.status(200).json({
      tipo: actividad.tipo,
      cantidad_total: actividad.cantidad_total,
      cantidad_ingresada: actividad.cantidad_ingresada,
      fecha_ingreso: actividad.fecha_ingreso,
      fecha_modificacion: actividad.fecha_modificacion,
      estado: actividad.estado
    });
  } catch (error) {
    console.error('❌ Error al obtener detalles de la actividad:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};

const actualizarEstadoActividad = async (req, res) => {
  const { id_actividad } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['NO INICIADO', 'TERMINADO'];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ message: 'Estado no válido.' });
  }

  try {
    const actividad = await Actividad.findByPk(id_actividad, {
      include: {
        model: Usuario,
        as: 'usuario',
        include: {
          model: Estudiantes,
          as: 'estudiante'
        }
      }
    });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    actividad.estado = estado;
    await actividad.save();

    // Si el estado es TERMINADO, otorgar puntos
    if (estado === 'TERMINADO' && actividad.usuario?.estudiante) {
      const estudiante = actividad.usuario.estudiante;
      const puntosActuales = estudiante.nota || 0;
      estudiante.nota = puntosActuales + 10;
      await estudiante.save();
    }

    res.json({ message: 'Estado actualizado correctamente.', actividad });
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    res.status(500).json({ message: 'Error del servidor al actualizar el estado.' });
  }
};


module.exports = {
  obtenerActividadesConDatosEstudiante,
  actualizarCantidadTotal,
  actualizarTipoResiduo,
  obtenerActividad,
  obtenerDetallesActividad,
  actualizarEstadoActividad
};
