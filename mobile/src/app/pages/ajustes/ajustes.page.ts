import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonModal, IonToast, NavController } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import type { Ajustes, Yo } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { DialogoComponent } from '../../ui/dialogo.component';
import { IconoComponent } from '../../ui/icono.component';

/** Ajustes (wireframe: Ajustes, Ajustes-cerrar-sesion, Ajustes-eliminar-cuenta). */
@Component({
  selector: 'app-ajustes',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IonModal, IonToast, RouterLink, IconoComponent, DialogoComponent],
  template: `
    <ion-header class="ion-no-border">
      <div class="barra">
        <button type="button" class="icono-boton" aria-label="Volver" (click)="nav.back()">
          <app-icono nombre="volver" />
        </button>
        <h1>Ajustes</h1>
      </div>
    </ion-header>
    <ion-content>
      @if (yo(); as y) {
        <div class="pagina">
          <span class="seccion">CUENTA</span>
          <div class="fila">
            <span class="dos-lineas"
              ><span>Correo electrónico</span><small>{{ y.email }}</small></span
            >
          </div>
          @if (y.tienePassword) {
            <a class="fila" routerLink="/ajustes/contrasena">
              <span class="crece">Cambiar contraseña</span>
              <app-icono nombre="siguiente" [tam]="20" />
            </a>
          }

          <span class="seccion">NOTIFICACIONES</span>
          <button
            type="button"
            class="fila"
            role="switch"
            [attr.aria-checked]="y.ajustes.notifMensajes"
            (click)="alternar('notifMensajes')"
          >
            <span class="dos-lineas crece"
              ><span>Mensajes nuevos</span><small>Aviso cuando alguien te escribe</small></span
            >
            <span class="interruptor" [class.on]="y.ajustes.notifMensajes" aria-hidden="true"><span></span></span>
          </button>
          <button
            type="button"
            class="fila"
            role="switch"
            [attr.aria-checked]="y.ajustes.notifNovedades"
            (click)="alternar('notifNovedades')"
          >
            <span class="dos-lineas crece"
              ><span>Novedades de la app</span><small>Consejos y nuevas funciones</small></span
            >
            <span class="interruptor" [class.on]="y.ajustes.notifNovedades" aria-hidden="true"><span></span></span>
          </button>

          <span class="seccion">SESIÓN</span>
          <button type="button" class="fila" (click)="dialogo.set('salir')">
            <app-icono nombre="salir" [tam]="20" />Cerrar sesión
          </button>
          <button type="button" class="fila" (click)="dialogo.set('eliminar')">
            <app-icono nombre="eliminar" [tam]="20" />Eliminar cuenta
          </button>
        </div>
      }

      <ion-toast [isOpen]="!!aviso()" [message]="aviso()" [duration]="3000" (didDismiss)="aviso.set(null)" />

      <ion-modal class="ventana" [isOpen]="dialogo() === 'salir'" (didDismiss)="dialogo.set(null)">
        <ng-template>
          <app-dialogo
            titulo="¿Cerrar sesión?"
            texto="Podrás volver a entrar con tu correo y tu contraseña cuando quieras."
            accion="Cerrar sesión"
            [destructiva]="true"
            (confirmar)="cerrarSesion()"
            (cerrar)="dialogo.set(null)"
          />
        </ng-template>
      </ion-modal>
      <ion-modal class="ventana" [isOpen]="dialogo() === 'eliminar'" (didDismiss)="dialogo.set(null)">
        <ng-template>
          <app-dialogo
            titulo="¿Eliminar tu cuenta?"
            texto="Se borrarán tu perfil, tus favoritos y tus chats. Esta acción no se puede deshacer."
            accion="Eliminar cuenta"
            [destructiva]="true"
            (confirmar)="eliminarCuenta()"
            (cerrar)="dialogo.set(null)"
          />
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  styles: `
    .barra {
      height: 56px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    h1 {
      margin: 0;
      font-size: 22px;
      line-height: 28px;
      font-weight: 400;
    }
    .pagina {
      display: flex;
      flex-direction: column;
    }
    .seccion {
      margin-top: 14px;
      font: 500 12px/16px var(--font-brand);
      letter-spacing: 0.5px;
      color: var(--on-surface-variant);
    }
    .fila {
      min-height: 56px;
      border: none;
      border-bottom: 1px solid var(--outline-variant);
      background: transparent;
      color: var(--on-surface);
      font: 400 16px var(--font-brand);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0;
      text-align: left;
      cursor: pointer;
    }
    .crece {
      flex: 1;
    }
    .dos-lineas {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    small {
      font-size: 12px;
      color: var(--on-surface-variant);
    }
    /* Interruptor: encendido en acento (lima); apagado en outline */
    .interruptor {
      flex: none;
      width: 52px;
      height: 32px;
      box-sizing: border-box;
      border-radius: var(--corner-full);
      border: 2px solid var(--outline);
      background: var(--surface-container-highest);
      padding: 4px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .interruptor span {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--outline);
    }
    .interruptor.on {
      border-color: var(--acento);
      background: var(--acento);
      justify-content: flex-end;
    }
    .interruptor.on span {
      width: 24px;
      height: 24px;
      background: var(--on-acento);
    }
  `,
})
export class AjustesPage {
  private readonly api = inject(ApiService);
  private readonly sesion = inject(SesionService);
  protected readonly nav = inject(NavController);

  protected readonly yo = signal<Yo | null>(null);
  protected readonly dialogo = signal<'salir' | 'eliminar' | null>(null);
  protected readonly aviso = signal<string | null>(null);

  constructor() {
    void this.api.yo().then(
      (y) => this.yo.set(y),
      () => undefined,
    );
  }

  protected async alternar(clave: keyof Ajustes): Promise<void> {
    const y = this.yo();
    if (!y) return;
    const nuevo = { ...y.ajustes, [clave]: !y.ajustes[clave] };
    this.yo.set({ ...y, ajustes: nuevo }); // optimista
    try {
      await this.api.guardarAjustes({ [clave]: nuevo[clave] });
    } catch {
      this.yo.set(y);
      this.aviso.set('No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.');
    }
  }

  protected async cerrarSesion(): Promise<void> {
    this.dialogo.set(null);
    await this.sesion.logout();
    void this.nav.navigateRoot('/inicio');
  }

  protected async eliminarCuenta(): Promise<void> {
    this.dialogo.set(null);
    try {
      await this.api.eliminarCuenta();
      await this.sesion.logout();
      void this.nav.navigateRoot('/inicio');
    } catch {
      this.aviso.set('No se ha podido completar la acción. Revisa tu conexión e inténtalo de nuevo.');
    }
  }
}
