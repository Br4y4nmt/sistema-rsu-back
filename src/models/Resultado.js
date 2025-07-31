// models/Resultado.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Resultado extends Model {}

Resultado.init({
  id_resultado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  puntaje: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  preguntas_asignadas: {
  type: DataTypes.JSON,
  allowNull: true
},
  total_preguntas: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  porcentaje: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  inicio_examen: {
  type: DataTypes.DATE,
  allowNull: true,
},
  detalle: {
    type: DataTypes.JSON,
    allowNull: true
  },
  fecha_realizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'Resultado',
  tableName: 'resultados',
  timestamps: false
});

module.exports = Resultado;
