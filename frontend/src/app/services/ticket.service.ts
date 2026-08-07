import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  ActualizarEstadoPayload,
  AsignarTecnicoPayload,
  CrearTicketPayload,
  HistorialTicket,
  RegistrarSolucionPayload,
  Ticket
} from '../interfaces/ticket.interface';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tickets`;

  listarMisTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/mios`);
  }

  listarAsignados(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.baseUrl}/asignados`);
  }

  listarTodos(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.baseUrl}/${id}`);
  }

  crearTicket(payload: CrearTicketPayload): Observable<Ticket> {
    return this.http.post<Ticket>(this.baseUrl, payload);
  }

  actualizarEstado(id: number, payload: ActualizarEstadoPayload): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}/estado`, payload);
  }

  registrarSolucion(id: number, payload: RegistrarSolucionPayload): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}/solucion`, payload);
  }

  asignarTecnico(id: number, payload: AsignarTecnicoPayload): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.baseUrl}/${id}/asignar`, payload);
  }

  eliminarTicket(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/${id}`);
  }

  obtenerHistorial(id: number): Observable<HistorialTicket[]> {
    return this.http.get<HistorialTicket[]>(`${this.baseUrl}/${id}/historial`);
  }
}
