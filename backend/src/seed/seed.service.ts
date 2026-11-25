import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from '@node-rs/argon2';
import { randomBytes } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { Model, Types } from 'mongoose';
import { MediaService } from '../media/media.service';
import {
  Block,
  Conversation,
  Favorite,
  Message,
  Profile,
  Report,
  User,
} from '../schemas';

// ---------- formato de mock-data/*.json ----------
interface UsuarioMock {
  clave: string;
  email: string;
  nombre: string;
  proveedor: string;
  demo: boolean;
  ajustes: { notifMensajes: boolean; notifNovedades: boolean };
}
interface PerfilMock {
  clave: string;
  nombre: string;
  roles: string[];
  generos: string[];
  zona: string;
  lugar: string;
  disponibilidad: string[];
  remunerados: boolean;
  colaboraciones: boolean;
  sobreMi: string | null;
  tarifas: {
    servicio: string;
    precio: number | null;
    unidad: string | null;
    texto: string | null;
  }[];
  redes: Record<string, string | null>;
  media: {
    tipo: string;
    titulo: string;
    miniatura: string | null;
    principal: boolean;
  }[];
  avatar: string | null;
  ultimaActividadMin: number;
}
interface ConversacionMock {
  participantes: [string, string];
  mensajes: { de: string; texto: string; haceMin: number; leido: boolean }[];
}

export interface ResultadoSeed {
  usuarios: number;
  perfiles: number;
  fotos: number;
  favoritos: number;
  conversaciones: number;
  mensajes: number;
  borrados: number;
}

const MIN = 60_000;

/**
 * Carga los datos ficticios de mock-data/ (docs/datos-mock.md). Idempotente: antes borra
 * todo lo marcado como ficticio y lo relacionado con ello; no toca usuarios reales.
 */
@Injectable()
export class SeedService {
  private readonly log = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name) private readonly usuarios: Model<User>,
    @InjectModel(Profile.name) private readonly perfiles: Model<Profile>,
    @InjectModel(Favorite.name) private readonly favoritos: Model<Favorite>,
    @InjectModel(Conversation.name)
    private readonly conversaciones: Model<Conversation>,
    @InjectModel(Message.name) private readonly mensajes: Model<Message>,
    @InjectModel(Block.name) private readonly bloqueos: Model<Block>,
    @InjectModel(Report.name) private readonly denuncias: Model<Report>,
    private readonly media: MediaService,
  ) {}

  private leer<T>(dir: string, archivo: string): T {
    return JSON.parse(readFileSync(join(dir, archivo), 'utf8')) as T;
  }

  /** Borra los datos ficticios y todo lo que cuelga de ellos. Devuelve cuántos usuarios borró. */
  async limpiar(): Promise<number> {
    const ficticios = await this.usuarios
      .find({ ficticio: true }, { _id: 1 })
      .lean();
    const ids = ficticios.map((u) => u._id);
    const perfiles = await this.perfiles
      .find({ userId: { $in: ids } }, { _id: 1 })
      .lean();
    const perfilIds = perfiles.map((p) => p._id);
    const convs = await this.conversaciones
      .find({ participantes: { $in: ids } }, { _id: 1 })
      .lean();
    await Promise.all([
      this.mensajes.deleteMany({
        conversationId: { $in: convs.map((c) => c._id) },
      }),
      this.conversaciones.deleteMany({ _id: { $in: convs.map((c) => c._id) } }),
      this.favoritos.deleteMany({
        $or: [{ userId: { $in: ids } }, { profileId: { $in: perfilIds } }],
      }),
      this.bloqueos.deleteMany({
        $or: [{ userId: { $in: ids } }, { bloqueadoId: { $in: ids } }],
      }),
      this.denuncias.deleteMany({
        $or: [
          { denuncianteId: { $in: ids } },
          { profileId: { $in: perfilIds } },
        ],
      }),
      this.perfiles.deleteMany({ userId: { $in: ids } }),
      this.media.borrarDonde({ 'metadata.ficticio': true }),
    ]);
    await this.usuarios.deleteMany({ _id: { $in: ids } });
    return ids.length;
  }

  async ejecutar(dir: string, passwordDemo: string): Promise<ResultadoSeed> {
    if (passwordDemo.length < 8)
      throw new Error('SEED_DEMO_PASSWORD debe tener al menos 8 caracteres');
    const usuariosMock = this.leer<UsuarioMock[]>(dir, 'usuarios.json');
    const perfilesMock = this.leer<PerfilMock[]>(dir, 'perfiles.json');
    const favoritosMock = this.leer<{ usuario: string; perfil: string }[]>(
      dir,
      'favoritos.json',
    );
    const convsMock = this.leer<ConversacionMock[]>(dir, 'conversaciones.json');

    // No pisar a personas reales que se hayan registrado con un correo del seed.
    const choques = await this.usuarios
      .find({
        email: { $in: usuariosMock.map((u) => u.email) },
        ficticio: { $ne: true },
      })
      .lean();
    if (choques.length) {
      throw new Error(
        `Hay usuarios reales con correos del seed: ${choques.map((u) => u.email).join(', ')}`,
      );
    }

    const borrados = await this.limpiar();
    const ahora = Date.now();
    const hashDemo = await hash(passwordDemo);
    // Las cuentas no demo no tienen contraseña utilizable: nadie puede entrar en ellas.
    const hashBloqueado = await hash(randomBytes(32).toString('hex'));

    const userIds = new Map<string, Types.ObjectId>();
    for (const u of usuariosMock) {
      const doc = await this.usuarios.create({
        email: u.email,
        passwordHash: u.demo ? hashDemo : hashBloqueado,
        proveedores: ['email'],
        ajustes: u.ajustes,
        ficticio: true,
      });
      userIds.set(u.clave, doc._id);
    }

    let fotos = 0;
    const perfilIds = new Map<string, Types.ObjectId>();
    const subirFoto = async (
      archivo: string | null,
      userId: Types.ObjectId,
    ) => {
      if (!archivo) return null;
      const ruta = join(dir, 'media', archivo);
      if (!existsSync(ruta)) {
        this.log.warn(`No existe ${ruta}`);
        return null;
      }
      fotos += 1;
      return this.media.guardar(readFileSync(ruta), archivo, 'image/jpeg', {
        userId: userId.toString(),
        ficticio: true,
      });
    };

    for (const p of perfilesMock) {
      const userId = userIds.get(p.clave);
      if (!userId) throw new Error(`Perfil sin usuario: ${p.clave}`);
      const media = [];
      for (const m of p.media) {
        // Vídeos aplazados: solo título y miniatura, sin archivo (decisión del 25/11).
        media.push({
          tipo: m.tipo,
          titulo: m.titulo,
          archivoId: null,
          miniaturaId: await subirFoto(m.miniatura, userId),
          principal: m.principal,
        });
      }
      const doc = await this.perfiles.create({
        userId,
        nombre: p.nombre,
        roles: p.roles,
        generos: p.generos,
        zona: p.zona,
        lugar: p.lugar,
        disponibilidad: p.disponibilidad,
        remunerados: p.remunerados,
        colaboraciones: p.colaboraciones,
        sobreMi: p.sobreMi,
        tarifas: p.tarifas,
        redes: p.redes,
        media,
        avatarId: await subirFoto(p.avatar, userId),
        ultimaActividadAt: new Date(ahora - p.ultimaActividadMin * MIN),
        ficticio: true,
      });
      perfilIds.set(p.clave, doc._id);
    }

    for (const f of favoritosMock) {
      await this.favoritos.create({
        userId: userIds.get(f.usuario),
        profileId: perfilIds.get(f.perfil),
      });
    }

    let mensajes = 0;
    for (const c of convsMock) {
      const [a, b] = c.participantes.map((k) => userIds.get(k)!);
      const participantes = [a, b].sort((x, y) =>
        x.toString().localeCompare(y.toString()),
      );
      const ordenados = [...c.mensajes].sort((x, y) => y.haceMin - x.haceMin);
      const ultimo = ordenados[ordenados.length - 1];
      const noLeidos: Record<string, number> = {};
      for (const m of ordenados) {
        if (!m.leido) {
          const destinatario = (m.de === c.participantes[0] ? b : a).toString();
          noLeidos[destinatario] = (noLeidos[destinatario] ?? 0) + 1;
        }
      }
      const conv = await this.conversaciones.create({
        participantes,
        clave: participantes.map(String).join(':'),
        ultimoMensaje: ultimo?.texto ?? null,
        ultimoMensajeAt: ultimo ? new Date(ahora - ultimo.haceMin * MIN) : null,
        noLeidos,
      });
      // Inserción directa para conservar las fechas del wireframe (los timestamps de Mongoose las pisarían).
      if (ordenados.length) {
        await this.mensajes.collection.insertMany(
          ordenados.map((m) => {
            const enviado = new Date(ahora - m.haceMin * MIN);
            return {
              conversationId: conv._id,
              de: userIds.get(m.de)!,
              texto: m.texto,
              createdAt: enviado,
              leidoAt: m.leido ? enviado : null,
            };
          }),
        );
      }
      mensajes += ordenados.length;
    }

    return {
      usuarios: userIds.size,
      perfiles: perfilIds.size,
      fotos,
      favoritos: favoritosMock.length,
      conversaciones: convsMock.length,
      mensajes,
      borrados,
    };
  }
}
