import { HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { EnvVars } from '../config/env.validation';
import { ChatEventos, salaUsuario } from './chat-eventos';
import { ChatsService } from './chats.service';

interface DatosSocket {
  userId: string;
  caducidad?: NodeJS.Timeout;
}

type Ack<T> =
  { ok: true; datos: T } | { ok: false; error: string; status: number };

const MAX_TEXTO = 2000;

/**
 * Chat en tiempo real (namespace /chat). La conexión se autentica con el token de acceso:
 * `io(url + '/chat', { auth: { token } })`. REST sigue siendo la fuente de verdad: el historial
 * se pide por HTTP y aquí solo se envía, se marca como leído y se avisa de lo nuevo.
 */
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly log = new Logger(ChatGateway.name);

  constructor(
    private readonly chats: ChatsService,
    private readonly eventos: ChatEventos,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<EnvVars, true>,
  ) {}

  afterInit(server: Server) {
    this.eventos.server = server;
  }

  async handleConnection(socket: Socket) {
    const auth = socket.handshake.auth as { token?: unknown } | undefined;
    const cabecera = socket.handshake.headers.authorization;
    const token =
      typeof auth?.token === 'string'
        ? auth.token
        : cabecera?.startsWith('Bearer ')
          ? cabecera.slice(7)
          : undefined;
    try {
      if (!token) throw new Error('sin token');
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        typ: string;
        exp: number;
      }>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      });
      if (payload.typ !== 'access') throw new Error('token no es de acceso');
      const datos: DatosSocket = { userId: payload.sub };
      // Cierra la conexión cuando caduca el token: el cliente reconecta con uno nuevo.
      const restante = payload.exp * 1000 - Date.now();
      datos.caducidad = setTimeout(
        () => {
          socket.emit('sesion:caducada');
          socket.disconnect(true);
        },
        Math.max(restante, 0),
      );
      socket.data = datos;
      await socket.join(salaUsuario(payload.sub));
    } catch {
      socket.emit('error:auth', { mensaje: 'Necesitas iniciar sesión' });
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket) {
    const datos = socket.data as DatosSocket | undefined;
    if (datos?.caducidad) clearTimeout(datos.caducidad);
  }

  @SubscribeMessage('mensaje:enviar')
  async enviar(
    @ConnectedSocket() socket: Socket,
    @MessageBody() cuerpo: { conversacionId?: unknown; texto?: unknown },
  ): Promise<Ack<unknown>> {
    const texto = typeof cuerpo?.texto === 'string' ? cuerpo.texto.trim() : '';
    if (
      typeof cuerpo?.conversacionId !== 'string' ||
      !texto ||
      texto.length > MAX_TEXTO
    ) {
      return { ok: false, error: 'Mensaje no válido', status: 400 };
    }
    return this.ejecutar(socket, (userId) =>
      this.chats.enviar(cuerpo.conversacionId as string, userId, { texto }),
    );
  }

  @SubscribeMessage('conversacion:leer')
  async leer(
    @ConnectedSocket() socket: Socket,
    @MessageBody() cuerpo: { conversacionId?: unknown },
  ): Promise<Ack<unknown>> {
    if (typeof cuerpo?.conversacionId !== 'string') {
      return { ok: false, error: 'Conversación no válida', status: 400 };
    }
    return this.ejecutar(socket, async (userId) => {
      await this.chats.marcarLeido(cuerpo.conversacionId as string, userId);
      return null;
    });
  }

  /** Ejecuta una acción y la convierte en ack: los errores HTTP del servicio llegan al cliente con su mensaje. */
  private async ejecutar<T>(
    socket: Socket,
    accion: (userId: string) => Promise<T>,
  ): Promise<Ack<T>> {
    const datos = socket.data as DatosSocket | undefined;
    if (!datos?.userId)
      return { ok: false, error: 'Necesitas iniciar sesión', status: 401 };
    try {
      return { ok: true, datos: await accion(datos.userId) };
    } catch (e) {
      if (e instanceof HttpException)
        return { ok: false, error: e.message, status: e.getStatus() };
      this.log.error(e);
      return {
        ok: false,
        error: 'No se ha podido completar la acción',
        status: 500,
      };
    }
  }
}
