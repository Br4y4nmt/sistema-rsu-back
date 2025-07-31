const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Alternativa extends Model {}

Alternativa.init({
  id_alternativa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  texto: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  es_correcta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  id_pregunta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Alternativa',
  tableName: 'alternativas',
  timestamps: false,
});

module.exports = Alternativa;
