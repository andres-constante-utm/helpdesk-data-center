export type Rol = 'USUARIO' | 'TECNICO' | 'ADMINISTRADOR';

export interface Usuario {
  id: number;
  nombre_completo: string;
  correo: string;
  rol: Rol;
}

export interface UsuarioResumen {
  id: number;
  nombre_completo: string;
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface CrearUsuarioPayload {
  nombre_completo: string;
  correo: string;
  password: string;
  rol_id: number;
}

export interface UsuarioCreado {
  id: number;
  nombre_completo: string;
  correo: string;
  activo: boolean;
  rol_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  /**
   * Usuario.belongsTo(Rol, { foreignKey: 'rol_id' }) en backend/src/models/index.js
   * tampoco define alias explícito. "Rol" no cae en ninguna regla de singularización
   * irregular conocida de la librería inflection (a diferencia de "Categoria" →
   * "Categorium"), pero no se verificó contra una respuesta real de GET /usuarios —
   * confirmar esta clave contra el JSON real antes de confiar en ella para mostrar datos.
   */
  Rol?: { id: number; nombre: Rol };
}

export interface ActualizarUsuarioPayload {
  nombre_completo: string;
  correo: string;
  rol_id: number;
  activo: boolean;
}
