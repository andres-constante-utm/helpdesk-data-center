const { Notificacion } = require('../models');

// Lista las notificaciones del usuario autenticado
async function listarNotificaciones(req, res) {
  const notificaciones = await Notificacion.findAll({
    where: { usuario_destinatario_id: req.usuario.id },
    order: [['fecha_creacion', 'DESC']]
  });
  return res.json(notificaciones);
}

// Marca una notificación propia como leída
async function marcarLeida(req, res) {
  try {
    const notificacion = await Notificacion.findByPk(req.params.id);
    if (!notificacion) {
      return res.status(404).json({ mensaje: 'Notificación no encontrada' });
    }

    if (notificacion.usuario_destinatario_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tiene permiso sobre esta notificación' });
    }

    notificacion.leida = true;
    notificacion.fecha_lectura = new Date();
    await notificacion.save();

    return res.json(notificacion);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al marcar la notificación como leída', error: error.message });
  }
}

module.exports = { listarNotificaciones, marcarLeida };
