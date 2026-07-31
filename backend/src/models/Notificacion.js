const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Notificaciones enviadas a un usuario (por ejemplo, asignación de ticket)
const Notificacion = sequelize.define('Notificacion', {
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  leida: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fecha_lectura: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notificaciones',
  createdAt: 'fecha_creacion',
  updatedAt: false
});

module.exports = Notificacion;
