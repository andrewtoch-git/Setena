import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ---------- users ----------
@Schema({ _id: false })
export class Sesion {
  @Prop({ required: true }) familia!: string;
  @Prop({ required: true }) hash!: string;
  @Prop({ required: true }) caduca!: Date;
}

@Schema({ _id: false })
export class Ajustes {
  @Prop({ default: true }) notifMensajes!: boolean;
  @Prop({ default: false }) notifNovedades!: boolean;
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;
  @Prop({ type: String, default: null }) passwordHash!: string | null;
  @Prop({ type: String, default: null, index: { unique: true, sparse: true } })
  googleId!: string | null;
  @Prop({ type: [String], default: [] }) proveedores!: string[];
  @Prop({ type: Ajustes, default: () => ({}) }) ajustes!: Ajustes;
  @Prop({ type: [Sesion], default: [] }) sesiones!: Sesion[];
  @Prop({ default: false }) ficticio!: boolean;
}
export type UserDoc = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

// ---------- profiles ----------
@Schema({ _id: false })
export class Tarifa {
  @Prop({ required: true }) servicio!: string;
  @Prop({ type: Number, default: null }) precio!: number | null;
  @Prop({ type: String, default: null }) unidad!: string | null;
  @Prop({ type: String, default: null }) texto!: string | null;
}

@Schema({ _id: false })
export class Media {
  @Prop({ required: true, enum: ['video', 'foto'] }) tipo!: string;
  @Prop({ required: true }) titulo!: string;
  @Prop({ type: Types.ObjectId, default: null })
  archivoId!: Types.ObjectId | null;
  @Prop({ type: Types.ObjectId, default: null })
  miniaturaId!: Types.ObjectId | null;
  @Prop({ default: false }) principal!: boolean;
}

@Schema({ _id: false })
export class Redes {
  @Prop({ type: String, default: null }) instagram!: string | null;
  @Prop({ type: String, default: null }) youtube!: string | null;
  @Prop({ type: String, default: null }) spotify!: string | null;
  @Prop({ type: String, default: null }) tiktok!: string | null;
  @Prop({ type: String, default: null }) soundcloud!: string | null;
}

@Schema({ timestamps: true, collection: 'profiles' })
export class Profile {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId!: Types.ObjectId;
  @Prop({ required: true, trim: true }) nombre!: string;
  @Prop({ type: [String], default: [], index: true }) roles!: string[];
  @Prop({ type: [String], default: [], index: true }) generos!: string[];
  @Prop({ required: true, index: true }) zona!: string;
  @Prop({ required: true }) lugar!: string;
  @Prop({ type: [String], default: [], index: true }) disponibilidad!: string[];
  @Prop({ default: false }) remunerados!: boolean;
  @Prop({ default: false }) colaboraciones!: boolean;
  @Prop({ type: String, default: null }) sobreMi!: string | null;
  @Prop({ type: [Tarifa], default: [] }) tarifas!: Tarifa[];
  @Prop({ type: Redes, default: () => ({}) }) redes!: Redes;
  @Prop({ type: [Media], default: [] }) media!: Media[];
  @Prop({ type: Types.ObjectId, default: null })
  avatarId!: Types.ObjectId | null;
  @Prop({ default: () => new Date(), index: true }) ultimaActividadAt!: Date;
  @Prop({ default: false }) ficticio!: boolean;
}
export type ProfileDoc = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);

// ---------- favorites ----------
@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'favorites',
})
export class Favorite {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Profile', required: true })
  profileId!: Types.ObjectId;
}
export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
FavoriteSchema.index({ userId: 1, profileId: 1 }, { unique: true });

// ---------- conversations / messages ----------
@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
  /** Los dos userId, ordenados para que el par sea único. */
  @Prop({ type: [Types.ObjectId], required: true, index: true })
  participantes!: Types.ObjectId[];
  @Prop({ required: true, unique: true }) clave!: string;
  @Prop({ type: Date, default: null, index: true })
  ultimoMensajeAt!: Date | null;
  @Prop({ type: String, default: null }) ultimoMensaje!: string | null;
  /** userId -> número de mensajes sin leer. */
  @Prop({ type: Map, of: Number, default: {} }) noLeidos!: Map<string, number>;
}
export type ConversationDoc = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'messages',
})
export class Message {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  conversationId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true }) de!: Types.ObjectId;
  @Prop({ required: true, maxlength: 2000 }) texto!: string;
  @Prop({ type: Date, default: null }) leidoAt!: Date | null;
  createdAt!: Date;
}
export type MessageDoc = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ conversationId: 1, createdAt: -1 });

// ---------- moderación ----------
@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'blocks',
})
export class Block {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true })
  bloqueadoId!: Types.ObjectId;
}
export const BlockSchema = SchemaFactory.createForClass(Block);
BlockSchema.index({ userId: 1, bloqueadoId: 1 }, { unique: true });

@Schema({
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'reports',
})
export class Report {
  @Prop({ type: Types.ObjectId, required: true })
  denuncianteId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, index: true })
  profileId!: Types.ObjectId;
  @Prop({ required: true }) motivo!: string;
}
export const ReportSchema = SchemaFactory.createForClass(Report);
