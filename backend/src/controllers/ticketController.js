const { Ticket, Categoria, Prioridad, EstadoTicket, Usuario, HistorialTicket } = require('../models');

// Include estándar para respuestas de ticket (sin exponer password_hash)
const includeTicket = [
  { model: Categoria },
  { model: Prioridad },
  { model: EstadoTicket },
  { model: Usuario, as: 'usuarioReporta', attributes: ['id', 'nombre_completo'] },
  { model: Usuario, as: 'tecnicoAsignado', attributes: ['id', 'nombre_completo'] }
];

// Crea un ticket a nombre del usuario autenticado, con estado inicial "Abierto"
async function crearTicket(req, res) {
  try {
    const { titulo, descripcion, categoria_id, prioridad_id } = req.body;

    if (!titulo || !descripcion || !categoria_id || !prioridad_id) {
      return res.status(400).json({ mensaje: 'titulo, descripcion, categoria_id y prioridad_id son obligatorios' });
    }

    const ticket = await Ticket.create({
      titulo,
      descripcion,
      categoria_id,
      prioridad_id,
      estado_id: 1,
      usuario_reporta_id: req.usuario.id
    });

    await HistorialTicket.create({
      ticket_id: ticket.id,
      accion: 'CREACION',
      usuario_responsable_id: req.usuario.id,
      estado_nuevo_id: ticket.estado_id
    });

    const ticketCreado = await Ticket.findByPk(ticket.id, { include: includeTicket });
    return res.status(201).json(ticketCreado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al crear el ticket', error: error.message });
  }
}

// Lista los tickets reportados por el usuario autenticado
async function misTickets(req, res) {
  const tickets = await Ticket.findAll({
    where: { usuario_reporta_id: req.usuario.id },
    include: includeTicket,
    order: [['fecha_creacion', 'DESC']]
  });
  return res.json(tickets);
}

// Lista los tickets asignados al técnico autenticado
async function ticketsAsignados(req, res) {
  const tickets = await Ticket.findAll({
    where: { tecnico_asignado_id: req.usuario.id },
    include: includeTicket,
    order: [['fecha_creacion', 'DESC']]
  });
  return res.json(tickets);
}

// El técnico asignado actualiza el estado del ticket (el historial lo registra el hook del modelo)
async function actualizarEstado(req, res) {
  try {
    const { estado_id } = req.body;
    if (!estado_id) {
      return res.status(400).json({ mensaje: 'estado_id es obligatorio' });
    }

    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    if (ticket.tecnico_asignado_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'Solo el técnico asignado puede actualizar el estado' });
    }

    ticket.estado_id = estado_id;
    await ticket.save();

    const ticketActualizado = await Ticket.findByPk(ticket.id, { include: includeTicket });
    return res.json(ticketActualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al actualizar el estado', error: error.message });
  }
}

// El técnico asignado registra la solución y cierra el ticket
async function registrarSolucion(req, res) {
  try {
    const { solucion } = req.body;
    if (!solucion) {
      return res.status(400).json({ mensaje: 'solucion es obligatoria' });
    }

    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    if (ticket.tecnico_asignado_id !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'Solo el técnico asignado puede registrar la solución' });
    }

    ticket.solucion = solucion;
    ticket.estado_id = 3;
    ticket.fecha_cierre = new Date();
    await ticket.save();

    await HistorialTicket.create({
      ticket_id: ticket.id,
      accion: 'REGISTRO_SOLUCION',
      usuario_responsable_id: req.usuario.id,
      detalle: solucion
    });

    const ticketActualizado = await Ticket.findByPk(ticket.id, { include: includeTicket });
    return res.json(ticketActualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al registrar la solución', error: error.message });
  }
}

// Lista todos los tickets del sistema
async function listarTickets(req, res) {
  const tickets = await Ticket.findAll({ include: includeTicket, order: [['fecha_creacion', 'DESC']] });
  return res.json(tickets);
}

// Asigna un técnico a un ticket (el hook del modelo notifica y registra historial)
async function asignarTecnico(req, res) {
  try {
    const { tecnico_asignado_id } = req.body;
    if (!tecnico_asignado_id) {
      return res.status(400).json({ mensaje: 'tecnico_asignado_id es obligatorio' });
    }

    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    ticket.tecnico_asignado_id = tecnico_asignado_id;
    await ticket.save();

    const ticketActualizado = await Ticket.findByPk(ticket.id, { include: includeTicket });
    return res.json(ticketActualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al asignar el técnico', error: error.message });
  }
}

// Elimina un ticket del sistema
async function eliminarTicket(req, res) {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    await ticket.destroy();
    return res.json({ mensaje: 'Ticket eliminado correctamente' });
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al eliminar el ticket', error: error.message });
  }
}

// Obtiene un ticket puntual por su ID
async function obtenerTicketPorId(req, res) {
  try {
    const ticket = await Ticket.findByPk(req.params.id, { include: includeTicket });

    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    return res.json(ticket);
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al consultar el ticket', error: error.message });
  }
}

// Actualiza campos generales de un ticket (no permite cambiar estado_id ni tecnico_asignado_id)
async function actualizarTicket(req, res) {
  try {
    const ticket = await Ticket.findByPk(req.params.id);
    if (!ticket) {
      return res.status(404).json({ mensaje: 'Ticket no encontrado' });
    }

    const camposPermitidos = ['titulo', 'descripcion', 'categoria_id', 'prioridad_id'];
    const datosActualizacion = {};

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        datosActualizacion[campo] = req.body[campo];
      }
    });

    if (Object.keys(datosActualizacion).length === 0) {
      return res.status(400).json({ mensaje: 'No se proporcionaron campos válidos para actualizar' });
    }

    await ticket.update(datosActualizacion);

    const ticketActualizado = await Ticket.findByPk(ticket.id, { include: includeTicket });
    return res.json(ticketActualizado);
  } catch (error) {
    return res.status(400).json({ mensaje: 'Error al actualizar el ticket', error: error.message });
  }
}

// Devuelve el historial de acciones de un ticket
async function historialTicket(req, res) {
  const ticket = await Ticket.findByPk(req.params.id);
  if (!ticket) {
    return res.status(404).json({ mensaje: 'Ticket no encontrado' });
  }

  const historial = await HistorialTicket.findAll({
    where: { ticket_id: req.params.id },
    include: { model: Usuario, attributes: ['id', 'nombre_completo'] },
    order: [['fecha_creacion', 'ASC']]
  });

  return res.json(historial);
}

module.exports = {
  crearTicket,
  misTickets,
  ticketsAsignados,
  actualizarEstado,
  registrarSolucion,
  listarTickets,
  asignarTecnico,
  eliminarTicket,
  historialTicket,
  obtenerTicketPorId,
  actualizarTicket
};
