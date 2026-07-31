const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Categorías de incidentes: Red, Hardware, Software
const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING(50),
    unique: true
  },
  descripcion: {
    type: DataTypes.TEXT
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categoria;
