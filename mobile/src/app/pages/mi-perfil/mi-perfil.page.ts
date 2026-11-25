import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import { IonContent, IonHeader, NavController } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import type { Ficha } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { LogoComponent } from '../../ui/logo.component';

/**
 * Mi perfil. Esta iteración: resumen de mi perfil, enlace a mi ficha pública y cerrar sesión.
 * Editar perfil, fotos y Ajustes quedan para la siguiente iteración.
 */
@Component({
  selector: 'app-mi-perfil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, RouterLink, IconoComponent, LogoComponent, InvitacionRegistroComponent],
  template: `
    <ion-header class="ion-no-border"
      ><div class="barra-logo"><app-logo /></div
    ></ion-header>
    <ion-content>
      <div class="pagina">
        <h1>Mi perfil</h1>
        @if (!sesion.iniciada()) {
          <app-invitacion-registro />
        } @else if (perfil(); as p) {
          <a class="cabecera" [routerLink]="['/perfil', p.id]">
            <span class="avatar">
              @if (api.media(p.avatarId); as src) {
                <img [src]="src" alt="" />
              } @else {
                <app-icono nombre="persona" [tam]="40" />
              }
            </span>
            <span class="datos">
              <span class="nombre">{{ p.nombre }}</span>
              <span class="texto-secundario">{{ p.roles.join(', ') }} · {{ p.generos.join(', ') }}</span>
              <span class="texto-secundario">{{ sesion.usuario()?.email }}</span>
            </span>
          </a>
          <button type="button" class="btn btn-contorno" (click)="cerrarSesion()">Cerrar sesión</button>
        }
      </div>
    </ion-content>
  `,
  styles: `
    h1 {
      margin: 8px 0 16px;
      font-size: 28px;
      line-height: 36px;
      font-weight: 400;
    }
    .cabecera {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 24px;
    }
    .avatar {
      flex: none;
      width: 80px;
      height: 80px;
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
      font-size: 22px;
      line-height: 28px;
      font-weight: 500;
    }
  `,
})
export class MiPerfilPage implements ViewDidEnter {
  protected readonly api = inject(ApiService);
  protected readonly sesion = inject(SesionService);
  private readonly nav = inject(NavController);
  protected readonly perfil = signal<Ficha | null>(null);

  constructor() {
    effect(() => {
      if (this.sesion.iniciada()) void this.cargar();
      else this.perfil.set(null);
    });
  }

  ionViewDidEnter(): void {
    if (this.sesion.iniciada()) void this.cargar();
  }

  private async cargar() {
    try {
      this.perfil.set((await this.api.yo()).perfil);
    } catch {
      // sin conexión: se mantiene lo último cargado
    }
  }

  protected async cerrarSesion(): Promise<void> {
    await this.sesion.logout();
    void this.nav.navigateRoot('/tabs/explorar');
  }
}
