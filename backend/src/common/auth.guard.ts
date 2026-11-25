import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { EnvVars } from '../config/env.validation';
import { AuthUser, IS_PUBLIC } from './decorators';

/** Guard global: exige token de acceso salvo en rutas @Public(). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<EnvVars, true>,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const [tipo, token] = (req.headers.authorization ?? '').split(' ');

    if (tipo === 'Bearer' && token) {
      try {
        const payload = await this.jwt.verifyAsync<{
          sub: string;
          typ: string;
        }>(token, {
          secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
        });
        if (payload.typ === 'access') {
          req.user = { userId: payload.sub };
          return true;
        }
      } catch {
        // token caducado o inválido: se trata como sin sesión
      }
    }
    if (isPublic) return true;
    throw new UnauthorizedException('Necesitas iniciar sesión');
  }
}
