import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';

import { ApiService } from '../core/api.service';
import type { Media } from '../core/modelos';

import { IconoComponent } from './icono.component';

/**
 * Carrusel de fotos y vídeos con puntos (sin flechas). Vídeos aplazados: se muestra la miniatura.
 * En modo editable (Mi perfil) añade «Principal», «Marcar como principal», «Eliminar» y «Añadir».
 */
@Component({
  selector: 'app-carrusel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconoComponent],
  template: `
    <div class="marco">
      <div class="carrusel" #carrusel aria-label="Fotos y vídeos" (scroll)="alDeslizar($event)">
        @for (m of items(); track $index) {
          <div class="diapositiva" role="group" [attr.aria-label]="m.titulo">
            @if (m.img) {
              <img [src]="m.img" alt="" />
            } @else {
              <app-icono nombre="foto" [tam]="32" />
            }
            <span class="rotulo">{{ m.principal && editable() ? 'Principal' : m.titulo }}</span>
            @if (editable()) {
              <div class="acciones">
                @if (!m.principal) {
                  <button type="button" class="pastilla" (click)="principal.emit($index)">Marcar como principal</button>
                }
                <button
                  type="button"
                  class="pastilla"
                  [attr.aria-label]="'Eliminar ' + m.titulo"
                  (click)="eliminar.emit($index)"
                >
                  <app-icono nombre="eliminar" [tam]="18" />Eliminar
                </button>
              </div>
            }
          </div>
        } @empty {
          <div class="diapositiva"><app-icono nombre="foto" [tam]="32" /></div>
        }
      </div>
      @if (editable()) {
        <button type="button" class="pastilla anadir" aria-label="Añadir foto o vídeo" (click)="anadir.emit()">
          <app-icono nombre="anadir" [tam]="18" />Añadir
        </button>
      }
    </div>
    @if (items().length > 1) {
      <div class="puntos">
        @for (m of items(); track $index) {
          <button
            type="button"
            [attr.aria-label]="'Ir a ' + m.titulo"
            [attr.aria-current]="actual() === $index"
            (click)="irA(carrusel, $index)"
          >
            <span [class.activo]="actual() === $index"></span>
          </button>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .marco {
      position: relative;
    }
    .carrusel {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      border-radius: var(--corner-medium);
      scrollbar-width: none;
    }
    .carrusel::-webkit-scrollbar {
      display: none;
    }
    .diapositiva {
      flex: none;
      width: 100%;
      height: 220px;
      scroll-snap-align: start;
      background: var(--surface-container-highest);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
    }
    .diapositiva img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    /* Sobre fotos, texto e iconos van en pastillas surface opacas. */
    .rotulo,
    .pastilla {
      position: absolute;
      height: 26px;
      padding: 0 10px;
      border: none;
      border-radius: var(--corner-full);
      background: var(--surface);
      color: var(--on-surface);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font: 500 12px var(--font-brand);
      white-space: nowrap;
    }
    .rotulo {
      top: 10px;
      left: 10px;
      max-width: 62%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .acciones {
      position: absolute;
      left: 10px;
      bottom: 10px;
      display: flex;
      gap: 6px;
    }
    .acciones .pastilla {
      position: static;
      height: 32px;
      cursor: pointer;
    }
    .anadir {
      top: 10px;
      right: 10px;
      height: 32px;
      cursor: pointer;
    }
    .puntos {
      display: flex;
      justify-content: center;
    }
    .puntos button {
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .puntos span {
      width: 8px;
      height: 8px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 1.5px solid var(--outline);
    }
    .puntos span.activo {
      border: none;
      background: var(--acento);
    }
  `,
})
export class CarruselComponent {
  private readonly api = inject(ApiService);

  readonly media = input.required<Media[]>();
  readonly editable = input(false);
  readonly principal = output<number>();
  readonly eliminar = output<number>();
  readonly anadir = output<void>();

  protected readonly actual = signal(0);
  protected readonly items = computed(() =>
    this.media().map((m) => ({ ...m, img: this.api.media(m.miniaturaId ?? m.archivoId) })),
  );

  protected alDeslizar(ev: Event): void {
    const el = ev.target as HTMLElement;
    this.actual.set(Math.round(el.scrollLeft / el.clientWidth));
  }

  protected irA(carrusel: HTMLElement, i: number): void {
    carrusel.scrollTo({ left: i * carrusel.clientWidth, behavior: 'smooth' });
  }
}
