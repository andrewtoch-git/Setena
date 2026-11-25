import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ChatsController } from './chats/chats.controller';
import { ChatsService } from './chats/chats.service';
import { AuthGuard } from './common/auth.guard';
import { EnvVars, validateEnv } from './config/env.validation';
import { FavoritesController } from './favorites/favorites.controller';
import { MiscController } from './misc.controller';
import { ModerationController } from './moderation/moderation.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { SchemasModule } from './schemas/schemas.module';
import { MeController } from './users/me.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvVars, true>) => ({
        uri: config.get('MONGODB_URI'),
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvVars, true>) => [
        {
          ttl: config.get('THROTTLE_TTL_MS', { infer: true }),
          limit: config.get('THROTTLE_LIMIT', { infer: true }),
        },
      ],
    }),
    JwtModule.register({ global: true }),
    SchemasModule,
    ProfilesModule,
    AuthModule,
  ],
  controllers: [
    MiscController,
    MeController,
    FavoritesController,
    ChatsController,
    ModerationController,
  ],
  providers: [ChatsService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
