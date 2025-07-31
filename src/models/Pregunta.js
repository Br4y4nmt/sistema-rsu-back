const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Pregunta extends Model {}

Pregunta.init({
  id_pregunta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING(500),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Pregunta',
  tableName: 'preguntas',
  timestamps: false,
});

module.exports = Pregunta;
