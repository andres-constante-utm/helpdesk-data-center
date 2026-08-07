import { Categoria, EstadoTicket, Prioridad } from '../interfaces/ticket.interface';
import { Rol } from '../interfaces/usuario.interface';

/**
 * Catálogos fijos que replican los datos cargados por backend/src/seeders/seed.js.
 * La API no expone endpoints GET para listar categorías, prioridades ni estados,
 * por lo que se declaran aquí como referencia estática. Si el seed cambia de
 * orden/IDs o se agregan endpoints de catálogo, estos valores deben ajustarse.
 */
export const CATEGORIAS: Categoria[] = [
  { id: 1, nombre: 'Red' },
  { id: 2, nombre: 'Hardware' },
  { id: 3, nombre: 'Software' }
];

export const PRIORIDADES: Prioridad[] = [
  { id: 1, nombre: 'Alta', nivel: 3 },
  { id: 2, nombre: 'Media', nivel: 2 },
  { id: 3, nombre: 'Baja', nivel: 1 }
];

export const ESTADOS_TICKET: EstadoTicket[] = [
  { id: 1, nombre: 'Abierto' },
  { id: 2, nombre: 'En Progreso' },
  { id: 3, nombre: 'Cerrado' }
];

export interface RolCatalogo {
  id: number;
  nombre: Rol;
}

/**
 * Roles reales de la tabla `roles` del backend (no vienen del seed genérico,
 * fueron confirmados explícitamente: USUARIO=1, TECNICO=2, ADMINISTRADOR=3).
 */
export const ROLES: RolCatalogo[] = [
  { id: 1, nombre: 'USUARIO' },
  { id: 2, nombre: 'TECNICO' },
  { id: 3, nombre: 'ADMINISTRADOR' }
];
