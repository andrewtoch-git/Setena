import { io, Socket } from 'socket.io-client';
import { cerrarApp, Contexto, crearApp, registrar } from './helpers';

type Musico = Awaited<ReturnType<typeof registrar>>;

describe('chat en tiempo real (socket.io)', () => {
  let ctx: Contexto;
  let alex: Musico;
  let laia: Musico;
  let marc: Musico;
  let convId: string;
  const sockets: Socket[] = [];

  /** Conecta y espera a que el servidor acepte (o rechace) la conexión. */
  const conectar = (token?: string) =>
    new Promise<Socket>((resolve, reject) => {
      const s = io(`${ctx.url}/chat`, {
        auth: token ? { token } : {},
        transports: ['websocket'],
        reconnection: false,
      });
      sockets.push(s);
      s.once('connect', () => setTimeout(() => resolve(s), 50)); // da tiempo a unirse a la sala
      s.once('connect_error', reject);
    });

  const esperar = <T>(s: Socket, evento: string, ms = 3000) =>
    new Promise<T>((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`sin evento ${evento}`)), ms);
      s.once(evento, (datos: T) => {
        clearTimeout(t);
        resolve(datos);
      });
    });

  const emitir = <T>(s: Socket, evento: string, datos: unknown) =>
    s.timeout(3000).emitWithAck(evento, datos) as Promise<T>;

  beforeAll(async () => {
    ctx = await crearApp(true);
    alex = await registrar(ctx, { nombre: 'Alex Martín' });
    laia = await registrar(ctx, { nombre: 'Laia Serra' });
    marc = await registrar(ctx, { nombre: 'Marc Soler' });
    const conv = await ctx
      .http()
      .post('/conversaciones')
      .set(alex.auth)
      .send({ perfilId: laia.perfilId })
      .expect(201);
    convId = conv.body.id;
  });

  afterEach(() => {
    sockets.splice(0).forEach((s) => s.disconnect());
  });
  afterAll(() => cerrarApp(ctx));

  it('rechaza conexiones sin token válido', async () => {
    const s = io(`${ctx.url}/chat`, {
      transports: ['websocket'],
      reconnection: false,
    });
    sockets.push(s);
    const error = await esperar<{ mensaje: string }>(s, 'error:auth');
    expect(error.mensaje).toBe('Necesitas iniciar sesión');
    await new Promise((r) => setTimeout(r, 100));
    expect(s.connected).toBe(false);

    const conRefresh = io(`${ctx.url}/chat`, {
      auth: { token: alex.refreshToken },
      transports: ['websocket'],
      reconnection: false,
    });
    sockets.push(conRefresh);
    await esperar(conRefresh, 'error:auth');
  });

  it('enviar por socket: ack al remitente y aviso al destinatario', async () => {
    const sAlex = await conectar(alex.accessToken);
    const sLaia = await conectar(laia.accessToken);
    const llegaALaia = esperar<{
      conversacionId: string;
      mensaje: { texto: string; mio: boolean };
    }>(sLaia, 'mensaje:nuevo');

    const ack = await emitir<{
      ok: boolean;
      datos: { texto: string; mio: boolean };
    }>(sAlex, 'mensaje:enviar', {
      conversacionId: convId,
      texto: '  ¿Ensayamos el sábado?  ',
    });
    expect(ack).toMatchObject({
      ok: true,
      datos: { texto: '¿Ensayamos el sábado?', mio: true },
    });

    const recibido = await llegaALaia;
    expect(recibido).toMatchObject({
      conversacionId: convId,
      mensaje: { texto: '¿Ensayamos el sábado?', mio: false },
    });

    // Queda guardado y cuenta como no leído
    const lista = await ctx
      .http()
      .get('/conversaciones')
      .set(laia.auth)
      .expect(200);
    expect(lista.body[0]).toMatchObject({
      ultimoMensaje: '¿Ensayamos el sábado?',
      noLeidos: 1,
    });
  });

  it('los mensajes enviados por REST también llegan en tiempo real', async () => {
    const sAlex = await conectar(alex.accessToken);
    const llega = esperar<{ mensaje: { texto: string; mio: boolean } }>(
      sAlex,
      'mensaje:nuevo',
    );
    await ctx
      .http()
      .post(`/conversaciones/${convId}/mensajes`)
      .set(laia.auth)
      .send({ texto: '¡Perfecto!' })
      .expect(201);
    expect((await llega).mensaje).toMatchObject({
      texto: '¡Perfecto!',
      mio: false,
    });
  });

  it('marcar como leído avisa al otro participante', async () => {
    const sAlex = await conectar(alex.accessToken);
    const sLaia = await conectar(laia.accessToken);
    const aviso = esperar<{ conversacionId: string; lector: string }>(
      sAlex,
      'conversacion:leida',
    );
    const ack = await emitir<{ ok: boolean }>(sLaia, 'conversacion:leer', {
      conversacionId: convId,
    });
    expect(ack.ok).toBe(true);
    expect((await aviso).conversacionId).toBe(convId);
    const total = await ctx
      .http()
      .get('/conversaciones/no-leidos')
      .set(laia.auth)
      .expect(200);
    expect(total.body).toEqual({ total: 0 });
  });

  it('errores: mensaje vacío, conversación ajena y bloqueo', async () => {
    const sAlex = await conectar(alex.accessToken);
    const sMarc = await conectar(marc.accessToken);

    expect(
      await emitir(sAlex, 'mensaje:enviar', {
        conversacionId: convId,
        texto: '   ',
      }),
    ).toMatchObject({
      ok: false,
      status: 400,
    });
    expect(
      await emitir(sMarc, 'mensaje:enviar', {
        conversacionId: convId,
        texto: 'hola',
      }),
    ).toMatchObject({
      ok: false,
      status: 404,
    });

    await ctx
      .http()
      .post(`/bloqueos/${alex.perfilId}`)
      .set(laia.auth)
      .expect(204);
    expect(
      await emitir(sAlex, 'mensaje:enviar', {
        conversacionId: convId,
        texto: 'hola',
      }),
    ).toMatchObject({
      ok: false,
      status: 403,
      error: 'No puedes enviar mensajes a este usuario',
    });
    await ctx
      .http()
      .delete(`/bloqueos/${alex.perfilId}`)
      .set(laia.auth)
      .expect(204);
  });

  it('compartir un perfil: tarjeta en el chat, aviso en tiempo real y vista previa', async () => {
    const sLaia = await conectar(laia.accessToken);
    const aviso = esperar<{
      mensaje: {
        texto: string;
        mio: boolean;
        perfil: { id: string; nombre: string } | null;
      };
    }>(sLaia, 'mensaje:nuevo');

    const res = await ctx
      .http()
      .post(`/conversaciones/${convId}/compartir`)
      .set(alex.auth)
      .send({ perfilId: marc.perfilId })
      .expect(201);
    expect(res.body).toMatchObject({
      texto: '',
      mio: true,
      perfil: { id: marc.perfilId, nombre: 'Marc Soler' },
    });

    expect((await aviso).mensaje).toMatchObject({
      mio: false,
      perfil: { nombre: 'Marc Soler' },
    });

    const lista = await ctx
      .http()
      .get('/conversaciones')
      .set(laia.auth)
      .expect(200);
    expect(lista.body[0].ultimoMensaje).toBe('Perfil compartido: Marc Soler');

    const hist = await ctx
      .http()
      .get(`/conversaciones/${convId}/mensajes`)
      .set(laia.auth)
      .expect(200);
    expect(hist.body[hist.body.length - 1].perfil).toMatchObject({
      nombre: 'Marc Soler',
      roles: ['Guitarra'],
    });

    await ctx
      .http()
      .post(`/conversaciones/${convId}/compartir`)
      .set(alex.auth)
      .send({ perfilId: '000000000000000000000000' })
      .expect(404);
  });
});
