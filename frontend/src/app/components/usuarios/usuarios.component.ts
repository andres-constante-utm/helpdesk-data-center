import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import { SanitizacionService } from '../../services/sanitizacion.service';
import { ROLES } from '../../shared/catalogos';
import { ErrorApi } from '../../interfaces/ticket.interface';
import { UsuarioCreado } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly sanitizacionService = inject(SanitizacionService);

  protected readonly roles = ROLES;

  protected readonly usuarios = signal<UsuarioCreado[]>([]);
  protected readonly cargando = signal(true);
  protected readonly errorCarga = signal<string | null>(null);
  protected readonly errorAccion = signal<string | null>(null);
  protected readonly mensajeExito = signal<string | null>(null);

  protected readonly usuarioEnEdicionId = signal<number | null>(null);
  protected readonly guardando = signal(false);

  protected readonly formularioEdicion = this.fb.nonNullable.group({
    nombreCompleto: ['', [Validators.required, Validators.maxLength(150)]],
    correo: ['', [Validators.required, Validators.email]],
    rol_id: this.fb.control<number | null>(null, [Validators.required]),
    activo: [true]
  });

  constructor() {
    this.cargarUsuarios();
  }

  protected nombreRol(rolId: number): string {
    return this.roles.find((rol) => rol.id === rolId)?.nombre ?? 'Desconocido';
  }

  protected abrirEdicion(usuario: UsuarioCreado): void {
    this.usuarioEnEdicionId.set(usuario.id);
    this.errorAccion.set(null);
    this.formularioEdicion.setValue({
      nombreCompleto: usuario.nombre_completo,
      correo: usuario.correo,
      rol_id: usuario.rol_id,
      activo: usuario.activo
    });
  }

  protected cancelarEdicion(): void {
    this.usuarioEnEdicionId.set(null);
  }

  protected guardarEdicion(usuario: UsuarioCreado): void {
    if (this.formularioEdicion.invalid) {
      this.formularioEdicion.markAllAsTouched();
      return;
    }

    const valores = this.formularioEdicion.getRawValue();

    const payload = {
      nombre_completo: this.sanitizacionService.limpiarTexto(valores.nombreCompleto),
      correo: valores.correo,
      rol_id: valores.rol_id as number,
      activo: valores.activo
    };

    this.errorAccion.set(null);
    this.guardando.set(true);

    this.usuarioService.actualizarUsuario(usuario.id, payload).subscribe({
      next: (usuarioActualizado) => {
        this.guardando.set(false);
        this.reemplazarUsuario(usuarioActualizado);
        this.usuarioEnEdicionId.set(null);
        this.mensajeExito.set(`Usuario "${usuarioActualizado.nombre_completo}" actualizado correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.establecerErrorAccion(error, 'No se pudo actualizar el usuario.');
      }
    });
  }

  protected desactivarUsuario(usuario: UsuarioCreado): void {
    const confirmado = confirm(`¿Desactivar al usuario "${usuario.nombre_completo}"? Podrá reactivarse luego editándolo.`);
    if (!confirmado) {
      return;
    }

    this.errorAccion.set(null);
    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.usuarios.update((lista) => lista.map((u) => (u.id === usuario.id ? { ...u, activo: false } : u)));
        this.mensajeExito.set(`Usuario "${usuario.nombre_completo}" desactivado correctamente.`);
      },
      error: (error: HttpErrorResponse) => this.establecerErrorAccion(error, 'No se pudo desactivar el usuario.')
    });
  }

  private cargarUsuarios(): void {
    this.cargando.set(true);
    this.usuarioService.listarUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: () => {
        this.errorCarga.set('No se pudieron cargar los usuarios.');
        this.cargando.set(false);
      }
    });
  }

  private reemplazarUsuario(actualizado: UsuarioCreado): void {
    this.usuarios.update((lista) => lista.map((u) => (u.id === actualizado.id ? actualizado : u)));
  }

  private establecerErrorAccion(error: HttpErrorResponse, mensajePorDefecto: string): void {
    const cuerpoError = error.error as ErrorApi | null;
    this.errorAccion.set(cuerpoError?.mensaje ?? mensajePorDefecto);
  }
}
