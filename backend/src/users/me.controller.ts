import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, NotFoundException, Patch,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { hash, verify } from '@node-rs/argon2';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Model, Types } from 'mongoose';
import { AuthUser, CurrentUser } from '../common/decorators';
import { ProfilesService } from '../profiles/profiles.service';
import { Block, Conversation, Favorite, Message, Profile, Report, User } from '../schemas';

class AjustesDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifMensajes?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() notifNovedades?: boolean;
}

class CambiarPasswordDto {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(128) actual!: string;
  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8, { message: 'Mínimo 8 caracteres' }) @MaxLength(128) nueva!: string;
}

@ApiTags('mi cuenta')
@ApiBearerAuth()
@Controller('me')
export class MeController {
  constructor(
    @InjectModel(User.name) private readonly usuarios: Model<User>,
    @InjectModel(Profile.name) private readonly perfilesModel: Model<Profile>,
    @InjectModel(Favorite.name) private readonly favoritos: Model<Favorite>,
    @InjectModel(Conversation.name) private readonly conversaciones: Model<Conversation>,
    @InjectModel(Message.name) private readonly mensajes: Model<Message>,
    @InjectModel(Block.name) private readonly bloqueos: Model<Block>,
    @InjectModel(Report.name) private readonly denuncias: Model<Report>,
    private readonly perfiles: ProfilesService,
  ) {}

  private async usuario(userId: string) {
    const u = await this.usuarios.findById(userId);
    if (!u) throw new NotFoundException('La cuenta no existe');
    return u;
  }

  @Get()
  @ApiOperation({ summary: 'Mi cuenta y mi perfil (perfil null si aún no está creado)' })
  async yo(@CurrentUser() user: AuthUser) {
    const u = await this.usuario(user.userId);
    const perfil = await this.perfiles.porUsuario(user.userId);
    return {
      id: u.id as string,
      email: u.email,
      proveedores: u.proveedores,
      tienePassword: !!u.passwordHash,
      ajustes: u.ajustes,
      perfil: perfil ? this.perfiles.ficha(perfil) : null,
    };
  }

  @Patch('ajustes')
  async ajustes(@CurrentUser() user: AuthUser, @Body() dto: AjustesDto) {
    const u = await this.usuario(user.userId);
    u.set('ajustes', { ...u.toObject().ajustes, ...dto });
    await u.save();
    return u.ajustes;
  }

  @Patch('password')
  @HttpCode(204)
  async password(@CurrentUser() user: AuthUser, @Body() dto: CambiarPasswordDto) {
    const u = await this.usuario(user.userId);
    if (!u.passwordHash) throw new BadRequestException('Tu cuenta usa Google y no tiene contraseña');
    if (!(await verify(u.passwordHash, dto.actual))) {
      throw new BadRequestException('La contraseña actual no es correcta');
    }
    u.passwordHash = await hash(dto.nueva);
    await u.save();
  }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Eliminar cuenta: borra perfil, favoritos, chats, bloqueos y denuncias propias' })
  async eliminar(@CurrentUser() user: AuthUser) {
    const yo = new Types.ObjectId(user.userId);
    const perfil = await this.perfilesModel.findOne({ userId: yo });
    const convs = await this.conversaciones.find({ participantes: yo }, { _id: 1 }).lean();
    await Promise.all([
      this.mensajes.deleteMany({ conversationId: { $in: convs.map((c) => c._id) } }),
      this.conversaciones.deleteMany({ participantes: yo }),
      this.favoritos.deleteMany({ $or: [{ userId: yo }, ...(perfil ? [{ profileId: perfil._id }] : [])] }),
      this.bloqueos.deleteMany({ $or: [{ userId: yo }, { bloqueadoId: yo }] }),
      this.denuncias.deleteMany({ $or: [{ denuncianteId: yo }, ...(perfil ? [{ profileId: perfil._id }] : [])] }),
      this.perfilesModel.deleteOne({ userId: yo }),
    ]);
    await this.usuarios.deleteOne({ _id: yo });
  }
}
