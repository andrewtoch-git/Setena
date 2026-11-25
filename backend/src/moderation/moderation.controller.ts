import { BadRequestException, Body, Controller, Delete, HttpCode, NotFoundException, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsIn, IsMongoId } from 'class-validator';
import { Model, Types } from 'mongoose';
import { MOTIVOS_DENUNCIA } from '../common/catalogos';
import { AuthUser, CurrentUser } from '../common/decorators';
import { ProfilesService } from '../profiles/profiles.service';
import { Block, Favorite, Report } from '../schemas';

class DenunciaDto {
  @ApiProperty() @IsMongoId() perfilId!: string;
  @ApiProperty({ enum: MOTIVOS_DENUNCIA }) @IsIn(MOTIVOS_DENUNCIA) motivo!: string;
}

@ApiTags('moderación')
@ApiBearerAuth()
@Controller()
export class ModerationController {
  constructor(
    @InjectModel(Block.name) private readonly bloqueos: Model<Block>,
    @InjectModel(Report.name) private readonly denuncias: Model<Report>,
    @InjectModel(Favorite.name) private readonly favoritos: Model<Favorite>,
    private readonly perfiles: ProfilesService,
  ) {}

  private async perfilAjeno(perfilId: string, userId: string) {
    const perfil = await this.perfiles.porId(perfilId);
    if (!perfil) throw new NotFoundException('Este perfil no está disponible');
    if (perfil.userId.equals(userId)) throw new BadRequestException('No puedes hacerlo con tu propio perfil');
    return perfil;
  }

  @Post('bloqueos/:perfilId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Bloquear: no podrá escribirte ni ver tu perfil. No se le avisa.' })
  async bloquear(@CurrentUser() user: AuthUser, @Param('perfilId') perfilId: string) {
    const perfil = await this.perfilAjeno(perfilId, user.userId);
    const yo = new Types.ObjectId(user.userId);
    await this.bloqueos.updateOne(
      { userId: yo, bloqueadoId: perfil.userId },
      { $setOnInsert: { userId: yo, bloqueadoId: perfil.userId } },
      { upsert: true },
    );
    // PROPUESTA: al bloquear, se quita de tus Favoritos.
    await this.favoritos.deleteOne({ userId: yo, profileId: perfil._id });
  }

  @Delete('bloqueos/:perfilId')
  @HttpCode(204)
  async desbloquear(@CurrentUser() user: AuthUser, @Param('perfilId') perfilId: string) {
    const perfil = await this.perfilAjeno(perfilId, user.userId);
    await this.bloqueos.deleteOne({ userId: new Types.ObjectId(user.userId), bloqueadoId: perfil.userId });
  }

  @Post('denuncias')
  @HttpCode(204)
  @ApiOperation({ summary: 'Denunciar perfil (anónimo para la persona denunciada)' })
  async denunciar(@CurrentUser() user: AuthUser, @Body() dto: DenunciaDto) {
    const perfil = await this.perfilAjeno(dto.perfilId, user.userId);
    await this.denuncias.create({ denuncianteId: new Types.ObjectId(user.userId), profileId: perfil._id, motivo: dto.motivo });
  }
}
