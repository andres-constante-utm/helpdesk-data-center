const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Prioridades de ticket: Alta, Media, Baja
const Prioridad = sequelize.define('Prioridad', {
  nombre: {
    type: DataTypes.STRING(20),
    unique: true
  },
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'prioridades',
  timestamps: false
});

module.exports = Prioridad;
