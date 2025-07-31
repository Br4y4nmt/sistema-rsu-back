// controllers/evidenciasController.js
const path = require('path');
const fs = require('fs');
const { Evidencia, Actividad, Usuario, Estudiantes } = require('../models');

const registrarEvidencia = async (req, res) => {
  try {
    const { id_actividad, cantidad_ingresada } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ message: 'Debe subir una imagen como evidencia' });
    }

    // Verificar que la actividad existe
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
      return res.status(404).json({ message: 'Actividad no encontrada' });
    }

    const cantidadNueva = parseInt(cantidad_ingresada.replace(/\D/g, ''));
    const cantidadTotal = parseInt(actividad.cantidad_total.replace(/\D/g, ''));
    const cantidadAnterior = parseInt(actividad.cantidad_ingresada.replace(/\D/g, '') || 0);

    if (isNaN(cantidadNueva) || isNaN(cantidadTotal)) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    const acumulado = cantidadAnterior + cantidadNueva;

    if (acumulado > cantidadTotal) {
      return res.status(400).json({
        message: `La suma total (${acumulado} KILOS) excede la cantidad permitida (${cantidadTotal} KILOS).`
      });
    }

    const evidenciaPath = `evidencias/${archivo.filename}`;

    await Evidencia.create({
      id_actividad,
      cantidad_ingresada,
      evidencia_url: evidenciaPath,
      fecha_entrega: new Date()
    });

    actividad.cantidad_ingresada = `${acumulado} KILOS`;

    // Determinar nuevo estado
    if (acumulado === 0) {
      actividad.estado = 'NO INICIADO';
    } else if (acumulado > 0 && acumulado < cantidadTotal) {
      actividad.estado = 'EN PROCESO';
    } else if (acumulado === cantidadTotal) {
      actividad.estado = 'TERMINADO';

      // Otorgar nota al estudiante (solo si no se hizo antes)
      const estudiante = actividad.usuario?.estudiante;
      if (estudiante) {
        const notaActual = estudiante.nota || 0;

        // Validación para evitar duplicar puntos si ya tiene 10+
        if (notaActual < 20) {
          estudiante.nota = Math.min(notaActual + 10, 20); // límite en 20
          await estudiante.save();
        }
      }
    }

    await actividad.save();

    res.status(201).json({ message: 'Evidencia registrada correctamente' });

  } catch (error) {
    console.error('❌ Error al registrar evidencia:', error);
    res.status(500).json({ message: 'Error del servidor', error });
  }
};


const obtenerEvidenciasPorActividad = async (req, res) => {
  const { id_actividad } = req.params;

  try {
    const evidencias = await Evidencia.findAll({
      where: { id_actividad },
      order: [['fecha_entrega', 'DESC']]
    });

    res.json(evidencias);
  } catch (error) {
    console.error('❌ Error al obtener evidencias:', error);
    res.status(500).json({ message: 'Error al obtener evidencias' });
  }
};

module.exports = {
  registrarEvidencia,
  obtenerEvidenciasPorActividad
};