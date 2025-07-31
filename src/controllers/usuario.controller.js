const axios = require('axios');
const { Usuario, Estudiantes, Facultades, ProgramasAcademicos } = require('../models');
const Actividad = require('../models/Actividad'); 

const crearUsuario = async (req, res) => {
  const { codigo, dni, whatsapp } = req.body;

  try {
    // 1. Validación de campos obligatorios
    if (!codigo || !dni || !whatsapp) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // 2. Obtener datos del estudiante desde UDH
    let data;
    try {
      const resUDH = await axios.get(
        `http://www.udh.edu.pe/websauh/secretaria_general/gradosytitulos/datos_estudiante_json.aspx?_c_3456=${codigo}`,
        { timeout: 7000 }
      );
      data = resUDH.data[0];
    } catch (error) {
      console.error('❌ Error conectando con la API de UDH:', error.message);
      return res.status(503).json({ message: 'El servidor de UDH no está disponible. Intenta más tarde.' });
    }

    if (!data) {
      return res.status(400).json({ message: 'Código inválido o no encontrado' });
    }

    // 3. Validar si el correo ya existe
    const email = `${codigo}@udh.edu.pe`;
    const existingUser = await Usuario.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // 4. Obtener facultad
    const facultad = await Facultades.findOne({
      where: { nombre_facultad: data.stu_facultad.trim() }
    });

    if (!facultad) {
      return res.status(400).json({ message: 'Facultad no encontrada' });
    }

    // 5. Obtener programa académico
    const programa = await ProgramasAcademicos.findOne({
      where: {
        nombre_programa: data.stu_programa.trim(),
        id_facultad: facultad.id_facultad
      }
    });

    if (!programa) {
      return res.status(400).json({ message: 'Programa académico no encontrado' });
    }

    // 6. Crear usuario
    const nuevoUsuario = await Usuario.create({
      email,
      dni,
      whatsapp,
      password: '',
      rol_id: 3
    });

  
    await Estudiantes.create({
      nombre_estudiante: `${data.stu_nombres} ${data.stu_apellido_paterno} ${data.stu_apellido_materno}`,
      dni,
      email,
      celular: whatsapp,
      facultad_id: facultad.id_facultad,
      programa_academico_id: programa.id_programa,
      id_usuario: nuevoUsuario.id_usuario,
      codigo: data.stu_codigo
    });

    await Actividad.create({
      id_usuario: nuevoUsuario.id_usuario,
      cantidad_total: '10 KILOS' // El campo cantidad_ingresada se autocompleta como '0 KILOS'
    });

    res.status(201).json({ message: 'Usuario y estudiante registrados correctamente' });

  } catch (error) {
    console.error('❌ Error al crear usuario:', error);

    // Manejo de errores por campos duplicados
    if (error.original && error.original.code === 'ER_DUP_ENTRY') {
      const msg = error.original.sqlMessage;

      if (msg.includes("for key 'usuario.email'")) {
        return res.status(400).json({
          code: 'ER_DUP_ENTRY',
          field: 'email',
          message: 'El correo ya está registrado',
        });
      }

      if (msg.includes("for key 'usuario.dni'")) {
        return res.status(400).json({
          code: 'ER_DUP_ENTRY',
          field: 'dni',
          message: 'El número de DNI ya fue registrado',
        });
      }

      if (msg.includes("for key 'usuario.whatsapp'")) {
        return res.status(400).json({
          code: 'ER_DUP_ENTRY',
          field: 'whatsapp',
          message: 'El número de WhatsApp ya fue registrado',
        });
      }

      return res.status(400).json({
        code: 'ER_DUP_ENTRY',
        message: 'Registro duplicado',
      });
    }

    // Otros errores generales
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
};
