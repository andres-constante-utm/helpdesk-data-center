import { UsuarioResumen } from './usuario.interface';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface Prioridad {
  id: number;
  nombre: string;
  nivel: number;
}

export interface EstadoTicket {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  solucion: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_cierre: string | null;
  categoria_id: number;
  prioridad_id: number;
  estado_id: number;
  usuario_reporta_id: number;
  tecnico_asignado_id: number | null;
  /**
   * La API expone esta relación bajo la clave "Categorium" (no "Categoria"):
   * Ticket.belongsTo(Categoria, ...) en backend/src/models/index.js no define
   * un alias explícito, y la librería inflection que usa Sequelize singulariza
   * "Categoria" como si fuera un plural latino, generando "Categorium".
   * Confirmado contra la respuesta real de GET /tickets/mios.
   */
  Categorium: Categoria;
  Prioridad: Prioridad;
  EstadoTicket: EstadoTicket;
  usuarioReporta: UsuarioResumen;
  tecnicoAsignado: UsuarioResumen | null;
}

export interface CrearTicketPayload {
  titulo: string;
  descripcion: string;
  categoria_id: number;
  prioridad_id: number;
}

export interface ActualizarEstadoPayload {
  estado_id: number;
}

export interface RegistrarSolucionPayload {
  solucion: string;
}

export interface AsignarTecnicoPayload {
  tecnico_asignado_id: number;
}

export interface HistorialTicket {
  id: number;
  ticket_id: number;
  accion: string;
  usuario_responsable_id: number;
  estado_nuevo_id?: number;
  detalle?: string;
  fecha_creacion: string;
  Usuario?: UsuarioResumen;
}

export interface ErrorApi {
  mensaje: string;
  error?: string;
}
