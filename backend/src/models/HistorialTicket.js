const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Bitácora de acciones realizadas sobre un ticket
const HistorialTicket = sequelize.define('HistorialTicket', {
  accion: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  estado_anterior_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  estado_nuevo_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  detalle: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'historial_tickets',
  createdAt: 'fecha_creacion',
  updatedAt: false
});

module.exports = HistorialTicket;
