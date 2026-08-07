import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TicketService } from '../../services/ticket.service';
import { SanitizacionService } from '../../services/sanitizacion.service';
import { CATEGORIAS, PRIORIDADES } from '../../shared/catalogos';
import { ErrorApi } from '../../interfaces/ticket.interface';

@Component({
  selector: 'app-registrar-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-ticket.component.html'
})
export class RegistrarTicketComponent {
  private readonly fb = inject(FormBuilder);
  private readonly ticketService = inject(TicketService);
  private readonly sanitizacionService = inject(SanitizacionService);

  protected readonly categorias = CATEGORIAS;
  protected readonly prioridades = PRIORIDADES;

  protected readonly enviando = signal(false);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly mensajeError = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    categoria_id: this.fb.control<number | null>(null, [Validators.required]),
    prioridad_id: this.fb.control<number | null>(null, [Validators.required]),
    descripcion: ['', [Validators.required]]
  });

  protected enviar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    const payload = {
      titulo: this.sanitizacionService.limpiarTexto(valores.titulo),
      descripcion: this.sanitizacionService.limpiarTexto(valores.descripcion),
      categoria_id: valores.categoria_id as number,
      prioridad_id: valores.prioridad_id as number
    };

    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.enviando.set(true);

    this.ticketService.crearTicket(payload).subscribe({
      next: (ticket) => {
        this.enviando.set(false);
        this.mensajeExito.set(`Incidente registrado correctamente con el ID TK-${String(ticket.id).padStart(3, '0')}.`);
        this.formulario.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.enviando.set(false);
        const cuerpoError = error.error as ErrorApi | null;
        this.mensajeError.set(cuerpoError?.mensaje ?? 'No se pudo registrar el incidente.');
      }
    });
  }

  protected limpiarFormulario(): void {
    this.formulario.reset();
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
  }
}
