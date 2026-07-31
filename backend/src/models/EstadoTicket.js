const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Estados del ciclo de vida de un ticket: Abierto, En Progreso, Cerrado
const EstadoTicket = sequelize.define('EstadoTicket', {
  nombre: {
    type: DataTypes.STRING(30),
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'estados_ticket',
  timestamps: false
});

module.exports = EstadoTicket;
