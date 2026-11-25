/* eslint-disable @typescript-eslint/no-require-imports -- AppModule se carga después de fijar el entorno */
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import type { Connection } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { GoogleVerifier, IdentidadGoogle } from '../src/auth/google-verifier';

/** Doble de Google: el "ID token" tiene la forma google:<sub>:<email>:<verificado>. */
export const googleFalso: Pick<GoogleVerifier, 'verificar'> = {
  async verificar(idToken: string): Promise<IdentidadGoogle> {
    const [prefijo, sub, email, verificado] = idToken.split(':');
    if (prefijo !== 'google' || !sub || !email)
      throw new UnauthorizedException(
        'No se ha podido verificar tu cuenta de Google',
      );
    return {
      sub,
      email,
      emailVerificado: verificado !== 'no',
      nombre: 'Nombre Google',
    };
  },
};

export interface Contexto {
  app: INestApplication;
  mongo: MongoMemoryServer;
  http: () => ReturnType<typeof request>;
  /** URL base si la app se arrancó con escuchar = true (necesario para sockets). */
  url?: string;
}

export async function crearApp(escuchar = false): Promise<Contexto> {
  const mongo = await MongoMemoryServer.create();
  Object.assign(process.env, {
    MONGODB_URI: mongo.getUri('setena-test'),
    JWT_ACCESS_SECRET: 'test-access-secret-0123456789abcdefghijkl',
    JWT_REFRESH_SECRET: 'test-refresh-secret-0123456789abcdefghijk',
    THROTTLE_LIMIT: '10000',
    GOOGLE_CLIENT_IDS: 'test-client',
    CORS_ORIGINS: '',
  });
  // Se importa después de fijar el entorno: ConfigModule lo valida al cargarse.

  const { AppModule } =
    require('../src/app.module') as typeof import('../src/app.module');

  const { setupApp } =
    require('../src/setup-app') as typeof import('../src/setup-app');
  const modulo = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(GoogleVerifier)
    .useValue(googleFalso)
    .compile();
  const app = setupApp(modulo.createNestApplication());
  // Crea los índices ya (en producción también existen): así los tests detectan choques de unicidad.
  await app.get<Connection>(getConnectionToken()).syncIndexes();
  let url: string | undefined;
  if (escuchar) {
    await app.listen(0, '127.0.0.1');
    url = await app.getUrl();
  } else {
    await app.init();
  }
  return { app, mongo, url, http: () => request(app.getHttpServer()) };
}

export async function cerrarApp(ctx: Contexto | undefined) {
  await ctx?.app?.close();
  await ctx?.mongo?.stop();
}

let contador = 0;
export function datosRegistro(extra: Record<string, unknown> = {}) {
  contador += 1;
  return {
    email: `musico${contador}@example.com`,
    password: 'contrasena-segura',
    nombre: `Músico ${contador}`,
    roles: ['Guitarra'],
    generos: ['Rock'],
    remunerados: true,
    colaboraciones: false,
    zona: 'Barcelona ciudad',
    lugar: 'Gràcia',
    disponibilidad: ['Esta semana'],
    aceptaTerminos: true,
    ...extra,
  };
}

/** Registra un músico y devuelve sus tokens y su perfilId. */
export async function registrar(
  ctx: Contexto,
  extra: Record<string, unknown> = {},
) {
  const datos = datosRegistro(extra);
  const res = await ctx.http().post('/auth/registro').send(datos).expect(201);
  const yo = await ctx
    .http()
    .get('/me')
    .set('Authorization', `Bearer ${res.body.accessToken}`)
    .expect(200);
  return {
    datos,
    accessToken: res.body.accessToken as string,
    refreshToken: res.body.refreshToken as string,
    perfilId: yo.body.perfil.id as string,
    auth: { Authorization: `Bearer ${res.body.accessToken}` },
  };
}
