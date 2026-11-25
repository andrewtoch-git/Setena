import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import type { ElementRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IonContent, IonFooter, IonHeader, IonModal, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/api.service';
import type { MensajeChat } from '../../core/chat-socket.service';
import { ChatSocketService, ErrorChat } from '../../core/chat-socket.service';
import { ubicacion } from '../../core/formato';
import type { PerfilCompartido, ResumenChat } from '../../core/modelos';
import { IconoComponent } from '../../ui/icono.component';
import { OpcionesPerfilComponent } from '../../ui/opciones-perfil.component';

interface Burbuja extends MensajeChat {
  /** Solo en mensajes propios pendientes o fallidos. */
  estado?: 'enviando' | 'fallido';
  local?: string;
}

const SUGERENCIA = 'Hola, he visto tu perfil y me interesa colaborar contigo. ¿Hablamos?';

/** Conversación (wireframe: Chat-*). Historial por REST; envío y avisos por WebSocket. */
@Component({
  selector: 'app-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonContent, IonFooter, IonModal, RouterLink, IconoComponent, OpcionesPerfilComponent],
  templateUrl: './chat.page.html',
  styleUrl: './chat.page.scss',
})
export class ChatPage {
  private readonly api = inject(ApiService);
  private readonly http = inject(HttpClient);
  private readonly socket = inject(ChatSocketService);
  private readonly nav = inject(NavController);
  private readonly contenido = viewChild(IonContent);
  private readonly campo = viewChild<ElementRef<HTMLTextAreaElement>>('campo');

  readonly id = input.required<string>();

  protected readonly resumen = signal<ResumenChat | null>(null);
  protected readonly mensajes = signal<Burbuja[]>([]);
  protected readonly cargando = signal(true);
  /** La otra persona me ha bloqueado (lo sabemos al intentar enviar). */
  protected readonly bloqueado = signal(false);
  /** Yo he bloqueado a la otra persona. */
  protected readonly bloqueadoPorMi = signal(false);
  protected readonly opciones = signal(false);
  protected readonly texto = signal('');
  protected readonly sugerencia = SUGERENCIA;

  protected readonly avatar = computed(() => this.api.media(this.resumen()?.con?.avatarId));
  /** «Enviado» bajo el último mensaje propio confirmado (como el wireframe). */
  protected readonly ultimoPropio = computed(() => {
    const propios = this.mensajes().filter((m) => m.mio && !m.estado);
    return propios.length ? propios[propios.length - 1].id : null;
  });

  constructor() {
    effect(() => void this.cargar(this.id()));

    this.socket.mensajeNuevo$.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((d) => {
      if (d.conversacionId !== this.id()) return;
      // El propio mensaje ya está en la lista (por el ack); solo se añaden los que faltan.
      if (this.mensajes().some((m) => m.id === d.mensaje.id)) return;
      this.mensajes.update((l) => [...l, d.mensaje]);
      if (!d.mensaje.mio) void this.marcarLeido();
      this.bajar();
    });
    this.socket.conversacionLeida$.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe((d) => {
      if (d.conversacionId !== this.id()) return;
      this.mensajes.update((l) => l.map((m) => (m.mio && !m.leidoAt ? { ...m, leidoAt: d.leidoAt } : m)));
    });
  }

  private async cargar(id: string) {
    this.cargando.set(true);
    try {
      const [chats, historial] = await Promise.all([
        this.api.chats(),
        firstValueFrom(
          this.http.get<MensajeChat[]>(`${environment.apiUrl}/conversaciones/${id}/mensajes`, {
            params: { limite: 100 },
          }),
        ),
      ]);
      const resumen = chats.find((c) => c.id === id) ?? null;
      this.resumen.set(resumen);
      this.mensajes.set(historial);
      if (resumen?.con) void this.estadoBloqueo(resumen.con.perfilId);
      void this.marcarLeido();
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 404) this.nav.back();
    } finally {
      this.cargando.set(false);
      this.bajar();
    }
  }

  private async estadoBloqueo(perfilId: string): Promise<void> {
    try {
      this.bloqueadoPorMi.set((await this.api.perfil(perfilId)).bloqueadoPorMi);
    } catch (e) {
      // 404: la otra persona me ha bloqueado o ha borrado su cuenta
      if (e instanceof HttpErrorResponse && e.status === 404) this.bloqueado.set(true);
    }
  }

  protected async desbloquear(): Promise<void> {
    const con = this.resumen()?.con;
    if (!con) return;
    try {
      await this.api.desbloquear(con.perfilId);
      this.bloqueadoPorMi.set(false);
    } catch {
      // se mantiene el aviso
    }
  }

  protected bloqueoCambiado(bloqueado: boolean): void {
    this.bloqueadoPorMi.set(bloqueado);
  }

  /** Datos de la tarjeta «Perfil compartido». */
  protected lineaPerfil(p: PerfilCompartido): string {
    return `${p.roles.join(', ')} · ${p.generos.join(', ')}`;
  }

  protected ubicPerfil(p: PerfilCompartido): string {
    return ubicacion(p.zona, p.lugar);
  }

  private async marcarLeido() {
    try {
      await this.socket.marcarLeido(this.id());
    } catch {
      await firstValueFrom(this.http.post(`${environment.apiUrl}/conversaciones/${this.id()}/leido`, null)).catch(
        () => undefined,
      );
    }
  }

  protected volver(): void {
    this.nav.back();
  }

  protected usarSugerencia(): void {
    this.texto.set(SUGERENCIA);
    this.campo()?.nativeElement.focus();
  }

  protected async enviar(textoReintento?: string, local?: string): Promise<void> {
    const texto = (textoReintento ?? this.texto()).trim();
    if (!texto) return;
    const idLocal = local ?? `local-${Date.now()}`;
    if (!textoReintento) {
      this.texto.set('');
      this.mensajes.update((l) => [
        ...l,
        {
          id: idLocal,
          local: idLocal,
          texto,
          mio: true,
          enviadoAt: new Date().toISOString(),
          leidoAt: null,
          estado: 'enviando',
        },
      ]);
    } else {
      this.cambiar(idLocal, { estado: 'enviando' });
    }
    this.bajar();
    try {
      const m = await this.socket.enviar(this.id(), texto);
      // Si el aviso mensaje:nuevo llegó antes que el ack, se quita el duplicado.
      this.mensajes.update((l) => l.filter((x) => x.id !== m.id).map((x) => (x.local === idLocal ? { ...m } : x)));
    } catch (e) {
      if (e instanceof ErrorChat && e.status === 403) this.bloqueado.set(true);
      this.cambiar(idLocal, { estado: 'fallido' });
    }
  }

  protected reintentar(m: Burbuja): void {
    if (m.local) void this.enviar(m.texto, m.local);
  }

  private cambiar(local: string, cambios: Partial<Burbuja>) {
    this.mensajes.update((l) => l.map((x) => (x.local === local ? { ...x, ...cambios } : x)));
  }

  protected teclado(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      void this.enviar();
    }
  }

  private bajar() {
    setTimeout(() => void this.contenido()?.scrollToBottom(200), 0);
  }
}
