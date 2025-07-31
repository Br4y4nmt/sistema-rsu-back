const Usuario = require('./Usuario');
const Roles = require('./Roles');
const Facultades = require('./Facultades');
const ProgramasAcademicos = require('./ProgramasAcademicos');
const Estudiantes = require('./Estudiantes');
const Modulos = require('./Modulos');
const Actividad = require('./Actividad');
const Evidencia = require('./Evidencia');
const Pregunta = require('./Pregunta');
const Certificado = require('./Certificado');
const Alternativa = require('./Alternativa');
const Resultado = require('./Resultado'); 

// Relaciones entre preguntas y alternativas
Pregunta.hasMany(Alternativa, { foreignKey: 'id_pregunta', as: 'alternativas' });
Alternativa.belongsTo(Pregunta, { foreignKey: 'id_pregunta', as: 'pregunta' });

// Usuario - Rol
Usuario.belongsTo(Roles, { foreignKey: 'rol_id', as: 'rol' });
Roles.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });

// Estudiante - Usuario
Estudiantes.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasOne(Estudiantes, { foreignKey: 'id_usuario', as: 'estudiante' });

// Actividad - Usuario
Actividad.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
Usuario.hasMany(Actividad, { foreignKey: 'id_usuario', as: 'actividades' });

//actividad - evidencia
Actividad.hasMany(Evidencia, { foreignKey: 'id_actividad', as: 'evidencias' });
Evidencia.belongsTo(Actividad, { foreignKey: 'id_actividad', as: 'actividad' });

// Estudiante - Facultad
Estudiantes.belongsTo(Facultades, { foreignKey: 'facultad_id', as: 'facultad' });
Facultades.hasMany(Estudiantes, { foreignKey: 'facultad_id', as: 'estudiantes' });


Usuario.hasOne(Certificado, { foreignKey: 'id_usuario', as: 'certificado' });
Certificado.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Estudiante - Programa Académico
Estudiantes.belongsTo(ProgramasAcademicos, { foreignKey: 'programa_academico_id', as: 'programa' });
ProgramasAcademicos.hasMany(Estudiantes, { foreignKey: 'programa_academico_id', as: 'estudiantes' });

// Programa Académico - Facultad
ProgramasAcademicos.belongsTo(Facultades, { foreignKey: 'id_facultad', as: 'facultad' });
Facultades.hasMany(ProgramasAcademicos, { foreignKey: 'id_facultad', as: 'programas' });

// Usuario - Resultado
Usuario.hasMany(Resultado, { foreignKey: 'id_usuario', as: 'resultados' });
Resultado.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

// Exportar todos los modelos
module.exports = {
  Usuario,
  Roles,
  Facultades,
  ProgramasAcademicos,
  Estudiantes,
  Modulos,
  Actividad,
  Evidencia,
  Pregunta,
  Alternativa,
  Resultado,
  Certificado
};
