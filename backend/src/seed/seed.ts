/**
 * npm run seed            → carga mock-data/ en la base de datos de MONGODB_URI
 * npm run seed -- --limpiar → solo borra los datos ficticios
 * Requiere SEED_DEMO_PASSWORD (contraseña del usuario demo, alex.martin@example.com).
 */
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  try {
    const seed = app.get(SeedService);
    if (process.argv.includes('--limpiar')) {
      console.log(`Usuarios ficticios borrados: ${await seed.limpiar()}`);
      return;
    }
    const password = process.env.SEED_DEMO_PASSWORD;
    if (!password) throw new Error('Define SEED_DEMO_PASSWORD en .env');
    const dir = process.env.SEED_DIR ?? join(__dirname, '../../../mock-data');
    const r = await seed.ejecutar(dir, password);
    console.log('Seed completado:', r);
  } finally {
    await app.close();
  }
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
