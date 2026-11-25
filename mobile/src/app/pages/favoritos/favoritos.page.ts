import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import { IonContent, IonHeader, IonToast } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { plural, ubicacion } from '../../core/formato';
import type { Tarjeta } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { LogoComponent } from '../../ui/logo.component';

/** Favoritos (wireframe: Favoritos, Favoritos-vacio, Favoritos-sin-registro). */
@Component({
  selector: 'app-favoritos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IonToast, RouterLink, IconoComponent, LogoComponent, InvitacionRegistroComponent],
  template: `
    <ion-header class="ion-no-border"
      ><div class="barra-logo"><app-logo /></div
    ></ion-header>
    <ion-content>
      <div class="pagina">
        <div class="titulo">
          <h1>Favoritos</h1>
          @if (sesion.iniciada() && lista().length) {
            <span class="texto-secundario">{{ cuenta() }}</span>
          }
        </div>
        @if (!sesion.iniciada()) {
          <app-invitacion-registro />
        } @else if (cargado() && !lista().length) {
          <div class="estado">
            <app-icono nombre="favorito" [tam]="32" />
            <span class="titulo">¡Aún no tienes favoritos!</span>
            <span class="texto">Encuentra y guarda músicos que te inspiren.</span>
            <a class="btn btn-principal" routerLink="/tabs/explorar">Explorar músicos</a>
          </div>
        } @else {
          <ul>
            @for (f of lista(); track f.id) {
              <li>
                <a class="fila" [routerLink]="['/perfil', f.id]">
                  <span class="avatar">
                    @if (api.media(f.avatarId); as src) {
                      <img [src]="src" alt="" />
                    } @else {
                      <app-icono nombre="persona" [tam]="20" />
                    }
                  </span>
                  <span class="datos">
                    <span class="nombre">{{ f.nombre }}</span>
                    <span class="texto-secundario">{{ f.roles.join(', ') }} · {{ f.generos.join(', ') }}</span>
                    <span class="texto-secundario pequeno">{{ ubic(f) }}</span>
                  </span>
                </a>
                <button
                  type="button"
                  class="quitar"
                  [attr.aria-label]="'Quitar a ' + f.nombre + ' de Favoritos'"
                  (click)="quitar(f)"
                >
                  <app-icono nombre="favorito" [relleno]="true" />
                </button>
              </li>
            }
          </ul>
        }
      </div>
      <ion-toast
        [isOpen]="!!deshacer()"
        [message]="deshacer() ? 'Has quitado a ' + deshacer()!.nombre + ' de Favoritos' : ''"
        [duration]="5000"
        [buttons]="[{ text: 'Deshacer', role: 'deshacer' }]"
        (didDismiss)="alCerrarAviso($event)"
      />
    </ion-content>
  `,
  styles: `
    .titulo {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin: 8px 0 12px;
    }
    h1 {
      margin: 0;
      font-size: 28px;
      line-height: 36px;
      font-weight: 400;
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid var(--outline-variant);
    }
    .fila {
      flex: 1;
      min-width: 0;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 0;
    }
    .avatar {
      flex: none;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--surface-container-highest);
      color: var(--on-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .datos {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 14px;
    }
    .nombre {
      font-size: 16px;
    }
    .pequeno {
      font-size: 12px;
    }
    .quitar {
      flex: none;
      width: 48px;
      height: 48px;
      border: none;
      border-radius: var(--corner-full);
      background: transparent;
      color: var(--acento);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    ion-toast {
      --background: var(--inverse-surface);
      --color: var(--inverse-on-surface);
      --button-color: var(--inverse-on-surface);
    }
  `,
})
export class FavoritosPage implements ViewDidEnter {
  protected readonly api = inject(ApiService);
  protected readonly sesion = inject(SesionService);
  protected readonly lista = signal<Tarjeta[]>([]);
  protected readonly cargado = signal(false);
  protected readonly deshacer = signal<Tarjeta | null>(null);
  protected readonly cuenta = computed(() => plural(this.lista().length, 'músico', 'músicos'));

  constructor() {
    effect(() => {
      if (this.sesion.iniciada()) void this.cargar();
      else this.lista.set([]);
    });
  }

  /** Al volver a la pestaña (p. ej. tras marcar un favorito en un perfil). */
  ionViewDidEnter(): void {
    if (this.sesion.iniciada()) void this.cargar();
  }

  private async cargar() {
    try {
      this.lista.set(await this.api.favoritos());
    } finally {
      this.cargado.set(true);
    }
  }

  protected ubic(f: Tarjeta): string {
    return ubicacion(f.zona, f.lugar);
  }

  protected async quitar(f: Tarjeta): Promise<void> {
    this.lista.update((l) => l.filter((x) => x.id !== f.id));
    this.deshacer.set(f);
    await this.api.quitarFavorito(f.id).catch(() => this.cargar());
  }

  protected async alCerrarAviso(ev: CustomEvent<{ role?: string }>): Promise<void> {
    const f = this.deshacer();
    this.deshacer.set(null);
    if (f && ev.detail.role === 'deshacer') {
      await this.api.anadirFavorito(f.id);
      await this.cargar();
    }
  }
}
