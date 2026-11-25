import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Block,
  BlockSchema,
  Conversation,
  ConversationSchema,
  Favorite,
  FavoriteSchema,
  Message,
  MessageSchema,
  Profile,
  ProfileSchema,
  Report,
  ReportSchema,
  User,
  UserSchema,
} from './index';

const modelos = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
  { name: Profile.name, schema: ProfileSchema },
  { name: Favorite.name, schema: FavoriteSchema },
  { name: Conversation.name, schema: ConversationSchema },
  { name: Message.name, schema: MessageSchema },
  { name: Block.name, schema: BlockSchema },
  { name: Report.name, schema: ReportSchema },
]);

/** Registra todos los modelos una vez para evitar dependencias circulares entre módulos. */
@Global()
@Module({ imports: [modelos], exports: [modelos] })
export class SchemasModule {}
