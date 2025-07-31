const sequelize = require('../config/database');
const { Pregunta, Alternativa, Actividad, Resultado, Estudiantes, Usuario } = require('../models');

const crearPregunta = async (req, res) => {
  try {
    const { titulo, alternativas } = req.body;

    if (!titulo || !alternativas || !Array.isArray(alternativas) || alternativas.length === 0) {
      return res.status(400).json({ message: 'Debe proporcionar el título y al menos una alternativa' });
    }

    const nuevaPregunta = await Pregunta.create({ titulo });

    const alternativasFormateadas = alternativas.map((alt) => ({
      texto: alt.texto,
      es_correcta: alt.es_correcta,
      id_pregunta: nuevaPregunta.id_pregunta
    }));

    await Alternativa.bulkCreate(alternativasFormateadas);

    return res.status(201).json({ message: 'Pregunta y alternativas creadas correctamente' });
  } catch (error) {
    console.error('❌ Error al crear pregunta:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};

const listarPreguntas = async (req, res) => {
  try {
    const preguntas = await Pregunta.findAll({
      include: [{
        model: Alternativa,
        as: 'alternativas'
      }]
    });

    res.json(preguntas);
  } catch (error) {
    console.error('❌ Error al listar preguntas:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};
const eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;

    // Primero elimina las alternativas asociadas
    await Alternativa.destroy({ where: { id_pregunta: id } });

    // Luego elimina la pregunta
    const resultado = await Pregunta.destroy({ where: { id_pregunta: id } });

    if (resultado === 0) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    res.json({ message: 'Pregunta eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar pregunta:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};
const editarPregunta = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, alternativas } = req.body;

    const pregunta = await Pregunta.findByPk(id);
    if (!pregunta) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    // Actualizar título
    await pregunta.update({ titulo });

    // Eliminar las alternativas antiguas
    await Alternativa.destroy({ where: { id_pregunta: id } });

    // Insertar nuevas alternativas
    const nuevasAlternativas = alternativas.map((alt) => ({
      texto: alt.texto,
      es_correcta: alt.es_correcta,
      id_pregunta: id
    }));
    await Alternativa.bulkCreate(nuevasAlternativas);

    res.json({ message: 'Pregunta actualizada correctamente' });
  } catch (error) {
    console.error('❌ Error al editar pregunta:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};
const verificarAccesoExamen = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const actividad = await Actividad.findOne({ where: { id_usuario } });

    if (!actividad || actividad.estado !== 'TERMINADO') {
      return res.status(403).json({ message: 'Acceso denegado al examen' });
    }

    res.status(200).json({ message: 'Acceso autorizado al examen' });
  } catch (error) {
    console.error('Error al verificar acceso:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
const obtenerPreguntasConAlternativas = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    // Verificar si el usuario ya tiene un resultado
    let resultado = await Resultado.findOne({ where: { id_usuario } });

    if (!resultado) {
      // Crear nuevo resultado con hora de inicio
      resultado = await Resultado.create({
        id_usuario,
        inicio_examen: new Date()
      });
    }

    let preguntasFinal = [];

    if (resultado.preguntas_asignadas && resultado.preguntas_asignadas.length > 0) {
      // ✅ Ya tiene preguntas asignadas → buscarlas
      const ids = resultado.preguntas_asignadas.map(p => p.id_pregunta);

      preguntasFinal = await Pregunta.findAll({
        where: { id_pregunta: ids },
        include: [{
          model: Alternativa,
          as: 'alternativas',
          attributes: ['id_alternativa', 'texto']
        }]
      });

      // 🧠 Ordenar igual que en la asignación original
      preguntasFinal.sort((a, b) => ids.indexOf(a.id_pregunta) - ids.indexOf(b.id_pregunta));

    } else {
      // 🔁 Primera vez: generar aleatorias
      preguntasFinal = await Pregunta.findAll({
        order: sequelize.random(),
        limit: 10,
        include: [{
          model: Alternativa,
          as: 'alternativas',
          attributes: ['id_alternativa', 'texto']
        }]
      });

      // Guardar solo los IDs asignados
      const preguntasSimplificadas = preguntasFinal.map(p => ({
        id_pregunta: p.id_pregunta
      }));

      resultado.preguntas_asignadas = preguntasSimplificadas;
      await resultado.save();
    }

    return res.status(200).json(preguntasFinal);

  } catch (error) {
    console.error('❌ Error al obtener preguntas:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const corregirExamen = async (req, res) => {
  const id_usuario = req.usuario.id;
  const respuestas = req.body.respuestas;

  try {
    if (!respuestas || typeof respuestas !== 'object') {
      return res.status(400).json({ message: 'Respuestas inválidas' });
    }

    const resultadoExistente = await Resultado.findOne({ where: { id_usuario } });

    if (!resultadoExistente || !resultadoExistente.inicio_examen) {
      return res.status(400).json({ message: 'No se detectó inicio de examen' });
    }

    // ⏱️ Verifica si pasó el tiempo
    const tiempoLimite = 20 * 60 * 1000;
    const ahora = new Date();
    const tiempoTranscurrido = ahora - new Date(resultadoExistente.inicio_examen);

    if (tiempoTranscurrido > tiempoLimite) {
      return res.status(403).json({ message: 'Tiempo límite superado. No puedes enviar el examen.' });
    }

    if (resultadoExistente.puntaje !== null) {
      return res.status(403).json({ message: 'Ya has enviado el examen.' });
    }

    // ✅ Corregir examen
    let puntaje = 0;
    const totalPreguntas = Object.keys(respuestas).length;
    const detalle = [];

    for (const [idPregunta, idAlternativaSeleccionada] of Object.entries(respuestas)) {
      const alternativaCorrecta = await Alternativa.findOne({
        where: {
          id_pregunta: idPregunta,
          es_correcta: true
        }
      });

      const esCorrecta = alternativaCorrecta?.id_alternativa === parseInt(idAlternativaSeleccionada);
      if (esCorrecta) puntaje++;

      detalle.push({
        id_pregunta: parseInt(idPregunta),
        seleccionada: parseInt(idAlternativaSeleccionada),
        correcta: alternativaCorrecta?.id_alternativa,
        esCorrecta
      });
    }

    const porcentaje = parseFloat(((puntaje / totalPreguntas) * 100).toFixed(2));

    // ✅ Guardar en tabla resultados
    resultadoExistente.puntaje = puntaje;
    resultadoExistente.total_preguntas = totalPreguntas;
    resultadoExistente.porcentaje = porcentaje;
    resultadoExistente.detalle = detalle;
    await resultadoExistente.save();

    // ✅ Sumar nota al estudiante en tabla 'estudiantes'
    const usuario = await Usuario.findByPk(id_usuario, {
      include: {
        model: Estudiantes,
        as: 'estudiante'
      }
    });

    if (usuario?.estudiante) {
      const estudiante = usuario.estudiante;

      const notaCalculada = puntaje; // ← usamos directamente el número de respuestas correctas
      const notaActual = estudiante.nota || 0;
      const nuevaNota = Math.min(notaActual + notaCalculada, 20); // máximo 20 puntos acumulados

      estudiante.nota = nuevaNota;
      await estudiante.save();
    }

    return res.status(200).json({
      puntaje,
      total: totalPreguntas,
      porcentaje,
      detalle
    });

  } catch (error) {
    console.error('❌ Error al corregir el examen:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};
const verificarSiYaRindioExamen = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;

    const resultadoExistente = await Resultado.findOne({
      where: { id_usuario },
      attributes: ['id_resultado', 'puntaje', 'total_preguntas', 'porcentaje', 'fecha_realizacion', 'inicio_examen']
    });

    // ⚠️ Verifica si ya fue corregido (es decir, si puntaje NO es null)
    if (resultadoExistente && resultadoExistente.puntaje !== null) {
      return res.status(200).json({
        yaRespondio: true,
        resultado: {
          id: resultadoExistente.id_resultado,
          puntaje: resultadoExistente.puntaje,
          total: resultadoExistente.total_preguntas,
          porcentaje: resultadoExistente.porcentaje,
          fecha: resultadoExistente.fecha_realizacion
        }
      });
    }

    // ✅ Aún no ha respondido el examen (aunque haya iniciado)
    return res.status(200).json({
      yaRespondio: false,
      inicio_examen: resultadoExistente?.inicio_examen || null // ← ESTA ES LA CLAVE
    });

  } catch (error) {
    console.error('❌ Error al verificar intento de examen:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


module.exports = {
  crearPregunta,
  listarPreguntas,
  eliminarPregunta,
  editarPregunta,
  verificarAccesoExamen,
  obtenerPreguntasConAlternativas,
  corregirExamen,
  verificarSiYaRindioExamen
};
