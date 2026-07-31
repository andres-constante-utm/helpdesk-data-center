const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Roles del sistema: USUARIO, TECNICO, ADMINISTRADOR
const Rol = sequelize.define('Rol', {
  nombre: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'roles',
  timestamps: false
});

module.exports = Rol;
