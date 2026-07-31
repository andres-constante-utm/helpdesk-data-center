const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Datos adicionales para usuarios con rol TECNICO
const PerfilTecnico = sequelize.define('PerfilTecnico', {
  disponible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'perfiles_tecnicos',
  timestamps: false
});

module.exports = PerfilTecnico;
