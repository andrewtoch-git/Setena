import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Types } from 'mongoose';
import { AuthUser, CurrentUser, Public } from '../common/decorators';
import { ProfilesService } from '../profiles/profiles.service';
import { MAX_IMAGEN, MediaService, TIPOS_IMAGEN } from './media.service';

const MAX_FOTOS = 10; // PROPUESTA (decisión delegada): límite para no llenar el clúster M0

const subidaImagen = FileInterceptor('archivo', {
  limits: { fileSize: MAX_IMAGEN, files: 1 },
  fileFilter: (_req, file, cb) => {
    if ((TIPOS_IMAGEN as readonly string[]).includes(file.mimetype))
      cb(null, true);
    else
      cb(
        new BadRequestException('Usa una imagen JPG o PNG de hasta 10 MB'),
        false,
      );
  },
});

const cuerpoArchivo = {
  schema: {
    type: 'object',
    properties: {
      archivo: { type: 'string', format: 'binary' },
      titulo: { type: 'string' },
    },
  },
};

@ApiTags('fotos')
@ApiBearerAuth()
@Controller()
export class MediaController {
  constructor(
    private readonly media: MediaService,
    private readonly perfiles: ProfilesService,
  ) {}

  @Public()
  @Get('media/:id')
  @ApiOperation({ summary: 'Descargar una foto (pública)' })
  async descargar(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const archivo = await this.media.leer(id);
    res.set({
      'Content-Type': archivo.tipo,
      'Content-Length': String(archivo.tamano),
      'Cache-Control': 'public, max-age=31536000, immutable', // el id cambia si cambia la foto
    });
    return new StreamableFile(archivo.flujo);
  }

  private async miPerfil(userId: string) {
    const perfil = await this.perfiles.porUsuario(userId);
    if (!perfil) throw new NotFoundException('Todavía no has creado tu perfil');
    return perfil;
  }

  private requerido(archivo: Express.Multer.File | undefined) {
    if (!archivo) throw new BadRequestException('Falta la imagen');
    return archivo;
  }

  @Post('me/avatar')
  @UseInterceptors(subidaImagen)
  @ApiConsumes('multipart/form-data')
  @ApiBody(cuerpoArchivo)
  @ApiOperation({
    summary: 'Subir o cambiar la foto de perfil (JPG o PNG, hasta 10 MB)',
  })
  async avatar(
    @CurrentUser() user: AuthUser,
    @UploadedFile() archivo?: Express.Multer.File,
  ) {
    const f = this.requerido(archivo);
    const perfil = await this.miPerfil(user.userId);
    const anterior = perfil.avatarId;
    perfil.avatarId = await this.media.guardar(
      f.buffer,
      f.originalname,
      f.mimetype,
      {
        userId: user.userId,
      },
    );
    await perfil.save();
    await this.media.borrar(anterior);
    return this.perfiles.ficha(perfil);
  }

  @Post('me/fotos')
  @UseInterceptors(subidaImagen)
  @ApiConsumes('multipart/form-data')
  @ApiBody(cuerpoArchivo)
  @ApiOperation({ summary: 'Añadir una foto al carrusel de mi perfil' })
  async anadirFoto(
    @CurrentUser() user: AuthUser,
    @Body('titulo') titulo: unknown,
    @UploadedFile() archivo?: Express.Multer.File,
  ) {
    const f = this.requerido(archivo);
    const perfil = await this.miPerfil(user.userId);
    if (perfil.media.filter((m) => m.tipo === 'foto').length >= MAX_FOTOS) {
      throw new BadRequestException(`Puedes tener hasta ${MAX_FOTOS} fotos`);
    }
    const id = await this.media.guardar(f.buffer, f.originalname, f.mimetype, {
      userId: user.userId,
    });
    const tituloLimpio =
      typeof titulo === 'string' && titulo.trim()
        ? titulo.trim().slice(0, 80)
        : 'Foto';
    perfil.media.push({
      tipo: 'foto',
      titulo: tituloLimpio,
      archivoId: id,
      miniaturaId: id,
      principal: perfil.media.length === 0,
    });
    await perfil.save();
    return this.perfiles.ficha(perfil);
  }

  @Delete('me/media/:indice')
  @ApiOperation({
    summary: 'Eliminar una foto o vídeo del carrusel (por posición)',
  })
  async eliminar(
    @CurrentUser() user: AuthUser,
    @Param('indice', ParseIntPipe) indice: number,
  ) {
    const perfil = await this.miPerfil(user.userId);
    const item = perfil.media[indice];
    if (!item) throw new NotFoundException('No existe ese elemento');
    perfil.media.splice(indice, 1);
    if (item.principal && perfil.media[0]) perfil.media[0].principal = true;
    await perfil.save();
    await this.media.borrar(item.archivoId);
    if (
      item.miniaturaId &&
      !item.miniaturaId.equals(item.archivoId ?? new Types.ObjectId())
    ) {
      await this.media.borrar(item.miniaturaId);
    }
    return this.perfiles.ficha(perfil);
  }

  @Post('me/media/:indice/principal')
  @HttpCode(200)
  @ApiOperation({ summary: 'Marcar como principal' })
  async principal(
    @CurrentUser() user: AuthUser,
    @Param('indice', ParseIntPipe) indice: number,
  ) {
    const perfil = await this.miPerfil(user.userId);
    if (!perfil.media[indice])
      throw new NotFoundException('No existe ese elemento');
    perfil.media.forEach((m, i) => (m.principal = i === indice));
    await perfil.save();
    return this.perfiles.ficha(perfil);
  }
}
