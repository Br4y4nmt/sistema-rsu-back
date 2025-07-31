const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Actividad = sequelize.define('Actividad', {
  id_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cantidad_total: {
    type: DataTypes.ENUM('5 KILOS', '10 KILOS', '15 KILOS', '20 KILOS'),
    allowNull: false
  },
  cantidad_ingresada: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0 KILOS'
  },
  tipo: {
  type: DataTypes.STRING,
  allowNull: true
},
estado: {
    type: DataTypes.ENUM('NO INICIADO', 'INICIADO', 'EN PROCESO', 'TERMINADO'),
    allowNull: false,
    defaultValue: 'NO INICIADO'
  },
id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'actividades',
  timestamps: true,
  createdAt: 'fecha_ingreso',
  updatedAt: 'fecha_modificacion'
});

module.exports = Actividad;
