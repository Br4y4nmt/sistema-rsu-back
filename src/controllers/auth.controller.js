const { verifyGoogleToken } = require('../services/googleAuth');
const { Usuario, Roles } = require('../models');
const generateJWT = require('../helpers/generateJWT');

const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verificar token de Google
    const googleUser = await verifyGoogleToken(token);

    if (!googleUser.email) {
      return res.status(400).json({ message: 'Correo inválido' });
    }

    // 2. Buscar al usuario en la base de datos
    const user = await Usuario.findOne({
      where: { email: googleUser.email },
      include: [{ model: Roles, as: 'rol' }]
    });

    // 3. Si no existe, rechazar
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 👇 CAMBIA ESTO:
    const jwtToken = await generateJWT({
      id_usuario: user.id_usuario,
    // 👇 POR ESTO:
      id: user.id_usuario,
      rol: user.rol?.nombre_rol || 3
    });

    // 5. Responder con datos del usuario y foto de perfil (NO guardada en la DB)
   res.json({
    message: 'Login exitoso',
    token: jwtToken,
    user: {
      id: user.id_usuario,
      nombre: googleUser.name, // ✅ CAMBIO AQUÍ
      email: user.email,
      rol: user.rol?.nombre_rol || 3,
      imagen: googleUser.picture
    }
  });

  } catch (err) {
    console.error('❌ Error en googleLogin:', err);
    res.status(401).json({ message: 'Token inválido' });
  }
};

const obtenerUsuarioAutenticado = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { id_usuario: req.usuario.id },
      include: [{ model: Roles, as: 'rol' }],
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener el usuario autenticado:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  googleLogin,
  obtenerUsuarioAutenticado,
};
