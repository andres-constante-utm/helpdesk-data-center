import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ActualizarUsuarioPayload, CrearUsuarioPayload, UsuarioCreado } from '../interfaces/usuario.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/usuarios`;

  crearUsuario(nombreCompleto: string, correo: string, password: string, rolId: number): Observable<UsuarioCreado> {
    const payload: CrearUsuarioPayload = {
      nombre_completo: nombreCompleto,
      correo,
      password,
      rol_id: rolId
    };

    return this.http.post<UsuarioCreado>(this.baseUrl, payload);
  }

  listarUsuarios(): Observable<UsuarioCreado[]> {
    return this.http.get<UsuarioCreado[]>(this.baseUrl);
  }

  actualizarUsuario(id: number, payload: ActualizarUsuarioPayload): Observable<UsuarioCreado> {
    return this.http.put<UsuarioCreado>(`${this.baseUrl}/${id}`, payload);
  }

  eliminarUsuario(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }
}
