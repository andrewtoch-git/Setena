import {
  cerrarApp,
  Contexto,
  crearApp,
  datosRegistro,
  registrar,
} from './helpers';

describe('auth', () => {
  let ctx: Contexto;
  beforeAll(async () => (ctx = await crearApp()));
  afterAll(() => cerrarApp(ctx));

  it('/health y /catalogos son públicos', async () => {
    await ctx.http().get('/health').expect(200, { status: 'ok', db: 'up' });
    const cat = await ctx.http().get('/catalogos').expect(200);
    expect(cat.body.chipsRapidos).toEqual([
      'Guitarra',
      'Piano',
      'Teclado',
      'Cantante',
      'Bajo',
      'Batería',
      'DJ',
    ]);
  });

  it('registro crea cuenta y perfil y devuelve tokens', async () => {
    const r = await registrar(ctx, {
      nombre: 'Laia Prueba',
      roles: ['Cantante'],
    });
    const yo = await ctx.http().get('/me').set(r.auth).expect(200);
    expect(yo.body.email).toBe(r.datos.email);
    expect(yo.body.tienePassword).toBe(true);
    expect(yo.body.perfil).toMatchObject({
      nombre: 'Laia Prueba',
      roles: ['Cantante'],
      lugar: 'Gràcia',
    });
  });

  it('registro rechaza correo repetido (409) y campos inválidos (400)', async () => {
    const r = await registrar(ctx);
    await ctx
      .http()
      .post('/auth/registro')
      .send({ ...datosRegistro(), email: r.datos.email.toUpperCase() })
      .expect(409);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ password: 'corta' }))
      .expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ roles: ['Pianista'] }))
      .expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ lugar: 'Badalona' }))
      .expect(400); // no es de Barcelona ciudad
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ remunerados: false, colaboraciones: false }))
      .expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ aceptaTerminos: false }))
      .expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ disponibilidad: [] }))
      .expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send(datosRegistro({ campoInventado: 1 }))
      .expect(400);
  });

  it('un registro fallido no deja la cuenta creada', async () => {
    const datos = datosRegistro({ lugar: 'Narnia' });
    await ctx.http().post('/auth/registro').send(datos).expect(400);
    await ctx
      .http()
      .post('/auth/registro')
      .send({ ...datos, lugar: 'Gràcia' })
      .expect(201);
  });

  it('login correcto e incorrecto', async () => {
    const r = await registrar(ctx);
    const ok = await ctx
      .http()
      .post('/auth/login')
      .send({ email: r.datos.email, password: r.datos.password })
      .expect(200);
    expect(ok.body.perfilCompleto).toBe(true);
    const mal = await ctx
      .http()
      .post('/auth/login')
      .send({ email: r.datos.email, password: 'otra-cosa' })
      .expect(401);
    expect(mal.body.message).toBe('El correo o la contraseña no son correctos');
    await ctx
      .http()
      .post('/auth/login')
      .send({ email: 'nadie@example.com', password: 'x' })
      .expect(401);
  });

  it('rutas privadas exigen sesión', async () => {
    await ctx.http().get('/me').expect(401);
    await ctx
      .http()
      .get('/me')
      .set('Authorization', 'Bearer basura')
      .expect(401);
  });

  it('refresh rota el token y detecta la reutilización', async () => {
    const r = await registrar(ctx);
    const nuevo = await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: r.refreshToken })
      .expect(200);
    expect(nuevo.body.refreshToken).not.toBe(r.refreshToken);
    // Reutilizar el viejo cierra la sesión entera...
    await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: r.refreshToken })
      .expect(401);
    // ...así que el nuevo tampoco vale ya.
    await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: nuevo.body.refreshToken })
      .expect(401);
  });

  it('un token de acceso no sirve como refresh y viceversa', async () => {
    const r = await registrar(ctx);
    await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: r.accessToken })
      .expect(401);
    await ctx
      .http()
      .get('/me')
      .set('Authorization', `Bearer ${r.refreshToken}`)
      .expect(401);
  });

  it('logout invalida solo esa sesión', async () => {
    const r = await registrar(ctx);
    const otra = await ctx
      .http()
      .post('/auth/login')
      .send({ email: r.datos.email, password: r.datos.password })
      .expect(200);
    await ctx
      .http()
      .post('/auth/logout')
      .send({ refreshToken: r.refreshToken })
      .expect(204);
    await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: r.refreshToken })
      .expect(401);
    await ctx
      .http()
      .post('/auth/refresh')
      .send({ refreshToken: otra.body.refreshToken })
      .expect(200);
  });

  describe('Google', () => {
    it('cuenta nueva: entra sin perfil y luego lo crea', async () => {
      const g = await ctx
        .http()
        .post('/auth/google')
        .send({ idToken: 'google:g-1:nueva@example.com:si' })
        .expect(200);
      expect(g.body.perfilCompleto).toBe(false);
      expect(g.body.nombreSugerido).toBe('Nombre Google');
      const auth = { Authorization: `Bearer ${g.body.accessToken}` };
      expect(
        (await ctx.http().get('/me').set(auth).expect(200)).body.perfil,
      ).toBeNull();
      const {
        email: _e,
        password: _p,
        aceptaTerminos: _a,
        ...perfil
      } = datosRegistro();
      await ctx.http().post('/me/perfil').set(auth).send(perfil).expect(201);
      await ctx.http().post('/me/perfil').set(auth).send(perfil).expect(409);
      const otra = await ctx
        .http()
        .post('/auth/google')
        .send({ idToken: 'google:g-1:nueva@example.com:si' })
        .expect(200);
      expect(otra.body.perfilCompleto).toBe(true);
    });

    it('vincula con una cuenta de correo existente si el correo está verificado', async () => {
      const r = await registrar(ctx);
      await ctx
        .http()
        .post('/auth/google')
        .send({ idToken: `google:g-2:${r.datos.email}:no` })
        .expect(403);
      const g = await ctx
        .http()
        .post('/auth/google')
        .send({ idToken: `google:g-2:${r.datos.email}:si` })
        .expect(200);
      expect(g.body.usuario.proveedores).toEqual(['email', 'google']);
      expect(g.body.perfilCompleto).toBe(true);
    });

    it('rechaza tokens no válidos', async () => {
      await ctx
        .http()
        .post('/auth/google')
        .send({ idToken: 'no-es-de-google' })
        .expect(401);
    });
  });

  describe('mi cuenta', () => {
    it('cambia la contraseña comprobando la actual', async () => {
      const r = await registrar(ctx);
      await ctx
        .http()
        .patch('/me/password')
        .set(r.auth)
        .send({ actual: 'mala-contrasena', nueva: 'nueva-clave-1' })
        .expect(400);
      await ctx
        .http()
        .patch('/me/password')
        .set(r.auth)
        .send({ actual: r.datos.password, nueva: 'nueva-clave-1' })
        .expect(204);
      await ctx
        .http()
        .post('/auth/login')
        .send({ email: r.datos.email, password: 'nueva-clave-1' })
        .expect(200);
    });

    it('guarda los ajustes de notificaciones', async () => {
      const r = await registrar(ctx);
      const res = await ctx
        .http()
        .patch('/me/ajustes')
        .set(r.auth)
        .send({ notifNovedades: true })
        .expect(200);
      expect(res.body).toEqual({ notifMensajes: true, notifNovedades: true });
    });

    it('edita el perfil pero no el nombre', async () => {
      const r = await registrar(ctx);
      await ctx
        .http()
        .patch('/me/perfil')
        .set(r.auth)
        .send({ nombre: 'Otro nombre' })
        .expect(400);
      const res = await ctx
        .http()
        .patch('/me/perfil')
        .set(r.auth)
        .send({
          zona: 'Alrededores',
          lugar: 'Badalona',
          tarifas: [
            { servicio: 'bolo', precio: 120 },
            { servicio: 'composicion', texto: 'A convenir' },
          ],
        })
        .expect(200);
      expect(res.body).toMatchObject({
        zona: 'Alrededores',
        lugar: 'Badalona',
      });
      expect(res.body.tarifas[0]).toMatchObject({
        servicio: 'bolo',
        precio: 120,
        unidad: 'por actuación',
        nombre: 'Bolo / Directo',
      });
      // Cambiar de zona sin lugar válido no se permite
      await ctx
        .http()
        .patch('/me/perfil')
        .set(r.auth)
        .send({ zona: 'Barcelona ciudad' })
        .expect(400);
    });
  });
});
