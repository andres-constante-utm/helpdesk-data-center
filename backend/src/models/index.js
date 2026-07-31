const sequelize = require('../config/database');

const Rol = require('./Rol');
const Categoria = require('./Categoria');
const Prioridad = require('./Prioridad');
const EstadoTicket = require('./EstadoTicket');
const Usuario = require('./Usuario');
const PerfilTecnico = require('./PerfilTecnico');
const Ticket = require('./Ticket');
const HistorialTicket = require('./HistorialTicket');
const Notificacion = require('./Notificacion');

// Rol - Usuario
Rol.hasMany(Usuario, { foreignKey: 'rol_id' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id' });

// Usuario - PerfilTecnico (1 a 1)
Usuario.hasOne(PerfilTecnico, { foreignKey: { name: 'usuario_id', unique: true } });
PerfilTecnico.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Categoria - PerfilTecnico (especialidad del técnico)
Categoria.hasMany(PerfilTecnico, { foreignKey: 'categoria_especialidad_id' });
PerfilTecnico.belongsTo(Categoria, { foreignKey: 'categoria_especialidad_id' });

// Categoria, Prioridad, EstadoTicket - Ticket
Categoria.hasMany(Ticket, { foreignKey: 'categoria_id' });
Ticket.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Prioridad.hasMany(Ticket, { foreignKey: 'prioridad_id' });
Ticket.belongsTo(Prioridad, { foreignKey: 'prioridad_id' });

EstadoTicket.hasMany(Ticket, { foreignKey: 'estado_id' });
Ticket.belongsTo(EstadoTicket, { foreignKey: 'estado_id' });

// Usuario - Ticket (quién reporta / técnico asignado)
Usuario.hasMany(Ticket, { foreignKey: 'usuario_reporta_id', as: 'ticketsReportados' });
Ticket.belongsTo(Usuario, { foreignKey: 'usuario_reporta_id', as: 'usuarioReporta' });

Usuario.hasMany(Ticket, { foreignKey: 'tecnico_asignado_id', as: 'ticketsAsignados' });
Ticket.belongsTo(Usuario, { foreignKey: 'tecnico_asignado_id', as: 'tecnicoAsignado' });

// Ticket - HistorialTicket
Ticket.hasMany(HistorialTicket, { foreignKey: 'ticket_id' });
HistorialTicket.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Usuario.hasMany(HistorialTicket, { foreignKey: 'usuario_responsable_id' });
HistorialTicket.belongsTo(Usuario, { foreignKey: 'usuario_responsable_id' });

// Ticket - Notificacion
Ticket.hasMany(Notificacion, { foreignKey: 'ticket_id' });
Notificacion.belongsTo(Ticket, { foreignKey: 'ticket_id' });

Usuario.hasMany(Notificacion, { foreignKey: 'usuario_destinatario_id' });
Notificacion.belongsTo(Usuario, { foreignKey: 'usuario_destinatario_id' });

// Hook: al actualizar un ticket, registra el cambio de estado y/o
// la asignación de técnico en el historial, y notifica al técnico asignado.
Ticket.addHook('afterUpdate', async (ticket) => {
  if (ticket.changed('estado_id')) {
    await HistorialTicket.create({
      ticket_id: ticket.id,
      accion: 'CAMBIO_ESTADO',
      estado_anterior_id: ticket._previousDataValues.estado_id,
      estado_nuevo_id: ticket.estado_id
    });
  }

  if (ticket.changed('tecnico_asignado_id') && ticket.tecnico_asignado_id !== null) {
    await Notificacion.create({
      ticket_id: ticket.id,
      usuario_destinatario_id: ticket.tecnico_asignado_id,
      mensaje: `Se te ha asignado el ticket #${ticket.id}: ${ticket.titulo}`
    });

    await HistorialTicket.create({
      ticket_id: ticket.id,
      accion: 'ASIGNACION_TECNICO',
      detalle: `Técnico asignado: usuario ${ticket.tecnico_asignado_id}`
    });
  }
});

module.exports = {
  sequelize,
  Rol,
  Categoria,
  Prioridad,
  EstadoTicket,
  Usuario,
  PerfilTecnico,
  Ticket,
  HistorialTicket,
  Notificacion
};
