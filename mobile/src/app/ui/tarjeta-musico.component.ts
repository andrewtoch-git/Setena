import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiService } from '../core/api.service';
import { haceCuanto, ubicacion } from '../core/formato';
import type { Tarjeta } from '../core/modelos';

import { IconoComponent } from './icono.component';

/**
 * Tarjeta de músico de Explorar (wireframe: Explorar). Sin botón de reproducir mientras los
 * vídeos estén aplazados (decisión delegada: se muestra la miniatura principal).
 */
@Component({
  selector: 'app-tarjeta-musico',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconoComponent],
  template: `
    @let t = tarjeta();
    <article>
      <a class="foto" [routerLink]="['/perfil', t.id]" [attr.aria-label]="'Ver perfil de ' + t.nombre">
        @if (miniatura(); as src) {
          <img [src]="src" alt="" loading="lazy" />
        } @else {
          <app-icono nombre="foto" [tam]="32" class="marcador" />
        }
        <span class="nombre">
          <span class="avatar">
            @if (avatar(); as src) {
              <img [src]="src" alt="" loading="lazy" />
            } @else {
              <app-icono nombre="persona" [tam]="16" />
            }
          </span>
          {{ t.nombre }}
        </span>
      </a>
      <div class="cuerpo">
        <a class="datos" [routerLink]="['/perfil', t.id]">
          <div class="fila">
            <span class="rol">{{ t.roles.join(', ') }}</span>
            <span class="meta">Última actividad: {{ actividad() }}</span>
          </div>
          <span class="meta">Géneros: {{ t.generos.join(', ') }}</span>
          <span class="meta">Ubicación: {{ ubic() }}</span>
          <span class="meta"
            >Disponibilidad: {{ t.disponibilidad.length ? t.disponibilidad.join(' · ') : 'No indicada' }}</span
          >
        </a>
        @if (t.remunerados || t.colaboraciones) {
          <div class="etiquetas">
            @if (t.remunerados) {
              <span class="etiqueta"><app-icono nombre="euro" [tam]="16" />Proyectos remunerados</span>
            }
            @if (t.colaboraciones) {
              <span class="etiqueta"><app-icono nombre="personas" [tam]="16" />Colaboraciones gratuitas</span>
            }
          </div>
        }
        <div class="acciones">
          <button class="btn btn-contorno" type="button" (click)="chat.emit(t)">Chat</button>
          <a class="btn btn-principal" [routerLink]="['/perfil', t.id]">Ver perfil</a>
        </div>
      </div>
    </article>
  `,
  styles: `
    article {
      border: 1px solid var(--outline-variant);
      border-radius: var(--corner-medium);
      overflow: hidden;
    }
    .foto {
      height: 196px;
      background: var(--surface-container-highest);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
    }
    .foto > img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .nombre {
      position: absolute;
      top: 10px;
      left: 10px;
      background: var(--surface);
      border-radius: var(--corner-full);
      padding: 4px 12px 4px 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--on-surface);
    }
    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--surface-container-high);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cuerpo {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .datos {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .fila {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8px;
    }
    .rol {
      font-size: 14px;
      font-weight: 500;
    }
    .meta {
      font-size: 12px;
      color: var(--on-surface-variant);
    }
    .etiquetas {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .acciones {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 6px;
      margin-top: 8px;
    }
    .acciones .btn {
      width: 100%;
      padding: 0;
    }
  `,
})
export class TarjetaMusicoComponent {
  private readonly api = inject(ApiService);
  readonly tarjeta = input.required<Tarjeta>();
  readonly chat = output<Tarjeta>();

  protected readonly miniatura = computed(() => this.api.media(this.tarjeta().principal?.miniaturaId));
  protected readonly avatar = computed(() => this.api.media(this.tarjeta().avatarId));
  protected readonly actividad = computed(() => haceCuanto(this.tarjeta().ultimaActividadAt));
  protected readonly ubic = computed(() => ubicacion(this.tarjeta().zona, this.tarjeta().lugar));
}
