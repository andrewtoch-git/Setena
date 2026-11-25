import { join } from 'path';
import { SeedService } from '../src/seed/seed.service';
import { cerrarApp, Contexto, crearApp, registrar } from './helpers';

const MOCK = join(__dirname, '../../mock-data');
const DEMO = { email: 'alex.martin@example.com', password: 'demo-contrasena' };

// PNG de 1×1 píxel
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

describe('seed y fotos', () => {
  let ctx: Contexto;
  let seed: SeedService;

  beforeAll(async () => {
    ctx = await crearApp();
    seed = ctx.app.get(SeedService);
  });
  afterAll(() => cerrarApp(ctx));

  const loginDemo = async () => {
    const r = await ctx.http().post('/auth/login').send(DEMO).expect(200);
    return { Authorization: `Bearer ${r.body.accessToken}` };
  };

  describe('seed', () => {
    let real: Awaited<ReturnType<typeof registrar>>;

    it('carga mock-data completo', async () => {
      real = await registrar(ctx, { nombre: 'Persona Real' });
      const r = await seed.ejecutar(MOCK, DEMO.password);
      expect(r).toEqual({
        usuarios: 32,
        perfiles: 32,
        fotos: 15,
        favoritos: 3,
        conversaciones: 5,
        mensajes: 8,
        borrados: 0,
      });
    });

    it('es idempotente y no toca a usuarios reales', async () => {
      const r = await seed.ejecutar(MOCK, DEMO.password);
      expect(r.borrados).toBe(32);
      expect(r.usuarios).toBe(32);
      // La persona real sigue existiendo y viendo a todos
      const lista = await ctx
        .http()
        .get('/perfiles')
        .set(real.auth)
        .expect(200);
      expect(lista.body.total).toBe(32);
    });

    it('el usuario demo entra; el resto de cuentas ficticias no', async () => {
      await loginDemo();
      await ctx
        .http()
        .post('/auth/login')
        .send({ email: 'laia.serra@example.com', password: DEMO.password })
        .expect(401);
    });

    it('Alex ve los datos del wireframe', async () => {
      const auth = await loginDemo();
      const yo = await ctx.http().get('/me').set(auth).expect(200);
      expect(yo.body.perfil).toMatchObject({
        nombre: 'Alex Martín',
        roles: ['Piano'],
        lugar: 'Eixample',
      });
      expect(
        yo.body.perfil.media.map((m: { titulo: string }) => m.titulo),
      ).toEqual(['Directo con trío de jazz', 'Jam session']);

      const favs = await ctx.http().get('/favoritos').set(auth).expect(200);
      expect(favs.body.map((p: { nombre: string }) => p.nombre).sort()).toEqual(
        ['Laia Serra', 'Marc Soler', 'Marta Ruiz'],
      );

      const chats = await ctx
        .http()
        .get('/conversaciones')
        .set(auth)
        .expect(200);
      expect(
        chats.body.map((c: { con: { nombre: string } }) => c.con.nombre),
      ).toEqual([
        'Núria Font',
        'Jordi Puig',
        'Laia Serra',
        'Marc Soler',
        'Pau Vidal',
      ]);
      expect(chats.body[0]).toMatchObject({
        ultimoMensaje: '¿Cuánto cobras por bolo?',
        noLeidos: 1,
      });
      expect(
        (await ctx.http().get('/conversaciones/no-leidos').set(auth)).body,
      ).toEqual({ total: 1 });

      const jordi = chats.body[1].id as string;
      const hist = await ctx
        .http()
        .get(`/conversaciones/${jordi}/mensajes`)
        .set(auth)
        .expect(200);
      expect(
        hist.body.map((m: { texto: string; mio: boolean }) => [m.mio, m.texto]),
      ).toEqual([
        [
          false,
          'Hola, he visto tu perfil. ¿Te interesa tocar en un concierto el viernes?',
        ],
        [true, '¡Hola! Sí, cuéntame más.'],
        [
          false,
          'Es en la sala Apolo, repertorio de rock. Es un proyecto remunerado.',
        ],
        [true, 'Perfecto. ¿Tienes disponibilidad el sábado para ensayar?'],
      ]);
    });

    it('Explorar con los datos de prueba', async () => {
      const auth = await loginDemo();
      const todos = await ctx
        .http()
        .get('/perfiles')
        .set(auth)
        .query({ porPagina: 50 })
        .expect(200);
      expect(todos.body.total).toBe(32); // 31 ficticios + la persona real, sin Alex
      // Ordenados por actividad reciente
      const fechas = todos.body.resultados.map(
        (p: { ultimaActividadAt: string }) =>
          new Date(p.ultimaActividadAt).getTime(),
      );
      expect(fechas).toEqual([...fechas].sort((x: number, y: number) => y - x));

      for (const chip of [
        'Guitarra',
        'Piano',
        'Teclado',
        'Cantante',
        'Bajo',
        'Batería',
        'DJ',
      ]) {
        const r = await ctx
          .http()
          .get('/perfiles')
          .set(auth)
          .query({ roles: chip })
          .expect(200);
        expect(r.body.total).toBeGreaterThanOrEqual(2);
      }
    });

    it('las fotos del seed se sirven', async () => {
      const lista = await ctx
        .http()
        .get('/perfiles')
        .query({ q: 'Laia Serra' })
        .expect(200);
      const laia = lista.body.resultados.find(
        (p: { nombre: string }) => p.nombre === 'Laia Serra',
      );
      expect(laia.avatarId).toBeTruthy();
      expect(laia.principal.miniaturaId).toBeTruthy();
      const img = await ctx.http().get(`/media/${laia.avatarId}`).expect(200);
      expect(img.headers['content-type']).toBe('image/jpeg');
      expect(Number(img.headers['content-length'])).toBeGreaterThan(1000);
      await ctx.http().get('/media/000000000000000000000000').expect(404);
    });

    it('--limpiar borra solo lo ficticio', async () => {
      expect(await seed.limpiar()).toBe(32);
      const lista = await ctx.http().get('/perfiles').expect(200);
      expect(
        lista.body.resultados.map((p: { nombre: string }) => p.nombre),
      ).toEqual(['Persona Real']);
    });
  });

  describe('subir fotos', () => {
    it('avatar: solo JPG o PNG, y reemplaza al anterior', async () => {
      const r = await registrar(ctx);
      await ctx
        .http()
        .post('/me/avatar')
        .set(r.auth)
        .attach('archivo', Buffer.from('no soy una imagen'), {
          filename: 'a.txt',
          contentType: 'text/plain',
        })
        .expect(400);
      await ctx.http().post('/me/avatar').set(r.auth).expect(400);

      const uno = await ctx
        .http()
        .post('/me/avatar')
        .set(r.auth)
        .attach('archivo', PNG, {
          filename: 'yo.png',
          contentType: 'image/png',
        })
        .expect(201);
      const dos = await ctx
        .http()
        .post('/me/avatar')
        .set(r.auth)
        .attach('archivo', PNG, {
          filename: 'yo2.png',
          contentType: 'image/png',
        })
        .expect(201);
      expect(dos.body.avatarId).not.toBe(uno.body.avatarId);
      await ctx.http().get(`/media/${uno.body.avatarId}`).expect(404);
      const img = await ctx
        .http()
        .get(`/media/${dos.body.avatarId}`)
        .expect(200);
      expect(img.headers['content-type']).toBe('image/png');
      await ctx
        .http()
        .post('/me/avatar')
        .attach('archivo', PNG, { filename: 'x.png', contentType: 'image/png' })
        .expect(401);
    });

    it('carrusel: añadir, marcar principal y eliminar', async () => {
      const r = await registrar(ctx);
      const subir = (titulo: string) =>
        ctx
          .http()
          .post('/me/fotos')
          .set(r.auth)
          .field('titulo', titulo)
          .attach('archivo', PNG, {
            filename: 'f.png',
            contentType: 'image/png',
          })
          .expect(201);
      await subir('Foto en el escenario');
      const dos = await subir('Foto con la banda');
      expect(
        dos.body.media.map((m: { titulo: string; principal: boolean }) => [
          m.titulo,
          m.principal,
        ]),
      ).toEqual([
        ['Foto en el escenario', true],
        ['Foto con la banda', false],
      ]);
      const principal = await ctx
        .http()
        .post('/me/media/1/principal')
        .set(r.auth)
        .expect(200);
      expect(principal.body.media[1].principal).toBe(true);

      const archivo = principal.body.media[1].archivoId as string;
      const sinUna = await ctx
        .http()
        .delete('/me/media/1')
        .set(r.auth)
        .expect(200);
      expect(sinUna.body.media).toHaveLength(1);
      expect(sinUna.body.media[0].principal).toBe(true);
      await ctx.http().get(`/media/${archivo}`).expect(404);
      await ctx.http().delete('/me/media/5').set(r.auth).expect(404);
    });

    it('eliminar la cuenta borra sus fotos', async () => {
      const r = await registrar(ctx);
      const res = await ctx
        .http()
        .post('/me/avatar')
        .set(r.auth)
        .attach('archivo', PNG, {
          filename: 'yo.png',
          contentType: 'image/png',
        })
        .expect(201);
      await ctx.http().delete('/me').set(r.auth).expect(204);
      await ctx.http().get(`/media/${res.body.avatarId}`).expect(404);
    });
  });
});
