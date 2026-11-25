import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import type { Server, ServerOptions } from 'socket.io';

/** Adaptador de socket.io con los mismos orígenes CORS que la API HTTP. */
export class SocketAdapter extends IoAdapter {
  constructor(
    app: INestApplicationContext,
    private readonly origenes: string[],
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    return super.createIOServer(port, {
      ...options,
      cors: { origin: this.origenes, credentials: false },
    }) as Server;
  }
}
