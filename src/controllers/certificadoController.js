const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { Certificado } = require('../models');

// Subir un nuevo certificado
exports.subirCertificado = async (req, res) => {
  const id_usuario = req.usuario.id;

  if (!req.file) {
    return res.status(400).json({ error: 'Debe subir un archivo PDF como certificado' });
  }

  try {
    // Ya está en uploads/certificados gracias a multer
    const nombreArchivo = req.file.filename; // 👈 usa el que multer ya generó

    // Guardar en la base de datos
    const url_certificado = `uploads/certificados/${nombreArchivo}`;
    const nuevoCertificado = await Certificado.create({
      id_usuario,
      url_certificado,
      fecha_generacion: new Date()
    });

    res.status(201).json({
      mensaje: 'Certificado subido correctamente',
      certificado: nuevoCertificado
    });
  } catch (error) {
    console.error('❌ Error al subir certificado:', error);
    res.status(500).json({ error: 'Error al subir el certificado' });
  }
};

// (Opcional) Obtener certificados por usuario
exports.obtenerMisCertificados = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const certificados = await Certificado.findAll({
      where: { id_usuario },
      order: [['fecha_generacion', 'DESC']]
    });

    res.status(200).json(certificados);
  } catch (error) {
    console.error('❌ Error al obtener certificados:', error);
    res.status(500).json({ error: 'Error al obtener certificados' });
  }
};
exports.obtenerMisCertificados = async (req, res) => {
  const id_usuario = req.usuario.id;

  try {
    const certificados = await Certificado.findAll({
      where: { id_usuario },
      order: [['fecha_generacion', 'DESC']],
      limit: 1 // solo el más reciente
    });

    res.status(200).json(certificados);
  } catch (error) {
    console.error('❌ Error al obtener certificados:', error);
    res.status(500).json({ error: 'Error al obtener certificados' });
  }
};
