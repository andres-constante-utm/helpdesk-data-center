import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { LoginResponse, Rol, Usuario } from '../interfaces/usuario.interface';

const CLAVE_ALMACENAMIENTO = 'helpdesk_sesion';

interface SesionAlmacenada {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly token = signal<string | null>(null);
  readonly usuarioActual = signal<Usuario | null>(null);
  readonly estaAutenticado = computed(() => this.usuarioActual() !== null);

  constructor() {
    this.restaurarSesion();
  }

  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { correo, password })
      .pipe(tap((respuesta) => this.guardarSesion(respuesta)));
  }

  logout(): void {
    this.token.set(null);
    this.usuarioActual.set(null);
    sessionStorage.removeItem(CLAVE_ALMACENAMIENTO);
  }

  getToken(): string | null {
    return this.token();
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual();
  }

  getRol(): Rol | null {
    return this.usuarioActual()?.rol ?? null;
  }

  private guardarSesion(respuesta: LoginResponse): void {
    this.token.set(respuesta.token);
    this.usuarioActual.set(respuesta.usuario);

    const sesion: SesionAlmacenada = { token: respuesta.token, usuario: respuesta.usuario };
    sessionStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(sesion));
  }

  private restaurarSesion(): void {
    const sesionGuardada = sessionStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (!sesionGuardada) {
      return;
    }

    try {
      const sesion = JSON.parse(sesionGuardada) as SesionAlmacenada;
      this.token.set(sesion.token);
      this.usuarioActual.set(sesion.usuario);
    } catch {
      sessionStorage.removeItem(CLAVE_ALMACENAMIENTO);
    }
  }
}
