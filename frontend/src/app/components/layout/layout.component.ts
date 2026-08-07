import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavegacionComponent } from '../navegacion/navegacion.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavegacionComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {}
