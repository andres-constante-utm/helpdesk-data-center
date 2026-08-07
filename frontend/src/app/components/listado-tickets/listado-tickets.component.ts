import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { UsuarioService } from '../../services/usuario.service';
import { SanitizacionService } from '../../services/sanitizacion.service';
import { ESTADOS_TICKET, ROLES } from '../../shared/catalogos';
import { ErrorApi, Ticket } from '../../interfaces/ticket.interface';
import { Rol, UsuarioCreado } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-listado-tickets',
  imports: [DatePipe],
  templateUrl: './listado-tickets.component.html'
})
export class ListadoTicketsComponent {
  private readonly authService = inject(AuthService);
  private readonly ticketService = inject(TicketService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly sanitizacionService = inject(SanitizacionService);
  private readonly router = inject(Router);

  protected readonly estados = ESTADOS_TICKET;
  protected readonly rol = computed<Rol | null>(() => this.authService.usuarioActual()?.rol ?? null);

  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly errorAccion = signal<string | null>(null);
  protected readonly mensajeAccion = signal<string | null>(null);

  protected readonly ticketEnSolucionId = signal<number | null>(null);
  protected readonly textoSolucion = signal('');
  protected readonly ticketVistaSolucionId = signal<number | null>(null);

  protected readonly tecnicosDisponibles = signal<UsuarioCreado[]>([]);

  constructor() {
    this.cargarTickets();

    if (this.rol() === 'ADMINISTRADOR') {
      this.cargarTecnicos();
    }

    // Recarga los tickets cada vez que se reingresa a /tickets, incluso si ya
    // se estaba en esa ruta (p. ej. al hacer clic de nuevo en "Ver Tickets" del
    // menú), ya que sin esto el router reutiliza la instancia del componente y
    // no vuelve a ejecutar el constructor, dejando datos desactualizados en
    // pantalla (p. ej. un ticket creado por otro usuario en otra sesión).
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cargarTickets());
  }

  protected formatearId(id: number): string {
    return `TK-${String(id).padStart(3, '0')}`;
  }

  protected claseBadge(nombrePrioridad: string | undefined): string {
    switch (nombrePrioridad) {
      case 'Alta':
        return 'badge-alta';
      case 'Media':
        return 'badge-media';
      case 'Baja':
        return 'badge-baja';
      default:
        return '';
    }
  }

  protected cambiarEstado(ticket: Ticket, valorSeleccionado: string): void {
    const estado_id = Number(valorSeleccionado);
    if (!estado_id) {
      return;
    }

    this.errorAccion.set(null);
    this.mensajeAccion.set(null);
    this.ticketService.actualizarEstado(ticket.id, { estado_id }).subscribe({
      next: (ticketActualizado) => {
        this.reemplazarTicket(ticketActualizado);
        const nombreEstado = ticketActualizado.EstadoTicket?.nombre ?? 'actualizado';
        this.mensajeAccion.set(
          `Estado del ticket ${this.formatearId(ticketActualizado.id)} cambiado a "${nombreEstado}".`
        );
      },
      error: (error: HttpErrorResponse) => this.establecerErrorAccion(error, 'No se pudo actualizar el estado.')
    });
  }

  protected abrirFormularioSolucion(ticket: Ticket): void {
    this.ticketEnSolucionId.set(ticket.id);
    this.textoSolucion.set('');
    this.errorAccion.set(null);
    this.mensajeAccion.set(null);
  }

  protected cancelarSolucion(): void {
    this.ticketEnSolucionId.set(null);
    this.textoSolucion.set('');
  }

  protected alternarVistaSolucion(ticket: Ticket): void {
    this.ticketVistaSolucionId.update((actual) => (actual === ticket.id ? null : ticket.id));
  }

  protected asignarTecnico(ticket: Ticket, valorSeleccionado: string): void {
    const tecnico_asignado_id = Number(valorSeleccionado);
    if (!tecnico_asignado_id) {
      return;
    }

    this.errorAccion.set(null);
    this.mensajeAccion.set(null);
    this.ticketService.asignarTecnico(ticket.id, { tecnico_asignado_id }).subscribe({
      next: (ticketActualizado) => {
        this.reemplazarTicket(ticketActualizado);
        const nombreTecnico = ticketActualizado.tecnicoAsignado?.nombre_completo ?? 'el técnico seleccionado';
        this.mensajeAccion.set(`Se asignó a ${nombreTecnico} al ticket ${this.formatearId(ticketActualizado.id)}.`);
      },
      error: (error: HttpErrorResponse) => this.establecerErrorAccion(error, 'No se pudo asignar el técnico.')
    });
  }

  protected confirmarSolucion(ticket: Ticket): void {
    const solucion = this.sanitizacionService.limpiarTexto(this.textoSolucion());

    if (!solucion) {
      this.errorAccion.set('Ingrese el detalle de la solución.');
      return;
    }

    this.errorAccion.set(null);
    this.mensajeAccion.set(null);
    this.ticketService.registrarSolucion(ticket.id, { solucion }).subscribe({
      next: (ticketActualizado) => {
        this.reemplazarTicket(ticketActualizado);
        this.ticketEnSolucionId.set(null);
        this.mensajeAccion.set(
          `Solución registrada correctamente para el ticket ${this.formatearId(ticketActualizado.id)}.`
        );
      },
      error: (error: HttpErrorResponse) => this.establecerErrorAccion(error, 'No se pudo registrar la solución.')
    });
  }

  protected eliminarTicket(ticket: Ticket): void {
    const confirmado = confirm(
      `¿Eliminar el ticket ${this.formatearId(ticket.id)} (${ticket.titulo})? Esta acción no se puede deshacer.`
    );
    if (!confirmado) {
      return;
    }

    this.errorAccion.set(null);
    this.mensajeAccion.set(null);
    this.ticketService.eliminarTicket(ticket.id).subscribe({
      next: () => {
        this.tickets.update((lista) => lista.filter((t) => t.id !== ticket.id));
        this.mensajeAccion.set(`Ticket ${this.formatearId(ticket.id)} eliminado correctamente.`);
      },
      error: (error: HttpErrorResponse) => this.establecerErrorAccion(error, 'No se pudo eliminar el ticket.')
    });
  }

  private cargarTickets(): void {
    let solicitud: Observable<Ticket[]> | null = null;

    switch (this.rol()) {
      case 'USUARIO':
        solicitud = this.ticketService.listarMisTickets();
        break;
      case 'TECNICO':
        solicitud = this.ticketService.listarAsignados();
        break;
      case 'ADMINISTRADOR':
        solicitud = this.ticketService.listarTodos();
        break;
    }

    if (!solicitud) {
      this.cargando.set(false);
      return;
    }

    this.cargando.set(true);
    solicitud.subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No se pudieron cargar los tickets.');
        this.cargando.set(false);
      }
    });
  }

  private cargarTecnicos(): void {
    const idRolTecnico = ROLES.find((rol) => rol.nombre === 'TECNICO')?.id;

    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.tecnicosDisponibles.set(
          usuarios.filter((usuario) => usuario.rol_id === idRolTecnico && usuario.activo)
        );
      },
      error: () => this.errorAccion.set('No se pudieron cargar los técnicos disponibles.')
    });
  }

  private reemplazarTicket(actualizado: Ticket): void {
    this.tickets.update((lista) => lista.map((t) => (t.id === actualizado.id ? actualizado : t)));
  }

  private establecerErrorAccion(error: HttpErrorResponse, mensajePorDefecto: string): void {
    const cuerpoError = error.error as ErrorApi | null;
    this.errorAccion.set(cuerpoError?.mensaje ?? mensajePorDefecto);
  }
}
