import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';

export const IS_PUBLIC = 'isPublic';
/** Ruta accesible sin sesión. Si llega un token válido, igualmente se identifica al usuario. */
export const Public = () => SetMetadata(IS_PUBLIC, true);

export class AuthUser {
  userId!: string;
}

/** Usuario autenticado (o undefined en rutas públicas sin sesión). */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthUser | undefined => {
    return ctx.switchToHttp().getRequest<{ user?: AuthUser }>().user;
  },
);
