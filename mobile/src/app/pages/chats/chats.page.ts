import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import type { ViewDidEnter } from '@ionic/angular';
import { IonContent, IonHeader } from '@ionic/angular';

import { ApiService } from '../../core/api.service';
import { ChatSocketService } from '../../core/chat-socket.service';
import type { ResumenChat } from '../../core/modelos';
import { SesionService } from '../../core/sesion.service';
import { IconoComponent } from '../../ui/icono.component';
import { InvitacionRegistroComponent } from '../../ui/invitacion-registro.component';
import { LogoComponent } from '../../ui/logo.component';

/** Lista de chats (wireframe: Chats, Chats-vacio, Chats-sin-registro). */
@Component({
  selector: 'app-chats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, RouterLink, IconoComponent, LogoComponent, InvitacionRegistroComponent],
  template: `
    <ion-header class="ion-no-border"
      ><div class="barra-logo"><app-logo /></div
    ></ion-header>
    <ion-content>
      <div class="pagina">
        <h1>Chats</h1>
        @if (!sesion.iniciada()) {
          <app-invitacion-registro />
        } @else if (cargado() && !chats().length) {
          <div class="estado">
            <app-icono nombre="chat" [tam]="32" />
            <span class="titulo">¡Tu bandeja está vacía!</span>
            <span class="texto">Conecta con otros músicos y empieza a conversar.</span>
            <a class="btn btn-principal" routerLink="/tabs/explorar">Buscar músicos</a>
          </div>
        } @else {
          <ul>
            @for (c of chats(); track c.id) {
              <li>
                <a class="fila" [routerLink]="['/chat', c.id]">
                  <span class="avatar">
                    @if (api.media(c.con?.avatarId); as src) {
                      <img [src]="src" alt="" />
                    } @else {
                      <app-icono nombre="persona" [tam]="20" />
                    }
                  </span>
                  <span class="datos">
                    <span class="nombre">{{ c.con?.nombre }}</span>
                    <span class="previa" [class.sin-leer]="c.noLeidos">{{ c.ultimoMensaje }}</span>
                  </span>
                  <span class="lado">
                    <span class="hora">{{ hora(c.ultimoMensajeAt) }}</span>
                    @if (c.noLeidos) {
                      <span class="insignia" [attr.aria-label]="c.noLeidos + ' sin leer'">{{ c.noLeidos }}</span>
                    }
                  </span>
                </a>
              </li>
            }
          </ul>
        }
      </div>
    </ion-content>
  `,
  styles: `
    h1 {
      margin: 8px 0 12px;
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
      border-bottom: 1px solid var(--outline-variant);
    }
    .fila {
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
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nombre {
      font-size: 16px;
    }
    .previa {
      font-size: 14px;
      color: var(--on-surface-variant);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .previa.sin-leer {
      color: var(--on-surface);
      font-weight: 500;
    }
    .lado {
      flex: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .hora {
      font: 500 11px var(--font-brand);
      color: var(--on-surface-variant);
    }
    .insignia {
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      box-sizing: border-box;
      border-radius: var(--corner-full);
      background: var(--acento);
      color: var(--on-acento);
      font: 500 11px/20px var(--font-brand);
      text-align: center;
    }
  `,
})
export class ChatsPage implements ViewDidEnter {
  protected readonly api = inject(ApiService);
  protected readonly sesion = inject(SesionService);
  protected readonly chats = signal<ResumenChat[]>([]);
  protected readonly cargado = signal(false);

  constructor() {
    effect(() => {
      if (this.sesion.iniciada()) void this.cargar();
      else this.chats.set([]);
    });
    // Un mensaje nuevo en cualquier chat actualiza la lista.
    inject(ChatSocketService)
      .mensajeNuevo$.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => void this.cargar());
  }

  ionViewDidEnter(): void {
    if (this.sesion.iniciada()) void this.cargar();
  }

  private async cargar() {
    try {
      this.chats.set(await this.api.chats());
    } finally {
      this.cargado.set(true);
    }
  }

  /** «10:24» hoy, «Ayer», o la fecha corta (como el wireframe). */
  protected hora(iso: string | null): string {
    if (!iso) return '';
    const d = new Date(iso);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(hoy.getDate() - 1);
    if (d.toDateString() === hoy.toDateString()) {
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    if (d.toDateString() === ayer.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
}
