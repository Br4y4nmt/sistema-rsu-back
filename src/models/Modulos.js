const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Modulos extends Model {}

Modulos.init({
  id_modulo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
    archivo: {
    type: DataTypes.STRING(500),
    allowNull: false,
    },
  estado: {
    type: DataTypes.ENUM('Activo', 'Inactivo'),
    defaultValue: 'Activo',
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Modulos',
  tableName: 'modulos',
  timestamps: false,
});

module.exports = Modulos;
