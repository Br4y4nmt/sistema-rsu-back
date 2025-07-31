const fs = require('fs');
const path = require('path');
const Modulos = require('../models/Modulos');

// Crear un nuevo módulo
exports.crearModulo = async (req, res) => {
  try {
    const { nombre, estado } = req.body;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ error: 'Se requiere un archivo PDF' });
    }
        const nuevoModulo = await Modulos.create({
        nombre,
        archivo: `modulos/${archivo.filename}`, 
        estado: estado || 'Activo',
        });

    res.status(201).json({ mensaje: 'Módulo creado correctamente', modulo: nuevoModulo });
  } catch (error) {
    console.error('Error al crear módulo:', error);
    res.status(500).json({ error: 'Error al crear módulo' });
  }
};

// Obtener todos los módulos
exports.obtenerModulos = async (req, res) => {
  try {
    const modulos = await Modulos.findAll();
    res.status(200).json(modulos);
  } catch (error) {
    console.error('Error al obtener módulos:', error);
    res.status(500).json({ error: 'Error al obtener módulos' });
  }
};


// Actualizar un módulo por ID
exports.actualizarModulo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    const modulo = await Modulos.findByPk(id);
    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // 🔒 No permitir actualización de archivo
    // Si deseas hacer control explícito:
    if (req.file) {
      return res.status(400).json({ error: 'No se permite actualizar el archivo PDF' });
    }

    // ✅ Solo actualiza nombre y estado
    modulo.nombre = nombre || modulo.nombre;
    modulo.estado = estado || modulo.estado;

    await modulo.save();

    res.json({ mensaje: 'Módulo actualizado correctamente', modulo });
  } catch (error) {
    console.error('Error al actualizar módulo:', error);
    res.status(500).json({ error: 'Error al actualizar módulo' });
  }
};


// Eliminar un módulo por ID
exports.eliminarModulo = async (req, res) => {
  try {
    const { id } = req.params;

    const modulo = await Modulos.findByPk(id);
    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    // Elimina el archivo del servidor
    if (modulo.archivo) {
      const rutaArchivo = path.join(__dirname, '..', modulo.archivo);
      if (fs.existsSync(rutaArchivo)) fs.unlinkSync(rutaArchivo);
    }

    await modulo.destroy();
    res.json({ mensaje: 'Módulo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar módulo:', error);
    res.status(500).json({ error: 'Error al eliminar módulo' });
  }
};
