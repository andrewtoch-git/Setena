import { cerrarApp, Contexto, crearApp, registrar } from './helpers';

type Musico = Awaited<ReturnType<typeof registrar>>;

describe('perfiles, favoritos, chats y moderación', () => {
  let ctx: Contexto;
  let alex: Musico;
  let laia: Musico;
  let marc: Musico;
  let nuria: Musico;

  beforeAll(async () => {
    ctx = await crearApp();
    alex = await registrar(ctx, {
      nombre: 'Alex Martín',
      roles: ['Piano'],
      generos: ['Jazz', 'Soul'],
      lugar: 'Eixample',
    });
    laia = await registrar(ctx, {
      nombre: 'Laia Serra',
      roles: ['Cantante'],
      generos: ['Pop', 'Soul'],
      lugar: 'Sant Martí',
      colaboraciones: true,
    });
    marc = await registrar(ctx, {
      nombre: 'Marc Soler',
      roles: ['Piano'],
      generos: ['Jazz', 'Clásica'],
      zona: 'Alrededores',
      lugar: "L'Hospitalet de Llobregat",
      disponibilidad: ['Este mes'],
      sobreMi: 'Toco jazz en trío',
    });
    nuria = await registrar(ctx, {
      nombre: 'Núria Font',
      roles: ['DJ'],
      generos: ['Electrónica', 'House'],
      zona: 'Alrededores',
      lugar: 'Cornellà de Llobregat',
    });
  });
  afterAll(() => cerrarApp(ctx));

  const nombres = (body: { resultados: { nombre: string }[] }) =>
    body.resultados.map((r) => r.nombre).sort();

  describe('Explorar', () => {
    it('es público y sin sesión muestra a todos', async () => {
      const res = await ctx.http().get('/perfiles').expect(200);
      expect(res.body.total).toBe(4);
      expect(res.body.resultados[0]).not.toHaveProperty('sobreMi');
    });

    it('con sesión no incluye tu propio perfil', async () => {
      const res = await ctx.http().get('/perfiles').set(alex.auth).expect(200);
      expect(nombres(res.body)).toEqual([
        'Laia Serra',
        'Marc Soler',
        'Núria Font',
      ]);
    });

    it('la búsqueda libre aplica filtros', async () => {
      const res = await ctx
        .http()
        .get('/perfiles')
        .query({ q: 'pianista jazz' })
        .expect(200);
      expect(nombres(res.body)).toEqual(['Alex Martín', 'Marc Soler']);
      expect(res.body.filtrosAplicados).toMatchObject({
        roles: ['Piano'],
        generos: ['Jazz'],
      });

      const texto = await ctx
        .http()
        .get('/perfiles')
        .query({ q: 'cornella' })
        .expect(200);
      expect(nombres(texto.body)).toEqual(['Núria Font']);

      const trio = await ctx
        .http()
        .get('/perfiles')
        .query({ q: 'trío' })
        .expect(200);
      expect(nombres(trio.body)).toEqual(['Marc Soler']);
    });

    it('filtros explícitos', async () => {
      const zona = await ctx
        .http()
        .get('/perfiles')
        .query({ zonas: 'Alrededores' })
        .expect(200);
      expect(nombres(zona.body)).toEqual(['Marc Soler', 'Núria Font']);
      const varios = await ctx
        .http()
        .get('/perfiles')
        .query({ generos: ['Soul', 'House'] })
        .expect(200);
      expect(nombres(varios.body)).toEqual([
        'Alex Martín',
        'Laia Serra',
        'Núria Font',
      ]);
      const colab = await ctx
        .http()
        .get('/perfiles')
        .query({ tipos: 'colaboraciones' })
        .expect(200);
      expect(nombres(colab.body)).toEqual(['Laia Serra']);
      await ctx
        .http()
        .get('/perfiles')
        .query({ roles: 'Pianista' })
        .expect(400);
    });

    it('pagina los resultados', async () => {
      const p1 = await ctx
        .http()
        .get('/perfiles')
        .query({ porPagina: 3 })
        .expect(200);
      const p2 = await ctx
        .http()
        .get('/perfiles')
        .query({ porPagina: 3, pagina: 2 })
        .expect(200);
      expect(p1.body.resultados).toHaveLength(3);
      expect(p2.body.resultados).toHaveLength(1);
    });

    it('ficha pública con tarifas e indicadores', async () => {
      const res = await ctx
        .http()
        .get(`/perfiles/${marc.perfilId}`)
        .expect(200);
      expect(res.body).toMatchObject({
        nombre: 'Marc Soler',
        sobreMi: 'Toco jazz en trío',
        esFavorito: false,
        esPropio: false,
      });
      const propio = await ctx
        .http()
        .get(`/perfiles/${marc.perfilId}`)
        .set(marc.auth)
        .expect(200);
      expect(propio.body.esPropio).toBe(true);
      await ctx.http().get('/perfiles/no-existe').expect(404);
    });
  });

  describe('Favoritos', () => {
    it('exigen sesión', async () => {
      await ctx.http().get('/favoritos').expect(401);
      await ctx.http().post(`/favoritos/${laia.perfilId}`).expect(401);
    });

    it('añadir, listar y quitar (idempotente)', async () => {
      await ctx
        .http()
        .post(`/favoritos/${laia.perfilId}`)
        .set(alex.auth)
        .expect(204);
      await ctx
        .http()
        .post(`/favoritos/${laia.perfilId}`)
        .set(alex.auth)
        .expect(204);
      await ctx
        .http()
        .post(`/favoritos/${marc.perfilId}`)
        .set(alex.auth)
        .expect(204);
      const lista = await ctx
        .http()
        .get('/favoritos')
        .set(alex.auth)
        .expect(200);
      expect(lista.body.map((p: { nombre: string }) => p.nombre)).toEqual([
        'Marc Soler',
        'Laia Serra',
      ]);
      const ficha = await ctx
        .http()
        .get(`/perfiles/${laia.perfilId}`)
        .set(alex.auth)
        .expect(200);
      expect(ficha.body.esFavorito).toBe(true);
      await ctx
        .http()
        .delete(`/favoritos/${marc.perfilId}`)
        .set(alex.auth)
        .expect(204);
      await ctx
        .http()
        .delete(`/favoritos/${marc.perfilId}`)
        .set(alex.auth)
        .expect(204);
      expect(
        (await ctx.http().get('/favoritos').set(alex.auth)).body,
      ).toHaveLength(1);
      await ctx
        .http()
        .post('/favoritos/000000000000000000000000')
        .set(alex.auth)
        .expect(404);
    });
  });

  describe('Chats', () => {
    let convId: string;

    it('abrir chat exige sesión y no se puede contigo', async () => {
      await ctx
        .http()
        .post('/conversaciones')
        .send({ perfilId: laia.perfilId })
        .expect(401);
      await ctx
        .http()
        .post('/conversaciones')
        .set(alex.auth)
        .send({ perfilId: alex.perfilId })
        .expect(403);
    });

    it('abrir devuelve siempre la misma conversación', async () => {
      const a = await ctx
        .http()
        .post('/conversaciones')
        .set(alex.auth)
        .send({ perfilId: laia.perfilId })
        .expect(201);
      const b = await ctx
        .http()
        .post('/conversaciones')
        .set(laia.auth)
        .send({ perfilId: alex.perfilId })
        .expect(201);
      expect(a.body.id).toBe(b.body.id);
      expect(a.body.con.nombre).toBe('Laia Serra');
      convId = a.body.id;
      // Sin mensajes no aparece en la lista
      expect(
        (await ctx.http().get('/conversaciones').set(alex.auth)).body,
      ).toEqual([]);
    });

    it('enviar, no leídos y marcar como leído', async () => {
      const m = await ctx
        .http()
        .post(`/conversaciones/${convId}/mensajes`)
        .set(alex.auth)
        .send({ texto: '  Hola, ¿tocas el viernes?  ' })
        .expect(201);
      expect(m.body).toMatchObject({
        texto: 'Hola, ¿tocas el viernes?',
        mio: true,
        leidoAt: null,
      });
      await ctx
        .http()
        .post(`/conversaciones/${convId}/mensajes`)
        .set(laia.auth)
        .send({ texto: '¡Sí!' })
        .expect(201);
      await ctx
        .http()
        .post(`/conversaciones/${convId}/mensajes`)
        .set(alex.auth)
        .send({ texto: '' })
        .expect(400);

      const lista = await ctx
        .http()
        .get('/conversaciones')
        .set(laia.auth)
        .expect(200);
      expect(lista.body[0]).toMatchObject({
        ultimoMensaje: '¡Sí!',
        noLeidos: 1,
        con: { nombre: 'Alex Martín' },
      });
      expect(
        (await ctx.http().get('/conversaciones/no-leidos').set(laia.auth)).body,
      ).toEqual({ total: 1 });

      const hist = await ctx
        .http()
        .get(`/conversaciones/${convId}/mensajes`)
        .set(laia.auth)
        .expect(200);
      expect(
        hist.body.map((x: { texto: string; mio: boolean }) => [x.texto, x.mio]),
      ).toEqual([
        ['Hola, ¿tocas el viernes?', false],
        ['¡Sí!', true],
      ]);

      await ctx
        .http()
        .post(`/conversaciones/${convId}/leido`)
        .set(laia.auth)
        .expect(204);
      expect(
        (await ctx.http().get('/conversaciones/no-leidos').set(laia.auth)).body,
      ).toEqual({ total: 0 });
      const visto = await ctx
        .http()
        .get(`/conversaciones/${convId}/mensajes`)
        .set(alex.auth)
        .expect(200);
      expect(visto.body[0].leidoAt).not.toBeNull();
    });

    it('nadie más puede leer ni escribir en la conversación', async () => {
      await ctx
        .http()
        .get(`/conversaciones/${convId}/mensajes`)
        .set(marc.auth)
        .expect(404);
      await ctx
        .http()
        .post(`/conversaciones/${convId}/mensajes`)
        .set(marc.auth)
        .send({ texto: 'hola' })
        .expect(404);
      await ctx
        .http()
        .get('/conversaciones/basura/mensajes')
        .set(marc.auth)
        .expect(404);
    });
  });

  describe('Bloqueos y denuncias', () => {
    it('al bloquear desaparece de Explorar, Favoritos y Chats en ambos sentidos', async () => {
      const conv = await ctx
        .http()
        .post('/conversaciones')
        .set(nuria.auth)
        .send({ perfilId: marc.perfilId })
        .expect(201);
      await ctx
        .http()
        .post(`/conversaciones/${conv.body.id}/mensajes`)
        .set(nuria.auth)
        .send({ texto: '¿Cuánto cobras por bolo?' })
        .expect(201);
      await ctx
        .http()
        .post(`/favoritos/${marc.perfilId}`)
        .set(nuria.auth)
        .expect(204);

      await ctx
        .http()
        .post(`/bloqueos/${nuria.perfilId}`)
        .set(marc.auth)
        .expect(204);

      // Marc ya no ve a Núria, y Núria no ve a Marc
      expect(
        nombres((await ctx.http().get('/perfiles').set(marc.auth)).body),
      ).not.toContain('Núria Font');
      expect(
        nombres((await ctx.http().get('/perfiles').set(nuria.auth)).body),
      ).not.toContain('Marc Soler');
      expect((await ctx.http().get('/favoritos').set(nuria.auth)).body).toEqual(
        [],
      );
      expect(
        (await ctx.http().get('/conversaciones').set(marc.auth)).body,
      ).toEqual([]);

      // Para quien bloquea, la ficha avisa; para la persona bloqueada, el perfil "no está disponible"
      const ficha = await ctx
        .http()
        .get(`/perfiles/${nuria.perfilId}`)
        .set(marc.auth)
        .expect(200);
      expect(ficha.body.bloqueadoPorMi).toBe(true);
      await ctx
        .http()
        .get(`/perfiles/${marc.perfilId}`)
        .set(nuria.auth)
        .expect(404);

      // Nadie puede escribir ni abrir chat
      await ctx
        .http()
        .post(`/conversaciones/${conv.body.id}/mensajes`)
        .set(nuria.auth)
        .send({ texto: 'hola' })
        .expect(403);
      await ctx
        .http()
        .post('/conversaciones')
        .set(marc.auth)
        .send({ perfilId: nuria.perfilId })
        .expect(403);
      await ctx
        .http()
        .post(`/favoritos/${marc.perfilId}`)
        .set(nuria.auth)
        .expect(404);

      // Desbloquear lo devuelve todo a la normalidad (salvo el favorito, que no se restaura)
      await ctx
        .http()
        .delete(`/bloqueos/${nuria.perfilId}`)
        .set(marc.auth)
        .expect(204);
      await ctx
        .http()
        .get(`/perfiles/${marc.perfilId}`)
        .set(nuria.auth)
        .expect(200);
      await ctx
        .http()
        .post(`/conversaciones/${conv.body.id}/mensajes`)
        .set(nuria.auth)
        .send({ texto: 'hola' })
        .expect(201);
    });

    it('no puedes bloquearte ni denunciarte a ti', async () => {
      await ctx
        .http()
        .post(`/bloqueos/${alex.perfilId}`)
        .set(alex.auth)
        .expect(400);
      await ctx
        .http()
        .post('/denuncias')
        .set(alex.auth)
        .send({ perfilId: alex.perfilId, motivo: 'Spam o publicidad' })
        .expect(400);
    });

    it('denunciar con un motivo de la lista', async () => {
      await ctx
        .http()
        .post('/denuncias')
        .set(alex.auth)
        .send({ perfilId: nuria.perfilId, motivo: 'Spam o publicidad' })
        .expect(204);
      await ctx
        .http()
        .post('/denuncias')
        .set(alex.auth)
        .send({ perfilId: nuria.perfilId, motivo: 'Me cae mal' })
        .expect(400);
      await ctx
        .http()
        .post('/denuncias')
        .send({ perfilId: nuria.perfilId, motivo: 'Spam o publicidad' })
        .expect(401);
    });
  });

  describe('Eliminar cuenta', () => {
    it('borra perfil, chats y favoritos relacionados', async () => {
      const pau = await registrar(ctx, {
        nombre: 'Pau Vidal',
        roles: ['Teclado'],
      });
      await ctx
        .http()
        .post(`/favoritos/${pau.perfilId}`)
        .set(alex.auth)
        .expect(204);
      const conv = await ctx
        .http()
        .post('/conversaciones')
        .set(alex.auth)
        .send({ perfilId: pau.perfilId })
        .expect(201);
      await ctx
        .http()
        .post(`/conversaciones/${conv.body.id}/mensajes`)
        .set(alex.auth)
        .send({ texto: 'Hola Pau' })
        .expect(201);

      await ctx.http().delete('/me').set(pau.auth).expect(204);

      await ctx.http().get(`/perfiles/${pau.perfilId}`).expect(404);
      expect(
        (await ctx.http().get('/favoritos').set(alex.auth)).body.map(
          (p: { nombre: string }) => p.nombre,
        ),
      ).not.toContain('Pau Vidal');
      await ctx
        .http()
        .get(`/conversaciones/${conv.body.id}/mensajes`)
        .set(alex.auth)
        .expect(404);
      await ctx
        .http()
        .post('/auth/login')
        .send({ email: pau.datos.email, password: pau.datos.password })
        .expect(401);
      await ctx
        .http()
        .post('/auth/refresh')
        .send({ refreshToken: pau.refreshToken })
        .expect(401);
    });
  });
});
