const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Certificado extends Model {}

Certificado.init({
  id_certificado: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  url_certificado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_generacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'Certificado',
  tableName: 'certificados',
  timestamps: false,
});

module.exports = Certificado;
