import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { SanitizacionService } from '../../services/sanitizacion.service';
import { ROLES } from '../../shared/catalogos';
import { ErrorApi } from '../../interfaces/ticket.interface';

@Component({
  selector: 'app-crear-usuario',
  imports: [ReactiveFormsModule],
  templateUrl: './crear-usuario.component.html'
})
export class CrearUsuarioComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly sanitizacionService = inject(SanitizacionService);

  protected readonly roles = ROLES;

  protected readonly enviando = signal(false);
  protected readonly mensajeExito = signal<string | null>(null);
  protected readonly mensajeError = signal<string | null>(null);

  protected readonly formulario = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.maxLength(150)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol_id: this.fb.control<number | null>(null, [Validators.required])
  });

  protected crear(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();
    const nombreCompleto = this.sanitizacionService.limpiarTexto(valores.nombreCompleto);

    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.enviando.set(true);

    this.usuarioService
      .crearUsuario(nombreCompleto, valores.correo, valores.password, valores.rol_id as number)
      .subscribe({
        next: (usuario) => {
          this.enviando.set(false);
          this.mensajeExito.set(`Usuario "${usuario.nombre_completo}" creado correctamente.`);
          this.formulario.reset();
        },
        error: (error: HttpErrorResponse) => {
          this.enviando.set(false);
          const cuerpoError = error.error as ErrorApi | null;
          this.mensajeError.set(cuerpoError?.mensaje ?? 'No se pudo crear el usuario.');
        }
      });
  }

  protected limpiarFormulario(): void {
    this.formulario.reset();
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
  }
}
