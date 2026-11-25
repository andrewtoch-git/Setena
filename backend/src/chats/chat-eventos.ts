import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

export const salaUsuario = (userId: string) => `usuario:${userId}`;

export interface PerfilCompartido {
  id: string;
  nombre: string;
  roles: string[];
  generos: string[];
  zona: string;
  lugar: string;
  avatarId: string | null;
}

export interface MensajeEmitido {
  id: string;
  texto: string;
  de: string;
  enviadoAt: Date;
  leidoAt: Date | null;
  perfil: PerfilCompartido | null;
}

/**
 * Puente entre el servicio de chats y socket.io. El gateway le pasa el servidor al arrancar;
 * si no hay servidor (p. ej. tests sin sockets), las notificaciones simplemente no se envían.
 */
@Injectable()
export class ChatEventos {
  server?: Server;

  mensajeNuevo(
    conversacionId: string,
    participantes: string[],
    m: MensajeEmitido,
  ) {
    if (!this.server) return;
    for (const userId of participantes) {
      this.server.to(salaUsuario(userId)).emit('mensaje:nuevo', {
        conversacionId,
        mensaje: {
          id: m.id,
          texto: m.texto,
          mio: m.de === userId,
          enviadoAt: m.enviadoAt,
          leidoAt: m.leidoAt,
          perfil: m.perfil,
        },
      });
    }
  }

  conversacionLeida(conversacionId: string, lector: string, otro: string) {
    this.server?.to(salaUsuario(otro)).emit('conversacion:leida', {
      conversacionId,
      lector,
      leidoAt: new Date(),
    });
  }
}
