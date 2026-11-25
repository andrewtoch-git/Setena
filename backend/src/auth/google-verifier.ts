import { Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { EnvVars } from '../config/env.validation';

export interface IdentidadGoogle {
  sub: string;
  email: string;
  emailVerificado: boolean;
  nombre?: string;
}

/** Verifica el ID token de Google. Se sustituye por un doble en los tests. */
@Injectable()
export class GoogleVerifier {
  private readonly cliente = new OAuth2Client();
  private readonly audiencias: string[];

  constructor(config: ConfigService<EnvVars, true>) {
    this.audiencias = config.get('GOOGLE_CLIENT_IDS', { infer: true }).split(',').map((s) => s.trim()).filter(Boolean);
  }

  async verificar(idToken: string): Promise<IdentidadGoogle> {
    if (!this.audiencias.length) throw new ServiceUnavailableException('El inicio de sesión con Google no está configurado');
    try {
      const ticket = await this.cliente.verifyIdToken({ idToken, audience: this.audiencias });
      const p = ticket.getPayload();
      if (!p?.sub || !p.email) throw new Error('sin email');
      return { sub: p.sub, email: p.email.toLowerCase(), emailVerificado: !!p.email_verified, nombre: p.name };
    } catch {
      throw new UnauthorizedException('No se ha podido verificar tu cuenta de Google');
    }
  }
}
