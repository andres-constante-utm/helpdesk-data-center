const { Usuario, Rol } = require('../models');

// Include y atributos estándar para respuestas de usuario (nunca expone password_hash)
const opcionesUsuario = {
  include: { model: Rol },
  attributes: { exclude: ['password_hash'] }
};

// Lista todos los usuarios del sistema
async function listarUsuarios(req, res) {
  const usuarios = await Usuario.findAll(opcionesUsuario);
  return res.json(usuarios);
}

// Crea un nuevo usuario (la contraseña se hashea automáticamente en el modelo)
async function crearUsuario(req, res) {
  try {
    const { nombre_completo, correo, password, rol_id } = req.body;

    if (!nombre_completo || !correo || !password || !rol_id) {
      return res.status(400).json({ mensaje: 'nombre_completo, correo, password y rol_id son obligatorios' });
    }

    const usuario = await Usuario.create({
      nombre_completo,
      correo,
      password_hash: password,
      rol_id
    });

    const usuarioCreado = await Usuario.findByPk(usuario.id, opcionesUsuario);
    return res.status(201).json(usuarioCreado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al crear el usuario', error: error.message });
  }
}

// Actualiza los datos básicos de un usuario
async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const { nombre_completo, correo, rol_id, activo } = req.body;

    if (nombre_completo !== undefined) usuario.nombre_completo = nombre_completo;
    if (correo !== undefined) usuario.correo = correo;
    if (rol_id !== undefined) usuario.rol_id = rol_id;
    if (activo !== undefined) usuario.activo = activo;

    await usuario.save();

    const usuarioActualizado = await Usuario.findByPk(usuario.id, opcionesUsuario);
    return res.json(usuarioActualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
  }
}

// Desactiva un usuario en lugar de eliminarlo físicamente
async function eliminarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    usuario.activo = false;
    await usuario.save();

    return res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al desactivar el usuario', error: error.message });
  }
}

module.exports = { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario };
