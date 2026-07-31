const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  solucion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_cierre: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'tickets',
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion'
});

module.exports = Ticket;
