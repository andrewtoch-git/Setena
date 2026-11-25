import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { ProfilesService } from '../profiles/profiles.service';
import { ChatEventos } from './chat-eventos';
import {
  Conversation,
  ConversationDoc,
  Message,
  MessageDoc,
  Profile,
} from '../schemas';

const oid = (id: string | Types.ObjectId) => new Types.ObjectId(id);
const NO_DISPONIBLE = 'No puedes enviar mensajes a este usuario';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversaciones: Model<Conversation>,
    @InjectModel(Message.name) private readonly mensajes: Model<Message>,
    @InjectModel(Profile.name) private readonly perfilesModel: Model<Profile>,
    private readonly perfiles: ProfilesService,
    private readonly eventos: ChatEventos,
  ) {}

  private clave(a: Types.ObjectId, b: Types.ObjectId) {
    return [a.toString(), b.toString()].sort().join(':');
  }

  /** Conversación en la que participa el usuario; si no, 404 (no se revela que exista). */
  async propia(convId: string, userId: string): Promise<ConversationDoc> {
    const c = isValidObjectId(convId)
      ? await this.conversaciones.findById(convId)
      : null;
    if (!c || !c.participantes.some((p) => p.equals(userId)))
      throw new NotFoundException('La conversación no existe');
    return c;
  }

  private otro(c: ConversationDoc, userId: string) {
    return c.participantes.find((p) => !p.equals(userId))!;
  }

  async abrirCon(userId: string, perfilId: string) {
    const perfil = await this.perfiles.porId(perfilId);
    if (!perfil) throw new NotFoundException('Este perfil no está disponible');
    if (perfil.userId.equals(userId))
      throw new ForbiddenException('No puedes abrir un chat contigo');
    if (await this.perfiles.hayBloqueo(userId, perfil.userId))
      throw new ForbiddenException(NO_DISPONIBLE);
    const yo = oid(userId);
    const clave = this.clave(yo, perfil.userId);
    const c = await this.conversaciones.findOneAndUpdate(
      { clave },
      {
        $setOnInsert: {
          clave,
          participantes: [yo, perfil.userId].sort((a, b) =>
            a.toString().localeCompare(b.toString()),
          ),
        },
      },
      { upsert: true, new: true },
    );
    return this.resumen(c, userId);
  }

  async listar(userId: string) {
    const ocultos = new Set(
      (await this.perfiles.usuariosOcultos(userId)).map(String),
    );
    const convs = await this.conversaciones
      .find({ participantes: oid(userId), ultimoMensajeAt: { $ne: null } })
      .sort({ ultimoMensajeAt: -1 });
    const visibles = convs.filter(
      (c) => !ocultos.has(this.otro(c, userId).toString()),
    );
    return Promise.all(visibles.map((c) => this.resumen(c, userId)));
  }

  async resumen(c: ConversationDoc, userId: string) {
    const otroId = this.otro(c, userId);
    const perfil = await this.perfilesModel.findOne({ userId: otroId });
    return {
      id: c.id as string,
      con: perfil
        ? {
            perfilId: perfil.id as string,
            nombre: perfil.nombre,
            avatarId: perfil.avatarId,
            roles: perfil.roles,
          }
        : null,
      ultimoMensaje: c.ultimoMensaje,
      ultimoMensajeAt: c.ultimoMensajeAt,
      noLeidos: c.noLeidos.get(userId) ?? 0,
    };
  }

  async historial(
    convId: string,
    userId: string,
    antesDe?: string,
    limite = 30,
  ) {
    const c = await this.propia(convId, userId);
    const filtro: Record<string, unknown> = { conversationId: c._id };
    if (antesDe) filtro.createdAt = { $lt: new Date(antesDe) };
    const docs = await this.mensajes
      .find(filtro)
      .sort({ createdAt: -1 })
      .limit(limite);
    return docs.reverse().map((m) => this.serializar(m, userId));
  }

  async enviar(convId: string, userId: string, texto: string) {
    const c = await this.propia(convId, userId);
    const otroId = this.otro(c, userId);
    if (await this.perfiles.hayBloqueo(userId, otroId))
      throw new ForbiddenException(NO_DISPONIBLE);
    const m = await this.mensajes.create({
      conversationId: c._id,
      de: oid(userId),
      texto,
    });
    await this.conversaciones.updateOne(
      { _id: c._id },
      {
        $set: { ultimoMensaje: texto, ultimoMensajeAt: m.createdAt },
        $inc: { [`noLeidos.${otroId.toString()}`]: 1 },
      },
    );
    await this.perfiles.tocarActividad(userId);
    // Tiempo real: avisa a los dos participantes (también a otras sesiones del remitente).
    this.eventos.mensajeNuevo(
      c._id.toString(),
      c.participantes.map((p) => p.toString()),
      {
        id: m._id.toString(),
        texto: m.texto,
        de: userId,
        enviadoAt: m.createdAt,
        leidoAt: null,
      },
    );
    return this.serializar(m, userId);
  }

  async marcarLeido(convId: string, userId: string) {
    const c = await this.propia(convId, userId);
    await this.mensajes.updateMany(
      { conversationId: c._id, de: { $ne: oid(userId) }, leidoAt: null },
      { $set: { leidoAt: new Date() } },
    );
    await this.conversaciones.updateOne(
      { _id: c._id },
      { $set: { [`noLeidos.${userId}`]: 0 } },
    );
    this.eventos.conversacionLeida(
      c._id.toString(),
      userId,
      this.otro(c, userId).toString(),
    );
  }

  async totalNoLeidos(userId: string) {
    const convs = await this.listar(userId);
    return convs.reduce((n, c) => n + c.noLeidos, 0);
  }

  private serializar(m: MessageDoc, userId: string) {
    return {
      id: m.id as string,
      texto: m.texto,
      mio: m.de.equals(userId),
      enviadoAt: m.createdAt,
      leidoAt: m.leidoAt,
    };
  }
}
