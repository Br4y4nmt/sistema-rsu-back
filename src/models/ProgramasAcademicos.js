const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ProgramasAcademicos extends Model {}

ProgramasAcademicos.init({
  id_programa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_programa: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  id_facultad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'ProgramasAcademicos',
  tableName: 'programas_academicos',
  timestamps: false,
});

module.exports = ProgramasAcademicos;
