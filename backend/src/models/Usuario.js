const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nombre_completo: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'usuarios',
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  hooks: {
    // Hashea automáticamente la contraseña antes de crear el usuario
    beforeCreate: async (usuario) => {
      usuario.password_hash = await bcrypt.hash(usuario.password_hash, 10);
    }
  }
});

module.exports = Usuario;
