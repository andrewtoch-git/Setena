import { Injectable, effect, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

import { environment } from '../../environments/environment';

import { SesionService } from './sesion.service';

export interface MensajeChat {
  id: string;
  texto: string;
  mio: boolean;
  enviadoAt: string;
  leidoAt: string | null;
}

type Ack<T> = { ok: true; datos: T } | { ok: false; error: string; status: number };

const ESPERA_ACK_MS = 5000;

/**
 * Chat en tiempo real (contrato en docs/evaluacion-websocket.md). Se conecta solo con sesión,
 * renueva el token si el servidor lo rechaza o caduca, y expone los avisos como Subjects.
 */
@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private readonly sesion = inject(SesionService);
  private socket: Socket | null = null;

  readonly conectado = signal(false);
  readonly mensajeNuevo$ = new Subject<{ conversacionId: string; mensaje: MensajeChat }>();
  readonly conversacionLeida$ = new Subject<{ conversacionId: string; leidoAt: string }>();

  constructor() {
    effect(() => (this.sesion.iniciada() ? this.conectar() : this.desconectar()));
  }

  private conectar() {
    if (this.socket) return;
    const s = io(`${environment.apiUrl}/chat`, {
      transports: ['websocket'],
      // Se evalúa en cada intento de conexión: siempre usa el token más reciente.
      auth: (cb) => cb({ token: this.sesion.accessToken }),
    });
    s.on('connect', () => this.conectado.set(true));
    s.on('disconnect', () => this.conectado.set(false));
    s.on('mensaje:nuevo', (d: { conversacionId: string; mensaje: MensajeChat }) => this.mensajeNuevo$.next(d));
    s.on('conversacion:leida', (d: { conversacionId: string; leidoAt: string }) => this.conversacionLeida$.next(d));
    // Token caducado o rechazado: se renueva y se vuelve a conectar.
    const renovar = async () => {
      if ((await this.sesion.refrescar()) && this.socket === s) s.connect();
    };
    s.on('sesion:caducada', () => void renovar());
    s.on('error:auth', () => void renovar());
    this.socket = s;
  }

  private desconectar() {
    this.socket?.disconnect();
    this.socket = null;
    this.conectado.set(false);
  }

  /** Envía por el socket y espera la confirmación. Sin conexión o sin ack en 5 s → error. */
  async enviar(conversacionId: string, texto: string): Promise<MensajeChat> {
    const r = await this.emitir<MensajeChat>('mensaje:enviar', { conversacionId, texto });
    return r;
  }

  async marcarLeido(conversacionId: string): Promise<void> {
    await this.emitir('conversacion:leer', { conversacionId });
  }

  private async emitir<T>(evento: string, datos: unknown): Promise<T> {
    if (!this.socket?.connected) throw new ErrorChat('Sin conexión', 0);
    let r: Ack<T>;
    try {
      r = (await this.socket.timeout(ESPERA_ACK_MS).emitWithAck(evento, datos)) as Ack<T>;
    } catch {
      throw new ErrorChat('Sin respuesta', 0);
    }
    if (!r.ok) throw new ErrorChat(r.error, r.status);
    return r.datos;
  }
}

export class ErrorChat extends Error {
  constructor(
    mensaje: string,
    readonly status: number,
  ) {
    super(mensaje);
  }
}
