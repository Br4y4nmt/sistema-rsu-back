const jwt = require('jsonwebtoken');

/**
 * Genera un JWT con el id y rol del usuario
 * @param {Object} payload - Datos a incluir en el token
 * @param {string|number} payload.id - ID del usuario
 * @param {string|number} payload.rol - Rol del usuario
 */
const generateJWT = ({ id, rol }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id, rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
      (err, token) => {
        if (err) {
          console.error('❌ Error generando JWT:', err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateJWT;
