import { Injectable, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Limpia el texto libre ingresado por el usuario (título, descripción,
 * solución, nombre) antes de enviarlo al backend, usando DomSanitizer.sanitize
 * con SecurityContext.HTML para descartar cualquier etiqueta o atributo
 * potencialmente peligroso (XSS) antes de que el dato viaje a la API.
 *
 * sanitize() serializa el resultado como fragmento HTML, lo que codifica
 * caracteres acentuados como entidades numéricas (p. ej. "é" -> "&#233;").
 * Como este texto se guarda como dato plano y siempre se muestra luego con
 * interpolación {{ }} (nunca con [innerHTML]), esas entidades no se decodifican
 * solas y quedarían visibles tal cual. Por eso se decodifican aquí mismo con
 * un <textarea> desconectado del documento (nunca se inserta ni se ejecuta,
 * solo sirve para leer .value ya decodificado de forma segura).
 */
@Injectable({ providedIn: 'root' })
export class SanitizacionService {
  private readonly sanitizer = inject(DomSanitizer);

  limpiarTexto(valor: string): string {
    const sinEspaciosSobrantes = valor.trim();
    const textoSanitizado = this.sanitizer.sanitize(SecurityContext.HTML, sinEspaciosSobrantes) ?? '';
    return this.decodificarEntidadesHtml(textoSanitizado);
  }

  private decodificarEntidadesHtml(texto: string): string {
    const contenedor = document.createElement('textarea');
    contenedor.innerHTML = texto;
    return contenedor.value;
  }
}
