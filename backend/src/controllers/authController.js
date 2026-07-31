const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario, Rol } = require('../models');

// Autentica un usuario por correo y contraseña, y devuelve un JWT
async function login(req, res) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({
      where: { correo, activo: true },
      include: { model: Rol }
    });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.Rol.nombre },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre_completo: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.Rol.nombre
      }
    });
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
}

module.exports = { login };
