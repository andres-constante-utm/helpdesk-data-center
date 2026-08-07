import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable, filter } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../interfaces/ticket.interface';
import { Rol } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly ticketService = inject(TicketService);
  private readonly router = inject(Router);

  protected readonly rol = computed<Rol | null>(() => this.authService.usuarioActual()?.rol ?? null);

  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);

  protected readonly totalTickets = computed(() => this.tickets().length);

  protected readonly totalPorEstado = computed(() => {
    const conteo = new Map<string, number>();
    for (const ticket of this.tickets()) {
      const nombreEstado = ticket.EstadoTicket?.nombre ?? 'Sin estado';
      conteo.set(nombreEstado, (conteo.get(nombreEstado) ?? 0) + 1);
    }
    return conteo;
  });

  constructor() {
    this.cargarTickets();

    // Recarga los tickets cada vez que se reingresa a /dashboard, incluso si ya
    // se estaba en esa ruta (p. ej. al hacer clic de nuevo en "Dashboard" del menú),
    // ya que sin esto el router reutiliza la instancia del componente y no vuelve
    // a ejecutar el constructor, dejando datos desactualizados en pantalla.
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.cargarTickets());
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
}
