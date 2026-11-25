import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Logotipo de la barra superior: símbolo de 24 dp + «setena» en Nunito Bold 22 px. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg width="24" height="22" viewBox="-105.04 -94.64 210.08 189.28" aria-hidden="true">
      <g class="puntos">
        <circle cx="-38.9" cy="-67.4" r="27.24" />
        <circle cx="38.9" cy="-67.4" r="27.24" />
        <circle cx="-77.8" cy="0" r="27.24" />
        <circle cx="-38.9" cy="67.4" r="27.24" />
        <circle cx="38.9" cy="67.4" r="27.24" />
      </g>
      <g class="par">
        <circle cx="0" cy="0" r="27.24" />
        <circle cx="77.8" cy="0" r="27.24" />
        <path d="M23.01,-14.59a18.83,18.83 0 0 0 31.82,0L54.83,14.59a18.83,18.83 0 0 0 -31.82,0Z" />
      </g>
    </svg>
    <span class="nombre">setena</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .puntos {
      fill: var(--palette-primary-40);
    }
    .par {
      fill: var(--acento);
    }
    .nombre {
      font-family: var(--font-logo);
      font-weight: 700;
      font-size: 22px;
      line-height: 1;
      letter-spacing: -0.2px;
      color: var(--on-surface);
    }
  `,
})
export class LogoComponent {}
