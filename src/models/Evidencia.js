// models/Evidencia.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evidencia = sequelize.define('Evidencia', {
  id_evidencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_actividad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_ingresada: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0 KILOS' // siempre texto como '3 KILOS'
  },
  evidencia_url: {
    type: DataTypes.STRING,
    allowNull: false // guarda el path relativo, ej: 'evidencias/imagen123.jpg'
  },
  fecha_entrega: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'evidencias',
  timestamps: false
});

module.exports = Evidencia;
