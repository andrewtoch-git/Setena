import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { hash, verify } from '@node-rs/argon2';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { Model } from 'mongoose';
import { EnvVars } from '../config/env.validation';
import { ProfilesService } from '../profiles/profiles.service';
import { User, UserDoc } from '../schemas';
import { RegistroDto } from './dto';
import { GoogleVerifier } from './google-verifier';

const MAX_SESIONES = 10;
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
const iguales = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiraEn: number;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly usuarios: Model<User>,
    private readonly perfiles: ProfilesService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService<EnvVars, true>,
    private readonly google: GoogleVerifier,
  ) {}

  // ---------- registro y login ----------
  async registrar(dto: RegistroDto) {
    const { email, password, aceptaTerminos: _a, ...perfil } = dto;
    if (await this.usuarios.exists({ email })) {
      throw new ConflictException('Ya existe una cuenta con este correo. Inicia sesión o recupera tu contraseña.');
    }
    // Si el perfil no es válido, se borra el usuario recién creado para no dejar cuentas a medias.
    const usuario = await this.usuarios.create({ email, passwordHash: await hash(password), proveedores: ['email'] });
    try {
      await this.perfiles.crear(usuario.id, perfil);
    } catch (e) {
      await this.usuarios.deleteOne({ _id: usuario._id });
      throw e;
    }
    return this.respuesta(usuario, true);
  }

  async login(email: string, password: string) {
    const usuario = await this.usuarios.findOne({ email });
    const ok = !!usuario?.passwordHash && (await verify(usuario.passwordHash, password));
    if (!usuario || !ok) throw new UnauthorizedException('El correo o la contraseña no son correctos');
    return this.respuesta(usuario, !!(await this.perfiles.porUsuario(usuario.id)));
  }

  async loginGoogle(idToken: string) {
    const g = await this.google.verificar(idToken);
    let usuario = await this.usuarios.findOne({ googleId: g.sub });
    if (!usuario) {
      usuario = await this.usuarios.findOne({ email: g.email });
      if (usuario) {
        // Solo vinculamos si Google garantiza que el correo es del usuario.
        if (!g.emailVerificado) throw new ForbiddenException('Tu correo de Google no está verificado');
        usuario.googleId = g.sub;
        if (!usuario.proveedores.includes('google')) usuario.proveedores.push('google');
        await usuario.save();
      } else {
        usuario = await this.usuarios.create({ email: g.email, googleId: g.sub, proveedores: ['google'] });
      }
    }
    const perfilCompleto = !!(await this.perfiles.porUsuario(usuario.id));
    return { ...(await this.respuesta(usuario, perfilCompleto)), nombreSugerido: g.nombre ?? null };
  }

  // ---------- tokens ----------
  private async emitir(usuario: UserDoc, familia: string = randomUUID()): Promise<Tokens> {
    const accessTtl = this.config.get('JWT_ACCESS_TTL', { infer: true });
    const refreshTtl = this.config.get('JWT_REFRESH_TTL', { infer: true });
    const accessToken = await this.jwt.signAsync(
      { sub: usuario.id, typ: 'access' },
      { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: accessTtl },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: usuario.id, typ: 'refresh', fam: familia, jti: randomUUID() },
      { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: refreshTtl },
    );
    const ahora = Date.now();
    const sesiones = usuario.sesiones.filter((s) => s.familia !== familia && s.caduca.getTime() > ahora);
    sesiones.push({ familia, hash: sha256(refreshToken), caduca: new Date(ahora + refreshTtl * 1000) });
    usuario.sesiones = sesiones.slice(-MAX_SESIONES);
    await usuario.save();
    return { accessToken, refreshToken, expiraEn: accessTtl };
  }

  /** Refresh token rotativo: cada uso invalida el anterior; reutilizar uno viejo cierra esa sesión. */
  async refrescar(refreshToken: string): Promise<Tokens> {
    let payload: { sub: string; typ: string; fam: string };
    try {
      payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') });
    } catch {
      throw new UnauthorizedException('Tu sesión ha caducado');
    }
    if (payload.typ !== 'refresh') throw new UnauthorizedException('Tu sesión ha caducado');
    const usuario = await this.usuarios.findById(payload.sub);
    const sesion = usuario?.sesiones.find((s) => s.familia === payload.fam);
    if (!usuario || !sesion) throw new UnauthorizedException('Tu sesión ha caducado');
    if (!iguales(sesion.hash, sha256(refreshToken))) {
      usuario.sesiones = usuario.sesiones.filter((s) => s.familia !== payload.fam);
      await usuario.save();
      throw new UnauthorizedException('Tu sesión ha caducado');
    }
    await this.perfiles.tocarActividad(usuario.id);
    return this.emitir(usuario, payload.fam);
  }

  async logout(refreshToken: string) {
    try {
      const p = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') });
      await this.usuarios.updateOne({ _id: p.sub }, { $pull: { sesiones: { familia: p.fam } } });
    } catch {
      // un token inválido ya no abre ninguna sesión
    }
  }

  async cerrarTodas(userId: string) {
    await this.usuarios.updateOne({ _id: userId }, { $set: { sesiones: [] } });
  }

  private async respuesta(usuario: UserDoc, perfilCompleto: boolean) {
    await this.perfiles.tocarActividad(usuario.id);
    return {
      ...(await this.emitir(usuario)),
      usuario: { id: usuario.id as string, email: usuario.email, proveedores: usuario.proveedores },
      perfilCompleto,
    };
  }
}
