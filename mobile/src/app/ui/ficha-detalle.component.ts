import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { precio } from '../core/formato';
import type { Ficha } from '../core/modelos';

const REDES = [
  { clave: 'instagram', nombre: 'Instagram', letra: 'I' },
  { clave: 'youtube', nombre: 'YouTube', letra: 'Y' },
  { clave: 'spotify', nombre: 'Spotify', letra: 'S' },
  { clave: 'tiktok', nombre: 'TikTok', letra: 'T' },
  { clave: 'soundcloud', nombre: 'SoundCloud', letra: 'SC' },
] as const;

/**
 * Pestañas Info / Tarifas de un perfil (compartido por la ficha pública y Mi perfil).
 * Con propio = true usa los textos de Mi perfil («Aún no has…»).
 */
@Component({
  selector: 'app-ficha-detalle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let f = ficha();
    <div class="pestanas" role="tablist">
      <button role="tab" type="button" [attr.aria-selected]="pestana() === 'info'" (click)="pestana.set('info')">
        Info
      </button>
      <button role="tab" type="button" [attr.aria-selected]="pestana() === 'tarifas'" (click)="pestana.set('tarifas')">
        Tarifas
      </button>
    </div>

    @if (pestana() === 'info') {
      <div class="info">
        <section>
          <h3>Sobre mí</h3>
          <p>
            {{
              f.sobreMi || (propio() ? 'Aún no has escrito nada sobre ti.' : 'Aún no ha escrito nada sobre sí mismo.')
            }}
          </p>
        </section>
        <section>
          <h3>Disponibilidad</h3>
          <p>{{ f.disponibilidad.length ? f.disponibilidad.join(' · ') : 'No indicada' }}</p>
        </section>
        <section>
          <h3>Redes sociales</h3>
          @if (redes().length) {
            <div class="redes">
              @for (r of redes(); track r.clave) {
                <a [href]="r.url" target="_blank" rel="noopener">
                  <span class="red">{{ r.letra }}</span>{{ r.nombre }}
                </a>
              }
            </div>
          } @else {
            <p>{{ propio() ? 'Aún no has añadido redes sociales.' : 'Aún no ha añadido redes sociales.' }}</p>
          }
        </section>
      </div>
    } @else {
      <div class="tarifas">
        @for (t of f.tarifas; track t.servicio) {
          <div class="tarifa">
            <div class="col">
              <span class="servicio">{{ t.nombre }}</span>
              <span class="pequeno">{{ t.servicio === 'otros' ? t.texto : t.descripcion }}</span>
            </div>
            @if (t.servicio !== 'otros') {
              <div class="col derecha">
                <span class="importe">{{ precio(t) }}</span>
                @if (t.precio !== null) {
                  <span class="pequeno">{{ t.unidad }}</span>
                }
              </div>
            }
          </div>
        } @empty {
          <p class="texto-secundario">{{ propio() ? 'Aún no has añadido tarifas.' : 'Aún no ha añadido tarifas.' }}</p>
        }
        @if (f.tarifas.length) {
          <p class="pequeno nota">Precios orientativos. El precio final se acuerda por chat.</p>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .pestanas {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-bottom: 1px solid var(--outline-variant);
    }
    .pestanas button {
      height: 48px;
      border: none;
      border-bottom: 3px solid transparent;
      background: transparent;
      color: var(--on-surface-variant);
      font: 500 14px var(--font-brand);
      cursor: pointer;
    }
    .pestanas button[aria-selected='true'] {
      border-bottom-color: var(--acento);
      color: var(--on-surface);
    }
    .info {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    section {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 500;
    }
    p {
      margin: 0;
      font-size: 14px;
      line-height: 1.35;
      color: var(--on-surface-variant);
    }
    .redes {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
    }
    .redes a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 12px;
    }
    .red {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid var(--outline);
      background: var(--surface-container-high);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    .tarifa {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid var(--outline-variant);
    }
    .col {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .derecha {
      flex: none;
      align-items: flex-end;
    }
    .servicio {
      font-size: 14px;
      font-weight: 500;
    }
    .importe {
      font-size: 16px;
      font-weight: 700;
    }
    .pequeno {
      font-size: 12px;
      color: var(--on-surface-variant);
    }
    .nota {
      margin-top: 12px;
    }
  `,
})
export class FichaDetalleComponent {
  readonly ficha = input.required<Ficha>();
  readonly propio = input(false);

  protected readonly pestana = signal<'info' | 'tarifas'>('info');
  protected readonly precio = precio;
  protected readonly redes = computed(() => {
    const r = this.ficha().redes;
    return REDES.filter((x) => r[x.clave]).map((x) => ({ ...x, url: r[x.clave] as string }));
  });
}
