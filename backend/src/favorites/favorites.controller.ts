import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Model, Types } from 'mongoose';
import { AuthUser, CurrentUser } from '../common/decorators';
import { ProfilesService } from '../profiles/profiles.service';
import { Favorite, Profile, ProfileDoc } from '../schemas';

@ApiTags('favoritos')
@ApiBearerAuth()
@Controller('favoritos')
export class FavoritesController {
  constructor(
    @InjectModel(Favorite.name) private readonly favoritos: Model<Favorite>,
    @InjectModel(Profile.name) private readonly perfilesModel: Model<Profile>,
    private readonly perfiles: ProfilesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Mis favoritos, del más reciente al más antiguo' })
  async listar(@CurrentUser() user: AuthUser) {
    const ocultos = new Set(
      (await this.perfiles.usuariosOcultos(user.userId)).map(String),
    );
    const filas = await this.favoritos
      .find({ userId: new Types.ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .lean();
    const docs = await this.perfilesModel.find({
      _id: { $in: filas.map((f) => f.profileId) },
    });
    const porId = new Map(docs.map((d) => [d.id as string, d]));
    return filas
      .map((f) => porId.get(f.profileId.toString()))
      .filter((p): p is ProfileDoc => !!p && !ocultos.has(p.userId.toString()))
      .map((p) => this.perfiles.tarjeta(p, true));
  }

  @Post(':perfilId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Añadir a Favoritos (idempotente)' })
  async anadir(
    @CurrentUser() user: AuthUser,
    @Param('perfilId') perfilId: string,
  ) {
    const perfil = await this.perfiles.porId(perfilId);
    if (
      !perfil ||
      (await this.perfiles.hayBloqueo(user.userId, perfil.userId))
    ) {
      throw new NotFoundException('Este perfil no está disponible');
    }
    await this.favoritos.updateOne(
      { userId: new Types.ObjectId(user.userId), profileId: perfil._id },
      {
        $setOnInsert: {
          userId: new Types.ObjectId(user.userId),
          profileId: perfil._id,
        },
      },
      { upsert: true },
    );
  }

  @Delete(':perfilId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Quitar de Favoritos (idempotente)' })
  async quitar(
    @CurrentUser() user: AuthUser,
    @Param('perfilId') perfilId: string,
  ) {
    if (!Types.ObjectId.isValid(perfilId)) return;
    await this.favoritos.deleteOne({
      userId: new Types.ObjectId(user.userId),
      profileId: new Types.ObjectId(perfilId),
    });
  }
}
