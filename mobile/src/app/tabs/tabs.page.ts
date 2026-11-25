import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { filter } from 'rxjs';

import { ApiService } from '../core/api.service';
import { SesionService } from '../core/sesion.service';
import { IconoComponent } from '../ui/icono.component';

/** Barra de navegación inferior: Explorar · Favoritos · Chats · Mi perfil. */
@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IconoComponent],
  template: `
    <ion-tabs (ionTabsDidChange)="activa.set($event.tab)">
      <ion-tab-bar slot="bottom">
        @for (t of pestanas; track t.tab) {
          <ion-tab-button
            [tab]="t.tab"
            [href]="'/tabs/' + t.tab"
            [attr.aria-label]="
              t.tab === 'chats' && noLeidos()
                ? 'Chats, ' + noLeidos() + ' mensaje' + (noLeidos() === 1 ? '' : 's') + ' sin leer'
                : null
            "
          >
            <span class="indicador" [class.activo]="activa() === t.tab">
              <app-icono
                [nombre]="t.icono"
                [relleno]="activa() === t.tab && t.icono !== 'explorar' && t.icono !== 'chat'"
              />
              @if (t.tab === 'chats' && noLeidos()) {
                <span class="insignia" aria-hidden="true">{{ noLeidos() }}</span>
              }
            </span>
            <ion-label>{{ t.texto }}</ion-label>
          </ion-tab-button>
        }
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: `
    ion-tab-bar {
      height: 80px;
      padding: 12px 0 16px;
    }
    ion-tab-button {
      --color: var(--on-surface-variant);
      --color-selected: var(--secondary);
      font: 500 12px/16px var(--font-brand);
      letter-spacing: 0.5px;
    }
    ion-tab-button.tab-selected ion-label {
      font-weight: 700;
    }
    ion-label {
      margin-top: 4px;
    }
    .indicador {
      position: relative;
      width: 56px;
      height: 32px;
      border-radius: var(--corner-full);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
    }
    .indicador.activo {
      background: var(--degradado-tonal), var(--secondary-container);
      color: var(--on-secondary-container);
    }
    .insignia {
      position: absolute;
      top: 0;
      right: 8px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      box-sizing: border-box;
      border-radius: var(--corner-full);
      background: var(--acento);
      color: var(--on-acento);
      font: 500 11px/16px var(--font-brand);
      text-align: center;
    }
  `,
})
export class TabsPage {
  private readonly api = inject(ApiService);
  private readonly sesion = inject(SesionService);

  protected readonly pestanas = [
    { tab: 'explorar', texto: 'Explorar', icono: 'explorar' },
    { tab: 'favoritos', texto: 'Favoritos', icono: 'favorito' },
    { tab: 'chats', texto: 'Chats', icono: 'chat' },
    { tab: 'mi-perfil', texto: 'Mi perfil', icono: 'persona' },
  ];
  protected readonly activa = signal('explorar');
  protected readonly noLeidos = signal(0);

  constructor() {
    // Insignia de Chats: se actualiza al iniciar sesión y en cada cambio de pantalla.
    effect(() => {
      if (this.sesion.iniciada()) void this.actualizarNoLeidos();
      else this.noLeidos.set(0);
    });
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.sesion.iniciada()) void this.actualizarNoLeidos();
      });
  }

  private async actualizarNoLeidos() {
    try {
      this.noLeidos.set((await this.api.noLeidos()).total);
    } catch {
      // sin conexión: se mantiene el último valor
    }
  }
}
