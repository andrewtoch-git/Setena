import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SocketAdapter } from './chats/socket-adapter';
import { EnvVars } from './config/env.validation';

/** Configuración común a main.ts y a los tests e2e. */
export function setupApp(app: INestApplication) {
  const config = app.get(ConfigService<EnvVars, true>);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origenes = config
    .get('CORS_ORIGINS', { infer: true })
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({ origin: origenes, credentials: false });
  app.useWebSocketAdapter(new SocketAdapter(app, origenes));

  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('setena API')
      .setDescription('Backend del prototipo setena')
      .setVersion('0.1')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, doc);
  return app;
}
