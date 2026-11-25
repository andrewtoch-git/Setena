import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/** Iconos de trazo redondeado copiados del wireframe (estilo Material Symbols Rounded). */
const ICONOS: Record<string, string> = {
  volver: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  buscar: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  filtros: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  error: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  favorito: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  euro: '<circle cx="12" cy="12" r="9"/><path d="M15 9a4 4 0 1 0 0 6M7 11h6M7 13h6"/>',
  personas:
    '<circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .5 3 2.3 3 5"/>',
  explorar: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  chat: '<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
  compartir:
    '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>',
  mas: '<circle cx="12" cy="5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
  ajustes:
    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  anadir: '<path d="M12 5v14M5 12h14"/>',
  enlace:
    '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  salir: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
  eliminar: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  siguiente: '<path d="M9 6l6 6-6 6"/>',
  confirmado: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  foto: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 8"/>',
};

@Component({
  selector: 'app-icono',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', style: 'display: inline-flex; flex: none' },
  template: `<svg
    [attr.width]="tam()"
    [attr.height]="tam()"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    [attr.fill]="relleno() ? 'currentColor' : 'none'"
    [innerHTML]="trazo()"
  ></svg>`,
})
export class IconoComponent {
  readonly nombre = input.required<string>();
  readonly tam = input(24);
  /** Relleno = estado seleccionado (regla de iconografía). */
  readonly relleno = input(false);
  private readonly sanitizer = inject(DomSanitizer);
  // Los trazos son constantes de este archivo (no vienen del usuario): se marcan como seguros.
  protected readonly trazo = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICONOS[this.nombre()] ?? ''));
}
