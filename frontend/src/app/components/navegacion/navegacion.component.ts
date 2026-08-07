import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navegacion',
  imports: [RouterLink, RouterLinkActive, NgOptimizedImage],
  templateUrl: './navegacion.component.html'
})
export class NavegacionComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuario = this.authService.usuarioActual;

  protected cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
